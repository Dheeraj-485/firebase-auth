import {
  IsEnum,
  IsInt,
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
export class updateProfileDTO {
  //   @IsNotEmpty()
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  alternate_phone?: string;

  @IsOptional()
  @IsBoolean()
  is_eggetarian?: boolean;

  @IsOptional()
  @IsEnum(milkType)
  milk_preference?: milkType;

  @IsOptional()
  @IsEnum(Gender)
  gender?: Gender;

  @IsOptional()
  @IsInt()
  family_member_count?: number;

  @IsOptional()
  @IsNumber()
  weight_kg?: number;

  @IsOptional()
  @IsString()
  door_image_url?: string;
}
