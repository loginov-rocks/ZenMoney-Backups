# ZenMoney Backups

[![CD](https://github.com/loginov-rocks/ZenMoney-Backups/actions/workflows/cd.yml/badge.svg)](https://github.com/loginov-rocks/ZenMoney-Backups/actions/workflows/cd.yml)

## TODO

1. Invoke WorkflowBackupCleanupFunction from StateMachine.
2. ZenMoney: Request to update redirect URI.
3. Infrastructure: Configure domains, origins, redirects as parameters.
4. Rename UsersTable to ZenMoneyTokensTable.
5. Rename `token` in UsersTable to `zenMoneyTokens`.
6. Configure CD for WorkflowStart and WorkflowUnauthorizedCleanup functions.
7. Fix computing infrastructure to deploy code from deployment bucket zips.

## Reference

* https://github.com/zenmoney/ZenPlugins/wiki/ZenMoney-API
