import { Category } from "../schemas/restaurant.schema";

export class UpdateRestaurantDto {

    readonly name: string;
    readonly description: string;
    readonly email: string;
    readonly phoneNo: string;
    readonly address: string;
    readonly category: Category;
    readonly images?: object[];

}