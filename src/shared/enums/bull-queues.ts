export enum BullBackoffOptions {
  EXPONENTIAL = 'exponential',
  FIXED = 'fixed',
}

export enum QueueList {
  FILE_UPLOAD = 'file_upload',
}

export enum FileUploadJob {
  CLEANUP_ABANDONED_UPLOADS = 'cleanup-abandoned-uploads',
  CLEANUP_SOFT_DELETED_FILES = 'cleanup-soft-deleted-files',
}
