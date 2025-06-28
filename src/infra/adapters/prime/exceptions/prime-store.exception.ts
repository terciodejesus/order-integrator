export class PrimeStoreException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'PrimeStoreException';
  }
}
