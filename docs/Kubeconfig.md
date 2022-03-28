# Kubeconfig

A kubeconfig file is used to communicate with a Kubernetes cluster. The kubeconfig files sent to you from this repo will be one per cluster but you can freely merge them together or merge them in to any existing kubeconfigs you might have.

Table of contents:

<!-- vscode-markdown-toc -->

- [What is a kubeconfig file?](#what-is-a-kubeconfig-file?)
- [Using a kubeconfig](#using-a-kubeconfig)
- [Kubeconfigs for Etimo Kubernetes](#kubeconfigs-for-etimo-kubernetes)
- [Merging kubeconfigs](#merging-kubeconfigs)

<!-- vscode-markdown-toc-config
	numbering=false
	autoSave=true
	/vscode-markdown-toc-config -->
<!-- /vscode-markdown-toc -->

## <a name='what-is-a-kubeconfig-file?'></a>What is a kubeconfig file?

To be able to communicate with a cluster and run commands you will need some credentials and something that describes where the cluster is located and how it wants to communicate. That is what the kubeconfig file is for.

To be able to communicate with a cluster you need to have [kubectl](https://kubernetes.io/docs/tasks/tools/#kubectl) installed on your computer.

To verify that you have it installed you can just run:

```bash
kubectl
```

Example kubeconfig file:

```yaml
apiVersion: v1
clusters: # List of clusters
  - cluster: # Connection info for a cluster
      certificate-authority-data: <certificate authority data>
      server: https://<cluster-address>
    name: etimo-staging # The name of the cluster
contexts:
  - context: # A context entry
      cluster: etimo-staging # The cluster to use
      user: indrif # ...together with the user to connect with
    name: etimo-staging # The name of the context. Used with the --context flag (not necessary if there is only one)
current-context: etimo-staging
kind: Config
preferences: {}
users: # List of users
  - name: indrif # Username
    user:
      client-certificate-data: <certifcate data> # Certificate used when authorizing
      client-key-data: <certificate key>
```

## <a name='using-a-kubeconfig'></a>Using a kubeconfig

The default config for kubectl is located in some magical places on your computer (depending on OS). For example on Mac OS it is located in `~/.kube/config`. This means that when you run `kubectl` without saying anything special it will use that file.

If you want to specify the kubeconfig that you want to use you simply type:

```
kubectl --kubeconfig=my-kubeconfig.yaml ...
```

The kubeconfig is highly sensitive since it contains everything that is needed to connect to the cluster(s).

A kubeconfig file can contain entries for multiple clusters, called "contexts". To be able to specify context you simply type for example:

```
kubectl --kubeconfig=my-kubeconfig.yaml --context staging ...
```

## <a name='kubeconfigs-for-etimo-kubernetes'></a>Kubeconfigs for Etimo Kubernetes

Kubeconfigs are automatically created for new users in the cluster(s) and will be sent by email to you when created. You will always receive one kubeconfig file per cluster and they will be named `<github-username>-<stage>.yaml`, for example `indrif-staging.yaml`.

## <a name='merging-kubeconfigs'></a>Merging kubeconfigs

TODO
