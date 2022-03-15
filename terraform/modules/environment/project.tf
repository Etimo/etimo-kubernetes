data "digitalocean_project" "project" {
  name = "[${var.stage}] ${var.name}"
}