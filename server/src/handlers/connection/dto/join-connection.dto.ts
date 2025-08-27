import { CreateConnectionDto } from '@/src/handlers/connection/dto/create-connection.dto';

export class JoinConnectionDto extends CreateConnectionDto {
  code: string;
}
