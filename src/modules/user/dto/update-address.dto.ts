import {
  IsBoolean,
  isBoolean,
  isNotEmpty,
  IsNotEmpty,
  IsOptional,
  isString,
  IsString,
  MaxLength,
} from 'class-validator';

export class updateAddressDTO {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  address_line1?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  address_line2: string;

  @IsOptional()
  @IsString()
  @MaxLength(30)
  city: string;

  @IsOptional()
  @IsString()
  @MaxLength(30)
  state: string;

  @IsOptional()
  @IsString()
  @MaxLength(30)
  pincode: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  landmark: string;

  @IsOptional()
  @IsBoolean()
  is_default?: boolean;
}
