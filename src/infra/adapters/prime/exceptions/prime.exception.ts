export class PrimeException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'PrimeException';
  }
}
