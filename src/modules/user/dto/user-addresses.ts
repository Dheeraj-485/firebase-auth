import { isString, IsString, MaxLength } from 'class-validator';

export class userAddressDTO {
  @IsString()
  @MaxLength(100)
  address_line1?: string;

  @IsString()
  @MaxLength(100)
  address_line2: string;

  @IsString()
  @MaxLength(30)
  city: string;

  @IsString()
  @MaxLength(30)
  state: string;

  @IsString()
  @MaxLength(30)
  pincode: string;

  @IsString()
  @MaxLength(50)
  landmark: string;
}

// model addresses{
//     id               Int          @id   @default(autoincrement())

//     user_id          Int

//     user             User        @relation(fields: [user_id],references: [id])

//     address_line1   String?     @db.VarChar(100)
//     address_line2    String?     @db.VarChar(100)
//     city            String      @db.VarChar(30)
//     State           String      @db.VarChar(30)
//     pincode         String      @db.VarChar(30)
//     landmark        String      @db.VarChar(30)
//     is_default      Boolean    @default(true)
//     created_at      DateTime  @default(now())
//     }
