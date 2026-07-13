#!/bin/bash
set -e
cd /Users/hy/.openclaw/workspace/forum
git add -A
git commit -m "feat: list player buttons, mini-player, classic songs"
git push
npx vercel --prod
