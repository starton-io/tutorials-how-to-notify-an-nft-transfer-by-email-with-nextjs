/*
| Developed by Starton
| Filename : item.module.ts
| Author : Alexandre Schaffner (alexandre.s@starton.com)
*/

import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';

import { ItemService } from './item.service';

/*
|--------------------------------------------------------------------------
| ITEM MODULE
|--------------------------------------------------------------------------
*/
@Module({
  imports: [PrismaModule],
  providers: [ItemService],
  exports: [ItemService],
})
export class ItemModule {}
