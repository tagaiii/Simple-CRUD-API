import dotenv from 'dotenv';
import http from 'node:http';
import { HttpMethods } from './types/http-methods';
import { createUser, getUsers } from './models/user';

dotenv.config();

const hostname: string = 'localhost';
const port: number = Number(process.env.PORT) || 5000;

const server = http.createServer();

server.on('request', (req, res) => {
  const method = req.method;

  if (method === HttpMethods.GET) {
    createUser('NewUser', 25, ['coding']);
    const users = getUsers();
    res.writeHead(200, { 'content-type': 'application/json' });
    res.end(JSON.stringify(users));
  }
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
