#!/bin/bash

rm -vf terraform/project_*.tf
rm -vf kubernetes/projects/*.yaml
rm -vf users/*
rm -vrf temp
mkdir -p temp/{csr,kubernetes,kubeconfigs,ca,migrations}