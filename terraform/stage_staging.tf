# Shared postgres database
resource "digitalocean_database_cluster" "staging-shared" {
  name       = "staging-shared"
  engine     = "pg"
  version    = "13"
  size       = "db-s-1vcpu-1gb"
  region     = var.region
  node_count = 1
}

data "digitalocean_database_ca" "staging-db-ca" {
  cluster_id = digitalocean_database_cluster.staging-shared.id
}

