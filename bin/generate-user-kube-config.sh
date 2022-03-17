#!/bin/bash

USERNAME=$1
PROJECT="test"
source "./lib/vars.sh"

echo $CERT_FILE

if [ "$USERNAME" == "" ]; then
    echo "Missing username."
    exit 1
fi

if [ ! -f $CERT_FILE ]; then
    echo "Missing cert file $CERT_FILE."
    exit 1
fi

if [ ! -f $KEY_FILE ]; then
    echo "Missing key file $KEY_FILE."
    exit 1
fi

# TODO: Create one entry per cluster
kubectl config set-cluster $CLUSTER_NAME --server=$CLUSTER_SERVER --certificate-authority=ca.crt --kubeconfig=$KUBECONFIG_FILE --embed-certs
kubectl config set-cluster test --server=$CLUSTER_SERVER --certificate-authority=ca.crt --kubeconfig=$KUBECONFIG_FILE --embed-certs
kubectl config set-credentials $USERNAME --client-certificate=$CERT_FILE --client-key=$KEY_FILE --embed-certs --kubeconfig=$KUBECONFIG_FILE
kubectl config set-context $CLUSTER_NAME --cluster=$CLUSTER_NAME --user=$USERNAME --kubeconfig=$KUBECONFIG_FILE #--namespace=$PROJECT
kubectl --kubeconfig $KUBECONFIG_FILE config use-context $CLUSTER_NAME