import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  findOne(id: number): Promise<User | null> {
    return this.usersRepository.findOneBy({ id });
  }

  findOneByUsername(username: string): Promise<User | null> {
    return this.usersRepository.findOneBy({ username });
  }

  async remove(id: number): Promise<void> {
    await this.usersRepository.delete(id);
  }

  async create(user: User): Promise<User> {
    const existingUser = await this.findOneByUsername(user.username);
    if (existingUser) {
      return existingUser;
    } else {
      return this.usersRepository.save(user);
    }
  }

  async patch(user: Partial<User>): Promise<void> {
    await this.usersRepository.update(user.id, user);
  }
}
