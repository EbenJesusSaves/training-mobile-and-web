import { BadRequestException, ValidationError, ValidationPipe } from '@nestjs/common';

function collect(errors: ValidationError[], prefix = '', into: Record<string, string> = {}) {
  for (const error of errors) {
    const path = prefix ? `${prefix}.${error.property}` : error.property;
    const firstMessage = error.constraints ? Object.values(error.constraints)[0] : undefined;
    if (firstMessage && !into[path]) into[path] = firstMessage;
    if (error.children?.length) collect(error.children, path, into);
  }
  return into;
}

/** Validation errors are returned as { code: 'VALIDATION_FAILED', details: { fieldErrors } } so forms can map them. */
export const validationPipe = new ValidationPipe({
  whitelist: true,
  forbidNonWhitelisted: true,
  transform: true,
  exceptionFactory: (errors) => {
    const fieldErrors = collect(errors);
    return new BadRequestException({
      code: 'VALIDATION_FAILED',
      message: Object.values(fieldErrors)[0] ?? 'Please check the highlighted fields.',
      details: { fieldErrors },
    });
  },
});
