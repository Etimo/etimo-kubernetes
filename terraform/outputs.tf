output "cluster_ids" {
  value = module.environment[*].cluster_id
}

output "cluster_endpoints" {
  value = module.environment[*].cluster_endpoint
}

output "cluster_names" {
  value = module.environment[*].cluster_name
}

output "stages" {
  value = var.stages
}

