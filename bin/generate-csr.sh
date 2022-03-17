#!/bin/bash

USERNAME=$1
PROJECT="test"
CERT_FILE="$1-k8s-access.crt"
KEY_FILE="$1-k8s.key"
KUBECONFIG_FILE="$1-kubeconfig.yaml"
CLUSTER_NAME="etimo-staging"
CLUSTER_SERVER="https://2df361da-c556-455d-9bb1-a6c74191c6ca.k8s.ondigitalocean.com"
# Prepare csr
openssl req -new -newkey rsa:4096 -nodes -keyout $KEY_FILE -out $USERNAME-k8s.csr -subj "/CN=$USERNAME/O=developer" -days 365
cat $USERNAME-k8s.csr | base64 | tr -d '\n' > $USERNAME-fixed.csr

# # Render yaml for cluster
yarn render:csr --username $USERNAME

# # Send to cluster
kubectl apply -f csr-$USERNAME.yaml

# # Approve
kubectl certificate approve $USERNAME-k8s-access

# # Get certificate
kubectl get csr $USERNAME-k8s-access -o jsonpath='{.status.certificate}' | base64 --decode > $CERT_FILE

# rm csr-$USERNAME.yaml

# kubectl config set-cluster $CLUSTER_NAME --server=$CLUSTER_SERVER --certificate-authority=ca.crt --kubeconfig=$KUBECONFIG_FILE --embed-certs
# kubectl config set-credentials bob --client-certificate=$CERT_FILE --client-key=$KEY_FILE --embed-certs --kubeconfig=$KUBECONFIG_FILE
# kubectl config set-context $PROJECT --cluster=$CLUSTER_NAME --namespace=bob --user=$USERNAME --kubeconfig=$KUBECONFIG_FILE
