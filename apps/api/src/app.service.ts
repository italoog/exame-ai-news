import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getInfo() {
    return {
      name: 'EXAME AI NEWS API',
      version: '1.0.0',
      status: 'running',
      timestamp: new Date().toISOString(),
    };
  }
}
