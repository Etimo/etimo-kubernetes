# Resources

For each project and environment you have a specific `<environment>.yaml` file that defines the resources used by your project.

<!-- vscode-markdown-toc -->

- [Creating resources](#creating-resources)
  - [Schema](#schema)
  - [Buckets](#buckets)
  - [Databases](#databases)
    - [Dedicated database cluster](#dedicated-database-cluster)
- [Credentials and configuration](#credentials-and-configuration)
  - [How to consume populated configuration](#how-to-consume-populated-configuration)
  - [How to connect to DB with TLS](#how-to-connect-to-db-with-tls)

<!-- vscode-markdown-toc-config
	numbering=false
	autoSave=true
	/vscode-markdown-toc-config -->
<!-- /vscode-markdown-toc -->

## Resource matrix

| Resource  | Tag       | Availability |
| --------- | --------- | ------------ |
| Bucket    | buckets   | N/A          |
| Databases | databases | Beta         |

## <a name='creating-resources'></a>Creating resources

### <a name='schema'></a>Schema

The schema for the resource file is:

```ts
interface Resources {
  buckets: string[]; // A list of names for the buckets
  databases: Database[];
}

interface Database {
  name: string; // The name of the database
  type: "pg"; // The type of database.
}
```

### <a name='buckets'></a>Buckets

A bucket is an S3 compatible bucket for storing assets and can potentially be served through a CDN.

### <a name='databases'></a>Databases

There is currently support for managed Postgres, mysql and redis databases. More will be added later on when needed.

## <a name='credentials-and-configuration'></a>Credentials and configuration

The resources specified for a project will result in Terraform resources that are then managed by Terraform. When Terraform has created the resources the configuration for them will be injected into the namespace in two different Kubernetes resources:

- `configmap/provisioned-config` - stores connection info but no credentials
- `secret/provisioned-secrets` - stores passwords

These resources can then be consumed by resources in your namespace in many different ways.

**Let's look at an example and how it works.**

### <a name='how-to-consume-populated-configuration'></a>How to consume populated configuration

Let's say we have a project named `test` that has the following resources defined for `staging.yaml`:

```yaml
buckets: []
databases:
  - name: mydb1
    type: pg
```

This would create the following resources in the `test` namespace:

```yaml
# Configmap
apiVersion: v1
kind: ConfigMap
metadata:
  name: provisioned-config
  namespace: "test"
  labels:
    provisioner: etimo-kubernetes
data:
  DB_MYDB1_NAME: "test_staging_mydb1"
  DB_MYDB1_USER: "test_staging_mydb1"
  DB_MYDB1_PORT: "25060"
  DB_MYDB1_PUBLIC_HOST: "something-something.domain.com"
  DB_MYDB1_PRIVATE_HOST: "private-something-something.domain.com"
  DB_MYDB1_CA: "LS0tLS1CRUdJTiBDRVJUSUZ..."
```

```yaml
# Secret
apiVersion: v1
kind: Secret
metadata:
  name: provisioned-secrets
  namespace: "test"
  labels:
    provisioner: etimo-kubernetes
data:
  DB_MYDB1_PASSWORD: "TXlTdXBlclNlY3JldFBhc3N3b3Jk" # MySuperSecretPassword
```

Note how the name `mydb1` relates to all variables being named `DB_MYDB1_...` and the database name, and user `test_staging_mydb1`.

### <a name='how-to-connect-to-db-with-tls'></a>How to connect to DB with TLS

All databases require TLS and to be able to connect to them properly you need to use the provisioned CA certificate or the connection will be rejected. In test environments you can also ignore the CA validation. Usually in JS/TS there is a flag called `rejectUnauthorized` that you can set to false. Note that this is considered unsafe in production environments!

The CA certificate for databases are automatically injected in the `provisioned-config` ConfigMap as `DB_<NAME>_CA` (e.g. `DB_MYDB1_CA`). You can mount these as a file in your container and reference that file when connecting to the database.

More information and example [here](https://kubernetes.io/docs/tasks/configure-pod-container/configure-pod-configmap/#add-configmap-data-to-a-specific-path-in-the-volume).

[« Back to Provisioning](./Provisioning.md#commit,-push-and-create-a-pr)
