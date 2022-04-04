import { IsEmail, IsEmpty, IsNotEmpty, IsString, MinLength } from "class-validator";
import mongoose from "mongoose";

export class SignUpDto {

    @IsString()
    @IsNotEmpty()
    readonly name: string;
    
    @IsString()
    @IsEmail({}, { message: 'Please enter correct email address' })
    readonly email: string;
    
    @IsString()
    @IsNotEmpty()
    @MinLength(8)
    readonly password: string;
}