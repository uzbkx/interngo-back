import { Controller, Get, Patch, Body, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Public } from '../common/decorators/public.decorator';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('profile')
  async getMyProfile(@CurrentUser() user: any) {
    return {
      _id: user._id,
      email: user.email,
      name: user.name,
      bio: user.bio,
      avatarUrl: user.avatarUrl,
      role: user.role,
      createdAt: user.createdAt,
    };
  }

  @Patch('profile')
  async updateProfile(
    @CurrentUser('_id') userId: string,
    @Body() dto: UpdateProfileDto,
  ) {
    const user = await this.usersService.updateProfile(userId, dto);
    return {
      _id: user._id,
      email: user.email,
      name: user.name,
      bio: user.bio,
      avatarUrl: user.avatarUrl,
      role: user.role,
    };
  }

  @Get('my-listings')
  async getMyListings(@CurrentUser('_id') userId: string) {
    return this.usersService.getUserListings(userId);
  }

  @Public()
  @Get(':id')
  async getPublicProfile(@Param('id') id: string) {
    const user = await this.usersService.findByIdPublic(id);
    if (!user) return { error: 'User not found' };
    return {
      _id: user._id,
      name: user.name,
      bio: user.bio,
      avatarUrl: user.avatarUrl,
      role: user.role,
      createdAt: user.createdAt,
    };
  }
}
