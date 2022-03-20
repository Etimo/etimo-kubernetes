module "environment" {
  source = "./modules/environment"
  count  = length(var.stages)
  name   = "etimo"
  stage  = var.stages[count.index]
  region = var.region
}
