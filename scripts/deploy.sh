#!/bin/bash

echo "Start packaging Lambda"

mkdir -p ./.deploy
(cd ./lambdas/hotkeysSqsProcessor; zip -r ../../.deploy/function.zip .)

echo "Start deploying Lambda"

aws lambda update-function-code --function-name $1 --zip-file fileb://.deploy/function.zip
