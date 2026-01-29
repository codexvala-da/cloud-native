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
import {
  ApiTags,
  ApiBearerAuth,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiBody,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { AuthGuard } from '../auth/auth.guard';

@ApiTags('users')
@Controller('v1/user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('getAll')
  @UseGuards(AuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOkResponse({ type: [UserResponseDto], description: 'List users' })
  async findAll(): Promise<UserResponseDto[]> {
    const users = await this.usersService.findAll();
    return users.map((u) => this.mapToDto(u));
  }

  @Get('self')
  @UseGuards(AuthGuard)
  @ApiBearerAuth('access-token')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: UserResponseDto })
  getSelf(@Request() req): UserResponseDto {
    return this.mapToDto(req.user);
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOkResponse({ type: UserResponseDto })
  async findOne(@Param('id') id: string): Promise<UserResponseDto | null> {
    const user = await this.usersService.findOne(+id);
    return user ? this.mapToDto(user) : null;
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(AuthGuard)
  @ApiBearerAuth('access-token')
  @ApiBody({ type: CreateUserDto })
  @ApiCreatedResponse({ description: 'User created' })
  async create(@Body() createUserDto: CreateUserDto): Promise<UserResponseDto> {
    const user = await this.usersService.create({
      username: createUserDto.username,
      password: createUserDto.password,
      firstName: createUserDto.first_name,
      lastName: createUserDto.last_name,
    });
    return this.mapToDto(user);
  }

  @Patch()
  @UseGuards(AuthGuard)
  @ApiBearerAuth('access-token')
  @HttpCode(HttpStatus.OK)
  async updateSelf(
    @Request() req,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    const user = await this.usersService.update(req.user.id, {
      firstName: updateUserDto.first_name,
      lastName: updateUserDto.last_name,
      password: updateUserDto.password,
    });
    return this.mapToDto(user);
  }

  private mapToDto(user: User): UserResponseDto {
    return {
      id: user.id,
      username: user.username,
      first_name: user.firstName,
      last_name: user.lastName,
      account_created: user.createdAt,
      account_updated: user.updatedAt,
    } as UserResponseDto;
  }
}
