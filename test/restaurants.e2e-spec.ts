import { MinLength } from 'class-validator';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as mongoose from 'mongoose';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { Category } from '../src/restaurants/schemas/restaurant.schema';

describe('RestaurantsController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  beforeAll(() => {
    mongoose.connect(process.env.DB_URI_LOCAL, () => {
      mongoose.connection.db.dropDatabase();
    });
  });

  afterAll(() => mongoose.disconnect());

  const user = {
    name: 'MikkaiserTester',
    email: 'mikkaiserTester@gmail.com',
    password: '12345678',
  };

  const newRestaurant = {
    name: 'Mikkaiser',
    description: 'This is just a description',
    email: 'ghulam@gamil.com',
    phoneNo: '824777776',
    address: '75 Middlesex Turnpike, Burlington, MA 01803',
    category: Category.FAST_FOOD,
  };

  let jwtToken;
  let restaurantCreated;

  it('(POST) - register a new user', () => {
    return request(app.getHttpServer())
      .post('/auth/signup')
      .send(user)
      .expect(201)
      .then((res) => {
        expect(res.body.token).toBeDefined();
      });
  });

  it('(GET) - login user', () => {
    return request(app.getHttpServer())
      .get('/auth/login')
      .send({ email: user.email, password: user.password })
      .expect(200)
      .then((res) => {
        expect(res.body.token).toBeDefined();
        jwtToken = res.body.token;
      });
  });

  it('(POST) - creates a new restaurant', () => {
    jest.setTimeout(10000);

    return request(app.getHttpServer())
      .post('/restaurants')
      .set('Authorization', 'Bearer ' + jwtToken)
      .send(newRestaurant)
      .expect(201)
      .then((res) => {
        expect(res.body._id).toBeDefined();
        expect(res.body.name).toEqual(newRestaurant.name);
        restaurantCreated = res.body;
      });
  });

  it('(GET) - get all restaurants', () => {
    jest.setTimeout(10000);

    return request(app.getHttpServer())
      .get('/restaurants')
      .set('Authorization', 'Bearer ' + jwtToken)
      .expect(200)
      .then((res) => {
        expect(res.body.length).toBe(1);
      });
  });

  it('(GET) - get restaurant by ID', () => {
    return request(app.getHttpServer())
      .get('/restaurants/' + restaurantCreated._id)
      .set('Authorization', 'Bearer ' + jwtToken)
      .expect(200)
      .then((res) => {
        expect(res.body).toBeDefined();
        expect(res.body._id).toEqual(restaurantCreated._id);
      });
  });

  it('(PUT) - update restaurant by ID', () => {
    return request(app.getHttpServer())
      .put('/restaurants/' + restaurantCreated._id)
      .set('Authorization', 'Bearer ' + jwtToken)
      .send({ name: 'Mikkaiser Updated' })
      .expect(200)
      .then((res) => {
        expect(res.body).toBeDefined();
        expect(res.body.name).toEqual('Mikkaiser Updated');
      });
  });

  it('(DELETE) - delete restaurant by ID', () => {
    jest.setTimeout(10000);
    return request(app.getHttpServer())
      .delete('/restaurants/' + restaurantCreated._id)
      .set('Authorization', 'Bearer ' + jwtToken)
      .expect(200)
      .then((res) => {
        expect(res.body).toBeDefined();
        expect(res.body.deleted).toEqual(true);
      });
  });
});
