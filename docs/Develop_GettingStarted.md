# Contribute and develop

Nice to have you here!

## Prerequisites

To be able to work with this repo you will need the following tools installed on your computer:

- [terraform](https://www.terraform.io/downloads) - to manage and apply the Terraform infrastructure
- [kubectl](https://kubernetes.io/docs/tasks/tools/#kubectl) - to manage the Kubernetes cluster(s)
- [doctl](https://docs.digitalocean.com/reference/doctl/how-to/install/) - to manage Digital Ocean infra structure and cluster(s).

You will also need the following configuration tokens:

- terraform api key
- digital ocean api key
- digital ocean spaces key
- digital ocean spaces secret
- logdna api key

## Technology

We use Typescript in this project. Here is a brief summary of the major parts of the project.

- Terraform - used to manage the underlying infrastructure. [Read more](./Terraform.md) about this works.

Major libraries used:

- [Handlebars](https://handlebarsjs.com/) - templates used for rendering a lot of files
- [Joi](https://joi.dev/) - schemas used for validation
- [Shelljs](https://www.npmjs.com/package/shelljs) - for easy handling of shell scripting in Typescript/Javascript.

## Structure

- `docs/` - the documentation
- `kubernetes/` - all rendered Kubernetes resources. Is automatically created by the scripts.
- `projects/` - this is the central part for project definitions and the source for all files generated in this repo. To provision a new project a new folder is added here. This is basically the only thing that should be modified by non-contributors.
- `scripts/` - contains all the scripts
- `templates/` - all Handlebars templates grouped by category
- `terraform/` - rendered Terraform files and modules that is used to manage infrastructure
- `users/` - a list of all unique users currently in use in all the projects

[« Back to index](./README.md)
