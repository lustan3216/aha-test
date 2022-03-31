import { ErrorMap } from '@/types/response.interface';

export class Exception {
  public status: number;
  public message: string;
  public errors?: ErrorMap;

  constructor(status: number, error: string | ErrorMap) {
    this.status = status;

    if (typeof error === 'string') {
      this.message = error;
      this.errors = {};
    } else {
      this.errors = error;
      this.message = Object.values(error).flat().join(',');
    }
  }
}
