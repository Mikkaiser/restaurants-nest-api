import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { RestaurantsService } from './restaurants.service';
import { Restaurant } from './schemas/restaurant.schema';
import { Query as ExpressQuery } from 'express-serve-static-core';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';

@Controller('restaurants')
export class RestaurantsController {


    constructor(private restaurantsService: RestaurantsService) {}

    @Get()
    async findAll(@Query() query: ExpressQuery): Promise<Restaurant[]> {
        return this.restaurantsService.findAll(query);
    }

    @Get(':id')
    async findById(@Param('id') id: string): Promise<Restaurant> {
        return this.restaurantsService.findById(id);
    }

    @Post()
    async create(@Body() restaurant: CreateRestaurantDto): Promise<Restaurant> {
        return this.restaurantsService.create(restaurant);
    }

    @Put(':id')
    async update(
        @Param('id') id: string,
        @Body() restaurant: UpdateRestaurantDto
    ): Promise<Restaurant> {

        await this.restaurantsService.findById(id);
        return this.restaurantsService.update(id, restaurant);

    }

    @Delete(':id')
    async delete(@Param('id') id: string): Promise<{deleted: Boolean}> {
        await this.restaurantsService.findById(id);

        const restaurant = this.restaurantsService.delete(id);

        if(restaurant) {
            return {deleted: true}
        }
    }


    @Put('upload/:id')
    @UseInterceptors(FilesInterceptor('files'))
    async uploadFiles(
        @Param('id') id : string,
        @UploadedFiles() files: Array<Express.Multer.File>
    ) {

        await this.restaurantsService.findById(id);

        const res = await this.restaurantsService.uploadImages(id, files)
        return res;
    }
    
}
