import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Restaurant } from '../restaurants/schemas/restaurant.schema';
import { User } from '../auth/schemas/user.schema';
import { CreateMealDto } from './dto/create-meal.dto';
import { UpdateMealDto } from './dto/update-meal.dto';
import { Meal } from './schemas/meal.schema';
import { NotFoundError } from 'rxjs';

@Injectable()
export class MealService {

  constructor(
    @InjectModel(Meal.name)
    private mealModel: mongoose.Model<Meal>,

    @InjectModel(Restaurant.name)
    private restaurantModel: mongoose.Model<Restaurant>,
  ) {}

  async create(meal: Meal, user: User) : Promise<Meal> {
    const data = Object.assign(meal, { user: user._id });

    const restaurant = await this.restaurantModel.findById(meal.restaurant);

    if(!restaurant)
      throw new NotFoundException('Restaurant not found with this ID')

    const mealCreated = await this.mealModel.create(data);

    //continue


  }

  findAll() {
    return `This action returns all meal`;
  }

  findOne(id: number) {
    return `This action returns a #${id} meal`;
  }

  update(id: number, updateMealDto: UpdateMealDto) {
    return `This action updates a #${id} meal`;
  }

  remove(id: number) {
    return `This action removes a #${id} meal`;
  }
}
