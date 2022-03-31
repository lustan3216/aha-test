import {ErrorMap} from '@/types/response';
import {flatten} from 'array-flatten';

export class Exception {
  status: number;
  message: string;
  errors?: ErrorMap;

  constructor(status: number, error: string | ErrorMap) {
    this.status = status;

    if (typeof error === 'string') {
      this.message = error;
      this.errors = {};
    } else {
      this.errors = error;
      this.message = flatten(Object.values(error)).join(',');
    }
  }
}
