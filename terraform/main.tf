module "environment" {
  source = "./modules/environment"
  name   = "etimo"
  stage  = "Staging"
}

module "kubernetes" {
  source = "./modules/kubernetes"
  stage  = "Staging"
  region = var.region
}

module "project_bind" {
  source     = "./modules/project_bind"
  project_id = module.environment.project_id
  resources = [
    module.kubernetes.cluster_urn
  ]
}

resource "digitalocean_spaces_bucket" "hello-world" {
  region = var.region
  name = "hello-world"
}