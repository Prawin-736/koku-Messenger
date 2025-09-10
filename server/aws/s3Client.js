
import { config } from "../config.js"
import { S3Client } from '@aws-sdk/client-s3';

const region = config.aws.region;
const accessKeyId = config.aws.accessKey;
const secretAccessKey = config.aws.secretAccessKey;

export const s3Client = new S3Client({
  region: region,
  credentials: {
    accessKeyId: accessKeyId,
    secretAccessKey: secretAccessKey,
  },
});
