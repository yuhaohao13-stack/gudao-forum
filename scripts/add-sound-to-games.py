#!/usr/bin/env python3
"""Add sound hook import + play calls + gameover text-lg fix to all game components."""

import os, re

GAMES_DIR = '/Users/hy/.openclaw/workspace/forum/src/components/games'

SOUND_IMPORT = "import useGameSound from '@/components/games/useGameSound'"

# Each game: filename, sound_calls dict { search_string: play_type }
# Patterns to find where to insert play() calls
SOUND_PATCHES = {
    'SnakeGame.jsx': [
        # eat food: gameScore += 10 (inline in tick)
        ('gameScore += 10', '  play(\'score\'); \\0'),
        # collision death
        ("setState('over'); setScore(gameScore); if (onScore) onScore(gameScore)", '  play(\'gameover\'); \\0'),
    ],
    'TetrisGame.jsx': [
        # clear lines scoring
        ('gameScore += pts', '  play(\'score\'); \\0'),
        # place piece (merge)
        ('const pts = ', ''),
        # gameover
        ("setState('over'); setScore(gameScore); if (onScore) onScore(gameScore)", '  play(\'gameover\'); \\0'),
    ],
    'BreakoutGame.jsx': [
        # bounce
        ("ball.dy = -ball.dy; ball.y = paddle.y - BALL_R", '  play(\'bounce\'); \\0'),
        # hit brick
        ('gameScore += 10; setScore(gameScore)', '  play(\'score\'); \\0'),
        # gameover
        ("setState('over'); setScore(gameScore); if (onScore) onScore(gameScore)", '  play(\'gameover\'); \\0'),
    ],
    'Game2048.jsx': [
        # score
        ('totalScore += score', '  play(\'score\'); \\0'),
        # gameover
        ("setState('over'); if (onScore) onScore(gameScore)", '  play(\'gameover\'); \\0'),
    ],
    'WhackAMoleGame.jsx': [
        # hit mole
        ('gameScore += 10; setScore(gameScore)', '  play(\'hit\'); \\0'),
        # time's up
        ("setState('over'); if (onScore) onScore(gameScore)", '  play(\'gameover\'); \\0'),
    ],
    'InvadersGame.jsx': [
        # shoot
        ("bullets.push({ x: player.x + PLAYER_W / 2, y: player.y, dy: -5 })", '  play(\'shoot\'); \\0'),
        # hit enemy
        ('gameScore += 10; setScore(gameScore); return false', '  play(\'explode\'); \\0'),
        # gameover
        ("setState('over'); setScore(gameScore); if (onScore) onScore(gameScore)", '  play(\'gameover\'); \\0'),
    ],
    'PacmanGame.jsx': [
        # eat dot small
        ("gameScore += 10; setScore(gameScore); dots--", '  play(\'score\'); \\0'),
        # eat power pellet
        ("gameScore += 50; setScore(gameScore); dots--", '  play(\'win\'); \\0'),
        # eat ghost
        ('gameScore += 200; setScore(gameScore)', '  play(\'hit\'); \\0'),
        # gameover
        ("setState('over'); setScore(gameScore); if (onScore) onScore(gameScore)", '  play(\'gameover\'); \\0'),
    ],
    'MinesweeperGame.jsx': [
        # click
        ('gameScore++', '  play(\'click\'); \\0'),
        # boom
        ("setState('over'); if (onScore) onScore(0)", '  play(\'explode\'); \\0'),
        # win
        ("if (onScore) onScore(Math.max(gameScore, 100))", '  play(\'win\'); \\0'),
    ],
    'DinoRunGame.jsx': [
        # jump
        ("if (jumpPressed && !dino.jumping) { dino.vy = -11; dino.jumping = true; jumpPressed = false }", '  play(\'jump\'); \\0'),
        # score up
        ('gameScore += speed / 10', ''),
        # gameover
        ("setState('over'); if (onScore) onScore(Math.floor(gameScore))", '  play(\'gameover\'); \\0'),
    ],
    'FlappyBirdGame.jsx': [
        # flap
        ("if (flapPressed) { bird.vy = FLAP; flapPressed = false }", '  play(\'jump\'); \\0'),
        # score pipe
        ("gameScore++ ; setScore(gameScore)", '  play(\'score\'); \\0'),
        # gameover
        ("setState('over'); if (onScore) onScore(gameScore); return", '  play(\'gameover\'); \\0'),
    ],
    'RacingGame.jsx': [
        # score (distance)
        ('gameScore += ', '  play(\'score\'); \\0'),
        # crash
        ("setState('over'); setScore(gameScore); if (onScore) onScore(gameScore)", '  play(\'explode\'); \\0'),
    ],
    'MarioGame.jsx': [
        # jump
        ("dino.vy = -11; dino.jumping = true", '  play(\'jump\'); \\0'),
        # score
        ('gameScore += 10', '  play(\'score\'); \\0'),
        # gameover
        ("setState('over'); if (onScore) onScore(gameScore)", '  play(\'gameover\'); \\0'),
    ],
    'TargetGame.jsx': [
        # hit target
        ('gameScore += 10', '  play(\'hit\'); \\0'),
        # gameover/timeout
        ("setState('over')", '  play(\'gameover\'); \\0'),
    ],
    'MemoryGame.jsx': [
        # flip card
        ('flipped.push', '  play(\'flip\'); \\0'),
        # match found
        ('matched.add', '  play(\'match\'); \\0'),
        # win
        ("setState('over')", '  play(\'win\'); \\0'),
    ],
    'SlidingPuzzle.jsx': [
        # move tile
        ('tilesMoved++', '  play(\'move\'); \\0'),
        # win
        ("setState('over')", '  play(\'win\'); \\0'),
    ],
    'DefenderGame.jsx': [
        # shoot
        ("bullets.push", '  play(\'shoot\'); \\0'),
        # explode asteroid
        ('gameScore += 10', '  play(\'explode\'); \\0'),
        # gameover
        ("setState('over')", '  play(\'gameover\'); \\0'),
    ],
    'BounceGame.jsx': [
        # bounce off platform
        ('bounce', '  play(\'bounce\'); \\0'),
        # score
        ('gameScore++', '  play(\'score\'); \\0'),
        # gameover
        ("setState('over')", '  play(\'gameover\'); \\0'),
    ],
    'PongGame.jsx': [
        # hit ball
        ("ball.dx = -ball.dx", '  play(\'bounce\'); \\0'),
        # score point
        ("playerScore++", '  play(\'score\'); \\0'),
        # win/gameover
        ("setState('over')", '  play(\'win\'); \\0'),
    ],
}


def add_sound_to_file(filepath, patches):
    with open(filepath, 'r') as f:
        content = f.read()
    
    # Add import after 'use client' or other imports
    if SOUND_IMPORT not in content:
        # Add after the last import
        imports = re.findall(r"^import .+?['\"]\s*$", content, re.MULTILINE)
        if imports:
            last_import = imports[-1]
            content = content.replace(last_import, last_import + '\n' + SOUND_IMPORT)
        else:
            # Add after 'use client'
            content = content.replace("'use client'", "'use client'\n" + SOUND_IMPORT)
    
    # Add useGameSound hook call after function declaration
    # Look for function export or default function pattern
    hook_pattern = r"(export default function \w+\([^)]*\)\s*\{)"
    if re.search(hook_pattern, content):
        content = re.sub(
            hook_pattern,
            r'\1\n  const { play } = useGameSound()',
            content
        )
    
    # Apply sound patches
    for search, replacement in patches:
        if '\\0' in replacement:
            # Insert play() before the matched line
            new_replacement = replacement.replace('\\0', search)
            if search in content:
                content = content.replace(search, new_replacement, 1)
        elif replacement:
            if search in content:
                content = content.replace(search, replacement, 1)
    
    with open(filepath, 'w') as f:
        f.write(content)
    print(f"  ✅ {os.path.basename(filepath)}")


def main():
    for filename, patches in SOUND_PATCHES.items():
        filepath = os.path.join(GAMES_DIR, filename)
        if os.path.exists(filepath):
            add_sound_to_file(filepath, patches)
        else:
            print(f"  ❌ {filename} NOT FOUND")

if __name__ == '__main__':
    main()
