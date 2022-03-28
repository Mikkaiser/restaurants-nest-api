import { Prop, Schema } from "@nestjs/mongoose";

@Schema()
export class Location {

    @Prop({ type: String, enum: ['Point'] })
    type: string;

    @Prop({ index: '2dsphere' })
    coordinates: Number[];


    //The @Prop() decorator defiens a property in the document. Our location is already in the Restaurant Schema
    //so you do not have to type in the Location Schema.
    //it will also work fine if you type @Prop(), if you want to add some additional properties then you can use in those fields also.
    formattedAddress: string;
    city: string;
    state: string;
    zipcode: string;
    country: string;

}