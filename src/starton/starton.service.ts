/*
| Developed by Starton
| Filename : starton.service.ts
| Author : Alexandre Schaffner (alexandre.s@starton.com)
*/

import { Injectable } from '@nestjs/common';
import axios from 'axios';
import {
  cryptoquartzCollectionAddress,
  network,
  signerWallet,
} from 'src/utils/constants';

/*
|--------------------------------------------------------------------------
| STARTON SERVICE
|--------------------------------------------------------------------------
*/

@Injectable()
export class StartonService {
  // axios instance preset
  //--------------------------------------------------------------------------
  private readonly instance = axios.create({
    baseURL:
      'https://api.starton.com/v3/smart-contract/' +
      network +
      '/' +
      cryptoquartzCollectionAddress +
      '/',
    headers: {
      'x-api-key': process.env.STARTON_API_KEY,
    },
  });

  // safeTransferFrom
  //--------------------------------------------------------------------------
  async initTransfer(from: string, to: string, tokenId: string) {
    await this.instance.post('call', {
      signerWallet,
      functionName: 'safeTransferFrom',
      params: [from, to, tokenId, 1, '0x00'],
    });
  }

  // mint
  //--------------------------------------------------------------------------
  async initMint(to: string, tokenId: string) {
    await this.instance.post('call', {
      signerWallet,
      functionName: 'mint',
      params: [to, tokenId, 1, '0x00'],
    });
  }

  // burn
  //--------------------------------------------------------------------------
  async initBurn(address: string, tokenId: string) {
    await this.instance.post('call', {
      signerWallet,
      functionName: 'burn',
      params: [address, tokenId, '0x00'],
    });
  }
}
