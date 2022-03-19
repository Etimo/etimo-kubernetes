#!/bin/bash

cd terraform
terraform output -json > cluster-info.json
echo "Found:"
cat cluster-info.json