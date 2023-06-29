/*
| Developed by Starton
| Filename : starton.module.ts
| Author : Alexandre Schaffner (alexandre.s@starton.com)
*/

import { Module } from '@nestjs/common';

import { StartonService } from './starton.service';

/*
|--------------------------------------------------------------------------
| STARTON MODULE
|--------------------------------------------------------------------------
*/

@Module({
  providers: [StartonService],
  exports: [StartonService],
})
export class StartonModule {}
