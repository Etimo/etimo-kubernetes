#!/bin/bash

git diff --cached --name-status | cat
DELETED_FILES=$(git diff --cached --name-status | grep -E "^D")
ADDED_FILES=$(git diff --cached --name-status | grep -E "^A")
MODIFIED_FILES=$(git diff --cached --name-status | grep -E "^M")

DELETED_PROJECTS=$(echo $DELETED_FILES | awk -F'/' '{print $2}')
ADDED_PROJECTS=$(echo $ADDED_FILES | awk -F'/' '{print $2}')

echo Deleted projects: $DELETED_PROJECTS
echo Added projects: $ADDED_PROJECTS