import { IsNumber } from 'class-validator';

export class createWalletDTO {
  @IsNumber()
  balance: number;
}
