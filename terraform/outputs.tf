output "cluster_urn" {
  value = module.environment[*].cluster_urn
}

output "cluster_id" {
  value = module.environment[*].cluster_id
}

output "cluster_endpoint" {
  value = module.environment[*].cluster_endpoint
}
