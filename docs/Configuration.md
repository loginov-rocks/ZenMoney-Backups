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
5. `DEPLOYMENT_BUCKET_NAME`
