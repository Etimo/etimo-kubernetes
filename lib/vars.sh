#!/bin/bash

CERT_FILE="$1-k8s-access.crt"
KEY_FILE="$1-k8s.key"
KUBECONFIG_FILE="$1-kubeconfig.yaml"
CLUSTER_NAME="etimo-staging"
CLUSTER_SERVER="https://2df361da-c556-455d-9bb1-a6c74191c6ca.k8s.ondigitalocean.com"
ALL_OWNERS_FILE="users/all_owners"