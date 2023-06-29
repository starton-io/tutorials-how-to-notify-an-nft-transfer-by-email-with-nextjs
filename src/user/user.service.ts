import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SignInDto } from '../contracts/dto/SignIn.dto';
import { JwtService } from '@nestjs/jwt';
import { v4 as uuidv4 } from 'uuid';
import * as bcrypt from 'bcrypt';
import SignUpDto from '../contracts/dto/SignUp.dto';

@Injectable()
export class UserService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  async signUp(user: SignUpDto) {
    user.password = await bcrypt.hash(user.password, 10);

    const newUser = await this.prisma.user.create({
      data: user,
    });

    const token = await this.jwtService.signAsync(
      {},
      { jwtid: uuidv4(), subject: newUser.id },
    );

    return { user: newUser, token };
  }

  async signIn(credentials: SignInDto) {
    const user = await this.prisma.user.findUniqueOrThrow({
      where: { email: credentials.email },
    });

    if (!(await bcrypt.compare(credentials.password, user.password)))
      throw new UnauthorizedException('Invalid credentials');

    const token = await this.jwtService.signAsync(
      {},
      { jwtid: uuidv4(), subject: user.id },
    );

    return { user, token };
  }

  async revokeToken(jti: string) {
    await this.prisma.revokedToken.create({ data: { jti } });

    return true;
  }

  async getById(id: string) {
    return await this.prisma.user.findUniqueOrThrow({ where: { id } });
  }

  async findByPublicAddress(publicAddress: string) {
    return await this.prisma.user.findUnique({
      where: { publicAddress },
    });
  }
}
