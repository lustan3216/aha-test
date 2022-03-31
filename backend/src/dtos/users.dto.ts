import {IsEmail, MinLength, IsString} from 'class-validator';
import HasLowerChar from './decorators/hasLowerChar.decorator';
import HasUpperChar from './decorators/hasUpperChar.decorator';
import HasSpecialChar from './decorators/hasSpecialChar.decorator';
import HasDigitChar from './decorators/hasDigitChar.decorator';

export class CreateUserDto {
  @IsEmail({}, {message: 'This email is invalid'})
  public email: string | undefined;

  @MinLength(8)
  @HasUpperChar()
  @HasSpecialChar()
  @HasDigitChar()
  @HasLowerChar()
  public password: string | undefined;
}
export class UpdateUserDto {
  @IsString()
  public username: string | undefined;
}

export class AccessTokenDto {
  @IsString()
  public accessToken: string | undefined;
}

export class PasswordResetDto {
  @MinLength(8)
  @HasUpperChar()
  @HasSpecialChar()
  @HasDigitChar()
  @HasLowerChar()
  public oldPassword: string | undefined;

  @MinLength(8)
  @HasUpperChar()
  @HasSpecialChar()
  @HasDigitChar()
  @HasLowerChar()
  public newPassword: string | undefined;
}
