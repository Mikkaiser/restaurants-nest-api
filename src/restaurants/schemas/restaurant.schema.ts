import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Location } from "./location.schema";


export enum Category {
    FAST_FOOD='Fast Food',
    CAFE='Cafe',
    FINE_DINNING='Fine Dinning',
}

@Schema()
export class Restaurant {

    @Prop()
    name: string;

    @Prop()
    description: string;

    @Prop()
    email: string;

    @Prop()
    phoneNo: string;

    @Prop()
    address: string;

    @Prop()
    category: Category;

    @Prop()
    images?: object[];

    @Prop({ type: Object, ref: 'Location' })
    location?: Location

}

export const RestaurantSchema = SchemaFactory.createForClass(Restaurant);