variable "region" {
  default = "fra1"
}

variable "stages" {
  type    = list(string)
  default = ["Staging"] #, "Production"]
}