module "kubernetes" {
  source = "../kubernetes"
  stage  = var.stage
  region = var.region
}

module "project_bind" {
  source     = "../project_bind"
  project_id = digitalocean_project.project.id
  resources = [
    module.kubernetes.cluster_urn
  ]
}

