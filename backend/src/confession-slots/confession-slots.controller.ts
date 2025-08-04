import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { ConfessionSlotsService } from './confession-slots.service';
import { CreateConfessionSlotDto } from './dto/create-confession-slot.dto';
import { UpdateConfessionSlotDto } from './dto/update-confession-slot.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('confession-slots')
export class ConfessionSlotsController {
  constructor(private readonly confessionSlotsService: ConfessionSlotsService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('priest')
  @Post()
  create(@Body() createConfessionSlotDto: CreateConfessionSlotDto, @Request() req) {
    return this.confessionSlotsService.create(createConfessionSlotDto, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Request() req) {
    return this.confessionSlotsService.findAll(req.user.id, req.user.role);
  }

  @Get('available')
  findAvailable() {
    return this.confessionSlotsService.findAvailableSlots();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('priest')
  @Get('my-slots')
  findMySlots(@Request() req) {
    return this.confessionSlotsService.findByPriest(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.confessionSlotsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateConfessionSlotDto: UpdateConfessionSlotDto, @Request() req) {
    return this.confessionSlotsService.update(id, updateConfessionSlotDto, req.user.id, req.user.role);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.confessionSlotsService.remove(id, req.user.id, req.user.role);
  }
}