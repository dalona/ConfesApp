import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  UseGuards, 
  Request,
  Query,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ConfessionBandsService } from './confession-bands.service';
import { CreateBandDto } from './dto/create-band.dto';
import { UpdateBandDto } from './dto/update-band.dto';
import { BookBandDto } from './dto/book-band.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { BandStatus } from '../entities/confession-band.entity';

@Controller('confession-bands')
@UseGuards(JwtAuthGuard)
export class ConfessionBandsController {
  constructor(private readonly confessionBandsService: ConfessionBandsService) {}

  // ===== PRIEST ENDPOINTS =====

  @Post()
  @UseGuards(RolesGuard)
  @Roles('priest')
  create(@Body() createBandDto: CreateBandDto, @Request() req) {
    return this.confessionBandsService.create(createBandDto, req.user.id);
  }

  @Get('my-bands')
  @UseGuards(RolesGuard)
  @Roles('priest')
  findMyBands(
    @Request() req,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.confessionBandsService.findAll(req.user.id, startDate, endDate);
  }

  @Get('my-bands/:id')
  @UseGuards(RolesGuard)
  @Roles('priest')
  findOne(@Param('id', ParseUUIDPipe) id: string, @Request() req) {
    return this.confessionBandsService.findOne(id, req.user.id);
  }

  @Patch('my-bands/:id')
  @UseGuards(RolesGuard)
  @Roles('priest')
  update(
    @Param('id', ParseUUIDPipe) id: string, 
    @Body() updateBandDto: UpdateBandDto,
    @Request() req,
  ) {
    return this.confessionBandsService.update(id, updateBandDto, req.user.id);
  }

  @Delete('my-bands/:id')
  @UseGuards(RolesGuard)
  @Roles('priest')
  remove(@Param('id', ParseUUIDPipe) id: string, @Request() req) {
    return this.confessionBandsService.remove(id, req.user.id);
  }

  @Patch('my-bands/:id/status')
  @UseGuards(RolesGuard)
  @Roles('priest')
  changeStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('status') status: BandStatus,
    @Request() req,
  ) {
    return this.confessionBandsService.changeStatus(id, status, req.user.id);
  }

  // ===== FAITHFUL ENDPOINTS =====

  @Get('available')
  @UseGuards(RolesGuard)
  @Roles('faithful')
  getAvailableBands(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('parishId') parishId?: string,
  ) {
    return this.confessionBandsService.getAvailableBands(startDate, endDate, parishId);
  }

  @Post('book')
  @UseGuards(RolesGuard)
  @Roles('faithful')
  bookBand(@Body() bookBandDto: BookBandDto, @Request() req) {
    return this.confessionBandsService.bookBand(bookBandDto, req.user.id);
  }

  @Get('my-bookings')
  @UseGuards(RolesGuard)
  @Roles('faithful')
  getMyBookings(@Request() req) {
    return this.confessionBandsService.getFaithfulBookings(req.user.id);
  }

  @Patch('bookings/:id/cancel')
  @UseGuards(RolesGuard)
  @Roles('faithful')
  cancelBooking(@Param('id', ParseUUIDPipe) confessionId: string, @Request() req) {
    return this.confessionBandsService.cancelBooking(confessionId, req.user.id);
  }

  // ===== PUBLIC ENDPOINTS (for display without booking) =====

  @Get('public/available')
  getPublicAvailableBands(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('parishId') parishId?: string,
  ) {
    return this.confessionBandsService.getAvailableBands(startDate, endDate, parishId);
  }
}