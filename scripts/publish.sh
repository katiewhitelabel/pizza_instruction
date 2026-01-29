#!/bin/bash
set -e

REPO_DIR="/root/clawd/pizza_instruction"
COMMIT_MSG="$1"

if [ -z "$COMMIT_MSG" ]; then
  echo "Error: Commit message required"
  exit 1
fi

cd "$REPO_DIR"

# Add all changes
git add .

# Commit
git commit -m "$COMMIT_MSG"

# Push
git push

# Output summary of changes
echo "Changes published successfully."
echo "Summary:"
git diff --stat HEAD~1 HEAD
