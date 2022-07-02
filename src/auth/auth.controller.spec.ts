import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserRoles } from './schemas/user.schema';

const token = 'jwtToken';

const mockUser = {
  _id: '6259d584a0ad9310af33220f',
  email: 'mikaelrsimoes19@gmail.com',
  name: 'Mikkaiser',
  role: UserRoles.USER,
  password: 'hashedPassword',
};

const mockRestaurantService = {
  signUp: jest.fn().mockResolvedValue({ token }),
  login: jest.fn().mockResolvedValue({ token }),
};

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockRestaurantService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('signUp', () => {
    it('should register a new user and return a token', async () => {
      const { name, email, password } = mockUser;

      const result = await controller.signUp({ name, email, password });

      expect(service.signUp).toHaveBeenCalled();
      expect(result).toEqual({ token });
    });
  });

  describe('login', () => {
    it('should login user and return a token', async () => {
      const { email, password } = mockUser;

      const result = await controller.login({ email, password });

      expect(service.login).toHaveBeenCalled();
      expect(result).toEqual({ token });
    });
  });
});
