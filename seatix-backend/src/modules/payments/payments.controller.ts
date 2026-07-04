import { Body, Controller, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { CurrentUser, JwtPayload } from '@common/decorators/current-user.decorator';
import { ResponseMessage } from '@common/decorators/response-message.decorator';
import { Roles } from '@common/decorators/roles.decorator';
import { JwtAuthGuard } from '@common/guards/jwt-auth.guard';
import { RolesGuard } from '@common/guards/roles.guard';
import { InitializePaymentDto } from './dto/initialize-payment.dto';
import { VerifyPaymentDto } from './dto/verify-payment.dto';
import { PaymentsService } from './payments.service';

@Controller('payments')
@UseGuards(JwtAuthGuard)
export class PaymentsController {
  constructor(private paymentsService: PaymentsService) {}

  @Post('initialize')
  @UseGuards(RolesGuard)
  @Roles('attendee')
  @ResponseMessage('Payment initialized successfully')
  initialize(@CurrentUser() user: JwtPayload, @Body() dto: InitializePaymentDto) {
    return this.paymentsService.initialize(user.id, dto);
  }

  @Post('verify')
  @UseGuards(RolesGuard)
  @Roles('attendee')
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Payment verified successfully')
  verify(@CurrentUser() user: JwtPayload, @Body() dto: VerifyPaymentDto) {
    return this.paymentsService.verify(user.id, dto);
  }
}
