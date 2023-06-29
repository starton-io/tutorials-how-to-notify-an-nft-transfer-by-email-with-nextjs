/*
| Developed by Starton
| Filename : transfer.controller.ts
| Author : Alexandre Schaffner (alexandre.s@starton.com)
*/

import {
  Body,
  Controller,
  InternalServerErrorException,
  Post,
  UseGuards,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { MintDto } from 'src/contracts/dto/Mint.dto';
import { SafeTransferDto } from 'src/contracts/dto/SafeTransfer.dto';
import { AuthGuard } from 'src/guards/auth/auth.guard';
import { ItemService } from 'src/item/item.service';
import { StartonService } from 'src/starton/starton.service';
import { UserService } from 'src/user/user.service';
import { cryptoquartzCollectionAddress } from 'src/utils/constants';

import { EmailService } from '../email/email.service';
import { TransferService } from './transfer.service';
import { StartonGuard } from 'src/guards/starton/starton.guard';

/*
|--------------------------------------------------------------------------
| TRANSFER CONTROLLER
|--------------------------------------------------------------------------
*/

@Controller('transfer')
export class TransferController {
  constructor(
    private readonly transferService: TransferService,
    private readonly starton: StartonService,
    private readonly userService: UserService,
    private readonly itemService: ItemService,
    private readonly emailService: EmailService,
  ) {}

  /*
  |--------------------------------------------------------------------------
  | WEBHOOK ENDPOINT TRIGGERED BY STARTON
  |--------------------------------------------------------------------------
  */

  @UseGuards(StartonGuard)
  @Post('webhook')
  async webhook(@Body() body: any) {
    try {
      const { from, to, id } = body.data.transferSingle;
      const transfer: Prisma.TransferCreateInput = {
        item: { connect: { tokenId: id.hex.toLowerCase() } },
        from: from.toLowerCase(),
        to: to.toLowerCase(),
        toUser: { connect: { publicAddress: to.toLowerCase() } },
        fromUser: { connect: { publicAddress: from.toLowerCase() } },
        txHash: body.data.transaction.hash.toLowerCase(),
      };

      // Check if user exists, if not, don't connect records
      //--------------------------------------------------------------------------
      const toUser = await this.userService.findByPublicAddress(
        to.toLowerCase(),
      );
      if (!toUser) delete transfer.toUser;
      const fromUser = await this.userService.findByPublicAddress(
        from.toLowerCase(),
      );
      if (!fromUser) delete transfer.fromUser;

      // Change the owner of the item in the database
      //--------------------------------------------------------------------------
      await this.itemService.safeTransferFrom(
        cryptoquartzCollectionAddress,
        id.hex.toLowerCase(),
        from.toLowerCase(),
        to.toLowerCase(),
      );

      // Create the transfer record
      //--------------------------------------------------------------------------
      await this.transferService.create(transfer);

      // If the recipient is a user, send an email
      //--------------------------------------------------------------------------
      if (!toUser) return;

      // Use a template here
      //--------------------------------------------------------------------------
      await this.emailService.sendEmail(
        toUser.email,
        'NFT Transfer',
        'The address ' +
          from +
          ' sent the NFT #' +
          id.hex +
          ' to your address ' +
          to +
          '.',
      );

      return;
    } catch (err: unknown) {
      console.error(err);
      throw new InternalServerErrorException();
    }
  }

  /*
  |--------------------------------------------------------------------------
  | TRANSFER / MINT / BURN ENDPOINTS
  |--------------------------------------------------------------------------
  */

  // safeTransferFrom
  //--------------------------------------------------------------------------
  @UseGuards(AuthGuard)
  @Post()
  async safeTransferFrom(@Body() safeTransferDto: SafeTransferDto) {
    await this.starton.initTransfer(
      safeTransferDto.from,
      safeTransferDto.to,
      safeTransferDto.tokenId,
    );
  }

  // Mint a token
  //--------------------------------------------------------------------------
  @UseGuards(AuthGuard)
  @Post('mint')
  async mint(@Body() mintDto: MintDto) {
    await this.starton.initMint(mintDto.to, mintDto.tokenId);
  }

  // Burn a token
  //--------------------------------------------------------------------------
  @UseGuards(AuthGuard)
  @Post('burn')
  async burn(@Body() burnDto: MintDto) {
    await this.starton.initBurn(burnDto.to, burnDto.tokenId);
    await this.itemService.deleteByTokenId(burnDto.tokenId);
  }
}
