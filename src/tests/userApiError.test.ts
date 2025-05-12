import request from 'supertest';
import http from 'http';
import { userRouter } from '../routes/userRouter';

let server: http.Server;
let nonExistingId: string;
let existingId: string;

beforeAll(async () => {
  server = http.createServer(userRouter);
  server.listen(0);

  nonExistingId = '430cc068-c163-4e53-86e6-3e018ce5c4f8';
  const newUser = { username: 'test_user', age: 25, hobbies: ['coding'] };
  const res = await request(server)
    .post('/api/users')
    .send(newUser)
    .set('Content-Type', 'application/json');
  existingId = res.body.id;
});

afterAll((done) => {
  server.close(done);
});

describe('User API - Error scenarios', () => {
  it('should return 400 when POST body is invalid', async () => {
    const res = await request(server)
      .post('/api/users')
      .send({ wrongField: 'wrongValue' })
      .set('Content-type', 'application/json');

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('message');
  });

  it('should return 404 when GET user by non-existing id', async () => {
    const res = await request(server).get(`/api/users/${nonExistingId}`);

    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty('message');
  });

  it('should return 400 when PUT body is invalid', async () => {
    const res = await request(server)
      .put(`/api/users/${existingId}`)
      .send({ username: 25 })
      .set('Content-type', 'application/json');

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('message');
  });

  it('should return 404 when PUT user by non-existing id', async () => {
    const res = await request(server)
      .put(`/api/users/${nonExistingId}`)
      .send({ username: 'updatedUser' })
      .set('Content-type', 'application/json');

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('message');
  });

  it('should return 404 when deleting non-existent user', async () => {
    const res = await request(server).delete(`/api/users/${nonExistingId}`);

    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty('message');
  });
});
