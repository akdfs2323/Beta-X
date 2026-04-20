import { IsNotEmpty, IsBoolean, IsOptional, IsString } from 'class-validator';

export class CreateAnnouncementDto {
  @IsString({ message: 'Title must be a string' })
  @IsNotEmpty({ message: 'Title is required' })
  title: string;

  @IsString({ message: 'Body must be a string' })
  @IsNotEmpty({ message: 'Body is required' })
  body: string;

  @IsOptional()
  @IsBoolean({ message: 'Pinned must be a boolean value' })
  pinned?: boolean;
}
