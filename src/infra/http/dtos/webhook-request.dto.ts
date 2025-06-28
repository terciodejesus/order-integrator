import { IsISO8601, IsObject, IsString } from 'class-validator';

export class WebhookRequestDto {
  @IsString()
  type: string;

  @IsISO8601()
  timestamp: string;

  @IsObject()
  data: Record<string, string>;
}
