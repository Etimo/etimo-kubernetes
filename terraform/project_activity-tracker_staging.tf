# Buckets, if any


resource "digitalocean_database_db" "activity_tracker_staging_main_shared" {
  cluster_id = local.staging_db_clusters["mysql"].id
  name       = "activity_tracker_staging_main"
}

resource "digitalocean_database_user" "activity_tracker_staging_main_shared" {
  cluster_id = local.staging_db_clusters["mysql"].id
  name       = "activity_tracker_staging_main"
}

# Outputs
output "project__activity_tracker_staging" {
  value = {
    project = "activity-tracker"
    stage   = "staging"
    shared_databases = {
      main = {
        db_type      = "mysql",
        name         = "activity_tracker_staging_main",
        port         = local.staging_db_clusters["mysql"].port,
        host         = local.staging_db_clusters["mysql"].host,
        private_host = local.staging_db_clusters["mysql"].private_host,
        ca           = local.staging_db_certs["mysql"].certificate,
      },
    },
    shared_databases_users = {
      main = {
        name     = "activity_tracker_staging_main",
        password = digitalocean_database_user.activity_tracker_staging_main_shared.password,
      },
    },
  }
  sensitive = true
}

# Logdna resources
resource "logdna_view" "activity_tracker_staging" {
  name  = "activity-tracker"
  query = "namespace:activity-tracker"
}