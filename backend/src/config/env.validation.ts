import { IsString, IsNumber, IsOptional, validateSync } from 'class-validator';
import { plainToClass, Transform } from 'class-transformer';

export class EnvironmentVariables {
  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  PORT?: number = 5000;

  @IsString()
  MONGODB_URI: string = '';

  @IsString()
  JWT_SECRET: string = '';

  @IsString()
  @IsOptional()
  JWT_EXPIRE?: string = '30d';

  @IsString()
  @IsOptional()
  EMAIL_HOST?: string;

  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  EMAIL_PORT?: number = 587;

  @IsString()
  @IsOptional()
  EMAIL_USER?: string;

  @IsString()
  @IsOptional()
  EMAIL_PASS?: string;

  @IsString()
  @IsOptional()
  CLOUDINARY_CLOUD_NAME?: string;

  @IsString()
  @IsOptional()
  CLOUDINARY_API_KEY?: string;

  @IsString()
  @IsOptional()
  CLOUDINARY_API_SECRET?: string;

  @IsString()
  @IsOptional()
  MPESA_CONSUMER_KEY?: string;

  @IsString()
  @IsOptional()
  MPESA_CONSUMER_SECRET?: string;

  @IsString()
  @IsOptional()
  MPESA_SHORTCODE?: string;

  @IsString()
  @IsOptional()
  MPESA_PASSKEY?: string;

  @IsString()
  @IsOptional()
  MPESA_ENVIRONMENT?: string = 'sandbox';
}

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToClass(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });
  const errors = validateSync(validatedConfig, { skipMissingProperties: false });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }
  return validatedConfig;
}