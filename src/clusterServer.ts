import dotenv from 'dotenv';
import http from 'node:http';
import os from 'node:os';
import cluster from 'node:cluster';
import { userRouter } from './routes/userRouter';

dotenv.config();

const hostname: string = 'localhost';
const port: number = Number(process.env.BASE_PORT) || 3000;
const db_service_port: number = Number(process.env.DB_SERVICE_PORT) || 4000;

if (cluster.isPrimary) {
  const dbServer = http.createServer(userRouter);

  dbServer.listen(db_service_port, () => {
    console.log(`Storage service listening on ${db_service_port}`);
  });

  const cpus = os.cpus().length;
  for (let i = 0; i < cpus - 1; i += 1) {
    cluster.fork({ worker_port: (port + i + 1).toString() });
  }
  let currentWorker = 0;

  const proxyServer = http.createServer((clientReq, clientRes) => {
    const workerPort = port + ((currentWorker % (cpus - 1)) + 1);
    currentWorker += 1;

    const options = {
      hostname: hostname,
      port: workerPort,
      path: clientReq.url,
      method: clientReq.method,
      headers: clientReq.headers,
    };

    const proxy = http.request(options, (resFromWorker) => {
      clientRes.writeHead(
        resFromWorker.statusCode || 500,
        resFromWorker.headers
      );
      resFromWorker.pipe(clientRes);
    });

    clientReq.pipe(proxy);

    proxy.on('error', (err) => {
      console.error('Proxy error:', err);
      clientRes.writeHead(500);
      clientRes.end('Internal Server Error');
    });

    console.log(
      `Forwarding ${clientReq.method} ${clientReq.url} → ${workerPort}`
    );
  });

  proxyServer.listen(port, () => {
    console.log(`Load balancer ${process.pid} listening on port ${port}`);
  });
} else {
  if (process.env.worker_port) {
    const port = parseInt(process.env.worker_port, 10);

    const server = http.createServer((clientReq, clientRes) => {
      const options = {
        hostname: hostname,
        port: db_service_port,
        path: clientReq.url,
        method: clientReq.method,
        headers: clientReq.headers,
      };

      const proxy = http.request(options, (resFromWorker) => {
        clientRes.writeHead(
          resFromWorker.statusCode || 500,
          resFromWorker.headers
        );
        resFromWorker.pipe(clientRes);
      });

      clientReq.pipe(proxy);

      proxy.on('error', (err) => {
        console.error('Proxy error:', err);
        clientRes.writeHead(500);
        clientRes.end('Internal Server Error');
      });
    });
    server.listen(port, hostname, () => {
      console.log(`Worker ${process.pid} listening on port ${port}`);
    });
  }
}
