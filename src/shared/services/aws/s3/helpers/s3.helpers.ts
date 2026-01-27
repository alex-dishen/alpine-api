export const getFileExtension = (filename: string): string | null => {
  const match = filename.match(/\.([^.]+)$/);

  return match ? match[1].toLowerCase() : null;
};

export const sanitizeFilename = (filename: string): string => {
  const nameWithoutExt = filename.replace(/\.[^/.]+$/, '');

  return nameWithoutExt
    .replace(/[^a-zA-Z0-9\-_\s]/g, '')
    .replace(/\s+/g, '-')
    .toLowerCase()
    .substring(0, 100);
};
