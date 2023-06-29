import { IsEthereumAddress, IsInt } from 'class-validator';

export class SafeTransferDto {
  @IsEthereumAddress()
  from: string;

  @IsEthereumAddress()
  to: string;

  @IsInt()
  tokenId: string;
}
