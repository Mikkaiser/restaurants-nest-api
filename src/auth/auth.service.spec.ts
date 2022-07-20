import { ConflictException, NotFoundException } from '@nestjs/common';
import APIFeatures from '../utils/apiFeatures.utils';
import { JwtModule } from '@nestjs/jwt';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';
import { AuthService } from './auth.service';
import { User, UserRoles } from './schemas/user.schema';
import * as bcrypt from 'bcryptjs';

const mockUser = {
  _id: '6259d584a0ad9310af33220f',
  email: 'mikaelrsimoes19@gmail.com',
  name: 'Mikkaiser',
  role: UserRoles.USER,
  password: 'hashedPassword',
};
const token = 'jwtToken';

const mockRepository = {
  create: jest.fn().mockResolvedValue(mockUser),
  findOne: jest.fn().mockResolvedValue(mockUser),
};

describe('AuthService', () => {
  let service: AuthService;
  let model: Model<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        JwtModule.register({
          secret: 'SLKDFWEOTHWEFNSDFHEQWFW7685H2NJKGW78',
          signOptions: { expiresIn: '1d' },
        }),
      ],
      providers: [
        AuthService,
        {
          provide: getModelToken(User.name),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    model = module.get<Model<User>>(getModelToken(User.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('signUp', () => {
    it('should register a new user', async () => {
      const hashedPassword = 'hashedPassword';
      const { name, email, password } = mockUser;
      jest.spyOn(service, 'hashPassword').mockResolvedValueOnce(hashedPassword);
      jest.spyOn(APIFeatures, 'assignJwtToken').mockResolvedValueOnce(token);

      const result = await service.signUp({ name, email, password });

      expect(service.hashPassword).toHaveBeenCalled();
      expect(result).toEqual({ token });
    });

    it('should return duplicate email entered message', async () => {
      jest
        .spyOn(model, 'create')
        .mockImplementationOnce(() => Promise.reject({ code: 11000 }));
      const { name, email, password } = mockUser;

      const result = service.signUp({ name, email, password });

      await expect(result).rejects.toThrow(ConflictException);
    });
  });

  describe('login', () => {
    it('should login user and return a token', async () => {
      jest.spyOn(model, 'findOne').mockImplementationOnce(
        () =>
          ({
            select: jest.fn().mockResolvedValueOnce(mockUser),
          } as any),
      );

      const { email, password } = mockUser;

      jest.spyOn(bcrypt, 'compare').mockResolvedValueOnce(true);
      jest.spyOn(APIFeatures, 'assignJwtToken').mockResolvedValueOnce(token);

      const result = await service.login({ email, password });

      expect(result).toEqual({ token });
    });

    it('should throw invalid password error', async () => {
      jest.spyOn(model, 'findOne').mockImplementationOnce(
        () =>
          ({
            select: jest.fn().mockResolvedValueOnce(mockUser),
          } as any),
      );
      jest.spyOn(bcrypt, 'compare').mockResolvedValueOnce(false);

      const { email, password } = mockUser;

      const result = service.login({ email, password });

      await expect(result).rejects.toThrow(NotFoundException);
    });
  });
});
