import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';

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

  async findOneByUsername(username: string): Promise<User | null> {
    return this.usersRepository.findOneBy({ username });
  }

  async create(userData: {
    username: string;
    password: string;
    firstName: string;
    lastName: string;
  }): Promise<User> {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const user = this.usersRepository.create({
      username: userData.username,
      password: hashedPassword,
      firstName: userData.firstName,
      lastName: userData.lastName,
    });
    return this.usersRepository.save(user);
  }

  async update(
    id: number,
    updateData: {
      firstName?: string;
      lastName?: string;
      password?: string;
    },
  ): Promise<User> {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) {
      throw new Error('User not found');
    }

    if (updateData.firstName) {
      user.firstName = updateData.firstName;
    }
    if (updateData.lastName) {
      user.lastName = updateData.lastName;
    }
    if (updateData.password) {
      user.password = await bcrypt.hash(updateData.password, 10);
    }

    return this.usersRepository.save(user);
  }

  async remove(id: number): Promise<void> {
    await this.usersRepository.delete(id);
  }
}
