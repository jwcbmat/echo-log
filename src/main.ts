import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ExpressAdapter } from '@nestjs/platform-express';
import { Request, Response } from 'express';

let express: typeof import('express');
if (!process.env.VERCEL) {
  express = require('express');
}

let server: any;

async function bootstrap() {
  if (process.env.VERCEL) {
    express = (await import('express')).default;
  }

  server = express();
  const app = await NestFactory.create(AppModule, new ExpressAdapter(server));
  await app.init();
  return server;
}

if (!process.env.VERCEL) {
  bootstrap().then(app =>
    app.listen(process.env.PORT ?? 3000)
  );
}

const handler = async (req: Request, res: Response) => {
  if (!server) {
    server = await bootstrap();
  }
  return server(req, res);
};

export default handler;
