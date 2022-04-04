import { IsEmail, IsEmpty, IsEnum, IsOptional, IsPhoneNumber, IsString } from "class-validator";
import { User } from "../../auth/schemas/user.schema";
import { Category } from "../schemas/restaurant.schema";

export class UpdateRestaurantDto {

    
    @IsOptional()
    @IsString()
    readonly name: string;

    @IsOptional()
    @IsString()
    readonly description: string;

    @IsOptional()
    @IsEmail({}, { message: 'Please, enter a correct email format' })
    readonly email: string;

    @IsPhoneNumber('BR')
    @IsOptional()
    readonly phoneNo: string;

    @IsString()
    @IsOptional()
    readonly address: string;

    @IsEnum(Category, { message: 'Please, enter the correct category' })
    @IsOptional()
    readonly category: Category;

    @IsEmpty({ message: 'You cannot provide the user ID' })
    readonly user: User;

}