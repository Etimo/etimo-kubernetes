#!/bin/bash

USERNAME=$1
PROJECT="test"
source "./lib/vars.sh"

if [ "$USERNAME" == "" ]; then
    echo "Missing username."
    exit 1
fi

./bin/generate-csr.sh $USERNAME

# # Render yaml for cluster
yarn render:csr --username $USERNAME

# # Send to cluster
kubectl apply -f csr-$USERNAME.yaml

# # Approve
kubectl certificate approve $USERNAME-k8s-access

# # Get certificate
kubectl get csr $USERNAME-k8s-access -o jsonpath='{.status.certificate}' | base64 --decode > $CERT_FILE
echo "Generated certificate in $CERT_FILE"

rm csr-$USERNAME.yaml
