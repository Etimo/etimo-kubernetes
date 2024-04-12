# Buckets, if any



# Outputs
output "project__test_mogge_staging" {
  value = {
    project = "test-mogge"
    stage   = "staging"
    shared_databases = {
    },
    shared_databases_users = {
    },
  }
  sensitive = true
}

# Logdna resources
resource "logdna_view" "test_mogge_staging" {
  name  = "test-mogge"
  query = "namespace:test-mogge"
}