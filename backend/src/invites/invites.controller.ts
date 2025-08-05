import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Query } from '@nestjs/common';
import { InvitesService } from './invites.service';
import { CreateInviteDto } from './dto/create-invite.dto';
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
}