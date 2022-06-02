import { NotFoundException } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import mongoose from 'mongoose';
import { NotFoundError } from 'rxjs';
import { UserRoles } from '../auth/schemas/user.schema';
import { Restaurant } from '../restaurants/schemas/restaurant.schema';
import { MealService } from './meal.service';
import { Category, Meal, MealSchema } from './schemas/meal.schema';

describe('MealService', () => {
  let mealService: MealService;
  let mealModel: mongoose.Model<Meal>;
  let restaurantModel: mongoose.Model<Restaurant>;

  const userMock = {
    _id: '62958e1eef302df04744b00b',
    name: 'Test',
    email: 'test@test.com',
    password: 'test1234',
    role: UserRoles.USER,
  };

  const mockMeal = {
    _id: '62958e1eef302df04744b00b',
    name: 'Food3',
    description: 'Simple description 2 kkkk',
    price: 200.99,
    category: Category.PASTA,
    restaurant: '6259d584a0ad9310af33220f',
    user: '6259d563a0ad9310af33220a',
    createdAt: '2022-05-31T03:40:14.963Z',
    updatedAt: '2022-05-31T03:40:14.963Z',
  };

  const mealList = [
    {
      _id: '62958e1eef302df04744b00b',
      name: 'Food3',
      description: 'Simple description 2 kkkk',
      price: 200.99,
      category: 'Pasta',
      restaurant: '6259d584a0ad9310af33220f',
      user: '6259d563a0ad9310af33220a',
      createdAt: '2022-05-31T03:40:14.963Z',
      updatedAt: '2022-05-31T03:40:14.963Z',
    },
    {
      _id: '62958e2bef302df04744b010',
      name: 'Food3',
      description: 'Simple description 2 kkkk',
      price: 200.99,
      category: 'Pasta',
      restaurant: '6259d584a0ad9310af33220f',
      user: '6259d563a0ad9310af33220a',
      createdAt: '2022-05-31T03:40:27.635Z',
      updatedAt: '2022-05-31T03:40:27.635Z',
    },
    {
      _id: '62958e2cef302df04744b015',
      name: 'Food3',
      description: 'Simple description 2 kkkk',
      price: 200.99,
      category: 'Pasta',
      restaurant: '6259d584a0ad9310af33220f',
      user: '6259d563a0ad9310af33220a',
      createdAt: '2022-05-31T03:40:28.381Z',
      updatedAt: '2022-05-31T03:40:28.381Z',
    },
    {
      _id: '62958e2def302df04744b01a',
      name: 'Food3',
      description: 'Simple description 2 kkkk',
      price: 200.99,
      category: 'Pasta',
      restaurant: '6259d584a0ad9310af33220f',
      user: '6259d563a0ad9310af33220a',
      createdAt: '2022-05-31T03:40:29.258Z',
      updatedAt: '2022-05-31T03:40:29.258Z',
    },
  ];

  //dependence injection
  const mockRepository = {
    //No async items should be mocked using mockReturnValue();
    create: jest.fn().mockResolvedValue(mockMeal),
    find: jest.fn().mockResolvedValue(mealList),
    findById: jest.fn().mockResolvedValue(mockMeal),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MealService,
        {
          provide: getModelToken(Meal.name),
          useValue: mockRepository, //dependence injection
        },
        {
          provide: getModelToken(Restaurant.name),
          useValue: mockRepository, //dependence injection
        },
      ],
    }).compile();

    mealService = module.get<MealService>(MealService);
    mealModel = module.get<mongoose.Model<Meal>>(getModelToken(Meal.name));
    restaurantModel = module.get<mongoose.Model<Restaurant>>(
      getModelToken(Restaurant.name),
    );
  });

  it('should be defined', () => {
    expect(mealService).toBeDefined();
    expect(mealModel).toBeDefined();
  });

  describe('findAll', () => {
    it('should return meals list', async () => {
      const result = await mealService.findAll();

      expect(result).toEqual(mealList);
      expect(mealModel.find).toHaveBeenCalledTimes(1);
    });

    it('should return an exception on findAll()', () => {
      jest.spyOn(mealModel, 'find').mockRejectedValueOnce(new Error());

      const result = mealService.findAll();

      expect(result).rejects.toThrowError();
    });
  });

  describe('findOne', () => {
    it('should return a unique meal on findById', async () => {
      const result = await mealService.findById(mockMeal._id);
      expect(result).toEqual(mockMeal);
      expect(mealModel.findById).toHaveBeenCalledTimes(1);
    });

    it('should throw a not found exception on findById', () => {
      jest
        .spyOn(mealModel, 'findById')
        .mockRejectedValueOnce(new NotFoundException('Meal not found'));

      expect(mealService.findById(mockMeal._id)).rejects.toThrowError(
        NotFoundException,
      );
    });
  });

  describe('create', () => {
    it('should create a new meal successfully', async () => {
      jest.fn(restaurantModel, 'findOne').mockResolvedValueOnce();

      const { _id, ...mockCreateDto } = mockMeal;
      const result = await mealService.create(
        mockCreateDto as any,
        userMock as any,
      );

      expect(result).toEqual(mockMeal);
    });
  });
});
