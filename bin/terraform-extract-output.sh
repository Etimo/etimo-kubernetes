#!/bin/bash

cd terraform
terraform output -json > ../cluster-info.json
wait
echo "Found:"
cat ../cluster-info.json