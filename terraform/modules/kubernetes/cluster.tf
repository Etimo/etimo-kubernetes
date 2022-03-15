data "digitalocean_kubernetes_versions" "cluster" {
  version_prefix = "1.21."
}

resource "digitalocean_vpc" "cluster-vpc" {
  name   = "default-${var.region}"
  region = var.region
}

resource "digitalocean_kubernetes_cluster" "cluster" {
  name          = "${lower(var.stage)}-cluster"
  region        = var.region
  version       = data.digitalocean_kubernetes_versions.cluster.latest_version
  auto_upgrade  = true
  surge_upgrade = true

  vpc_uuid = digitalocean_vpc.cluster-vpc.id

  maintenance_policy {
    start_time = "04:00"
    day        = "sunday"
  }

  node_pool {
    name       = "basic"
    size       = "s-1vcpu-2gb"
    auto_scale = true
    min_nodes  = 1
    max_nodes  = 1
  }
}