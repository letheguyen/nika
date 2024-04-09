import { IsEmail, IsNotEmpty, IsString, MinLength, Validate } from 'class-validator'
import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';

@ValidatorConstraint({ name: 'IsRelipasoftEmail', async: false })
export class IsRelipasoftEmail implements ValidatorConstraintInterface {
  validate(email: string) {
    if (email) {
      return email.endsWith('@relipasoft.com');
    } else {
      return true;
    }
  }

  defaultMessage(args: ValidationArguments) {
    return `${args.property} must be an email with @relipasoft.com domain`;
  }
}

export class BodyDto {
  @IsNotEmpty()
  @Validate(IsRelipasoftEmail, { message: 'Email must have @relipasoft.com domain' })
  @IsEmail()
  email: string

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  password: string

  @IsNotEmpty()
  @IsString()
  token: string
}
