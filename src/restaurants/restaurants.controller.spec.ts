import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { Test, TestingModule } from '@nestjs/testing';
import { RestaurantsService } from './restaurants.service';
import { RestaurantsController } from './restaurants.controller';
import { PassportModule } from '@nestjs/passport';
import { User, UserRoles } from '../auth/schemas/user.schema';
import { Category } from './schemas/restaurant.schema';

const mockRestaurant = {
  _id: '6259d584a0ad9310af33220f',
  name: 'Mikkaiser',
  description: 'This is just a description',
  email: 'ghulam@gamil.com',
  phoneNo: '824777776',
  address: '75 Middlesex Turnpike, Burlington, MA 01803',
  category: 'Fast Food',
  images: [],
  location: {
    type: 'Point',
    coordinates: [-71.2148, 42.4823],
    formattedAddress: '75 Middlesex Tpke, Burlington, MA 01803, US',
    city: 'Burlington',
    state: 'MA',
    zipcode: '01803',
    country: 'US',
  },
  user: '6259d584a0ad9310af33220f',
  menu: ['6259d59da0ad9310af332213'],
  createdAt: '2022-04-15T20:28:52.727Z',
  updatedAt: '2022-04-15T20:29:17.036Z',
};

const mockUser = {
  _id: '6259d584a0ad9310af33220f',
  email: 'mikaelrsimoes19@gmail.com',
  name: 'Mikkaiser',
  role: UserRoles.USER,
};

const mockRestaurantService = {
  findAll: jest.fn().mockResolvedValue([mockRestaurant]),
  create: jest.fn().mockResolvedValue(mockRestaurant),
  findById: jest.fn().mockResolvedValue(mockRestaurant),
  update: jest.fn().mockResolvedValue(mockRestaurant),
};

describe('RestaurantsController', () => {
  let controller: RestaurantsController;
  let service: RestaurantsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PassportModule.register({ defaultStrategy: 'jwt' })],
      controllers: [RestaurantsController],
      providers: [
        {
          provide: RestaurantsService,
          useValue: mockRestaurantService,
        },
      ],
    }).compile();

    controller = module.get<RestaurantsController>(RestaurantsController);
    service = module.get<RestaurantsService>(RestaurantsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('getAllRestaurants', () => {
    it('should get all restaurants', async () => {
      const result = await controller.findAll({ keyword: 'Restaurant' });

      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual([mockRestaurant]);
    });
  });

  describe('createRestaurant', () => {
    it('should create a new restaurant', async () => {
      const newRestaurant = {
        name: 'Mikkaiser',
        description: 'This is just a description',
        email: 'ghulam@gamil.com',
        phoneNo: '824777776',
        address: '75 Middlesex Turnpike, Burlington, MA 01803',
        category: Category.FAST_FOOD,
      };

      const result = await controller.create(
        newRestaurant as CreateRestaurantDto,
        mockUser as User,
      );

      expect(service.create).toHaveBeenCalled();
      expect(result).toEqual(mockRestaurant);
    });
  });

  describe('findById', () => {
    it('should return a single restaurant by ID', async () => {
      const result = await controller.findById(mockRestaurant._id);

      expect(service.findById).toHaveBeenCalled();
      expect(result).toEqual(mockRestaurant);
    });
  });

  describe('updateById', () => {
    it('should return a single restaurant by ID', async () => {
      const restaurant = {
        ...mockRestaurant,
        name: 'Updated name',
        description: 'Updated description',
      };

      const updatedItems = {
        name: 'Updated name',
        description: 'Updated description',
      };

      jest.spyOn(service, 'update').mockResolvedValueOnce(restaurant as any);

      const result = await controller.update(
        restaurant._id,
        updatedItems as any,
        mockUser as any,
      );

      expect(service.update).toHaveBeenCalled();
      expect(result).toEqual(restaurant);
      expect(result.name).toEqual(restaurant.name);
    });
  });
});
