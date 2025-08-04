import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Query } from '@nestjs/common';
import { ParishesService } from './parishes.service';
import { CreateParishDto } from './dto/create-parish.dto';
import { UpdateParishDto } from './dto/update-parish.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('parishes')
export class ParishesController {
  constructor(private readonly parishesService: ParishesService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'bishop')
  @Post()
  create(@Body() createParishDto: CreateParishDto) {
    return this.parishesService.create(createParishDto);
  }

  @Get()
  findAll() {
    return this.parishesService.findAll();
  }

  @Get('diocese/:dioceseId')
  findByDiocese(@Param('dioceseId') dioceseId: string) {
    return this.parishesService.findByDiocese(dioceseId);
  }

  @Get('nearby')
  findNearby(
    @Query('lat') latitude: number,
    @Query('lng') longitude: number,
    @Query('radius') radius?: number,
  ) {
    return this.parishesService.findNearby(latitude, longitude, radius);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.parishesService.findOne(id);
  }

  @Get(':id/statistics')
  getStatistics(@Param('id') id: string) {
    return this.parishesService.getParishStatistics(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'bishop', 'parish_staff')
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateParishDto: UpdateParishDto, @Request() req) {
    return this.parishesService.update(id, updateParishDto, req.user.id, req.user.role);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'bishop')
  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.parishesService.remove(id, req.user.id, req.user.role);
  }
}