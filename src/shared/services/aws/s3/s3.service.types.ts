export type GenerateUploadUrlArgs = {
  key: string;
  bucket: string;
  contentType?: string;
  contentLength?: number;
  expiresIn?: number;
};

export type GenerateDownloadUrlArgs = {
  key: string;
  bucket: string;
  expiresIn?: number;
};

export type GetObjectInfoOutput = {
  exists: boolean;
  size?: number;
  etag?: string;
  lastModified?: Date;
  contentType?: string;
};
