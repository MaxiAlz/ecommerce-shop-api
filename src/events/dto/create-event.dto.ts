import { IsIn, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateEventDto {
  @IsString()
  @MinLength(1)
  title: string;

  @IsString()
  @MinLength(1)
  description: string;

  @IsString()
  @IsOptional()
  slug?: string;

  @IsString({ each: true })
  @IsOptional()
  @IsIn(['+18', 'ATP'])
  publicType?: string;

  @IsString()
  @IsOptional()
  adress_desciption?: string;
}
