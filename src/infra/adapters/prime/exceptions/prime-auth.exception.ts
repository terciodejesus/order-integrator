export class PrimeAuthException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'PrimeAuthException';
  }
}
