# Host a new project

So you want to host your project in Etimo Kubernetes? Nice, you've come to the right place!

## Prerequisites

To be able to communicate with cluster you will need to have [kubectl](https://kubernetes.io/docs/tasks/tools/#kubectl) installed on your computer.

## Provision a project

Provisioning a project is the process of setting up a project and getting a dedicated namespace assigned for it.

[» Provision a namespace for your project](./Provisioning.md)

## How to get access?

To get access to the cluster you will need a configuration file called `kubeconfig`. This will automatically be generated for you when you provision your first project using these instructions. Further down you can also read more about how to use your kubeconfig.

When you provision your first project (or when someone else includes you in their project) you will get a `kubeconfig` file emailed to your `@etimo.se` address.

[» How to use a kubeconfig](./Kubeconfig.md)

[« Back to index](./README.md)
