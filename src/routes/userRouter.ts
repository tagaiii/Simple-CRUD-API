import { IncomingMessage, ServerResponse } from 'node:http';
import { createUserController } from '../controllers/userController';
import { HttpMethods } from '../types/http-methods';

export const userRouter = (req: IncomingMessage, res: ServerResponse) => {
  const method = req.method;
  const url = req.url;

  if (method === HttpMethods.POST && url === '/api/users') {
    createUserController(req, res);
  }
};
