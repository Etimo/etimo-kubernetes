output "project_id" {
  value = resource.digitalocean_project.project.id
}

output "cluster_urn" {
  value = module.kubernetes.cluster_urn
}

output "cluster_id" {
  value = module.kubernetes.cluster_id
}

output "cluster_endpoint" {
  value = module.kubernetes.endpoint
}
