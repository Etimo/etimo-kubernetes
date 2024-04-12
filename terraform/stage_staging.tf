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

resource "digitalocean_database_cluster" "staging-mysql-shared" {
  name       = "staging-mysql-shared"
  engine     = "mysql"
  version    = "8"
  size       = "db-s-1vcpu-1gb"
  region     = var.region
  node_count = 1
}

data "digitalocean_database_ca" "staging-mysql-db-ca" {
  cluster_id = digitalocean_database_cluster.staging-mysql-shared.id
}

resource "digitalocean_database_cluster" "staging-redis-shared" {
  name       = "staging-redis-shared"
  engine     = "redis"
  version    = "7"
  size       = "db-s-1vcpu-1gb"
  region     = var.region
  node_count = 1
}

data "digitalocean_database_ca" "staging-redis-db-ca" {
  cluster_id = digitalocean_database_cluster.staging-redis-shared.id
}
