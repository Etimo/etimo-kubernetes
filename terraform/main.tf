module "environment" {
  source = "./modules/environment"
  name   = "etimo"
  stage  = "Staging"
}

module "kubernetes" {
  source = "./modules/kubernetes"
  stage  = "Staging"
}

module "project_bind" {
  source     = "./modules/project_bind"
  project_id = module.environment.project_id
  resources = [
    module.kubernetes.cluster_urn
  ]
}