import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ValidateUserUseCase } from '../../application/use-cases/validate-user.use-case';
import { User } from '../../../users/domain/user.entity';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private validateUserUseCase: ValidateUserUseCase) {
    super({ usernameField: 'email' });
  }

  async validate(
    email: string,
    pass: string,
  ): Promise<Omit<User, 'passwordHash'>> {
    const user = await this.validateUserUseCase.execute(email, pass);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
