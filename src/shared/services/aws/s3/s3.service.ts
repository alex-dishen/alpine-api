import { Injectable, Logger } from '@nestjs/common';
import { S3Client, PutObjectCommand, GetObjectCommand, HeadObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { AppConfigService } from 'src/shared/services/config-service/config.service';
import { GenerateDownloadUrlArgs, GenerateUploadUrlArgs, GetObjectInfoOutput } from './s3.service.types';
import { getFileExtension, sanitizeFilename } from './s3.helpers';

@Injectable()
export class S3Service {
  private readonly logger = new Logger(S3Service.name);
  private readonly s3Client: S3Client;
  private readonly defaultBucket: string;

  constructor(private configService: AppConfigService) {
    this.s3Client = new S3Client({
      region: this.configService.get('AWS_REGION'),
      credentials: {
        accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID'),
        secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY'),
      },
    });

    this.defaultBucket = this.configService.get('AWS_S3_BUCKET');
  }

  async generateUploadUrl({ key, bucket, contentType, contentLength, expiresIn = 3600 }: GenerateUploadUrlArgs): Promise<string> {
    try {
      const command = new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        ContentType: contentType,
        ContentLength: contentLength,
      });

      const signedUrl = await getSignedUrl(this.s3Client, command, {
        expiresIn,
      });

      this.logger.debug(`Generated upload URL for key: ${key}`);

      return signedUrl;
    } catch (error) {
      this.logger.error(`Failed to generate upload URL for key: ${key}`, error);
      throw error;
    }
  }

  async generateDownloadUrl({ key, bucket, expiresIn = 3600 }: GenerateDownloadUrlArgs): Promise<string> {
    try {
      const command = new GetObjectCommand({
        Bucket: bucket,
        Key: key,
      });

      const signedUrl = await getSignedUrl(this.s3Client, command, {
        expiresIn,
      });

      this.logger.debug(`Generated download URL for key: ${key}`);

      return signedUrl;
    } catch (error) {
      this.logger.error(`Failed to generate download URL for key: ${key}`, error);
      throw error;
    }
  }

  async getObjectInfo(key: string, bucket?: string): Promise<GetObjectInfoOutput> {
    const bucketName = bucket || this.defaultBucket;

    try {
      const command = new HeadObjectCommand({
        Bucket: bucketName,
        Key: key,
      });

      const response = await this.s3Client.send(command);

      return {
        exists: true,
        size: response.ContentLength,
        etag: response.ETag,
        lastModified: response.LastModified,
        contentType: response.ContentType,
      };
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (error.name === 'NotFound' || error.$metadata?.httpStatusCode === 404) {
        return { exists: false };
      }

      this.logger.error(`Failed to get object info for key: ${key}`, error);
      throw error;
    }
  }

  async deleteObject(key: string, bucket?: string): Promise<void> {
    const bucketName = bucket || this.defaultBucket;

    try {
      const command = new DeleteObjectCommand({
        Bucket: bucketName,
        Key: key,
      });

      await this.s3Client.send(command);

      this.logger.debug(`Deleted object with key: ${key}`);
    } catch (error) {
      this.logger.error(`Failed to delete object with key: ${key}`, error);
      throw error;
    }
  }

  generateFileKey(fileId: string, originalFilename: string, prefix = 'files'): string {
    const timestamp = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const extension = getFileExtension(originalFilename);
    const baseFilename = sanitizeFilename(originalFilename);

    return `${prefix}/${timestamp}/${fileId}/${baseFilename}${extension ? `.${extension}` : ''}`;
  }

  generateVariantKey(originalKey: string, variantName: string): string {
    const pathParts = originalKey.split('/');
    const filename = pathParts.pop()!;
    const basePath = pathParts.join('/');
    const filenameWithoutExt = filename.replace(/\.[^/.]+$/, '');

    return `${basePath}/variants/${variantName}/${filenameWithoutExt}_${variantName}`;
  }

  getDefaultBucket(): string {
    return this.defaultBucket;
  }
}
