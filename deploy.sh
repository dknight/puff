#!/bin/bash

type=$1
if [ -z "$type" ]; then
  type="patch"
fi

npm run build

current=$( node -e "console.log(require('./package.json').version)"  | tr -d "\n" ) 
next=$( npm version $type | tr -d "\n" ) 

git push origin "$next"
git push origin main

npm publish