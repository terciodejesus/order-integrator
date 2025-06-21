import { IsNotEmpty, IsString } from 'class-validator';

export class BahnLoginResponseDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  token: string;
}
