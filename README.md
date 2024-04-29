# ZenMoney Backups

[![CD](https://github.com/loginov-rocks/ZenMoney-Backups/actions/workflows/cd.yml/badge.svg)](https://github.com/loginov-rocks/ZenMoney-Backups/actions/workflows/cd.yml)

## TODO

1. Refactor OrchestratorFunction to cleanup old backups, rename to WorkflowBackupCleanupFunction.
2. Invoke WorkflowBackupCleanupFunction from StateMachine.
3. ZenMoney: Request to update redirect URI.
4. Infrastructure: Configure domains, origins, redirects as parameters.
5. Rename UsersTable to ZenMoneyTokensTable.
6. Rename `token` in UsersTable to `zenMoneyTokens`.
7. Configure CD for WorkflowStart and WorkflowUnauthorizedCleanup functions.
8.  Fix computing infrastructure to deploy code from deployment bucket zips.

## Reference

* https://github.com/zenmoney/ZenPlugins/wiki/ZenMoney-API
