// import { Test, TestingModule } from '@nestjs/testing';
// import { RestaurantsService } from './restaurants.service';

import { getModelToken } from "@nestjs/mongoose";
import { Test, TestingModule } from "@nestjs/testing";
import { RestaurantsService } from "./restaurants.service";
import { Restaurant } from "./schemas/restaurant.schema";
import { Model } from 'mongoose';
import { UserRoles } from "../auth/schemas/user.schema";
import APIFeatures from "../utils/apiFeatures.utils";
import mongoose from "mongoose";
import { BadRequestException, NotFoundException } from "@nestjs/common";

const mockRestaurantService = {
  find: jest.fn(),
  create: jest.fn(),
  findById: jest.fn()
}

const mockRestaurant = {
  _id: "6259d584a0ad9310af33220f",
  name: "Mikkaiser",
  description: "This is just a description",
  email: "ghulam@gamil.com",
  phoneNo: "824777776",
  address: "75 Middlesex Turnpike, Burlington, MA 01803",
  category: "Fast Food",
  images: [],
  location: {
      type: "Point",
      coordinates: [
          -71.2148,
          42.4823
      ],
      formattedAddress: "75 Middlesex Tpke, Burlington, MA 01803, US",
      city: "Burlington",
      state: "MA",
      zipcode: "01803",
      country: "US"
  },
  user: "6259d563a0ad9310af33220a",
  menu: [
      "6259d59da0ad9310af332213"
  ],
  createdAt: "2022-04-15T20:28:52.727Z",
  updatedAt: "2022-04-15T20:29:17.036Z",
}

const mockUser = {
  _id: '6259d584a0ad9310af33220f',
  email: 'mikaelrsimoes19@gmail.com',
  name: 'Mikkaiser',
  role: UserRoles.USER
}

describe('RestaurantsService', () => {

  let service: RestaurantsService;
  let model : Model<Restaurant>;

  beforeEach(async () => {
    const module : TestingModule = await Test.createTestingModule({
      providers: [
        RestaurantsService,
        {
          provide: getModelToken(Restaurant.name),
          useValue: mockRestaurantService
        }
      ]
    }).compile();

    service = module.get<RestaurantsService>(RestaurantsService);
    model = module.get<Model<Restaurant>>(getModelToken(Restaurant.name));

  });
  
  it('should be defined', () => {
    expect(service).toBeDefined();
  });


  describe('findAll', () =>  {
    it('should get all restaurants', async () => {
      jest.spyOn(model, 'find').mockImplementationOnce(() => ({
        limit: () => ({
          skip: jest.fn().mockResolvedValue([mockRestaurant]),
        })
      } as any));

      const restaurants = await service.findAll({ keyword: 'Mikkaiser'});

      expect(restaurants).toEqual([mockRestaurant]);
    })
  })

  describe('create', () => {
    const newRestaurant = {
      name: "Mikkaiser",
      description: "This is just a description",
      email: "ghulam@gamil.com",
      phoneNo: "824777776",
      address: "75 Middlesex Turnpike, Burlington, MA 01803",
      category: "Fast Food"
    }

    it('should create a new restaurant', async () => {
      jest.spyOn(APIFeatures, 'getRestaurantLocation')
        .mockImplementationOnce(() => Promise.resolve(mockRestaurant.location));

      jest.spyOn(model, 'create')
        .mockImplementationOnce(() => Promise.resolve(mockRestaurant));

      const result = await service.create(newRestaurant as any, mockUser as any);
      expect(result).toEqual(mockRestaurant);
    })

  })

  describe('findById', () => {
    it('should get restaurant by ID', async () => {
      jest.spyOn(model, 'findById')
        .mockResolvedValueOnce(mockRestaurant as any);

      const result = await service.findById(mockRestaurant._id);
      expect(result).toEqual(mockRestaurant);
    });

    it('should throw wrong mongoose ID error', async () => {
      const result = service.findById('wrongId');
      await expect(result).rejects.toThrow(BadRequestException);
    })

    it('should throw restaurant not found error', async () => {

      jest.spyOn(model, 'findById').mockRejectedValue(new NotFoundException('Restaurant not found'));

      const result = service.findById(mockRestaurant._id);

      expect(result).rejects.toThrow(NotFoundException);
    });
  })

});

