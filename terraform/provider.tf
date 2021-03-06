terraform {
  required_providers {
    digitalocean = {
      source  = "digitalocean/digitalocean"
      version = "~> 2.0"
    }
    logdna = {
      source  = "logdna/logdna"
      version = "1.7.0"
    }
  }

  cloud {
    organization = "etimo"

    workspaces {
      name = "etimo-kubernetes"
    }
  }
}

provider "digitalocean" {
  token             = var.do_token
  spaces_access_id  = var.spaces_key
  spaces_secret_key = var.spaces_secret
}

provider "logdna" {
  servicekey = var.logdna_key
}
