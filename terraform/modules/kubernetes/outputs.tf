output "cluster_urn" {
  value = digitalocean_kubernetes_cluster.cluster.urn
}

output "endpoint" {
  value = digitalocean_kubernetes_cluster.cluster.endpoint
}
