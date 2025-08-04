import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { DiocesesService } from './dioceses.service';
import { CreateDioceseDto } from './dto/create-diocese.dto';
import { UpdateDioceseDto } from './dto/update-diocese.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('dioceses')
export class DiocesesController {
  constructor(private readonly diocesesService: DiocesesService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Post()
  create(@Body() createDioceseDto: CreateDioceseDto) {
    return this.diocesesService.create(createDioceseDto);
  }

  @Get()
  findAll() {
    return this.diocesesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.diocesesService.findOne(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('bishop')
  @Get('my-diocese/info')
  findMyDiocese(@Request() req) {
    return this.diocesesService.findByBishop(req.user.id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('bishop')
  @Get(':id/statistics')
  getDioceseStatistics(@Param('id') id: string) {
    return this.diocesesService.getDioceseStatistics(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'bishop')
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDioceseDto: UpdateDioceseDto) {
    return this.diocesesService.update(id, updateDioceseDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.diocesesService.remove(id);
  }
}