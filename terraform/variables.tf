variable "region" {
  default = "fra1"
}

variable "stages" {
  type    = list(string)
  default = ["Staging"] #, "Production"]
}

variable "do_token" {}
variable "spaces_key" {}
variable "spaces_secret" {}
variable "logdna_key" {}
