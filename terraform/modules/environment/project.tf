resource "digitalocean_project" "project" {
  name        = "[${lower(var.stage)}] ${var.name}"
  purpose     = "Web Application"
  environment = var.stage
  resources   = var.resources
}