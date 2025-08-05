import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Query } from '@nestjs/common';
import { InvitesService } from './invites.service';
import { CreateInviteDto } from './dto/create-invite.dto';
import { CreateCoordinatorInviteDto } from './dto/create-coordinator-invite.dto';
import { AcceptCoordinatorInviteDto } from './dto/accept-coordinator-invite.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('invites')
export class InvitesController {
  constructor(private readonly invitesService: InvitesService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('bishop', 'admin')
  @Post()
  create(@Body() createInviteDto: CreateInviteDto, @Request() req) {
    return this.invitesService.create(createInviteDto, req.user.id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('bishop', 'admin')
  @Get()
  findAll(@Query('dioceseId') dioceseId?: string) {
    return this.invitesService.findAll(dioceseId);
  }

  @Get('by-token/:token')
  findByToken(@Param('token') token: string) {
    return this.invitesService.findByToken(token);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('bishop', 'admin')
  @Get('stats/:dioceseId')
  getStats(@Param('dioceseId') dioceseId: string) {
    return this.invitesService.getInviteStats(dioceseId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.invitesService.findOne(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('bishop', 'admin')
  @Patch(':id/revoke')
  revoke(@Param('id') id: string, @Request() req) {
    return this.invitesService.revoke(id, req.user.id, req.user.role);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Delete('cleanup-expired')
  cleanupExpired() {
    return this.invitesService.cleanExpiredInvites();
  }

  // Endpoints específicos para Coordinadores Parroquiales
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('priest')
  @Post('coordinator')
  createCoordinatorInvite(@Body() createCoordinatorInviteDto: CreateCoordinatorInviteDto, @Request() req) {
    return this.invitesService.createCoordinatorInvite(createCoordinatorInviteDto, req.user.id);
  }

  @Get('coordinator/token/:token')
  findCoordinatorInviteByToken(@Param('token') token: string) {
    return this.invitesService.findByToken(token);
  }

  @Post('coordinator/accept/:token')
  acceptCoordinatorInvite(@Param('token') token: string, @Body() acceptDto: AcceptCoordinatorInviteDto) {
    return this.invitesService.acceptCoordinatorInvite(token, acceptDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('coordinator/parishes/:userId')
  getUserCoordinatorParishes(@Param('userId') userId: string) {
    return this.invitesService.getUserCoordinatorParishes(userId);
  }
}