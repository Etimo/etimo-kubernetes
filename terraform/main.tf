module "environment" {
  source = "./modules/environment"
  count  = length(var.stages)
  name   = "etimo"
  stage  = var.stages[count.index]
  region = var.region
}

locals {
  staging_db_clusters = tomap({
    "pg"    = digitalocean_database_cluster.staging-shared,
    "mysql" = digitalocean_database_cluster.staging-mysql-shared,
    "redis" = digitalocean_database_cluster.staging-redis-shared
  })
  staging_db_certs = tomap({
    "pg"    = data.digitalocean_database_ca.staging-db-ca,
    "mysql" = data.digitalocean_database_ca.staging-mysql-db-ca,
    "redis" = data.digitalocean_database_ca.staging-redis-db-ca
  })
}
