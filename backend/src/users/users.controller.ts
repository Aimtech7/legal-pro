import { Controller, Post, Get, Put, Delete, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateAdminDto, CreateClientDto, UpdatePermissionsDto } from './dto/user-management.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { Roles } from './decorators/roles.decorator';
import { ApiResponseDto, PaginationDto } from '../common/dto/api-response.dto';

@ApiTags('User Management')
@Controller('api/user-management')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('create-admin')
  @Roles('advocate')
  @ApiOperation({ summary: 'Create admin user (Advocate only)' })
  @ApiResponse({ status: 201, description: 'Admin created successfully' })
  async createAdmin(@Body() createAdminDto: CreateAdminDto, @Request() req: any): Promise<ApiResponseDto> {
    const result = await this.usersService.createAdmin(createAdminDto, req.user._id);
    return new ApiResponseDto(true, 'Admin user created successfully', result);
  }

  @Post('create-client')
  @Roles('advocate', 'admin')
  @ApiOperation({ summary: 'Create client user (Advocate/Admin with permission)' })
  @ApiResponse({ status: 201, description: 'Client created successfully' })
  async createClient(@Body() createClientDto: CreateClientDto, @Request() req: any): Promise<ApiResponseDto> {
    const result = await this.usersService.createClient(
      createClientDto, 
      req.user._id, 
      req.user.role, 
      req.user.permissions
    );
    return new ApiResponseDto(true, 'Client user created successfully', result);
  }

  @Get('users')
  @Roles('advocate')
  @ApiOperation({ summary: 'Get all users (Advocate only)' })
  @ApiResponse({ status: 200, description: 'Users retrieved successfully' })
  async getAllUsers(@Query() query: { role?: string; page?: number; limit?: number }): Promise<ApiResponseDto> {
    const { role, page = 1, limit = 10 } = query;
    const result = await this.usersService.getAllUsers(role, Number(page), Number(limit));
    return new ApiResponseDto(true, 'Users retrieved successfully', {
      count: result.users.length,
      total: result.total,
      pagination: result.pagination,
      users: result.users
    });
  }

  @Put('admin/:id/permissions')
  @Roles('advocate')
  @ApiOperation({ summary: 'Update admin permissions (Advocate only)' })
  @ApiResponse({ status: 200, description: 'Permissions updated successfully' })
  async updateAdminPermissions(
    @Param('id') id: string,
    @Body() updatePermissionsDto: UpdatePermissionsDto
  ): Promise<ApiResponseDto> {
    const result = await this.usersService.updateAdminPermissions(id, updatePermissionsDto);
    return new ApiResponseDto(true, 'Admin permissions updated successfully', { user: result });
  }

  @Put('user/:id/deactivate')
  @Roles('advocate')
  @ApiOperation({ summary: 'Deactivate user (Advocate only)' })
  @ApiResponse({ status: 200, description: 'User deactivated successfully' })
  async deactivateUser(@Param('id') id: string): Promise<ApiResponseDto> {
    await this.usersService.deactivateUser(id);
    return new ApiResponseDto(true, 'User deactivated successfully');
  }

  @Put('user/:id/activate')
  @Roles('advocate')
  @ApiOperation({ summary: 'Activate user (Advocate only)' })
  @ApiResponse({ status: 200, description: 'User activated successfully' })
  async activateUser(@Param('id') id: string): Promise<ApiResponseDto> {
    await this.usersService.activateUser(id);
    return new ApiResponseDto(true, 'User activated successfully');
  }

  @Put('user/:id/reset-password')
  @Roles('advocate')
  @ApiOperation({ summary: 'Reset user password (Advocate only)' })
  @ApiResponse({ status: 200, description: 'Password reset successfully' })
  async resetUserPassword(@Param('id') id: string): Promise<ApiResponseDto> {
    const result = await this.usersService.resetUserPassword(id);
    return new ApiResponseDto(true, 'Password reset successfully', result);
  }

  @Delete('user/:id')
  @Roles('advocate')
  @ApiOperation({ summary: 'Delete user (Advocate only)' })
  @ApiResponse({ status: 200, description: 'User deleted successfully' })
  async deleteUser(@Param('id') id: string): Promise<ApiResponseDto> {
    await this.usersService.deleteUser(id);
    return new ApiResponseDto(true, 'User deleted successfully');
  }
}