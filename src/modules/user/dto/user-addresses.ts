import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class userAddressDTO {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  address_line1?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  address_line2: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(30)
  city: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(30)
  state: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(30)
  pincode: string;

  @IsString()
  @MaxLength(50)
  landmark: string;

  @IsOptional()
  @IsBoolean()
  is_default?: boolean;
}
