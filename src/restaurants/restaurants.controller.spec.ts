import { ForbiddenException } from '@nestjs/common';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { Test, TestingModule } from '@nestjs/testing';
import { RestaurantsService } from './restaurants.service';
import { RestaurantsController } from './restaurants.controller';
import { PassportModule } from '@nestjs/passport';
import { User, UserRoles } from '../auth/schemas/user.schema';
import { Category } from './schemas/restaurant.schema';

const mockImages = [
  {
    ETag: '"7047246c606a7f07b31a98fb24aab8ed"',
    Location:
      'https://nestjs-restaurants-api.s3.amazonaws.com/restaurants/image_1653446257183.png',
    key: 'restaurants/image_1653446257183.png',
    Key: 'restaurants/image_1653446257183.png',
    Bucket: 'nestjs-restaurants-api',
  },
];

const mockFiles = [
  {
    fieldname: 'files',
    originalname: 'image.png',
    encoding: '7bit',
    mimetype: 'image/png',
    buffer:
      '<Buffer 89 50 4e 47 0d 0a 1a 0a 00 00 00 0d 49 48 44 52 00 00 01 62 00 00 00 a6 08 06 00 00 00 e0 52 85 6c 00 00 00 04 73 42 49 54 08 08 08 08 7c 08 64 88 00 ... 21153 more bytes>',
    size: 21203,
  },
];

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
  delete: jest.fn().mockResolvedValue(mockRestaurant),
  deleteImages: jest.fn().mockResolvedValue(true),
  uploadImages: jest.fn(),
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

    it('should throw a forbidden exception', async () => {
      const user = {
        ...mockUser,
        _id: '6259d59da0ad9310af332213',
      };

      const result = controller.update(
        mockRestaurant._id,
        mockRestaurant as any,
        user as any,
      );

      expect(result).rejects.toThrow(ForbiddenException);
    });
  });

  describe('deleteRestaurant', () => {
    it('should delete restaurant by ID', async () => {
      const result = await controller.delete(
        mockRestaurant._id,
        mockUser as any,
      );

      expect(service.deleteImages).toHaveBeenCalled();
      expect(service.delete).toHaveBeenCalled();
      expect(result).toEqual({ deleted: true });
    });

    it('should not delete restaurant because images are not deleted', async () => {
      jest.spyOn(service, 'deleteImages').mockResolvedValueOnce(false);

      const result = await controller.delete(
        mockRestaurant._id,
        mockUser as any,
      );

      expect(service.deleteImages).toHaveBeenCalled();
      expect(result).toEqual({ deleted: false });
    });
  });

  describe('uploadFiles', () => {
    it('should upload files and returned the updated restaurant', async () => {
      const updatedRestaurant = { ...mockRestaurant, images: mockImages };

      jest
        .spyOn(service, 'uploadImages')
        .mockResolvedValueOnce(updatedRestaurant as any);

      const result = await controller.uploadFiles(
        mockRestaurant._id,
        mockFiles as any,
      );

      expect(service.uploadImages).toHaveBeenCalled();
      expect(result).toEqual(updatedRestaurant);
    });
  });
});
