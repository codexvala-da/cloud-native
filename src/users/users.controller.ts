import {
  Controller,
  Get,
  Param,
  Post,
  Patch,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
  Request,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { AuthGuard } from '../auth/auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Get('self')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  getSelf(@Request() req): UserResponseDto {
    const user = req.user;
    return {
      id: user.id,
      username: user.username,
      first_name: user.firstName,
      last_name: user.lastName,
      account_created: user.createdAt,
      account_updated: user.updatedAt,
    };
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<User | null> {
    return this.usersService.findOne(+id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.create({
      username: createUserDto.username,
      password: createUserDto.password,
      firstName: createUserDto.first_name,
      lastName: createUserDto.last_name,
    });
  }

  @Patch('self')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  updateSelf(
    @Request() req,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return this.usersService.update(req.user.id, {
      firstName: updateUserDto.first_name,
      lastName: updateUserDto.last_name,
      password: updateUserDto.password,
    });
  }
}
