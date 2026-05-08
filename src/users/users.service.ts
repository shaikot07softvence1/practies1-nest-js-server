import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';

import { User, UserDocument } from './users.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
  ) {}

  // =========================
  // GET ALL USERS
  // =========================
  async findAll(): Promise<UserDocument[]> {
    return this.userModel.find().select('-password').exec(); // hide password
  }

  // =========================
  // GET SINGLE USER
  // =========================
  async findOne(id: string): Promise<UserDocument> {
    const user = await this.userModel.findById(id).select('-password').exec();

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  // =========================
  // CREATE USER (with hashing + duplicate check)
  // =========================
  async create(dto: CreateUserDto): Promise<UserDocument> {
    // check duplicate email
    const existingUser = await this.userModel.findOne({
      email: dto.email,
    });

    if (existingUser) {
      throw new BadRequestException('User already exists');
    }

    // hash password 🔐
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const userData = {
      ...dto,
      password: hashedPassword,
    };

    const user = await this.userModel.create(userData);

    // hide password before return
    const result = user.toObject();
    return result as UserDocument;
  }

  // =========================
  // UPDATE USER
  // =========================
  async update(id: string, dto: UpdateUserDto): Promise<UserDocument> {
    // if password update hoile hash koro

    const updatedUser = await this.userModel
      .findByIdAndUpdate(id, dto, {
        new: true,
        runValidators: true,
      })
      .select('-password')
      .exec();

    if (!updatedUser) {
      throw new NotFoundException('User not found');
    }

    return updatedUser;
  }

  // =========================
  // DELETE USER
  // =========================
  async delete(id: string): Promise<{ message: string }> {
    const result = await this.userModel.findByIdAndDelete(id).exec();

    if (!result) {
      throw new NotFoundException('User not found');
    }

    return {
      message: 'User deleted successfully',
    };
  }
}
