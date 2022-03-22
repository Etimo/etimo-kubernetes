#!/bin/bash

rm -vf terraform/project_*.tf
rm -vf kubernetes/projects/*.yaml
rm -vf users/*
mkdir -p temp/{csr,kubernetes,kubeconfigs,ca,migrations}