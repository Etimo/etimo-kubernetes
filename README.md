# etimo-kubernetes

- Generate certificate signing request (csr) for user
- Approve csr in k8s cluster
- Download certificate
- Create kubeconfig

## How to test emails locally

Gmail, app password etc
https://myaccount.google.com/u/1/apppasswords

TODO:

- How to install basic stuff to new clusters? -> migrations
- restrict cpu and memory in namespaces in the future
- doctl save config for clusters from terraform output
- Add RBAC: full admin to namespace and read to everything?
- Recreate users. Delete csr from k8s and provision them again. Bonus in the future to have a cron job automatically recreate them
