import { ApiBody, ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEmpty,
  IsEnum,
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
} from 'class-validator';
import { User } from '../../auth/schemas/user.schema';
import { Category } from '../schemas/restaurant.schema';

export class CreateRestaurantDto {
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
  @IsEmail({}, { message: 'Please, enter a correct email format' })
  readonly email: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsPhoneNumber('BR')
  readonly phoneNo: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly address: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(Category, { message: 'Please, enter the correct category' })
  readonly category: Category;

  @ApiProperty()
  @IsEmpty({ message: 'You cannot provide the user ID' })
  readonly user: User;
}
