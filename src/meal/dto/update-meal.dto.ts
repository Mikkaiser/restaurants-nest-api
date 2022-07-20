import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmpty,
  IsEnum,
  IsOptional,
  IsNumber,
  IsString,
} from 'class-validator';
import { User } from '../../auth/schemas/user.schema';
import { Category } from '../schemas/meal.schema';

export class UpdateMealDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  readonly name: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  readonly description: string;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  readonly price: number;

  @ApiProperty()
  @IsOptional()
  @IsEnum(Category, {
    message: 'Please enter the correct category for this meal',
  })
  readonly category: Category;

  @ApiProperty()
  @IsOptional()
  @IsString()
  readonly restaurant: string;

  @ApiProperty()
  @IsEmpty({ message: 'You cannot provide a user ID' })
  readonly user: User;
}
