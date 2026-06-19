import { Injectable, ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UserRepository } from '../../../users/domain/user.repository';
import { RegisterDto } from '../dtos/register.dto';
import { User } from '../../../users/domain/user.entity';

@Injectable()
export class RegisterUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(dto: RegisterDto) {
    const existingUser = await this.userRepository.findByEmail(dto.email);
    if (existingUser) {
      throw new ConflictException('El correo electrónico ya está en uso');
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(dto.password, salt);

    const newUser = await this.userRepository.create({
      email: dto.email,
      passwordHash,
    });

    const result = { ...newUser };
    delete (result as Partial<User>).passwordHash;
    return result;
  }
}
