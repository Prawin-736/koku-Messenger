import { GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { s3Client } from '../../server/aws/s3Client.js';
import { config } from '../config.js';
// import dotenv from 'dotenv';
// dotenv.config();

export const generateSignedUrl = async (key, expiresIn = 3600) => {
  const command = new GetObjectCommand({
    Bucket: config.aws.bucketName,
    Key: key,
    expiresIn: 3600,
  });

  const signedUrl = await getSignedUrl(s3Client, command, { expiresIn });
  return signedUrl;
};
