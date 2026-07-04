import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  ParseUUIDPipe,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser, JwtPayload } from '@common/decorators/current-user.decorator';
import { ResponseMessage } from '@common/decorators/response-message.decorator';
import { Roles } from '@common/decorators/roles.decorator';
import { JwtAuthGuard } from '@common/guards/jwt-auth.guard';
import { RolesGuard } from '@common/guards/roles.guard';
import { BookingsService } from './bookings.service';

@Controller('bookings')
@UseGuards(JwtAuthGuard)
export class BookingsController {
  constructor(private bookingsService: BookingsService) {}

  @Get()
  @ResponseMessage('Bookings retrieved successfully')
  getUserBookings(@CurrentUser() user: JwtPayload) {
    return this.bookingsService.getUserBookings(user.id);
  }

  @Get('all')
  @UseGuards(RolesGuard)
  @Roles('admin')
  @ResponseMessage('All bookings retrieved successfully')
  getAllBookings(@Query('page') page?: string, @Query('limit') limit?: string) {
    return this.bookingsService.getAllBookings(
      page ? parseInt(page) : 1,
      limit ? parseInt(limit) : 20,
    );
  }

  @Get('event/:eventId')
  @UseGuards(RolesGuard)
  @Roles('organizer')
  @ResponseMessage('Event bookings retrieved successfully')
  getEventBookings(
    @Param('eventId', ParseUUIDPipe) eventId: string,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.bookingsService.getEventBookings(eventId, user.id);
  }

  @Get(':id')
  @ResponseMessage('Booking retrieved successfully')
  getBooking(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user: JwtPayload) {
    return this.bookingsService.getBookingById(id, user.id, user.role);
  }
}
