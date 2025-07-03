import { ApiProperty } from '@nestjs/swagger';

export class CreateOrderSuccessResponseDTO {
  @ApiProperty({ 
    example: 'success',
    description: 'Status da operação',
    enum: ['success']
  })
  status: string;

  @ApiProperty({ 
    example: 'Pedido criado com sucesso',
    description: 'Mensagem de confirmação' 
  })
  message: string;
}

export class CreateOrderErrorResponseDTO {
  @ApiProperty({ 
    example: 400,
    description: 'Código de status HTTP' 
  })
  statusCode: number;

  @ApiProperty({ 
    example: 'Dados inválidos fornecidos',
    description: 'Mensagem de erro' 
  })
  message: string;

  @ApiProperty({ 
    example: 'Bad Request',
    description: 'Tipo do erro' 
  })
  error: string;
}

export class ValidationErrorResponseDTO {
  @ApiProperty({ 
    example: 400,
    description: 'Código de status HTTP' 
  })
  statusCode: number;

  @ApiProperty({ 
    example: ['orderNumber should not be empty', 'email must be an email'],
    description: 'Lista de erros de validação',
    type: [String]
  })
  message: string[];

  @ApiProperty({ 
    example: 'Bad Request',
    description: 'Tipo do erro' 
  })
  error: string;
} 