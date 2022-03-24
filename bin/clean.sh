#!/bin/bash

rm -vf terraform/project_*.tf
rm -rvf kubernetes/projects
rm -vf users/*
rm -vrf temp
mkdir -p temp/{csr,kubernetes,kubeconfigs,ca,migrations}
