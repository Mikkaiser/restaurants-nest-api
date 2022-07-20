import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEmpty,
  IsEnum,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator';
import { User } from '../../auth/schemas/user.schema';
import { Category } from '../schemas/restaurant.schema';

export class UpdateRestaurantDto {
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
  @IsEmail({}, { message: 'Please, enter a correct email format' })
  readonly email: string;

  @ApiProperty()
  @IsPhoneNumber('BR')
  @IsOptional()
  readonly phoneNo: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  readonly address: string;

  @ApiProperty()
  @IsEnum(Category, { message: 'Please, enter the correct category' })
  @IsOptional()
  readonly category: Category;

  @ApiProperty()
  @IsEmpty({ message: 'You cannot provide the user ID' })
  readonly user: User;
}
