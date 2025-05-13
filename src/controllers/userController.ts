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
    if (error instanceof SyntaxError) {
      res.writeHead(400, { 'Content-type': 'application/json' });
      res.end(JSON.stringify({ message: 'Invalid JSON' }));
      return;
    } else {
      res.writeHead(500, { 'Content-type': 'application/json' });
      res.end(JSON.stringify({ message: 'Internal server error' }));
      return;
    }
  }
};

export const getUsersController = (
  _req: IncomingMessage,
  res: ServerResponse
) => {
  try {
    const users = getUsers();
    res.writeHead(200, { 'Content-type': 'application/json' });
    res.end(JSON.stringify(users));
    return;
  } catch {
    res.writeHead(500, { 'Content-type': 'application/json' });
    res.end(JSON.stringify({ message: 'Internal server error' }));
    return;
  }
};

export const getUserByIdController = (
  _req: IncomingMessage,
  res: ServerResponse,
  id: string
) => {
  try {
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
  } catch {
    res.writeHead(500, { 'Content-type': 'application/json' });
    res.end(JSON.stringify({ message: 'Internal server error' }));
    return;
  }
};

export const updateUserController = async (
  req: IncomingMessage,
  res: ServerResponse,
  id: string
) => {
  try {
    if (!validate(id)) {
      res.writeHead(400, { 'Content-type': 'application/json' });
      res.end(JSON.stringify({ message: 'Invalid user ID' }));
      return;
    }

    const { username, age, hobbies } =
      await getRequestBody<Partial<UserPayload>>(req);
    if (!isValidUserPayload({ username, age, hobbies })) {
      res.writeHead(400, { 'Content-type': 'application/json' });
      res.end(JSON.stringify({ message: 'Invalid user data' }));
      return;
    }
    const updatedUser = updateUser(id, { username, age, hobbies });

    if (!updatedUser) {
      res.writeHead(404, { 'Content-type': 'application/json' });
      res.end(JSON.stringify({ message: 'User not found' }));
      return;
    }

    res.writeHead(200, { 'Content-type': 'application/json' });
    res.end(JSON.stringify(updatedUser));
    return;
  } catch (error) {
    if (error instanceof SyntaxError) {
      res.writeHead(400, { 'Content-type': 'application/json' });
      res.end(JSON.stringify({ message: (error as Error).message }));
      return;
    }
    res.writeHead(500, { 'Content-type': 'application/json' });
    res.end(JSON.stringify({ message: 'Internal server error' }));
    return;
  }
};

export const deleteUserController = (
  _req: IncomingMessage,
  res: ServerResponse,
  id: string
) => {
  try {
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
  } catch {
    res.writeHead(500, { 'Content-type': 'application/json' });
    res.end(JSON.stringify({ message: 'Internal server error' }));
    return;
  }
};
