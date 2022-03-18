#!/bin/bash

USERNAME=$1
PROJECT="test"
source "./lib/vars.sh"

if [ "$USERNAME" == "" ]; then
    echo "Missing username."
    exit 1
fi

./bin/generate-csr.sh $USERNAME

# Render yaml for cluster
yarn render:csr --username $USERNAME

# Send to cluster
kubectl apply -f csr-$USERNAME.yaml

# Approve
kubectl certificate approve $USERNAME

# Get certificate
kubectl get csr $USERNAME -o jsonpath='{.status.certificate}' | base64 --decode > $CERT_FILE
echo "Generated certificate in $CERT_FILE"

rm csr-$USERNAME.yaml
