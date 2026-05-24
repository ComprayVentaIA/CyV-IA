import {
  Controller, Get, Post, Patch, Delete, Body, Param,
  Query, UseGuards, Request,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard, Roles } from '../common/guards/index';
import { AdminService } from './admin.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateRoleDto } from './dto/create-role.dto';

@ApiTags('admin')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('dashboard')
  @ApiOperation({ summary: 'Métricas del dashboard administrativo' })
  getDashboard() {
    return this.adminService.getDashboardMetrics();
  }

  @Get('stats')
  @ApiOperation({ summary: 'Estadísticas globales de la plataforma' })
  getStats() {
    return this.adminService.getGlobalStats();
  }

  // ── Users ──────────────────────────────────────────────────────────────────

  @Get('users')
  @ApiOperation({ summary: 'Listar todos los usuarios' })
  getUsers(
    @Query('search') search?: string,
    @Query('role') role?: string,
    @Query('status') status?: string,
    @Query('plan') plan?: string,
    @Query('page') page = 1,
    @Query('limit') limit = 20,
  ) {
    return this.adminService.getUsers({ search, role, status, plan, page: +page, limit: +limit });
  }

  @Get('users/:id')
  getUserDetail(@Param('id') id: string) {
    return this.adminService.getUserDetail(id);
  }

  @Post('users')
  @ApiOperation({ summary: 'Crear usuario manualmente' })
  createUser(@Request() req: any, @Body() dto: CreateUserDto) {
    return this.adminService.createUser(req.user.id, dto);
  }

  @Patch('users/:id')
  updateUser(@Request() req: any, @Param('id') id: string, @Body() dto: UpdateUserDto) {
    return this.adminService.updateUser(req.user.id, id, dto);
  }

  @Patch('users/:id/suspend')
  suspend(@Request() req: any, @Param('id') id: string, @Body('reason') reason: string) {
    return this.adminService.suspendUser(req.user.id, id, reason);
  }

  @Patch('users/:id/activate')
  activate(@Request() req: any, @Param('id') id: string) {
    return this.adminService.activateUser(req.user.id, id);
  }

  @Patch('users/:id/block')
  block(@Request() req: any, @Param('id') id: string, @Body('reason') reason: string) {
    return this.adminService.blockUser(req.user.id, id, reason);
  }

  @Delete('users/:id')
  deleteUser(@Request() req: any, @Param('id') id: string) {
    return this.adminService.deleteUser(req.user.id, id);
  }

  @Post('users/:id/impersonate')
  impersonate(@Request() req: any, @Param('id') id: string) {
    return this.adminService.impersonateUser(req.user.id, id);
  }

  @Post('users/:id/reset-password')
  resetPassword(@Request() req: any, @Param('id') id: string) {
    return this.adminService.resetUserPassword(req.user.id, id);
  }

  @Patch('users/:id/plan')
  overridePlan(
    @Request() req: any,
    @Param('id') id: string,
    @Body('plan') plan: string,
  ) {
    return this.adminService.overridePlan(req.user.id, id, plan);
  }

  @Patch('users/:id/permissions')
  setPermissions(
    @Request() req: any,
    @Param('id') id: string,
    @Body('permissions') permissions: string[],
  ) {
    return this.adminService.setUserPermissions(req.user.id, id, permissions);
  }

  // ── Feature flags ──────────────────────────────────────────────────────────

  @Get('feature-flags')
  getFeatureFlags() {
    return this.adminService.getFeatureFlags();
  }

  @Patch('feature-flags/:id')
  toggleFeatureFlag(
    @Request() req: any,
    @Param('id') id: string,
    @Body('enabled') enabled: boolean,
  ) {
    return this.adminService.toggleFeatureFlag(req.user.id, id, enabled);
  }

  // ── Plans ──────────────────────────────────────────────────────────────────

  @Patch('plans/:name/price')
  updatePlanPrice(
    @Request() req: any,
    @Param('name') name: string,
    @Body('priceCents') priceCents: number,
  ) {
    return this.adminService.updatePlanPrice(req.user.id, name, priceCents);
  }

  // ── Audit log ──────────────────────────────────────────────────────────────

  @Get('audit')
  getAuditLog(
    @Query('userId') userId?: string,
    @Query('action') action?: string,
    @Query('page') page = 1,
    @Query('limit') limit = 50,
  ) {
    return this.adminService.getAuditLog({ userId, action, page: +page, limit: +limit });
  }

  // ── Announcements ──────────────────────────────────────────────────────────

  @Post('announce')
  @ApiOperation({ summary: 'Enviar comunicado masivo' })
  announce(
    @Request() req: any,
    @Body() dto: { subject: string; body: string; target: 'all' | 'plan' | 'user'; targetValue?: string },
  ) {
    return this.adminService.sendAnnouncement(req.user.id, dto);
  }

  // ── Roles ──────────────────────────────────────────────────────────────────

  @Get('roles')
  getRoles() {
    return this.adminService.getRoles();
  }

  @Post('roles')
  createRole(@Request() req: any, @Body() dto: CreateRoleDto) {
    return this.adminService.createRole(req.user.id, dto);
  }
}
