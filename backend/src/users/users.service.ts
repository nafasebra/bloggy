import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto, UpdateUserDto } from './dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>
  ) {}
  findAll(): Promise<User[]> {
    return this.userRepository.find();
  }
  async create(dto: CreateUserDto): Promise<User> {
    const user = await this.userRepository.save(
      this.userRepository.create(dto)
    );
    delete (user as Partial<User>).password;
    return user;
  }
  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findOneBy({ _id: id });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }
  async update(id: string, dto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);
    return this.userRepository.save(
      this.userRepository.merge(user, dto, { isNew: false })
    );
  }
  async remove(id: string): Promise<User> {
    const user = await this.findOne(id);
    await this.userRepository.delete({ _id: id });
    return user;
  }
}
