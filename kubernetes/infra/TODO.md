before auto applying the certificate make sure nginx controller is patched with

- '--default-ssl-certificate=default/cert-wildcard-staging-domain'

skapa token på do för att kunna managera dns. lägg in base64 encodad i dns-secret och applicera både certificate.yaml och dns-secret.yml

