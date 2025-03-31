interface FieldError {
  field: string;
  message: string;
}

interface ValidationErrors {
  body?: FieldError[];
  query?: FieldError[];
  params?: FieldError[];
}

const msg = 'Validation failed';

export class ValidationError extends Error {
  public httpCode = 422;

  constructor(public readonly errors: ValidationErrors) {
    super(msg);
    this.message = msg;
  }
}
