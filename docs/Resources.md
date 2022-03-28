# Resources

For each project and environment you have a specific `<environment>.yaml` file that defines the resources used by your project.

<!-- vscode-markdown-toc -->

- [Creating resources](#creating-resources)
  - [Schema](#schema)
  - [Buckets](#buckets)
  - [Databases](#databases)
    - [Shared databases](#shared-databases)
    - [Dedicated database cluster](#dedicated-database-cluster)
- [Credentials and configuration](#credentials-and-configuration)
  - [How to consume populated configuration](#how-to-consume-populated-configuration)

<!-- vscode-markdown-toc-config
	numbering=false
	autoSave=true
	/vscode-markdown-toc-config -->
<!-- /vscode-markdown-toc -->

## <a name='creating-resources'></a>Creating resources

### <a name='schema'></a>Schema

The schema for the resource file is:

```ts
interface Resources {
  buckets: string[]; // A list of names for the buckets
  databases: Database[];
}

interface Database {
  shared: boolean; // Shared cluster or not
  name: string; // The name of the database
  type: "pg"; // The type of database. Only supports postgres as of now
}
```

### <a name='buckets'></a>Buckets

A bucket is an S3 compatible bucket for storing assets and can potentially be served through a CDN.

### <a name='databases'></a>Databases

There is currently support for managed Postgres databases. More will be added later on when needed. You can choose to provision a shared database or a dedicated one.

#### <a name='shared-databases'></a>Shared databases

A shared database is sort of misleading as it is not the actual database that is shared but the actual cluster. Each environment has a database cluster that can be used by multiple projects. This is mostly to reduce the cost since most of our projects don't require a separate cluster.

A shared database cluster can contain multiple separated databases each having their own credentials.

#### <a name='dedicated-database-cluster'></a>Dedicated database cluster

If you don't want a shared database cluster you can provision your own separate database cluster.

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
    shared: true
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