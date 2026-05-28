import { Injectable, BadRequestException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../auth/schemas/user.schema';
import { CreateAdminDto, CreateClientDto, UpdatePermissionsDto } from './dto/user-management.dto';
import * as crypto from 'crypto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  private generateSecurePassword(): string {
    const length = 12;
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < length; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    return password;
  }

  async createAdmin(createAdminDto: CreateAdminDto, createdBy: string) {
    const { firstName, lastName, email, phone, permissions } = createAdminDto;

    const existingUser = await this.userModel.findOne({ email });
    if (existingUser) {
      throw new BadRequestException('User already exists with this email');
    }

    const temporaryPassword = this.generateSecurePassword();

    const adminUser = await this.userModel.create({
      firstName,
      lastName,
      email,
      phone,
      password: temporaryPassword,
      role: 'admin',
      permissions: permissions || {
        canOpenFiles: false,
        canUploadFiles: false,
        canAdmitClients: false,
        canManageCases: false,
        canScheduleAppointments: false,
        canAccessReports: false
      },
      createdBy,
      isTemporaryPassword: true,
      isVerified: true,
      isActive: true
    });

    return {
      user: {
        id: adminUser._id,
        firstName: adminUser.firstName,
        lastName: adminUser.lastName,
        email: adminUser.email,
        role: adminUser.role,
        permissions: adminUser.permissions,
        isActive: adminUser.isActive
      },
      temporaryPassword
    };
  }

  async createClient(createClientDto: CreateClientDto, createdBy: string, userRole: string, userPermissions: any) {
    if (userRole === 'admin' && !userPermissions.canAdmitClients) {
      throw new ForbiddenException('You do not have permission to admit clients');
    }

    const { firstName, lastName, email, phone } = createClientDto;

    const existingUser = await this.userModel.findOne({ email });
    if (existingUser) {
      throw new BadRequestException('User already exists with this email');
    }

    const temporaryPassword = this.generateSecurePassword();

    const clientUser = await this.userModel.create({
      firstName,
      lastName,
      email,
      phone,
      password: temporaryPassword,
      role: 'client',
      createdBy,
      isTemporaryPassword: true,
      isVerified: true,
      isActive: true
    });

    return {
      user: {
        id: clientUser._id,
        firstName: clientUser.firstName,
        lastName: clientUser.lastName,
        email: clientUser.email,
        role: clientUser.role,
        isActive: clientUser.isActive
      },
      temporaryPassword
    };
  }

  async getAllUsers(role?: string, page = 1, limit = 10) {
    const query: any = {};
    if (role && ['admin', 'client'].includes(role)) {
      query.role = role;
    }

    const users = await this.userModel.find(query)
      .populate('createdBy', 'firstName lastName email')
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip((page - 1) * limit);

    const total = await this.userModel.countDocuments(query);

    return {
      users,
      total,
      pagination: {
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    };
  }

  async updateAdminPermissions(adminId: string, updatePermissionsDto: UpdatePermissionsDto) {
    const admin = await this.userModel.findById(adminId);
    if (!admin) {
      throw new NotFoundException('Admin user not found');
    }

    if (admin.role !== 'admin') {
      throw new BadRequestException('User is not an admin');
    }

    admin.permissions = { ...admin.permissions, ...updatePermissionsDto.permissions };
    await admin.save();

    return {
      id: admin._id,
      firstName: admin.firstName,
      lastName: admin.lastName,
      email: admin.email,
      permissions: admin.permissions
    };
  }

  async deactivateUser(userId: string) {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.role === 'advocate') {
      throw new BadRequestException('Cannot deactivate advocate account');
    }

    user.isActive = false;
    await user.save();
  }

  async activateUser(userId: string) {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.isActive = true;
    await user.save();
  }

  async resetUserPassword(userId: string) {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.role === 'advocate') {
      throw new BadRequestException('Cannot reset advocate password');
    }

    const newPassword = this.generateSecurePassword();
    user.password = newPassword;
    user.isTemporaryPassword = true;
    await user.save();

    return { temporaryPassword: newPassword };
  }

  async deleteUser(userId: string) {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.role === 'advocate') {
      throw new BadRequestException('Cannot delete advocate account');
    }

    await this.userModel.findByIdAndDelete(userId);
  }
}