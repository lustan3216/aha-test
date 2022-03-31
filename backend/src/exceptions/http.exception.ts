import { ErrorMap } from '@/types/response.interface';

export class HttpException {
  public status: number;
  public message: string;
  public errors?: ErrorMap;

  constructor(status: number, message: string, errors?: ErrorMap) {
    // super(message);
    this.status = status;
    this.message = message;
    this.errors = errors;
  }
}
