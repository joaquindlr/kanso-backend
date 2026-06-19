import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UserRepository } from '../../../users/domain/user.repository';
import { User } from '../../../users/domain/user.entity';

@Injectable()
export class ValidateUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(
    email: string,
    pass: string,
  ): Promise<Omit<User, 'passwordHash'> | null> {
    const user = await this.userRepository.findByEmail(email);
    if (user && (await bcrypt.compare(pass, user.passwordHash))) {
      const result = { ...user };
      delete (result as Partial<User>).passwordHash;
      return result;
    }
    return null;
  }
}
