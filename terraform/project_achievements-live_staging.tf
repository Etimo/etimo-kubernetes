# Buckets, if any

locals {
  achievements_live_staging_database_clusters = toset([])
  achievements_live_staging_shared_databases  = toset(["main", "unleash"])
}

resource "digitalocean_database_db" "achievements_live_staging_shared" {
  for_each   = local.achievements_live_staging_shared_databases
  cluster_id = digitalocean_database_cluster.staging-shared.id
  name       = "achievements_live_staging_${each.key}"
}

resource "digitalocean_database_user" "achievements_live_staging_shared" {
  for_each   = local.achievements_live_staging_shared_databases
  cluster_id = digitalocean_database_cluster.staging-shared.id
  name       = "achievements_live_staging_${each.key}"
}

resource "digitalocean_database_cluster" "achievements_live_staging" {
  for_each   = local.achievements_live_staging_database_clusters
  name       = "achievements_live_staging_${each.key}"
  engine     = "pg"
  version    = "13"
  size       = "db-s-1vcpu-1gb"
  region     = var.region
  node_count = 1
}

# Outputs
output "project__achievements_live_staging" {
  value = {
    project = "achievements-live"
    stage   = "staging"
    database_clusters = {
      for key, obj in digitalocean_database_cluster.achievements_live_staging :
      key => ({
        name : obj.name,
        user : obj.user,
        password : obj.password,
        port : obj.port
        host : obj.host
        private_host : obj.private_host
      })
    }
    shared_databases = {
      for key, obj in digitalocean_database_db.achievements_live_staging_shared :
      key => ({
        name : obj.name,
        port : digitalocean_database_cluster.staging-shared.port
        host : digitalocean_database_cluster.staging-shared.host
        private_host : digitalocean_database_cluster.staging-shared.private_host
        ca : data.digitalocean_database_ca.staging-db-ca.certificate
      })
    }
    shared_databases_users = {
      for key, obj in digitalocean_database_user.achievements_live_staging_shared :
      key => ({
        name : obj.name,
        password : obj.password,
      })
    }
  }
  sensitive = true
}

# Logdna resources
resource "logdna_view" "achievements_live_staging" {
  name  = "achievements-live"
  query = "namespace:achievements-live"
}