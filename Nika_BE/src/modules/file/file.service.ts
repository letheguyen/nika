import { v4 } from 'uuid';
import { Injectable } from '@nestjs/common';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

@Injectable()
export class FileService {
  private readonly s3Client: S3Client;

  constructor() {
    this.s3Client = new S3Client({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
      },
    });
  }

  private async uploadSingleFile(key: string, file: Express.Multer.File) {
    await this.s3Client.send(
      new PutObjectCommand({
        Key: key,
        Body: file.buffer,
        ACL: 'public-read',
        ContentType: file.mimetype,
        Bucket: process.env.AWS_BUCKET_NAME,
      }),
    );
    return `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
  }

  public uploadNftMetadataFile = (file: Express.Multer.File) => {
    const key = 'blogs/' + v4();
    return this.uploadSingleFile(key, file);
  };
}
