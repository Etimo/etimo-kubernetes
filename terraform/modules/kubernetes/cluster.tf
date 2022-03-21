provider "helm" {
  kubernetes {
    host                   = digitalocean_kubernetes_cluster.cluster.endpoint
    cluster_ca_certificate = base64decode(digitalocean_kubernetes_cluster.cluster.cluster_ca_certificate)
    client_certificate     = base64decode(digitalocean_kubernetes_cluster.cluster.client_certificate)
    client_key             = base64decode(digitalocean_kubernetes_cluster.cluster.client_key)
  }
}

data "digitalocean_kubernetes_versions" "cluster" {
}

data "digitalocean_vpc" "cluster-vpc" {
  region = var.region
}

resource "digitalocean_kubernetes_cluster" "cluster" {
  name          = "etimo-${lower(var.stage)}"
  region        = var.region
  version       = data.digitalocean_kubernetes_versions.cluster.latest_version
  auto_upgrade  = true
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
    max_nodes  = 1
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

resource "helm_release" "sealed-secrets" {
  name       = "sealed-secrets"
  repository = "https://bitnami-labs.github.io/sealed-secrets"
  chart      = "sealed-secrets"
  version    = "2.1.4"

  # values = [
  #   "${file("values.yaml")}"
  # ]

  # set {
  #   name  = "cluster.enabled"
  #   value = "true"
  # }

  # set {
  #   name  = "metrics.enabled"
  #   value = "true"
  # }

  # set {
  #   name  = "service.annotations.prometheus\\.io/port"
  #   value = "9127"
  #   type  = "string"
  # }
}