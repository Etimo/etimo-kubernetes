#!/bin/bash

USERNAME=$1
CERT_FILE="$1-k8s-access.crt"
KEY_FILE="$1-k8s.key"

# Prepare csr
openssl req -new -newkey rsa:4096 -nodes -keyout $KEY_FILE -out $USERNAME-k8s.csr -subj "/CN=$USERNAME/O=developer" -days 365
cat $USERNAME-k8s.csr | base64 | tr -d '\n' > $USERNAME-base64-encoded.csr

