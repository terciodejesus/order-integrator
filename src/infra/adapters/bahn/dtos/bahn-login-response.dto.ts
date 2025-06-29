import { IsNotEmpty, IsString } from 'class-validator';

export class BahnLoginResponseDTO {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  token: string;
}
