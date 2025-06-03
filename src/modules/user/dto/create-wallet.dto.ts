import { IsNumber, isNumber } from 'class-validator';

export class createWalletDTO {
  @IsNumber()
  balance: number;
}
