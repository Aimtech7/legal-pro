import { IsString, IsEmail, IsOptional, IsObject, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAdminDto {
  @ApiProperty()
  @IsString()
  firstName!: string;

  @ApiProperty()
  @IsString()
  lastName!: string;

  @ApiProperty()
  @IsEmail()
  email!: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsObject()
  permissions?: {
    canOpenFiles?: boolean;
    canUploadFiles?: boolean;
    canAdmitClients?: boolean;
    canManageCases?: boolean;
    canScheduleAppointments?: boolean;
    canAccessReports?: boolean;
  };
}

export class CreateClientDto {
  @ApiProperty()
  @IsString()
  firstName!: string;

  @ApiProperty()
  @IsString()
  lastName!: string;

  @ApiProperty()
  @IsEmail()
  email!: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  phone?: string;
}

export class UpdatePermissionsDto {
  @ApiProperty()
  @IsObject()
  permissions!: {
    canOpenFiles?: boolean;
    canUploadFiles?: boolean;
    canAdmitClients?: boolean;
    canManageCases?: boolean;
    canScheduleAppointments?: boolean;
    canAccessReports?: boolean;
  };
}