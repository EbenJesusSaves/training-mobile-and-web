import { PartialType } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsDateString,
  IsEnum,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Length,
  Matches,
  Max,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';

import { BookingStatus, JourneyStatus, TravelClass } from '../../generated/prisma/enums.js';
import { PaginationQueryDto } from './pagination.dto.js';

const trim = ({ value }: { value: unknown }) => (typeof value === 'string' ? value.trim() : value);
const upper = ({ value }: { value: unknown }) => (typeof value === 'string' ? value.trim().toUpperCase() : value);

export class CreateStationDto {
  @Transform(upper)
  @Matches(/^[A-Z]{3}$/, { message: 'Station code must be 3 letters, e.g. ACC.' })
  code!: string;

  @Transform(trim)
  @IsString()
  @Length(2, 60)
  name!: string;

  @Transform(trim)
  @IsString()
  @Length(2, 60)
  city!: string;

  @IsOptional()
  @Transform(trim)
  @IsString()
  @MaxLength(140)
  address?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
export class UpdateStationDto extends PartialType(CreateStationDto) {}

export class CreateRouteDto {
  @IsUUID('4')
  originId!: string;

  @IsUUID('4')
  destinationId!: string;

  @IsInt()
  @Min(1)
  @Max(2000)
  distanceKm!: number;

  @IsInt()
  @Min(100, { message: 'Fares are entered in pesewas and must be at least GH₵1.00.' })
  defaultFirstClassFareCents!: number;

  @IsInt()
  @Min(100, { message: 'Fares are entered in pesewas and must be at least GH₵1.00.' })
  defaultSecondClassFareCents!: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsBoolean()
  createReturnRoute?: boolean;
}

export class UpdateRouteDto {
  @IsOptional() @IsInt() @Min(1) @Max(2000) distanceKm?: number;
  @IsOptional() @IsInt() @Min(100) defaultFirstClassFareCents?: number;
  @IsOptional() @IsInt() @Min(100) defaultSecondClassFareCents?: number;
  @IsOptional() @IsBoolean() isActive?: boolean;
}

export class JourneyCarDto {
  @IsInt()
  @Min(1)
  @Max(99)
  carNumber!: number;

  @IsEnum(TravelClass)
  travelClass!: TravelClass;

  @IsInt()
  @Min(1, { message: 'A car needs at least one compartment.' })
  @Max(12, { message: 'A car can have at most 12 compartments.' })
  compartments!: number;

  @IsOptional()
  @IsBoolean()
  airConditioned?: boolean;
}

export class CreateJourneyDto {
  @IsUUID('4', { message: 'Choose a route.' })
  routeId!: string;

  @Transform(upper)
  @Matches(/^[A-Z+]{1,5}$/, { message: 'Service code is 1–5 letters, e.g. IC or EIC.' })
  serviceCode!: string;

  @Transform(trim)
  @IsString()
  @Length(2, 12)
  trainNumber!: string;

  @Transform(trim)
  @IsString()
  @Length(2, 40)
  trainName!: string;

  @IsDateString({}, { message: 'Enter a valid departure time.' })
  departureAt!: string;

  @IsDateString({}, { message: 'Enter a valid arrival time.' })
  arrivalAt!: string;

  @IsOptional() @IsInt() @Min(100) firstClassFareCents?: number;
  @IsOptional() @IsInt() @Min(100) secondClassFareCents?: number;

  @IsArray()
  @ArrayMinSize(1, { message: 'Add at least one car.' })
  @ArrayMaxSize(16)
  @ValidateNested({ each: true })
  @Type(() => JourneyCarDto)
  cars!: JourneyCarDto[];

  /** Create the same timetable on this many consecutive days (1 = just this departure). */
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(30)
  repeatDays?: number;
}

export class UpdateJourneyDto {
  @IsOptional() @Transform(upper) @Matches(/^[A-Z+]{1,5}$/) serviceCode?: string;
  @IsOptional() @Transform(trim) @IsString() @Length(2, 12) trainNumber?: string;
  @IsOptional() @Transform(trim) @IsString() @Length(2, 40) trainName?: string;
  @IsOptional() @IsDateString() departureAt?: string;
  @IsOptional() @IsDateString() arrivalAt?: string;
  @IsOptional() @IsEnum(JourneyStatus) status?: JourneyStatus;
  @IsOptional() @IsInt() @Min(0) @Max(1440) delayMinutes?: number;
  @IsOptional() @IsInt() @Min(100) firstClassFareCents?: number;
  @IsOptional() @IsInt() @Min(100) secondClassFareCents?: number;

  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(16)
  @ValidateNested({ each: true })
  @Type(() => JourneyCarDto)
  cars?: JourneyCarDto[];
}

export class ListJourneysQueryDto extends PaginationQueryDto {
  @IsOptional() @IsUUID('4') routeId?: string;
  @IsOptional() @IsUUID('4') stationId?: string;
  @IsOptional() @IsEnum(JourneyStatus) status?: JourneyStatus;
  @IsOptional() @Matches(/^\d{4}-\d{2}-\d{2}$/) from?: string;
  @IsOptional() @Matches(/^\d{4}-\d{2}-\d{2}$/) to?: string;
  @IsOptional() @IsIn(['upcoming', 'past', 'all']) when?: 'upcoming' | 'past' | 'all';
}

export class ListBookingsAdminQueryDto extends PaginationQueryDto {
  @IsOptional() @IsEnum(BookingStatus) status?: BookingStatus;
  @IsOptional() @IsUUID('4') journeyId?: string;
  @IsOptional() @IsUUID('4') userId?: string;
}

export class UpdateBookingStatusDto {
  @IsIn(['CONFIRMED', 'CHECKED_IN', 'CANCELLED'])
  status!: 'CONFIRMED' | 'CHECKED_IN' | 'CANCELLED';

  @IsOptional()
  @Transform(trim)
  @IsString()
  @MaxLength(200)
  reason?: string;
}

export class UpdateAddOnDto {
  @IsOptional() @Transform(trim) @IsString() @Length(2, 40) name?: string;
  @IsOptional() @Transform(trim) @IsString() @Length(2, 80) description?: string;
  @IsOptional() @IsInt() @Min(0) @Max(1_000_000) priceCents?: number;
  @IsOptional() @IsBoolean() isActive?: boolean;
}
