import { DeleteObjectsCommand, ListObjectsV2Command, S3Client } from '@aws-sdk/client-s3';

import { BACKUPS_BUCKET_NAME, BACKUPS_KEY_SUFFIX, BACKUPS_RETENTION_PERIOD } from './Constants.mjs';
import { fileNameToDate } from './fileNameToDate.mjs';

const s3Client = new S3Client();

export const handler = async (event) => {
  console.log('event', JSON.stringify(event));

  const { userId } = event;

  if (!userId) {
    throw new Error('User ID missing');
  }

  const prefix = `${userId}/`;

  const listObjectsCommand = new ListObjectsV2Command({
    Bucket: BACKUPS_BUCKET_NAME,
    MaxKeys: 1000,
    Prefix: prefix,
  });

  const listObjectsCommandOutput = await s3Client.send(listObjectsCommand);

  console.log('listObjectsCommandOutput', JSON.stringify(listObjectsCommandOutput));

  if (!listObjectsCommandOutput.KeyCount || listObjectsCommandOutput.KeyCount === 0
    || !listObjectsCommandOutput.Contents || !Array.isArray(listObjectsCommandOutput.Contents)) {
    return { userId };
  }

  const dateDeleteBefore = new Date(Date.now() - BACKUPS_RETENTION_PERIOD * 24 * 60 * 60 * 1000);
  const keysToDelete = [];

  listObjectsCommandOutput.Contents.forEach((object) => {
    const file = object.Key.substring(prefix.length);
    const fileName = file.substring(0, file.length - BACKUPS_KEY_SUFFIX.length);
    const date = fileNameToDate(fileName);

    if (date < dateDeleteBefore) {
      keysToDelete.push(object.Key);
    }
  });

  console.log('keysToDelete', JSON.stringify(keysToDelete));

  if (keysToDelete.length > 0) {
    const deleteObjectsCommand = new DeleteObjectsCommand({
      Bucket: BACKUPS_BUCKET_NAME,
      Delete: {
        Objects: keysToDelete.map((key) => ({ Key: key })),
      },
    });

    const deleteObjectsCommandOutput = await s3Client.send(deleteObjectsCommand);

    console.log('deleteObjectsCommandOutput', JSON.stringify(deleteObjectsCommandOutput));
  }

  return { userId };
};
