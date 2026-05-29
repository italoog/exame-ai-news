import { IsEmail } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class SubscribeNewsletterDto {
  @ApiProperty({ example: 'leitor@email.com' })
  @IsEmail({}, { message: 'E-mail inválido' })
  email: string
}
