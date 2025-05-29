import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ExpressAdapter } from '@nestjs/platform-express';
import * as express from 'express';
import { Request, Response } from 'express';

const server = express();

async function bootstrap() {
  const app = await NestFactory.create(AppModule, new ExpressAdapter(server));
  await app.init();
  return server;
}

if (!process.env.VERCEL) {
  bootstrap().then(app =>
    app.listen(process.env.PORT ?? 3000)
  );
}

const handler: (req: Request, res: Response) => void = async (req, res) => {
  const server = await bootstrap();
  return server(req, res);
};

export default handler;
