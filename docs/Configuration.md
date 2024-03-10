# Configuration

## Infrastructure

### Backup Queue

* `ReceiveMessageWaitTimeSeconds` = 20 seconds (maximum)
* `VisibilityTimeout` = 6 * `BackupFunction.Timeout` + `BackupFunctionEventSourceMapping.MaximumBatchingWindowInSeconds`
* Move to DLQ after 5 attempts, store for 2 weeks.
