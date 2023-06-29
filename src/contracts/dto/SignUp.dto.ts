import { IsEmail, IsEthereumAddress, IsStrongPassword } from 'class-validator';

export default class SignUpDto {
  @IsEmail()
  email: string;

  @IsStrongPassword()
  password: string;

  @IsEthereumAddress()
  publicAddress: string;
}
