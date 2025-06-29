import { IsObject, IsString } from 'class-validator';

export class CreateWebhookRequestDTO {
  @IsString()
  type: string;

  @IsObject()
  data: Record<string, string>;

  @IsString()
  timestamp: string;
}
