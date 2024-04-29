# ZenMoney Backups

[![CD](https://github.com/loginov-rocks/ZenMoney-Backups/actions/workflows/cd.yml/badge.svg)](https://github.com/loginov-rocks/ZenMoney-Backups/actions/workflows/cd.yml)

## TODO

1. ZenMoney: Request to update redirect URI.
2. Infrastructure: Configure domains, origins, redirects as parameters.
3. Rename UsersTable to ZenMoneyTokensTable.
4. Rename `token` in UsersTable to `zenMoneyTokens`.
5. Configure CD for WorkflowStart and WorkflowUnauthorizedCleanup functions.
6. Fix computing infrastructure to deploy code from deployment bucket zips.
7. Implement WorkflowBackupCleanupFunction.

## Reference

* https://github.com/zenmoney/ZenPlugins/wiki/ZenMoney-API
