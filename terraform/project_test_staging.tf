# Buckets, if any



# Outputs
output "project__test_staging" {
  value = {
    project = "test"
    stage   = "staging"
    shared_databases = {
    },
    shared_databases_users = {
    },
  }
  sensitive = true
}

# Logdna resources
resource "logdna_view" "test_staging" {
  name  = "test"
  query = "namespace:test"
}