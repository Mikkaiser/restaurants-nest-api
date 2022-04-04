import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "aws-sdk/clients/acm";
import mongoose from "mongoose";

export enum UserRoles {
    ADMIN='admin',
    USER='user',
}

@Schema()
export class User {

    @Prop({ type: mongoose.Schema.Types.ObjectId })
    _id: mongoose.Schema.Types.ObjectId;

    @Prop()
    name: string;

    @Prop({ unique: [true, 'Duplicated email entered'] })
    email: string;

    @Prop({ select: false })
    password: string;

    @Prop({
        enum: UserRoles,
        default: UserRoles.USER
    })
    role: UserRoles;
}


export const UserSchema = SchemaFactory.createForClass(User);