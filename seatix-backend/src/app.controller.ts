import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ResponseMessage } from '@common/decorators/response-message.decorator';

@Controller()
export class AppController {
  constructor(private appService: AppService) {}

  @Get()
  @ResponseMessage('Seatix API is running')
  getStatus() {
    return this.appService.getStatus();
  }
}
