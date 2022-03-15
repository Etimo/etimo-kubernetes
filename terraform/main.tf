# module "kubernetes" {
#   source = "./modules/kubernetes"
#   environment  = "staging"
# }

module "environment" {
    source = "./modules/environment"
    name = "etimo"
    stage = "staging"
}