import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { MealService } from './meal.service';
import { CreateMealDto } from './dto/create-meal.dto';
import { UpdateMealDto } from './dto/update-meal.dto';
import { Meal } from './schemas/meal.schema';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../auth/schemas/user.schema';
import { AuthGuard } from '@nestjs/passport';

@Controller('meal')
export class MealController {
  constructor(private readonly mealService: MealService) {}

  @Post()
  @UseGuards(AuthGuard())
  async create(
    @Body() createMealDto: CreateMealDto,
    @CurrentUser() user: User
  ) : Promise<Meal>{
    return await this.mealService.create(createMealDto, user);
  }

  @Get()
  async findAll() : Promise<Meal[]> {
    return await this.mealService.findAll();
  }

  @Get('restaurant/:id')
  findAllByRestaurant(@Param('id') restaurantId: string) : Promise<Meal[]> {
    return this.mealService.findAllByRestaurant(restaurantId);
  }

  @Get(':id')
  async findById(@Param('id') id: string) : Promise<Meal> {
    return await this.mealService.findById(id);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateMealDto: UpdateMealDto) {
  //   return this.mealService.update(+id, updateMealDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.mealService.remove(+id);
  // }
}
