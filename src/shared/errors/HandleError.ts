
export default class HandleError extends Error {

  public readonly statusCode!: number;

  constructor(message: string, statusCode: number = 400) {
    super(message);
    this.statusCode = statusCode;
  }
}