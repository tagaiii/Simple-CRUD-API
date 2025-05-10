import dotenv from 'dotenv';
import http from 'node:http';
import { userRouter } from './routes/userRouter';

dotenv.config();

const hostname: string = 'localhost';
const port: number = Number(process.env.PORT) || 5000;

const server = http.createServer(userRouter);

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
