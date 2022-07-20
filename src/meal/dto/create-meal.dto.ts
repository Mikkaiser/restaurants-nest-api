import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmpty,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';
import { User } from '../../auth/schemas/user.schema';
import { Category } from '../schemas/meal.schema';

export class CreateMealDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly description: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  readonly price: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(Category, {
    message: 'Please enter the correct category for this meal',
  })
  readonly category: Category;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly restaurant: string;

  @ApiProperty()
  @IsEmpty({ message: 'You cannot provide a user ID' })
  readonly user: User;
}
