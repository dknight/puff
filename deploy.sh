#!/bin/bash

type=$1
if [ -z "$type" ]; then
  type="patch"
fi

current=$( node -e "console.log(require('./package.json').version)"  | tr -d "\n" ) 
next=$( npm version $type | tr -d "\n" ) 

BUILD_VERSION="v$next" npm run build

git add .
git commit -m "Release: v$next"

git push origin "$next"
git push origin main

npm publish