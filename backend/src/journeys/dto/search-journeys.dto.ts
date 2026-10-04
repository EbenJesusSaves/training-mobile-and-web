import { Type } from 'class-transformer';
import { IsIn, IsInt, IsOptional, IsUUID, Matches, Max, Min } from 'class-validator';

export const JOURNEY_SORTS = ['fastest', 'earliest', 'cheapest'] as const;
export type JourneySort = (typeof JOURNEY_SORTS)[number];

export class SearchJourneysDto {
  @IsUUID('4', { message: 'Choose a departure station.' })
  originId!: string;

  @IsUUID('4', { message: 'Choose an arrival station.' })
  destinationId!: string;

  @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: 'Date must use the YYYY-MM-DD format.' })
  date!: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(6)
  passengers?: number;

  @IsOptional()
  @IsIn(JOURNEY_SORTS)
  sort?: JourneySort;
}
