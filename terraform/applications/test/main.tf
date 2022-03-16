resource "digitalocean_spaces_bucket" "hello-world" {
  region = var.region
  name   = "hello-world"
}