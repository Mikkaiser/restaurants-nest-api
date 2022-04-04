import { IsEmail, IsEmpty, IsEnum, IsNotEmpty, IsPhoneNumber, IsString, isValidationOptions } from "class-validator";
import { User } from "../../auth/schemas/user.schema";
import { Category } from "../schemas/restaurant.schema";

export class CreateRestaurantDto {

    @IsNotEmpty()
    @IsString()
    readonly name: string;

    @IsNotEmpty()
    @IsString()
    readonly description: string;

    @IsNotEmpty()
    @IsEmail({}, { message: 'Please, enter a correct email format' })
    readonly email: string;

    @IsNotEmpty()
    @IsPhoneNumber('BR')
    readonly phoneNo: string;
    
    @IsNotEmpty()
    @IsString()
    readonly address: string;
    
    @IsNotEmpty()
    @IsEnum(Category, { message: 'Please, enter the correct category' })
    readonly category: Category;

    @IsEmpty({ message: 'You cannot provide the user ID' })
    readonly user: User

}