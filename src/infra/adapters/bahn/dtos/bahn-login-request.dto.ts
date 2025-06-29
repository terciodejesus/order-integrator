import { IsNotEmpty, IsString } from 'class-validator';

export class BahnLoginRequestDTO {
  @IsString()
  @IsNotEmpty()
  userName: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
