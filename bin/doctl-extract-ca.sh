#!/bin/bash

CLUSTER_ID=$1
CLUSTER_NAME=$2

if [ "$CLUSTER_ID" == "" ]; then
    echo "Missing cluster id."
    exit 1
fi

if [ "$CLUSTER_NAME" == "" ]; then
    echo "Missing cluster name."
    exit 1
fi

echo "Extracting CA from $CLUSTER_NAME ($CLUSTER_ID)..."
doctl kubernetes cluster kubeconfig show $CLUSTER_ID | grep certificate-authority-data | awk -F': ' '{print $2}' | base64 -d > ca.$CLUSTER_NAME.crt
echo "  -> Wrote ca.$CLUSTER_NAME.crt"