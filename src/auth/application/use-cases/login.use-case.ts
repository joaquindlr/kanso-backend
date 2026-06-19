import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '../../../users/domain/user.entity';

@Injectable()
export class LoginUseCase {
  constructor(private readonly jwtService: JwtService) {}

  execute(user: Omit<User, 'passwordHash'>) {
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
