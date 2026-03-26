import { Controller, Post, Body } from '@nestjs/common';
import { ContactDto } from './dto/contact.dto';
import { Public } from '../common/decorators/public.decorator';

@Controller('contact')
export class ContactController {
  @Public()
  @Post()
  async submit(@Body() dto: ContactDto) {
    // TODO: Send email notification
    console.log('[Contact] New message:', dto);
    return { success: true, message: 'Message received' };
  }
}
