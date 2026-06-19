import { User } from './user.entity';

export abstract class UserRepository {
  abstract findAll(): Promise<User[]>;
  abstract findById(id: string): Promise<User | null>;
  abstract findByEmail(email: string): Promise<User | null>;
  abstract create(user: Partial<User>): Promise<User>;
  abstract update(id: string, user: Partial<User>): Promise<User | null>;
  abstract delete(id: string): Promise<void>;
}
