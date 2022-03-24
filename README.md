# etimo-kubernetes

- Generate certificate signing request (csr) for user
- Approve csr in k8s cluster
- Download certificate
- Create kubeconfig

## How to test emails locally

Gmail, app password etc
https://myaccount.google.com/u/1/apppasswords

TODO:

- doctl save config for clusters from terraform output
- Add RBAC: full admin to namespace and read to everything?
  - per user:
    - admin in namespace
    - read to everything (except other's secrets)
  - per project:
    - admin in namespace (used in ci)
    - read to everything (except other's secrets)
  - should not be able to alter resource quota or namespace itself
- auto handle oauth2-proxy
