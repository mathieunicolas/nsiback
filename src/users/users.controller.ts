// NestJS controller for users

// Path: src/users/users.controller.ts
import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Patch,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  async findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Get(':id')
  async findOne(id: number): Promise<User | null> {
    return this.usersService.findOne(id);
  }

  @Delete(':id')
  async deleteOne(@Param() id: number): Promise<void> {
    return this.usersService.remove(id);
  }

  @Patch(':id')
  async patchOne(
    @Param() id: number,
    @Body() user: Partial<User>,
  ): Promise<void> {
    return this.usersService.patch(user);
  }

  @Post()
  async create(@Body() user: User): Promise<User> {
    return this.usersService.create(user);
  }
}
