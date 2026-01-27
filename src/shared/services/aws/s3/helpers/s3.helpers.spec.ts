import { describe, it, expect } from 'vitest';
import { getFileExtension, sanitizeFilename } from './s3.helpers';

describe('getFileExtension', () => {
  it('should extract simple extensions', () => {
    expect(getFileExtension('document.pdf')).toBe('pdf');
    expect(getFileExtension('image.png')).toBe('png');
    expect(getFileExtension('script.js')).toBe('js');
  });

  it('should return lowercase extension', () => {
    expect(getFileExtension('Document.PDF')).toBe('pdf');
    expect(getFileExtension('Image.PNG')).toBe('png');
    expect(getFileExtension('File.TXT')).toBe('txt');
  });

  it('should handle multiple dots in filename', () => {
    expect(getFileExtension('archive.tar.gz')).toBe('gz');
    expect(getFileExtension('file.backup.2024.txt')).toBe('txt');
    expect(getFileExtension('my.file.name.pdf')).toBe('pdf');
  });

  it('should return null for files without extension', () => {
    expect(getFileExtension('README')).toBe(null);
    expect(getFileExtension('Makefile')).toBe(null);
  });

  it('should handle dotfiles', () => {
    expect(getFileExtension('.gitignore')).toBe('gitignore');
    expect(getFileExtension('.env')).toBe('env');
  });

  it('should handle empty string', () => {
    expect(getFileExtension('')).toBe(null);
  });

  it('should handle files ending with dot', () => {
    // Regex requires at least one char after dot, so returns null
    expect(getFileExtension('file.')).toBe(null);
  });
});

describe('sanitizeFilename', () => {
  it('should remove file extension', () => {
    expect(sanitizeFilename('document.pdf')).toBe('document');
    expect(sanitizeFilename('image.png')).toBe('image');
  });

  it('should convert to lowercase', () => {
    expect(sanitizeFilename('MyDocument.pdf')).toBe('mydocument');
    expect(sanitizeFilename('UPPERCASE.txt')).toBe('uppercase');
  });

  it('should replace spaces with hyphens', () => {
    expect(sanitizeFilename('my document.pdf')).toBe('my-document');
    expect(sanitizeFilename('file   with   spaces.txt')).toBe('file-with-spaces');
  });

  it('should remove special characters', () => {
    expect(sanitizeFilename('file!@#$%^&*().pdf')).toBe('file');
    expect(sanitizeFilename("file's (copy).txt")).toBe('files-copy');
  });

  it('should preserve hyphens and underscores', () => {
    expect(sanitizeFilename('my-file_name.pdf')).toBe('my-file_name');
    expect(sanitizeFilename('test-file_v2.txt')).toBe('test-file_v2');
  });

  it('should truncate to 100 characters', () => {
    const longName = 'a'.repeat(150) + '.pdf';
    const result = sanitizeFilename(longName);
    expect(result.length).toBe(100);
    expect(result).toBe('a'.repeat(100));
  });

  it('should handle filenames with multiple extensions', () => {
    // Only removes last extension (.gz), then dots are stripped as special chars
    expect(sanitizeFilename('archive.tar.gz')).toBe('archivetar');
  });

  it('should handle empty filename', () => {
    expect(sanitizeFilename('.pdf')).toBe('');
  });

  it('should handle unicode characters', () => {
    expect(sanitizeFilename('файл.pdf')).toBe('');
    expect(sanitizeFilename('文件.pdf')).toBe('');
  });

  it('should handle mixed valid and invalid characters', () => {
    expect(sanitizeFilename('my (1) file!.pdf')).toBe('my-1-file');
  });
});
