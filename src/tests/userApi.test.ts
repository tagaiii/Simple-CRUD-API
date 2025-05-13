import request from 'supertest';
import http from 'http';
import { userRouter } from '../routes/userRouter';

let server: http.Server;

beforeAll(() => {
  server = http.createServer(userRouter);
  server.listen(0);
});

afterAll((done) => {
  server.close(done);
});

describe('CRUD API integration tests', () => {
  let userId: string;

  it('GET /api/users - should return empty array', async () => {
    const res = await request(server).get('/api/users');

    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  it('POST /api/users - should create a new user', async () => {
    const newUser = { username: 'test_user', age: 25, hobbies: ['coding'] };
    const res = await request(server)
      .post('/api/users')
      .send(newUser)
      .set('Content-Type', 'application/json');

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body).toMatchObject(newUser);

    userId = res.body.id;
  });

  it('GET /api/users/{userId} - should return created user', async () => {
    const res = await request(server).get(`/api/users/${userId}`);

    expect(res.status).toBe(200);
    expect(res.body.id).toBe(userId);
  });

  it('PUT /api/users/{userId} - should update user', async () => {
    const updatedUser = {
      username: 'updated_user',
      age: 30,
      hobbies: ['reading'],
    };
    const res = await request(server)
      .put(`/api/users/${userId}`)
      .send(updatedUser)
      .set('Content-Type', 'application/json');

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject(updatedUser);
  });

  it('DELETE /api/users/{userId} - should delete user', async () => {
    const res = await request(server).delete(`/api/users/${userId}`);

    expect(res.status).toBe(204);
  });

  it('GET /api/users/{userId} - should return 404 for deleted user', async () => {
    const res = await request(server).get(`/api/users/${userId}`);
    expect(res.status).toBe(404);
  });
});
