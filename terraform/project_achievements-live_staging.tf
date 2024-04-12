# Buckets, if any


resource "digitalocean_database_db" "achievements_live_staging_main_shared" {
  cluster_id = local.staging_db_clusters["pg"].id
  name       = "achievements_live_staging_main"
}

resource "digitalocean_database_user" "achievements_live_staging_main_shared" {
  cluster_id = local.staging_db_clusters["pg"].id
  name       = "achievements_live_staging_main"
}
resource "digitalocean_database_db" "achievements_live_staging_unleash_shared" {
  cluster_id = local.staging_db_clusters["pg"].id
  name       = "achievements_live_staging_unleash"
}

resource "digitalocean_database_user" "achievements_live_staging_unleash_shared" {
  cluster_id = local.staging_db_clusters["pg"].id
  name       = "achievements_live_staging_unleash"
}

# Outputs
output "project__achievements_live_staging" {
  value = {
    project = "achievements-live"
    stage   = "staging"
    shared_databases = {
      main = {
        db_type      = "pg",
        name         = "achievements_live_staging_main",
        port         = local.staging_db_clusters["pg"].port,
        host         = local.staging_db_clusters["pg"].host,
        private_host = local.staging_db_clusters["pg"].private_host,
        ca           = local.staging_db_certs["pg"].certificate,
      },
      unleash = {
        db_type      = "pg",
        name         = "achievements_live_staging_unleash",
        port         = local.staging_db_clusters["pg"].port,
        host         = local.staging_db_clusters["pg"].host,
        private_host = local.staging_db_clusters["pg"].private_host,
        ca           = local.staging_db_certs["pg"].certificate,
      },
    },
    shared_databases_users = {
      main = {
        name     = "achievements_live_staging_main",
        password = digitalocean_database_user.achievements_live_staging_main_shared.password,
      },
      unleash = {
        name     = "achievements_live_staging_unleash",
        password = digitalocean_database_user.achievements_live_staging_unleash_shared.password,
      },
    },
  }
  sensitive = true
}

# Logdna resources
resource "logdna_view" "achievements_live_staging" {
  name  = "achievements-live"
  query = "namespace:achievements-live"
}