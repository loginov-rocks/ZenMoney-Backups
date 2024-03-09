import { ListObjectsV2Command, S3Client } from '@aws-sdk/client-s3';

import { BACKUPS_BUCKET_NAME } from './Constants.mjs';

const s3Client = new S3Client();

export const handler = async (event) => {
  console.log('event', JSON.stringify(event));

  const { requestContext } = event;

  if (!requestContext || !requestContext.authorizer || !requestContext.authorizer.jwt
    || !requestContext.authorizer.jwt.claims || !requestContext.authorizer.jwt.claims.sub) {
    return { statusCode: 401 };
  }

  const userId = requestContext.authorizer.jwt.claims.sub;

  const listObjectsCommand = new ListObjectsV2Command({
    Bucket: BACKUPS_BUCKET_NAME,
    MaxKeys: 1000,
    Prefix: `${userId}/`,
  });

  let listObjectsCommandOutput;
  try {
    listObjectsCommandOutput = await s3Client.send(listObjectsCommand);
  } catch (error) {
    console.error(error);

    return { statusCode: 500 };
  }

  return {
    body: JSON.stringify({ listObjectsCommandOutput }),
    headers: {
      'content-type': 'application/json',
    },
    statusCode: 200,
  };
};
