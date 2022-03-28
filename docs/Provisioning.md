# Provisioning a project

Each project should run in its own namespace in Kubernetes. When you provision a namespace you get full access to managing that namespace through kubectl.

Table of contents:

<!-- vscode-markdown-toc -->

- [How to provision a namespace](#how-to-provision-a-namespace)
  - [Clone and create a branch](#clone-and-create-a-branch)
  - [Adding new project](#adding-new-project)
    - [`info.yaml`](#`info.yaml`)
    - [`<environment>.yaml`](#`<environment>.yaml`)
  - [Commit, push and create a PR](#commit,-push-and-create-a-pr)
  - [The pull request](#the-pull-request)
  - [Merge](#merge)
- [Updating a project](#updating-a-project)
- [Adding the same user to multiple projects](#adding-the-same-user-to-multiple-projects)
- [Removing a user from a project](#removing-a-user-from-a-project)
- [Removing a project](#removing-a-project)
- [Renaming a project](#renaming-a-project)

<!-- vscode-markdown-toc-config
	numbering=false
	autoSave=true
	/vscode-markdown-toc-config -->
<!-- /vscode-markdown-toc -->

## <a name='how-to-provision-a-namespace'></a>How to provision a namespace

Provisioning a project is done by adding a few files to the repo and submitting and merging a pull request.

### <a name='clone-and-create-a-branch'></a>Clone and create a branch

First step is to clone the repo unless you've already done so.

```
git clone git@github.com:Etimo/etimo-kubernetes.git
```

If you already have it cloned make sure you pull the latest main and then create a branch from there:

```
git checkout main
git pull
git checkout -b my-project
```

### <a name='adding-new-project'></a>Adding new project

To add a new project you first create a folder in the `projects/` folder. Give it an appropriate name. This will be the name of the namespace in Kubernetes.

```
mkdir projects/my-project
```

Then you need to add at least two files:

- `info.yaml` - describing all the participants in the project
- `staging.yaml` - describing the needed resources in the staging cluster

In a future state when we also need/use a production cluster a corresponding `production.yaml` should also be added if you intend to use separate environments for your project.

**I.e. for each environment that you want your namespace in, create a file called `<environment>.yaml` in your project folder.**

All environment files use the same schema (as of now).

#### <a name='`info.yaml`'></a>`info.yaml`

This file lists all the users that should have access to the namespace. The username is your **Github username** and must be a part of the Etimo organization. No other users are accepted.

Example:

```yaml
owners:
  - indrif
```

There are multiple goals with this file:

1. It is used to create new users in the cluster
2. It is used to protect your project from being edited by other people (using [CODEONWERS](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-code-owners))

#### <a name='`<environment>.yaml`'></a>`<environment>.yaml`

**This schema is a work in progress at the moment and is bound to change!**

This file lists the resources that you will need. At the moment there is support for the following resources:

- S3 compatible buckets
- Managed databases (postgres)

The following resources will be added later on:

- Managed databases (possibly others)

The format of the file looks like this:

```yaml
buckets:
  - bucket1
databases:
  - name: db1
    type: pg
    shared: true
```

If you don't need anything you can just have empty lists:

```yaml
buckets: []
databases: []
```

Furhter reading:

- [How to specify resources and how to access them](./Resources.md)

### <a name='commit,-push-and-create-a-pr'></a>Commit, push and create a PR

Add your new project, commit it and push.

```bash
git add projects/my-project
git commit -m "feat: add project my-project"
git push
```

### <a name='the-pull-request'></a>The pull request

Github workflows will run to make sure the syntax and schemas are correct. If something is wrong you can continue fixing it until you get a green light from Github.

When the PR is ready you can request an approval to be able to merge the PR. The process for approving involves [CODEONWERS](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-code-owners) and you can read more about the process here.

### <a name='merge'></a>Merge

When the PR is merged the following things will be set up:

1. Your namespace will be created
2. Terraform will update infrastructure and provision any potential buckets etc
3. You will get a kubeconfig file sent to your `@etimo.se` email that you can use to work with the namespace in the cluster.

## <a name='updating-a-project'></a>Updating a project

You can create a new PR to update the project. The update can change anything in the project (but remember that the change always need an approval from the owners). Feel free to add or remove users in the `info.yaml` or add/remove resources in the environment files.

When merging the PR the project will be updated accordingly in Kubernetes.

## <a name='adding-the-same-user-to-multiple-projects'></a>Adding the same user to multiple projects

Adding the same user to multiple projects is totally fine. What this means is that the user will have access to multiple namespaces in the cluster(s). The user will also be considered an owner in all of the projects it belongs to meaning they gain access to approve PRs for all the projects.

The user will not receive a new kubeconfig file for each project. The kubeconfig file is user specific and not project specific, meaning it will only be created and sent to the user whenever it is newly created in the cluster(s).

However there could be a case where a new cluster is added, then all users will receive a new kubeconfig for that cluster.

## <a name='removing-a-user-from-a-project'></a>Removing a user from a project

Simply create a new PR where the user is removed from the `info.yaml`. The user will then have their access to that project/namespace removed.

If the user does not belong to any projects anymore the user will be deleted from the cluster(s) as well.

## <a name='removing-a-project'></a>Removing a project

Simply removing the project folder will result in the namespace being deleted (and potentially some users as well if they are not a part of another project).

## <a name='renaming-a-project'></a>Renaming a project

Renaming a project is done by renaming the project folder. Please be aware that this will have the same effect as removing the project and adding another one instead.

BE AWARE: removing a namespace means that all resources in that namespace will be removed as well!
