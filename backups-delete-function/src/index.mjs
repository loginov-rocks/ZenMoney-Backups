import { HeadObjectCommand, S3Client } from '@aws-sdk/client-s3';

import { BACKUPS_BUCKET_NAME, BACKUPS_KEY_SUFFIX } from './Constants.mjs';

const s3Client = new S3Client();

export const handler = async (event) => {
  console.log('event', JSON.stringify(event));

  const { pathParameters, requestContext } = event;

  if (!requestContext || !requestContext.authorizer || !requestContext.authorizer.jwt
    || !requestContext.authorizer.jwt.claims || !requestContext.authorizer.jwt.claims.sub) {
    return { statusCode: 401 };
  }

  const userId = requestContext.authorizer.jwt.claims.sub;

  if (!pathParameters || !pathParameters.fileName) {
    return { statusCode: 400 };
  }

  const { fileName } = pathParameters;

  const key = `${userId}/${fileName}${BACKUPS_KEY_SUFFIX}`;

  const headObjectCommand = new HeadObjectCommand({
    Bucket: BACKUPS_BUCKET_NAME,
    Key: key,
  });

  let headObjectCommandOutput;
  try {
    headObjectCommandOutput = await s3Client.send(headObjectCommand);
  } catch (error) {
    if (error.name !== 'NotFound') {
      console.error(error);

      return { statusCode: 500 };
    }
  }

  if (!headObjectCommandOutput) {
    return { statusCode: 404 };
  }

  console.log('headObjectCommandOutput', JSON.stringify(headObjectCommandOutput));

  // TODO: Delete object.

  return {
    body: JSON.stringify({ key }),
    headers: {
      'content-type': 'application/json',
    },
    // TODO: Return 204 without body.
    statusCode: 200,
  };
};
