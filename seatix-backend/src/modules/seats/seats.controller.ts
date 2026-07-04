import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser, JwtPayload } from '@common/decorators/current-user.decorator';
import { ResponseMessage } from '@common/decorators/response-message.decorator';
import { Roles } from '@common/decorators/roles.decorator';
import { JwtAuthGuard } from '@common/guards/jwt-auth.guard';
import { RolesGuard } from '@common/guards/roles.guard';
import { CreateSeatMapDto } from './dto/create-seat-map.dto';
import { HoldSeatsDto } from './dto/hold-seats.dto';
import { UpdateSeatDto } from './dto/update-seat.dto';
import { SeatsService } from './seats.service';

@Controller('events/:eventId/seats')
export class SeatsController {
  constructor(private seatsService: SeatsService) {}

  @Get()
  @ResponseMessage('Seat map retrieved successfully')
  getSeatMap(@Param('eventId', ParseUUIDPipe) eventId: string) {
    return this.seatsService.getSeatMap(eventId);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('organizer')
  @ResponseMessage('Seat map saved successfully')
  saveSeatMap(
    @Param('eventId', ParseUUIDPipe) eventId: string,
    @CurrentUser() user: JwtPayload,
    @Body() dto: CreateSeatMapDto,
  ) {
    return this.seatsService.saveSeatMap(eventId, user.id, dto);
  }

  @Patch(':seatId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('organizer')
  @ResponseMessage('Seat updated successfully')
  updateSeat(
    @Param('eventId', ParseUUIDPipe) eventId: string,
    @Param('seatId', ParseUUIDPipe) seatId: string,
    @CurrentUser() user: JwtPayload,
    @Body() dto: UpdateSeatDto,
  ) {
    return this.seatsService.updateSeat(eventId, seatId, user.id, dto);
  }

  @Post('hold')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Seats held successfully')
  holdSeats(
    @Param('eventId', ParseUUIDPipe) eventId: string,
    @CurrentUser() user: JwtPayload,
    @Body() dto: HoldSeatsDto,
  ) {
    return this.seatsService.holdSeats(eventId, user.id, dto);
  }

  @Delete('hold')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Seats released successfully')
  releaseHolds(@Param('eventId', ParseUUIDPipe) eventId: string, @CurrentUser() user: JwtPayload) {
    return this.seatsService.releaseHolds(eventId, user.id);
  }
}
