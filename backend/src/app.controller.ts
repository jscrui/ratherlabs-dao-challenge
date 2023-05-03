import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { id } from 'ethers/lib/utils';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  //get all proposals
  @Get('/proposals')
  async getProposals(): Promise<string> {
    return this.appService.getProposals();
  }   

}
