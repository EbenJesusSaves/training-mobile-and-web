import { Transform, Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsEmail,
  IsEnum,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Length,
  Max,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';

import { SegmentDirection, TravelClass, TripType } from '../../generated/prisma/enums.js';

const trim = ({ value }: { value: unknown }) => (typeof value === 'string' ? value.trim() : value);

export class SeatSelectionDto {
  @IsInt()
  @Min(1)
  carNumber!: number;

  @IsInt()
  @Min(1)
  seatNumber!: number;
}

export class SegmentSelectionDto {
  @IsUUID('4')
  journeyId!: string;

  @IsEnum(TravelClass)
  travelClass!: TravelClass;

  @IsEnum(SegmentDirection)
  direction!: SegmentDirection;

  @IsArray()
  @ArrayMinSize(1, { message: 'Choose at least one seat.' })
  @ArrayMaxSize(6, { message: 'You can book up to 6 seats at a time.' })
  @ValidateNested({ each: true })
  @Type(() => SeatSelectionDto)
  seats!: SeatSelectionDto[];
}

export class AddOnSelectionDto {
  @IsString()
  @MaxLength(40)
  code!: string;

  @IsInt()
  @Min(0)
  @Max(6)
  quantity!: number;
}

export class PassengerDto {
  @Transform(trim)
  @IsString()
  @Length(2, 80, { message: 'Enter the passenger’s full name.' })
  fullName!: string;
}

export class QuoteBookingDto {
  @IsEnum(TripType)
  tripType!: TripType;

  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(2)
  @ValidateNested({ each: true })
  @Type(() => SegmentSelectionDto)
  segments!: SegmentSelectionDto[];

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(10)
  @ValidateNested({ each: true })
  @Type(() => AddOnSelectionDto)
  addOns?: AddOnSelectionDto[];
}

export class CreateBookingDto extends QuoteBookingDto {
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(6)
  @ValidateNested({ each: true })
  @Type(() => PassengerDto)
  passengers!: PassengerDto[];

  @IsOptional()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim().toLowerCase() : value))
  @IsEmail({}, { message: 'Enter a valid email for your tickets.' })
  contactEmail?: string;
}

export class ListBookingsQueryDto {
  @IsOptional()
  @IsIn(['upcoming', 'past'])
  scope?: 'upcoming' | 'past';
}
