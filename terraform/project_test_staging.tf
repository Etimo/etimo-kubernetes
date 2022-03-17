# Buckets, if any
resource "digitalocean_spaces_bucket" "test-my-bucket-staging" {
  region = var.region
  name   = "test-my-bucket-staging"
}

