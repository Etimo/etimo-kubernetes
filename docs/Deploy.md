# How to deploy stuff

<!-- vscode-markdown-toc -->

- [Creating your resources](#creating-your-resources)
- [Preparing your resources for deployment](#preparing-your-resources-for-deployment)
  - [Always use specific tags for Docker images](#always-use-specific-tags-for-docker-images)
  - [How to run one time jobs](#how-to-run-one-time-jobs)
  - [How to deploy](#how-to-deploy)
  - [Hot to verify deployment](#hot-to-verify-deployment)

<!-- vscode-markdown-toc-config
	numbering=false
	autoSave=true
	/vscode-markdown-toc-config -->
<!-- /vscode-markdown-toc -->

## <a name='creating-your-resources'></a>Creating your resources

TODO

## <a name='preparing-your-resources-for-deployment'></a>Preparing your resources for deployment

There are some gotchas to learn when handling stuff in Kubernetes:

- Always use specific tags for Docker images
- How to run one time jobs (e.g. for migrations)
- How to deploy
- How to verify deployment

### <a name='always-use-specific-tags-for-docker-images'></a>Always use specific tags for Docker images

The first thing to think about is to never deploy a docker image using a `latest` tag (or similar static tag). The reasons for this are many:

- You don't know which image you are running
- Recreating pods could cause them to use a different image from other pods
- The tag could be already cached on the Kubernetes node and thus a new one won't be deployed

A best practice is to always deploy an image using a specific tag that is tied to a git commit. So for git commit `abcdef` you should have a corresponding docker image `org/my-app:abcdef`. This will make sure that the right tag is deployed, that it is not cached and that the same tag gets deployed in case of a pod recreation.

### <a name='how-to-run-one-time-jobs'></a>How to run one time jobs

One time jobs are good candidates to use for migrations for example. It is better to have a controlled way of applying migrations instead of trying to do it automatically on application start.

TODO show example

### <a name='how-to-deploy'></a>How to deploy

TODO Order of deploy
TODO how to apply
TODO use deployment, even for small use cases

### <a name='hot-to-verify-deployment'></a>Hot to verify deployment

TODO rollout status

[« Back to Getting started](./Host_GettingStarted.md)
