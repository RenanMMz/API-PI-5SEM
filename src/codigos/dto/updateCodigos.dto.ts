import { PartialType } from '@nestjs/mapped-types';
import { CreateCodigoDTO } from './createCodigos.dto';

export class UpdateCodigoDto extends PartialType(CreateCodigoDTO) {}