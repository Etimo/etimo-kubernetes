This project heavily use the [CODEONWERS](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-code-owners) along with protected branches features on Github.

CODEOWNERS is a file that describes the owner(s) for each individual file in a repo. Together with branch protection rules this is used to protect files from being edited and pushed to main without the owners approving of it.

[Link to the CODEOWNERS file in etimo-kubernetes](https://github.com/Etimo/etimo-kubernetes/blob/main/.github/CODEOWNERS).

## Protection rules

All pull requests with new changes will require approval from someone in the CODEOWNERS list for that file. What this means is that only the users assigned to a certain project can approve changes to that project.

## How to update CODEOWNERS

The file cannot be updated manually and this is intentional. Instead it is automatically updated when merging a pull request to main. A script in the release process takes care of rewriting the CODEOWNERS file to make sure that all projects are owned by their respective owners specified in the [`info.yaml`](https://github.com/Etimo/etimo-kubernetes/wiki/Provisioning-a-namespace-for-your-project#infoyaml) file.
