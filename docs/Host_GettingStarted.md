# Host a new project

So you want to host your project in Etimo Kubernetes? Nice, you've come to the right place!

<!-- vscode-markdown-toc -->

- [Prerequisites](#prerequisites)
- [Provision a project](#provision-a-project)
- [How to get access?](#how-to-get-access?)

<!-- vscode-markdown-toc-config
	numbering=false
	autoSave=true
	/vscode-markdown-toc-config -->
<!-- /vscode-markdown-toc -->

## <a name='prerequisites'></a>Prerequisites

To be able to communicate with cluster you will need to have [kubectl](https://kubernetes.io/docs/tasks/tools/#kubectl) installed on your computer.

## <a name='provision-a-project'></a>Provision a project

Provisioning a project is the process of setting up a project and getting a dedicated namespace assigned for it.

[» Provision a namespace for your project](./Provisioning.md)

## <a name='how-to-get-access?'></a>How to get access?

To get access to the cluster you will need a configuration file called `kubeconfig`. This will automatically be generated for you when you provision your first project using these instructions. Further down you can also read more about how to use your kubeconfig.

When you provision your first project (or when someone else includes you in their project) you will get a `kubeconfig` file emailed to your `@etimo.se` address.

[» How to use a kubeconfig](./Kubeconfig.md)

## How to deploy stuff in the namespace?

So you are eager to start using your new namespace to deploy stuff? You should be! But before you get started there are some common best practices to learn

[» How to deploy stuff](./Deploy.md)

[« Back to index](./README.md)
