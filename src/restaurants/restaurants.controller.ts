import { Body,
         Controller,
         Delete,
         Get,
         Param,
         ParseIntPipe,
         Post,
         Put,
         Query,
         Req,
         UploadedFiles, 
         UseGuards, 
         UseInterceptors 
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

@Controller('restaurants')
export class RestaurantsController {


    constructor(private restaurantsService: RestaurantsService) {}

    @Get()
    async findAll(
        @Query() query: ExpressQuery,
    ): Promise<Restaurant[]> {
        return this.restaurantsService.findAll(query);
    }

    @Get(':id')
    async findById(@Param('id') id: string): Promise<Restaurant> {
        return this.restaurantsService.findById(id);
    }

    @Post()
    @UseGuards(AuthGuard())
    async create(@Body() restaurant: CreateRestaurantDto, @CurrentUser() user: User): Promise<Restaurant> {
        return this.restaurantsService.create(restaurant, user);
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
        const restaurant = await this.restaurantsService.findById(id);

        let areImagesDeleted = await this.restaurantsService.deleteImages(restaurant.images);

        if(areImagesDeleted) {
            this.restaurantsService.delete(id);
            return {deleted: true}
        }
        else {
            return { deleted: false }
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
