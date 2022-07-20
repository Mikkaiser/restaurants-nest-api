import { UnauthorizedException } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';
import { JwtStrategy } from './jwt.strategy';
import { User, UserRoles } from './schemas/user.schema';

const mockUser = {
  _id: '6259d584a0ad9310af33220f',
  email: 'mikaelrsimoes19@gmail.com',
  name: 'Mikkaiser',
  role: UserRoles.USER,
  password: 'hashedPassword',
};

const mockRepository = {
  findById: jest.fn().mockResolvedValue(mockUser),
};

describe('jwtStrategy', () => {
  let jwtStrategy: JwtStrategy;
  let model: Model<User>;

  beforeEach(async () => {
    process.env.JWT_SECRET = 'SLKDFWEOTHWEFNSDFHEQWFW7685H2NJKGW78';

    const module: TestingModule = await Test.createTestingModule({
      imports: [
        JwtModule.register({
          secret: 'SLKDFWEOTHWEFNSDFHEQWFW7685H2NJKGW78',
          signOptions: { expiresIn: '1d' },
        }),
      ],
      providers: [
        JwtStrategy,
        {
          provide: getModelToken(User.name),
          useValue: mockRepository,
        },
      ],
    }).compile();

    jwtStrategy = module.get<JwtStrategy>(JwtStrategy);
    model = module.get<Model<User>>(getModelToken(User.name));
  });

  afterEach(() => {
    delete process.env.JWT_SECRET;
  });

  it('should be defined', () => {
    expect(jwtStrategy).toBeDefined();
  });
  describe('validate', () => {
    it('should validate and return a user', async () => {
      const result = await jwtStrategy.validate({ id: mockUser._id });

      expect(model.findById).toHaveBeenCalledWith(mockUser._id);
      expect(result).toEqual(mockUser);
    });

    it('should throw an error if user is not found', async () => {
      jest.spyOn(model, 'findById').mockResolvedValueOnce(null);

      const result = jwtStrategy.validate({ id: mockUser._id });
      expect(result).rejects.toThrow(UnauthorizedException);
    });
  });
});
