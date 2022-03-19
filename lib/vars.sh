#!/bin/bash

CERT_FILE="$1-k8s-access.crt"
KEY_FILE="$1-k8s.key"
KUBECONFIG_FILE="$1-kubeconfig.yaml"
CLUSTER_NAME="etimo-staging"
CLUSTER_SERVER="https://fefd9159-a36a-4ad2-883d-7c9563ffdf1d.k8s.ondigitalocean.com"
ALL_OWNERS_FILE="users/all_owners"