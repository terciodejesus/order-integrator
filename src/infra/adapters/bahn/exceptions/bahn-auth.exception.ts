export class BahnAuthException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'BahnAuthException';
  }
}
