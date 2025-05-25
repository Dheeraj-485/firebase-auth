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
  ParseIntPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserProfileDto } from './dto/user-profile';
import { updateProfileDTO } from './dto/update-profile';
import { userAddressDTO } from './dto/user-addresses';
import { updateAddressDTO } from './dto/update-address.dto';

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

  //Address api
  @Post('address')
  createAddress(
    @Headers('idToken') idToken: string,
    @Body() createAddressDTO: userAddressDTO,
  ) {
    return this.userService.createAddress(idToken, createAddressDTO);
  }

  @Get('address')
  getAddress(@Headers('idToken') idToken: string) {
    return this.userService.getAddress(idToken);
  }

  @Put('address/:id')
  updateAddress(
    @Headers('idToken') idToken: string,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateAddressDTO: updateAddressDTO,
  ) {
    return this.userService.updateAddress(idToken, id, updateAddressDTO);
  }

  @Delete('address/:id')
  deleteAddress(
    @Headers('idToken') idToken: string,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.userService.deleteAddress(idToken, id);
  }
}
