import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getStatus() {
    return {
      name: 'Seatix API',
      version: '1.0.0',
      status: 'operational',
    };
  }
}
