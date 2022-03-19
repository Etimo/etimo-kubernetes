#!/bin/bash

CERT_FILE="$1-k8s-access.crt"
KEY_FILE="$1-k8s.key"
KUBECONFIG_FILE="$1-kubeconfig.yaml"
ALL_OWNERS_FILE="users/all_owners"