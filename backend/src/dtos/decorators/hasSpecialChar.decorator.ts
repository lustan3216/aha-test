import {registerDecorator, ValidationOptions} from 'class-validator';

export default function (
  property?: string,
  validationOptions?: ValidationOptions
) {
  return (object: any, propertyName: string) => {
    registerDecorator({
      name: 'hasSpecialChar',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [property],
      validator: {
        validate(value: any): Promise<boolean> | boolean {
          return /\W+/.test(value || '');
        },
        defaultMessage(): string {
          return 'at least one special character';
        },
      },
    });
  };
}
