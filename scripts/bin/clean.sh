#!/bin/bash

rm -vf terraform/project_*.tf
rm -rvf kubernetes/{projects,namespaces}
rm -vf users/*
rm -rf employees/
rm -vrf temp
mkdir -p temp/{csr,kubernetes,kubeconfigs,ca,migrations}