import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { PrismaService } from './prisma/prisma.service';
import { JwtModule } from '@nestjs/jwt';
import { ItemService } from './item/item.service';
import { EmailModule } from './email/email.module';
import { ItemModule } from './item/item.module';
import { StartonService } from './starton/starton.service';
import { TransferService } from './transfer/transfer.service';
import { StartonModule } from './starton/starton.module';
import { TransferController } from './transfer/transfer.controller';
import { TransferModule } from './transfer/transfer.module';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '2h' },
    }),
    UserModule,
    StartonModule,
    TransferModule,
    ItemModule,
    EmailModule,
  ],
  controllers: [TransferController],
  providers: [PrismaService, ItemService, StartonService, TransferService],
})
export class AppModule {}
