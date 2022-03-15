data "digitalocean_kubernetes_versions" "cluster" {
  version_prefix = "1.21."
}

resource "digitalocean_vpc" "cluster-vpc" {
  name     = "${var.stage}-cluster-vpc"
  region   = var.region
  ip_range = "10.10.10.0/24"
}

resource "digitalocean_kubernetes_cluster" "cluster" {
  name         = "${var.stage}-cluster"
  region       = var.region
  version      = data.digitalocean_kubernetes_versions.cluster.latest_version
  auto_upgrade = true
  vpc_uuid     = digitalocean_vpc.cluster-vpc.id

  maintenance_policy {
    start_time = "04:00"
    day        = "sunday"
  }

  node_pool {
    name       = "autoscale-worker-pool"
    size       = "s-1vcpu-1gb"
    auto_scale = true
    min_nodes  = 1
    max_nodes  = 1
  }
}