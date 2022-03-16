#!/bin/bash

git diff --name-only origin/main HEAD
PROJECT_COUNT=$(git diff --name-only origin/main HEAD | grep "projects/" | awk -F'/' '{print $2}' | sort | uniq | wc -l)
if [ $PROJECT_COUNT -gt 1 ]; then
    echo "Multiple projects detected"
    exit 1
fi
