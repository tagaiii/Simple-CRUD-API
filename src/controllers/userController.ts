import { IncomingMessage, ServerResponse } from 'node:http';
import { getRequestBody } from '../utils/getRequestBody';
import { UserPayload } from '../types/user.types';
import {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
} from '../models/user';
import { validate } from 'uuid';
import { isValidUserPayload } from '../utils/validators/userPayloadValidator';

export const createUserController = async (
  req: IncomingMessage,
  res: ServerResponse
) => {
  try {
    const { username, age, hobbies } = await getRequestBody<UserPayload>(req);

    if (!isValidUserPayload({ username, age, hobbies })) {
      res.writeHead(400, { 'Content-type': 'application/json' });
      res.end(JSON.stringify({ message: 'Invalid user data' }));
      return;
    }

    const newUser = createUser(username, age, hobbies);
    res.writeHead(201, { 'Content-type': 'application/json' });
    res.end(JSON.stringify(newUser));
    return;
  } catch (error) {
    res.writeHead(400, { 'Content-type': 'application/json' });
    res.end(JSON.stringify({ message: (error as Error).message }));
    return;
  }
};

export const getUsersController = (
  _req: IncomingMessage,
  res: ServerResponse
) => {
  const users = getUsers();
  res.writeHead(200, { 'Content-type': 'application/json' });
  res.end(JSON.stringify(users));
  return;
};

export const getUserByIdController = (
  _req: IncomingMessage,
  res: ServerResponse,
  id: string
) => {
  if (!validate(id)) {
    res.writeHead(400, { 'Content-type': 'application/json' });
    res.end(JSON.stringify({ message: 'Invalid user ID' }));
    return;
  }

  const user = getUserById(id);
  if (!user) {
    res.writeHead(404, { 'Content-type': 'application/json' });
    res.end(JSON.stringify({ message: 'User not found' }));
    return;
  }

  res.writeHead(200, { 'Content-type': 'application/json' });
  res.end(JSON.stringify(user));
  return;
};

export const updateUserController = async (
  req: IncomingMessage,
  res: ServerResponse,
  id: string
) => {
  if (!validate(id)) {
    res.writeHead(400, { 'Content-type': 'application/json' });
    res.end(JSON.stringify({ message: 'Invalid user ID' }));
    return;
  }

  try {
    const payload = await getRequestBody<Partial<UserPayload>>(req);
    const updatedUser = updateUser(id, payload);

    if (!updatedUser) {
      res.writeHead(404, { 'Content-type': 'application/json' });
      res.end(JSON.stringify({ message: 'User not found' }));
      return;
    }

    res.writeHead(200, { 'Content-type': 'application/json' });
    res.end(JSON.stringify(updatedUser));
    return;
  } catch (error) {
    res.writeHead(400, { 'Content-type': 'application/json' });
    res.end(JSON.stringify({ message: (error as Error).message }));
    return;
  }
};

export const deleteUserController = (
  _req: IncomingMessage,
  res: ServerResponse,
  id: string
) => {
  if (!validate(id)) {
    res.writeHead(400, { 'Content-type': 'application/json' });
    res.end(JSON.stringify({ message: 'Invalid user ID' }));
    return;
  }

  const isDeleted = deleteUser(id);

  if (!isDeleted) {
    res.writeHead(404, { 'Content-type': 'application/json' });
    res.end(JSON.stringify({ message: 'User not found' }));
    return;
  }

  res.writeHead(204, { 'Content-type': 'application/json' });
  res.end();
  return;
};
