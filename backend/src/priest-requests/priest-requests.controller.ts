import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { PriestRequestsService } from './priest-requests.service';
import { CreatePriestRequestDto } from './dto/create-priest-request.dto';
import { ReviewRequestDto } from './dto/review-request.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('priest-requests')
export class PriestRequestsController {
  constructor(private readonly priestRequestsService: PriestRequestsService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('priest')
  @Post()
  create(@Body() createPriestRequestDto: CreatePriestRequestDto, @Request() req) {
    return this.priestRequestsService.create(createPriestRequestDto, req.user.id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'bishop', 'parish_staff')
  @Get()
  findAll() {
    return this.priestRequestsService.findAll();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('priest')
  @Get('my-requests')
  findMyRequests(@Request() req) {
    return this.priestRequestsService.findByPriest(req.user.id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'bishop', 'parish_staff')
  @Get('parish/:parishId')
  findByParish(@Param('parishId') parishId: string) {
    return this.priestRequestsService.findByParish(parishId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('bishop')
  @Get('diocese/:dioceseId/pending')
  findPendingForDiocese(@Param('dioceseId') dioceseId: string) {
    return this.priestRequestsService.findPendingForDiocese(dioceseId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.priestRequestsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'bishop', 'parish_staff')
  @Patch(':id/review')
  reviewRequest(@Param('id') id: string, @Body() reviewRequestDto: ReviewRequestDto, @Request() req) {
    return this.priestRequestsService.reviewRequest(id, reviewRequestDto, req.user.id, req.user.role);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.priestRequestsService.remove(id, req.user.id, req.user.role);
  }

  @UseGuards(JwtAuthGuard)
  @Get('history/priest/:priestId')
  getPriestHistory(@Param('priestId') priestId: string) {
    return this.priestRequestsService.getPriestHistory(priestId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('history/parish/:parishId')
  getParishHistory(@Param('parishId') parishId: string) {
    return this.priestRequestsService.getParishPriestHistory(parishId);
  }
}