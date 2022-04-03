import {IsEmail, MinLength, IsString, IsNotEmpty} from 'class-validator';
import HasLowerChar from './decorators/hasLowerChar.decorator';
import HasUpperChar from './decorators/hasUpperChar.decorator';
import HasSpecialChar from './decorators/hasSpecialChar.decorator';
import HasDigitChar from './decorators/hasDigitChar.decorator';

export class CreateUserDto {
  @IsEmail({}, {message: 'This email is invalid'})
  public email: string;

  @MinLength(8)
  @HasUpperChar()
  @HasSpecialChar()
  @HasDigitChar()
  @HasLowerChar()
  public password: string;
}
export class UpdateUserDto {
  @IsString()
  @IsNotEmpty()
  public username: string;
}

export class AccessTokenDto {
  @IsString()
  public accessToken: string;
}

export class PasswordResetDto {
  @MinLength(8)
  @HasUpperChar()
  @HasSpecialChar()
  @HasDigitChar()
  @HasLowerChar()
  public oldPassword: string;

  @MinLength(8)
  @HasUpperChar()
  @HasSpecialChar()
  @HasDigitChar()
  @HasLowerChar()
  public newPassword: string;
}
