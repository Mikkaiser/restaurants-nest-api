import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Put,
  ForbiddenException,
} from '@nestjs/common';
import { MealService } from './meal.service';
import { CreateMealDto } from './dto/create-meal.dto';
import { UpdateMealDto } from './dto/update-meal.dto';
import { Meal } from './schemas/meal.schema';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../auth/schemas/user.schema';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('meals')
@Controller('meal')
export class MealController {
  constructor(private readonly mealService: MealService) {}

  @Post()
  @UseGuards(AuthGuard())
  async create(
    @Body() createMealDto: CreateMealDto,
    @CurrentUser() user: User,
  ): Promise<Meal> {
    return await this.mealService.create(createMealDto, user);
  }

  @Get()
  async findAll(): Promise<Meal[]> {
    return await this.mealService.findAll();
  }

  @Get('restaurant/:id')
  findAllByRestaurant(@Param('id') restaurantId: string): Promise<Meal[]> {
    return this.mealService.findAllByRestaurant(restaurantId);
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<Meal> {
    return await this.mealService.findById(id);
  }

  @Put(':id')
  @UseGuards(AuthGuard())
  async updateById(
    @Param('id') id: string,
    @Body() mealUpdateDto: UpdateMealDto,
    @CurrentUser() user: User,
  ): Promise<Meal> {
    const meal = await this.mealService.findById(id);

    if (meal.user.toString() !== user._id.toString())
      throw new ForbiddenException(
        'You cannot update a meal to this restaurant',
      );

    return await this.mealService.updateById(id, mealUpdateDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard())
  async deleteById(
    @Param('id') id: string,
    @CurrentUser() user: User,
  ): Promise<{ deleted: boolean }> {
    const meal = await this.mealService.findById(id);

    if (meal.user.toString() !== meal.user.toString())
      throw new ForbiddenException(
        'You cannot delete a meal to this restaurant',
      );

    return this.mealService.deleteById(id);
  }
}
