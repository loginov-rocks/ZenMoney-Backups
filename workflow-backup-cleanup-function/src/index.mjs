import { ListObjectsV2Command, S3Client } from '@aws-sdk/client-s3';

import { BACKUPS_BUCKET_NAME } from './Constants.mjs';

const s3Client = new S3Client();

export const handler = async (event) => {
  console.log('event', JSON.stringify(event));

  const { userId } = event;

  if (!userId) {
    throw new Error('User ID missing');
  }

  return { userId };
};
