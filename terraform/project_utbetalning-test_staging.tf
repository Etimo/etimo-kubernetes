# Buckets, if any


resource "digitalocean_database_db" "utbetalning_test_staging_auth_shared" {
  cluster_id = local.staging_db_clusters["mysql"].id
  name       = "utbetalning_test_staging_auth"
}

resource "digitalocean_database_user" "utbetalning_test_staging_auth_shared" {
  cluster_id = local.staging_db_clusters["mysql"].id
  name       = "utbetalning_test_staging_auth"
}
resource "digitalocean_database_db" "utbetalning_test_staging_main_shared" {
  cluster_id = local.staging_db_clusters["mysql"].id
  name       = "utbetalning_test_staging_main"
}

resource "digitalocean_database_user" "utbetalning_test_staging_main_shared" {
  cluster_id = local.staging_db_clusters["mysql"].id
  name       = "utbetalning_test_staging_main"
}

# Outputs
output "project__utbetalning_test_staging" {
  value = {
    project = "utbetalning-test"
    stage   = "staging"
    shared_databases = {
      auth = {
        db_type      = "mysql",
        name         = "utbetalning_test_staging_auth",
        port         = local.staging_db_clusters["mysql"].port,
        host         = local.staging_db_clusters["mysql"].host,
        private_host = local.staging_db_clusters["mysql"].private_host,
        ca           = local.staging_db_certs["mysql"].certificate,
      },
      main = {
        db_type      = "mysql",
        name         = "utbetalning_test_staging_main",
        port         = local.staging_db_clusters["mysql"].port,
        host         = local.staging_db_clusters["mysql"].host,
        private_host = local.staging_db_clusters["mysql"].private_host,
        ca           = local.staging_db_certs["mysql"].certificate,
      },
    },
    shared_databases_users = {
      auth = {
        name     = "utbetalning_test_staging_auth",
        password = digitalocean_database_user.utbetalning_test_staging_auth_shared.password,
      },
      main = {
        name     = "utbetalning_test_staging_main",
        password = digitalocean_database_user.utbetalning_test_staging_main_shared.password,
      },
    },
  }
  sensitive = true
}

# Logdna resources
resource "logdna_view" "utbetalning_test_staging" {
  name  = "utbetalning-test"
  query = "namespace:utbetalning-test"
}