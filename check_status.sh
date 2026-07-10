#!/bin/bash
# Check build and deployment status
echo "=== Build check ==="
if [ -f .next/build-manifest.json ]; then
    echo "BUILD_OK - build-manifest.json exists"
else
    echo "BUILD_FAIL - no build-manifest.json"
fi
echo "=== Game files ==="
ls src/components/games/*.jsx | wc -l
echo "games"
echo "=== Git log ==="
git log --oneline -3
echo "=== Vercel status ==="
cat .vercel/project.json 2>/dev/null | head -3
