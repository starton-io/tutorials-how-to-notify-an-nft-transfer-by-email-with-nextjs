/*
| Developed by Starton
| Filename : item.service.ts
| Author : Alexandre Schaffner (alexandre.s@starton.com)
*/

import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { nullAddress } from 'src/utils/constants';

/*
|--------------------------------------------------------------------------
| ITEM SERVICE
|--------------------------------------------------------------------------
*/

@Injectable()
export class ItemService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.ItemCreateInput) {
    await this.prisma.item.create({ data });
  }

  async updateByTokenId(tokenId: string, data: Prisma.ItemUpdateInput) {
    await this.prisma.item.update({ where: { tokenId }, data });
  }

  async deleteByTokenId(tokenId: string) {
    await this.prisma.item.delete({ where: { tokenId } });
  }

  async safeTransferFrom(
    collection: string,
    tokenId: string,
    from: string,
    to: string,
  ) {
    // Add item to database in case of a mint (from === nullAddress)
    //--------------------------------------------------------------------------
    if (from === nullAddress) {
      await this.prisma.item.create({
        data: {
          collection: {
            connect: {
              contractAddress: collection,
            },
          },
          tokenId,
          ownerAddress: to,
        },
      });

      // Increment nextTokenId in the database
      //--------------------------------------------------------------------------
      await this.prisma.collection.update({
        where: {
          contractAddress: collection,
        },
        data: {
          nextTokenId: {
            increment: 1,
          },
        },
      });

      // Update item's owner in case of a transfer
      //--------------------------------------------------------------------------
    } else {
      await this.prisma.item.updateMany({
        where: {
          AND: [
            { tokenId },
            { collection: { contractAddress: collection } },
            { ownerAddress: from },
          ],
        },
        data: {
          ownerAddress: to,
        },
      });
    }
  }
}
