# GitHub Action: workflow-wait

Await the completion of a foreign repository Workflow Run given the Run ID.

This Action exists as a workaround for the issue where you cannot await the completion of a dispatched action.

This action requires being able to get the run ID from a dispatched action, this can be achieved through another Action i've created, [return-dispatch](https://github.com/microtema/workflow-dispatch-wait).

Should a remote workflow run fail, this action will attempt to output which step failed, with a link to the workflow run itself.

An example using both of these actions is documented below.

## Usage

Once you have configured your remote repository to work as expected with the `workflow-dispatch` action, include `workflow-dispatch-wait` as described below.

```yaml
steps:
  - name: Dispatch an action and get the run ID
    uses: microtema/workflow-dispatch@v2.0
    id: return_dispatch
    with:
      token: ${{ github.token }}
      repo: owner/repository-name
      workflow: automation-test.yml
  - name: Await Run ID ${{ steps.return_dispatch.outputs.runId }}
    uses: microtema/workflow-wait@v2.0
    with:
      token: ${{ github.token }}
      repo: owner/repository-name
      runId: ${{ steps.return_dispatch.outputs.runId }}

```

### Permissions Required

The permissions required for this action to function correctly are:

- `repo` scope
  - You may get away with simply having `repo:public_repo`
  - `repo` is definitely needed if the repository is private.
- `actions:read`

### APIs Used

For the sake of transparency please note that this action uses the following API calls:

- [Get a workflow run](https://docs.github.com/en/rest/reference/actions#get-a-workflow-run)
  - GET `/repos/{owner}/{repo}/actions/runs/{run_id}`
  - Permissions:
    - `repo`
    - `actions:read`
- [List jobs for a workflow run](https://docs.github.com/en/rest/reference/actions#list-jobs-for-a-workflow-run)
  - GET `/repos/{owner}/{repo}/actions/runs/{run_id}/jobs`
  - Permissions:
    - `repo`
    - `actions:read`

For more information please see [api.ts](./src/api.ts).

## Where does this help?

If you want to use the result of a Workflow Run from a remote repository to complete a check locally, i.e. you have automated tests on another repository and don't want the local checks to pass if the remote fails.

## Commit, tag, and push your action to GitHub

It's best practice to also add a version tag for releases of your action. For more information on versioning your action, see "About actions."

```
git tag -a -m "My first action release" v1.1
git push --follow-tags
```
