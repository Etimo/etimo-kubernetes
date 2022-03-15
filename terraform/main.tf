module "kubernetes" {
  source = "./modules/kubernetes"
  stage  = "Staging"
}

module "environment" {
  source = "./modules/environment"
  name   = "etimo"
  stage  = "Staging"
  resources = [
    module.kubernetes.cluster_urn
  ]
}
