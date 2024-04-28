# ZenMoney Backups

[![CD](https://github.com/loginov-rocks/ZenMoney-Backups/actions/workflows/cd.yml/badge.svg)](https://github.com/loginov-rocks/ZenMoney-Backups/actions/workflows/cd.yml)

## TODO

1. Refactor OrchestratorFunction to cleanup old backups, rename to WorkflowBackupCleanupFunction.
2. Invoke WorkflowBackupCleanupFunction from StateMachine.
3. ZenMoney: Request to update redirect URI.
4. Infrastructure: Configure domains, origins, redirects as parameters.
5. Refactor BackupFunction to be invoked from the State Machine, rename to WorkflowBackupFunction.
6. Invoke WorkflowBackupFunction from StateMachine.
7. Rename UsersTable to ZenMoneyTokensTable.
8. Rename `token` in UsersTable to `zenMoneyTokens`.
9. Configure CD for WorkflowStart and WorkflowUnauthorizedCleanup functions.
10. Fix computing infrastructure to deploy code from deployment bucket zips.

## Reference

* https://github.com/zenmoney/ZenPlugins/wiki/ZenMoney-API
