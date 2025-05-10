import { IncomingMessage, ServerResponse } from 'node:http';
import { getRequestBody } from '../utils/getRequestBody';
import { UserPayload } from '../types/user.types';
import {
  createUser,
  // getUserById,
  // getUsers,
  // updateUser,
  // deleteUser,
} from '../models/user';
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
  } catch (error) {
    res.writeHead(400, { 'Content-type': 'application/json' });
    res.end(JSON.stringify({ message: (error as Error).message }));
  }
};
