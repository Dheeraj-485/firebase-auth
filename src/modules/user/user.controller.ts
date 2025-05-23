import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Headers,
  Put,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserProfileDto } from './dto/user-profile';
import { updateProfileDTO } from './dto/update-profile';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('profile')
  create(
    @Headers('idToken') isToken: string,
    @Body() createProfileDto: CreateUserProfileDto,
  ) {
    return this.userService.createProfile(isToken, createProfileDto);
  }

  @Get('me')
  GetUser(@Headers('idToken') idToken: string) {
    return this.userService.userProfile(idToken);
  }

  @Put('update')
  updateUser(
    @Headers('idToken') idToken: string,
    @Body() updateProfileDTO: updateProfileDTO,
  ) {
    return this.userService.updateProfile(idToken, updateProfileDTO);
  }
}
