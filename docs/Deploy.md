# How to deploy stuff

<!-- vscode-markdown-toc -->

- [Creating your resources](#creating-your-resources)
- [Pods / Deployments](#pods-/-deployments)
  - [Preparing your resources for deployment](#preparing-your-resources-for-deployment)
  - [Always use specific tags for Docker images](#always-use-specific-tags-for-docker-images)
  - [Use public images (atm)](<#use-public-images-(atm)>)
  - [Jobs (one time running pods)](<#jobs-(one-time-running-pods)>)
  - [How to deploy](#how-to-deploy)
  - [How to verify deployment](#how-to-verify-deployment)

<!-- vscode-markdown-toc-config
	numbering=false
	autoSave=true
	/vscode-markdown-toc-config -->
<!-- /vscode-markdown-toc -->

## <a name='creating-your-resources'></a>Creating your resources

You can create almost any resources that you need, please note however that some may require new features to be developed before working properly. Please file an issue (or even better a PR!) for new features.

- Pods
- Deployments
- Services
- Ingresses
- Jobs

## <a name='pods-/-deployments'></a>Pods / Deployments

### <a name='preparing-your-resources-for-deployment'></a>Preparing your resources for deployment

There are some gotchas to learn when handling stuff in Kubernetes. This page briefly describes some of the considerations.

### <a name='always-use-specific-tags-for-docker-images'></a>Always use specific tags for Docker images

The first thing to think about is to never deploy a docker image using a `latest` tag (or similar static tag). The reasons for this are many:

- You don't know which image you are running
- Recreating pods could cause them to use a different image from other pods
- The tag could be already cached on the Kubernetes node and thus a new one won't be deployed (this can be solved using the `ImagePullPolicy: Always` but this means longer deployment times)

A best practice is to always deploy an image using a specific tag that is tied to a git commit. So for git commit `abcdef` you should have a corresponding docker image `org/my-app:abcdef`. This will make sure that the right tag is deployed, that it is not cached and that the same tag gets deployed in case of a pod recreation.

### <a name='use-public-images-(atm)'></a>Use public images (atm)

At the moment Etimo Kubernetes only support public images (i.e. images that are not in a private registry). Adding support for private images can be done in the future if the need arise.

## <a name='jobs-(one-time-running-pods)'></a>Jobs (one time running pods)

One time jobs are good candidates to use for migrations for example. It is better to have a controlled way of applying migrations instead of trying to do it automatically on application start.

You can deploy these and wait for them finish before deploying an update to your application.

TODO show example

## Ingresses

Ingresses are used when you want to expose a service to the public by an endpoint. Please note that Etimo Kubernetes has a custom policy in place for ingresses at the moment that restrict projects to only use hostnames in the form of `<project>.<cluster>.<domain>` or `<project>-<something>.<cluster>.<domain>`. You can for example use `myproject.app.etimo.se` or `myproject-test.app.etimo.se`. This is to prevent havoc among ingresses and to naturally tie them to the projects that owns them. Otherwise you will get an error similar to this one:

```bash
$ kubectl apply -f invalid-ingress.yaml
Error from server: error when creating "invalid-ingress.yaml": admission webhook "admission-server.default.svc" denied the request: ingress host must be default.app.etimo.se or default-<something>.app.etimo.se
```

## <a name='how-to-verify-deployment'></a>How to verify deployment

```bash
kubectl rollout status deployment/<name>
```

[« Back to Getting started](./Host_GettingStarted.md)
