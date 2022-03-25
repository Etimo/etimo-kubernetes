<div id="top"></div>

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/othneildrew/Best-README-Template">
    <img src="https://kubernetes.io/images/nav_logo.svg" alt="Logo" width="400" height="100">
  </a>

  <h3>Etimo Kubernetes</h3>

  <p align="center">
    <a href="https://github.com/Etimo/etimo-kubernetes"><strong>Explore the docs »</strong></a>
    ·
    <a href="https://github.com/Etimo/etimo-kubernetes/issues">Report Bug</a>
    ·
    <a href="https://github.com/Etimo/etimo-kubernetes/issues">Request Feature</a>
  </p>
</div>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->

## About The Project

> A managed kubernetes cluster with light-weight tooling to simplify, unify and give faster possibilities to host and manage arbitrary Etimo Open projects in a standardised way.

This project aims to give employees at Etimo the possibility to work with Kubernetes at Etimo Open but without everyone having to invent the wheel for setting up and managing a cluster. In this way we can learn more, work more together and lower the barrier to start and host new Etimo Open projects.

One of the question that always arise when we are starting or want to start a new project is:

> "Where and how do we host this?"

We want to remove this barrier to simplify the process. Usually everyone does things their own way (which of course can be fine since we all want to learn new stuff) but this results in lots of different accounts registered across different services. Often these accounts are tied to personal accounts. Some of these are paid for by Etimo which creates a lot of hassle and administration.

A lot of us also want to work more with Kubernetes. And Kubernetes is a hot technology which makes it even more important for us to be able to work with it and learn more.

The point of this project is not in any way to abstract the Kubernetes part. We want to be able to work with Kubernetes

## Goals

This project was created the certain goals in mind:

1. **Don't abstract away Kubernetes** - i.e. don't create a lot of custom tooling to hide Kubernetes from the projects. We want the tooling to be as light-weight as possible and do the bare minimum to get you started.
2. **Easy onboarding for new projects** - it should be easy and quick to setup a project.
3. **Full access to an isolated namespace** - each individual project can decide what to run, how to deploy it etc. You should have full access to your own space but not be able to destroy other projects.
4. **Unified and easy hosting** - all projects should be hosted and optionally exposed on a single domain with automatic TLS certificates using Let's encrypt.
5. **A central hub for sharing Kubernetes knowledge** - even though everyone is free to do their stuff the way they like, there should still be a place to discuss solutions and help other projects with Kubernetes specific stuff.

## Getting Started

Head over to the [docs](docs/) to read more!

## Roadmap

- [x] Manage infrastructure using Terraform
- [x] Able to manage multiple clusters (staging/production)
- [x] Provision namespaces for projects using PRs
- [x] Automatically create kubeconfigs for each user that is onboarded
- [x] Add RBAC to give full access to the namespaces you are collaborating on
- [x] Add RBAC to give read access to the whole cluster
- [ ] Host each cluster in a different subdomain `<environment>.domain.se` with wildcard cert for `*.<environment>.domain.se`

See the [open issues](https://github.com/Etimo/etimo-kubernetes/issues) for a full list of proposed features (and known issues).

<!-- # etimo-kubernetes

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
- auto handle oauth2-proxy -->
