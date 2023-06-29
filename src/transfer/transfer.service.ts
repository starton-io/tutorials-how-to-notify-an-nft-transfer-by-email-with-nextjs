/*
| Developed by Starton
| Filename : transfer.service.ts
| Author : Alexandre Schaffner (alexandre.s@starton.com)
*/

import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

/*
|--------------------------------------------------------------------------
| TRANSFER SERVICE
|--------------------------------------------------------------------------
*/
@Injectable()
export class TransferService {
  constructor(private readonly prisma: PrismaService) {}

  // Create a transfer record in the database
  //--------------------------------------------------------------------------
  async create(transfer: Prisma.TransferCreateInput) {
    await this.prisma.transfer.create({ data: transfer });
  }
}
