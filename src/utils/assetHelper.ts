import { GetObjectCommand, S3 } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import 'dotenv/config';
import { v4 as uuidv4 } from 'uuid';

export const uploadFiles = async (files: Express.Multer.File[]) => {
  const s3Client = new S3({ region: process.env.CLOUDWATCH_REGION });

  const uploadFilesList = files.map(async (file) => {
    const name = `${uuidv4()}`;
    await new Upload({
      client: s3Client,

      params: {
        Body: file.buffer,
        Key: name,
        Bucket: process.env.AWS_S3_BUCKET as string,
      },
    }).done();
    return name;
  });

  return await Promise.all(uploadFilesList);
};

export const getImageFromS3 = async (id: string) => {
  const s3Client = new S3({ region: process.env.CLOUDWATCH_REGION });

  const command = new GetObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET as string,
    Key: id,
  });

  const response = await s3Client.send(command);
  // The Body object also has 'transformToByteArray' and 'transformToWebStream' methods.
  const result = await response.Body?.transformToByteArray();
  return result;
};
export const parseImageUrl = (id: string) =>
  `${process.env.HOST_URL}image/${id}`;
