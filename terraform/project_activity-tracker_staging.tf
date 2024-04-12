# Buckets, if any



# Outputs
output "project__activity_tracker_staging" {
  value = {
    project = "activity-tracker"
    stage   = "staging"
    shared_databases = {
    },
    shared_databases_users = {
    },
  }
  sensitive = true
}

# Logdna resources
resource "logdna_view" "activity_tracker_staging" {
  name  = "activity-tracker"
  query = "namespace:activity-tracker"
}