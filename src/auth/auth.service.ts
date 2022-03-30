import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import { SignUpDto } from './dto/signup.dto';
import * as bcrypt from 'bcryptjs';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import APIFeatures from 'src/utils/apiFeatures.utils';


@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User.name)
        private userModel: Model<User>,

        private jwtService: JwtService
    ) {}


    async hashPassword(password: string) : Promise<string> {
        const hashedPassword = await bcrypt.hash(password, 10);

        return hashedPassword;
    }


    async signUp(signUpDto: SignUpDto): Promise<{ token: string }> {
        const { name, email, password } = signUpDto;

        try {
            const user = await this.userModel.create({
                name,
                email,
                password: await this.hashPassword(password)
            });
            
            const token = await APIFeatures.assignJwtToken(user._id, this.jwtService);

            return { token };
        }
        catch (error) {
            if(error.code == 11000)
                throw new ConflictException('Duplicated email entered.');
        }

    }

    async login(loginDto: LoginDto) : Promise<{ token: string }> {
        const { email, password } = loginDto;

        // The '+' symbol is used to say "get all the user, including him password"
        // if the query don´t have the '+', only the password will be captured from user object
        
        const user = await this.userModel.findOne({ email }).select('+password');
        console.log(user);
        const isPasswordMatched = await bcrypt.compare(password, user.password);

        if(!user || !isPasswordMatched)
            throw new UnauthorizedException('Invalid email address or password');

        const token = await APIFeatures.assignJwtToken(user._id, this.jwtService);

        return { token };
    }
}
