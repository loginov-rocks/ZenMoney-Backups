# Configuration

## Infrastructure

### Backup Queue

* `ReceiveMessageWaitTimeSeconds` = 20 seconds (maximum)
* `VisibilityTimeout` = 6 * `BackupFunction.Timeout` + `BackupFunctionEventSourceMapping.MaximumBatchingWindowInSeconds`
* Move to DLQ after 5 attempts, store for 2 weeks.

## GitHub Actions

1. `AWS_ACCESS_KEY_ID`
2. `AWS_REGION`
3. `AWS_SECRET_ACCESS_KEY`
4. `BACKUP_FUNCTION_NAME`
5. `BACKUPS_CREATE_URL_FUNCTION_NAME`
6. `BACKUPS_LIST_FUNCTION_NAME`
7. `DEPLOYMENT_BUCKET_NAME`
8. `DISTRIBUTION_ID`
9. `ORCHESTRATOR_FUNCTION_NAME`
10. `WEB_APP_BUCKET_NAME`
11. `ZENMONEY_AUTH_FUNCTION_NAME`
12. `ZENMONEY_VALIDATE_AUTH_FUNCTION_NAME`
