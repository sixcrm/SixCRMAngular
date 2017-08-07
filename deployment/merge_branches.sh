#!/bin/bash
set -e
set -u
set -o pipefail

git fetch --all

echo "Checking out..."
git checkout $2

echo "Merging..."
git merge $1

echo "Pushing..."
git push origin $2
