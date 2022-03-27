import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Restaurant } from './schemas/restaurant.schema';
import { Query } from 'express-serve-static-core';

@Injectable()
export class RestaurantsService {

    constructor(
        @InjectModel(Restaurant.name)
        private restaurantModel: mongoose.Model<Restaurant>
    ) {}


    async findAll(query: Query) : Promise<Restaurant[]> {

        const keyword = query.keyword ? {
            name: {
                $regex: query.keyword,
                $options: 'i'
            }
        } : {};

        return await this.restaurantModel.find({ ...keyword });
    }

    async findById(id: string) : Promise<Restaurant> {
        const restaurant = await this.restaurantModel.findById(id);

        if(!restaurant) 
            throw new NotFoundException('Restaurant not found');

        return restaurant;
    }

    async create(restaurant: Restaurant) : Promise<Restaurant> {
        return await this.restaurantModel.create(restaurant);
    }

    async update(id: string, restaurant: Restaurant) : Promise<Restaurant> {
        return await this.restaurantModel.findByIdAndUpdate(id, restaurant, 
            {
                new: true,
                runValidators: true
            });
    }

    async delete(id: string) : Promise<Restaurant> {
        return this.restaurantModel.findByIdAndDelete(id);
    }

}
