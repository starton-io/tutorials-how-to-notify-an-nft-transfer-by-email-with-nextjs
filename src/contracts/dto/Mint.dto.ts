import { IsEthereumAddress, IsHexadecimal } from 'class-validator';

export class MintDto {
  @IsEthereumAddress()
  to: string;

  @IsHexadecimal()
  tokenId: string;
}
