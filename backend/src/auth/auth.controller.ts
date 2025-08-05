import { Controller, Post, Body, UseGuards, Request, Param, Patch } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { JwtAuthGuard } from './jwt-auth.guard';
import { RolesGuard } from './roles.guard';
import { Roles } from './roles.decorator';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterPriestRequestDto } from './dto/register-priest-request.dto';
import { RegisterFromInviteDto } from './dto/register-from-invite.dto';
import { AcceptCoordinatorInviteDto } from '../invites/dto/accept-coordinator-invite.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req, @Body() loginDto: LoginDto) {
    return this.authService.login(req.user);
  }

  @Post('register-priest')
  async registerPriestRequest(@Body() registerPriestRequestDto: RegisterPriestRequestDto) {
    return this.authService.registerPriestRequest(registerPriestRequestDto);
  }

  @Post('register-from-invite/:token')
  async registerFromInvite(
    @Param('token') token: string,
    @Body() registerFromInviteDto: RegisterFromInviteDto
  ) {
    return this.authService.registerFromInvite(token, registerFromInviteDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('bishop', 'admin')
  @Patch('approve-priest/:userId')
  async approvePriestRequest(
    @Param('userId') userId: string,
    @Body() body: { approved: boolean },
    @Request() req
  ) {
    return this.authService.approvePriestRequest(userId, body.approved, req.user.id);
  }
}