import { IsEthereumAddress, IsHexadecimal } from 'class-validator';

export class BurnDto {
  @IsEthereumAddress()
  from: string;

  @IsHexadecimal()
  tokenId: string;
}
