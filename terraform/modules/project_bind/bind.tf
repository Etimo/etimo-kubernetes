resource "digitalocean_project_resources" "resources" {
  project   = var.project_id
  resources = var.resources
}