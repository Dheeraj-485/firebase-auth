import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsBoolean,
} from 'class-validator';

export enum Gender {
  Male = 'Male',
  Female = 'Female',
  Others = 'Others',
}

export enum milkType {
  Cow = 'Cow',
  Buffalo = 'Buffalo',
}

export class CreateUserProfileDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  alternate_phone?: string;

  @IsBoolean()
  is_eggetarian: boolean;

  @IsEnum(milkType)
  milk_preference: milkType;

  @IsEnum(Gender)
  gender: Gender;

  @IsInt()
  family_member_count: number;

  @IsNumber()
  weight_kg: number;

  @IsOptional()
  @IsString()
  door_image_url?: string;
}
