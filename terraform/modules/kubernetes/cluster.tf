data "digitalocean_kubernetes_versions" "cluster" {
}

data "digitalocean_vpc" "cluster-vpc" {
  region = var.region
}

resource "digitalocean_kubernetes_cluster" "cluster" {
  name          = "etimo-${lower(var.stage)}"
  region        = var.region
  version       = data.digitalocean_kubernetes_versions.cluster.latest_version
  auto_upgrade  = false
  surge_upgrade = true

  vpc_uuid = data.digitalocean_vpc.cluster-vpc.id

  maintenance_policy {
    start_time = "04:00"
    day        = "sunday"
  }

  node_pool {
    name       = "basic"
    size       = "s-1vcpu-2gb"
    auto_scale = true
    min_nodes  = 1
    max_nodes  = 4
  }
}

# resource "digitalocean_kubernetes_node_pool" "bar" {
#   cluster_id = digitalocean_kubernetes_cluster.cluster.id

#   name       = "compute-pool"
#   size       = "c-2"
#   node_count = 0
#   min_nodes = 0
#   max_nodes = 1
#   tags       = ["compute"]

#   # labels = {
#   #   service  = "backend"
#   #   priority = "high"
#   # }

#   # taint {
#   #   key    = "workloadKind"
#   #   value  = "database"
#   #   effect = "NoSchedule"
#   # }
# }
