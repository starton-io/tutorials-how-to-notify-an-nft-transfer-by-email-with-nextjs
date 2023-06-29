/*
| Developed by Starton
| Filename : transfer.module.ts
| Author : Alexandre Schaffner (alexandre.s@starton.com)
*/

import { Module } from '@nestjs/common';
import { EmailModule } from 'src/email/email.module';
import { ItemModule } from 'src/item/item.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { StartonModule } from 'src/starton/starton.module';
import { UserModule } from 'src/user/user.module';

import { TransferController } from './transfer.controller';
import { TransferService } from './transfer.service';

/*
|--------------------------------------------------------------------------
| TRANSFER MODULE
|--------------------------------------------------------------------------
*/

@Module({
  imports: [PrismaModule, StartonModule, UserModule, ItemModule, EmailModule],
  providers: [TransferService],
  controllers: [TransferController],
})
export class TransferModule {}
