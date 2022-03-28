# Terraform

This project uses [Terraform](https://www.terraform.io/) to manage the underlying infrastructure as much as possible.

We are currently running everything on [Digital Ocean](https://www.digitalocean.com/) for two main reasons:

1. Easy to manage
2. Deterministic costs

Terraform currently manages the following things:

- Projects (in Digital Ocean)
- Kubernetes cluster(s)
- Binding of resources
- Project resources
  - Buckets
  - Databases
  - ...and potentially other project resources in the future

In the future the plan is also to manage the DNS records through Terraform.

Terraform runs on the Terraform Cloud to have a safe place to keep the state without incurring any extra costs (e.g. for running a database).
