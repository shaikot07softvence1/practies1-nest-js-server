import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Put,
  Delete,
} from '@nestjs/common';

import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // =========================
  // GET ALL USERS
  // =========================
  @Get()
  async findAll() {
    const users = await this.usersService.findAll();

    return {
      statusCode: 200,
      message: 'Users fetched successfully',
      data: users,
    };
  }

  // =========================
  // GET SINGLE USER
  // =========================
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const user = await this.usersService.findOne(id);

    return {
      statusCode: 200,
      message: 'User fetched successfully',
      data: user,
    };
  }

  // =========================
  // CREATE USER
  // =========================
  @Post()
  async create(@Body() dto: CreateUserDto) {
    const user = await this.usersService.create(dto);

    return {
      statusCode: 201,
      message: 'User created successfully',
      data: user,
    };
  }

  // =========================
  // UPDATE USER
  // =========================
  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    const user = await this.usersService.update(id, dto);

    return {
      statusCode: 200,
      message: 'User updated successfully',
      data: user,
    };
  }

  // =========================
  // DELETE USER
  // =========================
  @Delete(':id')
  async delete(@Param('id') id: string) {
    await this.usersService.delete(id);

    return {
      statusCode: 200,
      message: 'User deleted successfully',
      data: null,
    };
  }
}
