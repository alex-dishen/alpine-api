export class Base64 {
  static encode(input: string): string {
    return Buffer.from(input, 'utf8').toString('base64');
  }

  static decode(input: string): string {
    return Buffer.from(input, 'base64').toString('utf8');
  }
}
