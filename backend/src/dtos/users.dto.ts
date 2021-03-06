import {IsEmail, MinLength, IsString, IsNotEmpty} from 'class-validator';
import MatchSame from './decorators/matchSame.decorator';
import MatchNotSame from './decorators/matchNotSame.decorator';
import HasLowerChar from './decorators/hasLowerChar.decorator';
import HasUpperChar from './decorators/hasUpperChar.decorator';
import HasSpecialChar from './decorators/hasSpecialChar.decorator';
import HasDigitChar from './decorators/hasDigitChar.decorator';

export class ReadUserDto {
  @IsEmail({}, {message: 'This email is invalid'})
  public email: string;

  @MinLength(8)
  @HasUpperChar()
  @HasSpecialChar()
  @HasDigitChar()
  @HasLowerChar()
  public password: string;
}

export class CreateUserDto extends ReadUserDto {
  @MatchSame('password', {
    message: 'password confirmation should be the same as the password',
  })
  public passwordConfirm: string;
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
  @MatchNotSame('oldPassword', {
    message: 'new password should not be the same as the old password',
  })
  public newPassword: string;

  @MatchSame('newPassword', {
    message: 'password confirmation should be the same as the password',
  })
  public newPasswordConfirm: string;
}
