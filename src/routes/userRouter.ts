import { IncomingMessage, ServerResponse } from 'node:http';
import {
  createUserController,
  deleteUserController,
  getUserByIdController,
  getUsersController,
  updateUserController,
} from '../controllers/userController';
import { HttpMethods } from '../types/http-methods';

export const userRouter = (req: IncomingMessage, res: ServerResponse) => {
  const method = req.method;
  const url = req.url;

  if (!url) return;
  const [base, resource, id] = url.split('/').slice(1);

  if (method === HttpMethods.POST && `/${base}/${resource}` === '/api/users') {
    return createUserController(req, res);
  }

  if (method === HttpMethods.GET && `/${base}/${resource}` === '/api/users') {
    if (id) {
      return getUserByIdController(req, res, id);
    }

    return getUsersController(req, res);
  }

  if (
    method === HttpMethods.PUT &&
    `/${base}/${resource}` === '/api/users' &&
    id
  ) {
    return updateUserController(req, res, id);
  }

  if (
    method === HttpMethods.DELETE &&
    `/${base}/${resource}` === '/api/users' &&
    id
  ) {
    return deleteUserController(req, res, id);
  }

  res.writeHead(404, { 'Content-type': 'application/json' });
  res.end(JSON.stringify({ message: 'Page not found' }));
};
