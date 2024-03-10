import { ListObjectsV2Command, S3Client } from '@aws-sdk/client-s3';

import { BACKUPS_BUCKET_NAME, BACKUPS_KEY_SUFFIX } from './Constants.mjs';

const s3Client = new S3Client();

const fileNameToServerTimestamp = (fileName) => {
  const elements = fileName.split('-');
  const date = new Date(`${elements[0]}-${elements[1]}-${elements[2]}T${elements[3]}:${elements[4]}:${elements[5]}.${elements[6]}`);

  return Math.floor(date.getTime() / 1000);
};

export const handler = async (event) => {
  console.log('event', JSON.stringify(event));

  const { requestContext } = event;

  if (!requestContext || !requestContext.authorizer || !requestContext.authorizer.jwt
    || !requestContext.authorizer.jwt.claims || !requestContext.authorizer.jwt.claims.sub) {
    return { statusCode: 401 };
  }

  const userId = requestContext.authorizer.jwt.claims.sub;
  const prefix = `${userId}/`;

  const listObjectsCommand = new ListObjectsV2Command({
    Bucket: BACKUPS_BUCKET_NAME,
    MaxKeys: 1000,
    Prefix: prefix,
  });

  let listObjectsCommandOutput;
  try {
    listObjectsCommandOutput = await s3Client.send(listObjectsCommand);
  } catch (error) {
    console.error(error);

    return { statusCode: 500 };
  }

  if (!listObjectsCommandOutput.KeyCount || listObjectsCommandOutput.KeyCount === 0
    || !listObjectsCommandOutput.Contents || !Array.isArray(listObjectsCommandOutput.Contents)) {
    return {
      body: JSON.stringify({ backups: [] }),
      headers: {
        'content-type': 'application/json',
      },
      statusCode: 200,
    };
  }

  const backups = listObjectsCommandOutput.Contents.map((object) => {
    const file = object.Key.substring(prefix.length);
    const fileName = file.substring(0, file.length - BACKUPS_KEY_SUFFIX.length);
    const serverTimestamp = fileNameToServerTimestamp(fileName);

    return {
      fileName,
      serverTimestamp,
      size: object.Size,
    };
  });

  return {
    body: JSON.stringify({ backups }),
    headers: {
      'content-type': 'application/json',
    },
    statusCode: 200,
  };
};
