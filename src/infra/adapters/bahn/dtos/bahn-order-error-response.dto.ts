import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class BahnOrderErrorResponseDTO {
  /** Order index returned by Bahn */
  @IsNumber()
  orderIndex: number;

  /** Indicates if the order was successfully created */
  @IsBoolean()
  success: boolean;

  /** Array of errors (only present when success is false) */
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BahnOrderErrorDTO)
  errors?: BahnOrderErrorDTO[];
}

export class BahnOrderErrorDTO {
  /** Order index from error */
  @IsNumber()
  orderIndex: number;

  /** Order number from error */
  @IsString()
  @IsNotEmpty()
  orderNumber: string;

  /** Error message */
  @IsString()
  @IsNotEmpty()
  error: string;
}
