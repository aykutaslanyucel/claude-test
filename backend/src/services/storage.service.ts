import AWS from 'aws-sdk';
import { env } from '../config/env';
import { logger } from '../config/logger';
import { AppError } from '../utils/errors';
import { Readable } from 'stream';

const s3 = new AWS.S3({
  accessKeyId: env.AWS_ACCESS_KEY_ID,
  secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
  region: env.AWS_REGION,
});

export class StorageService {
  private bucketName: string;

  constructor() {
    this.bucketName = env.S3_BUCKET_NAME || 'legaldd-documents';
  }

  async uploadFile(
    file: Express.Multer.File,
    path: string
  ): Promise<string> {
    try {
      const key = `${path}/${Date.now()}-${file.originalname}`;

      await s3
        .putObject({
          Bucket: this.bucketName,
          Key: key,
          Body: file.buffer,
          ContentType: file.mimetype,
          ServerSideEncryption: 'AES256',
        })
        .promise();

      logger.info('File uploaded to S3', { key });
      return key;
    } catch (error) {
      logger.error('Failed to upload file to S3', error);
      throw new AppError('Failed to upload file', 500);
    }
  }

  async downloadFile(key: string): Promise<Buffer> {
    try {
      const result = await s3
        .getObject({
          Bucket: this.bucketName,
          Key: key,
        })
        .promise();

      return result.Body as Buffer;
    } catch (error) {
      logger.error('Failed to download file from S3', error);
      throw new AppError('Failed to download file', 500);
    }
  }

  async getFileStream(key: string): Promise<Readable> {
    try {
      return s3
        .getObject({
          Bucket: this.bucketName,
          Key: key,
        })
        .createReadStream();
    } catch (error) {
      logger.error('Failed to get file stream from S3', error);
      throw new AppError('Failed to stream file', 500);
    }
  }

  async deleteFile(key: string): Promise<void> {
    try {
      await s3
        .deleteObject({
          Bucket: this.bucketName,
          Key: key,
        })
        .promise();

      logger.info('File deleted from S3', { key });
    } catch (error) {
      logger.error('Failed to delete file from S3', error);
      throw new AppError('Failed to delete file', 500);
    }
  }

  async getSignedUrl(key: string, expiresIn: number = 3600): Promise<string> {
    try {
      return s3.getSignedUrl('getObject', {
        Bucket: this.bucketName,
        Key: key,
        Expires: expiresIn,
      });
    } catch (error) {
      logger.error('Failed to generate signed URL', error);
      throw new AppError('Failed to generate download URL', 500);
    }
  }
}
