import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Req,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { RestaurantsService } from './restaurants.service';
import { Restaurant } from './schemas/restaurant.schema';
import { Query as ExpressQuery } from 'express-serve-static-core';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../auth/schemas/user.schema';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { ApiTags } from '@nestjs/swagger';
@ApiTags('restaurants')
@Controller('restaurants')
export class RestaurantsController {
  constructor(private restaurantsService: RestaurantsService) {}

  @Get()
  @UseGuards(AuthGuard())
  async findAll(@Query() query: ExpressQuery): Promise<Restaurant[]> {
    return this.restaurantsService.findAll(query);
  }

  @Get(':id')
  @UseGuards(AuthGuard())
  async findById(@Param('id') id: string): Promise<Restaurant> {
    return this.restaurantsService.findById(id);
  }

  @Post()
  @UseGuards(AuthGuard(), RolesGuard)
  @Roles('admin', 'user')
  async create(
    @Body() restaurant: CreateRestaurantDto,
    @CurrentUser() user: User,
  ): Promise<Restaurant> {
    return this.restaurantsService.create(restaurant, user);
  }

  @Put(':id')
  @UseGuards(AuthGuard())
  async update(
    @Param('id') id: string,
    @Body() restaurant: UpdateRestaurantDto,
    @CurrentUser() user: User,
  ): Promise<Restaurant> {
    const restaurantFound = await this.restaurantsService.findById(id);

    if (restaurantFound.user.toString() !== user._id.toString())
      throw new ForbiddenException('You cannot update this restaurant.');

    return this.restaurantsService.update(id, restaurant);
  }

  @Delete(':id')
  @UseGuards(AuthGuard())
  async delete(@Param('id') id: string): Promise<{ deleted: boolean }> {
    try {
      const restaurant = await this.restaurantsService.findById(id);

      if (restaurant.images.length !== 0) {
        await this.restaurantsService.deleteImages(restaurant.images);
      }

      await this.restaurantsService.delete(id);
      return { deleted: true };
    } catch (error) {
      return { deleted: false };
    }
  }

  @Put('upload/:id')
  @UseInterceptors(FilesInterceptor('files'))
  @UseGuards(AuthGuard())
  async uploadFiles(
    @Param('id') id: string,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    await this.restaurantsService.findById(id);

    const res = await this.restaurantsService.uploadImages(id, files);
    return res;
  }
}
