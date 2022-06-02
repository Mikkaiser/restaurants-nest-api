import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Restaurant } from '../restaurants/schemas/restaurant.schema';
import { User } from '../auth/schemas/user.schema';
import { CreateMealDto } from './dto/create-meal.dto';
import { UpdateMealDto } from './dto/update-meal.dto';
import { Meal } from './schemas/meal.schema';

@Injectable()
export class MealService {
  constructor(
    @InjectModel(Meal.name)
    private mealModel: mongoose.Model<Meal>,

    @InjectModel(Restaurant.name)
    private restaurantModel: mongoose.Model<Restaurant>,
  ) {}

  async create(meal: CreateMealDto, user: User): Promise<Meal> {
    const data = Object.assign(meal, { user: user._id });

    const restaurant = await this.restaurantModel.findById(meal.restaurant);

    if (!restaurant)
      throw new NotFoundException('Restaurant not found with this ID');

    if (restaurant.user.toString() !== user._id.toString())
      throw new ForbiddenException('You cannot add a meal to this restaurant');

    const mealCreated = await this.mealModel.create(data);

    restaurant.menu.push(mealCreated.id);

    await restaurant.save();

    return mealCreated;
  }

  async findAll(): Promise<Meal[]> {
    return await this.mealModel.find();
  }

  async findAllByRestaurant(restaurantId: string): Promise<Meal[]> {
    return await this.mealModel.find({ restaurant: restaurantId });
  }

  async findById(id: string): Promise<Meal> {
    const isValidId = mongoose.isValidObjectId(id);

    if (!isValidId) throw new BadRequestException('Wrong mongoose ID error');

    const mealFound = await this.mealModel.findById(id);

    if (!mealFound) throw new NotFoundException('Meal not found.');

    return mealFound;
  }

  async updateById(id: string, meal: UpdateMealDto): Promise<Meal> {
    return await this.mealModel.findByIdAndUpdate(id, meal, {
      new: true,
      runValidators: true,
    });
  }

  async deleteById(id: string): Promise<{ deleted: boolean }> {
    const meal = await this.mealModel.findByIdAndDelete(id);

    if (meal) return { deleted: true };
    return { deleted: false };
  }
}
