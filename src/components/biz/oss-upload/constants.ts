export const UPLOAD_DEFAULTS = {
  accept: '.jpeg,.jpg,.png,.pdf',
  maxFileSize: 20, // MB
  maxCount: 1,
  maxFileNameLen: 60,
  channel: 'oneloop' as const,
  listType: 'picture' as const,
} as const;
