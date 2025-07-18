import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ExpressAdapter } from '@nestjs/platform-express';
import type { Express, Request, Response } from 'express';

/**
 * - In local development (Node.js with NestJS), CommonJS (`require`) is used, as NestJS does not fully support native ESModules.
 * - In the Vercel production environment (which requires ESModules for serverless functions), dynamic `await import()` is used.
 *
 * This hybrid approach is not ideal from an architectural or maintainability perspective, but it is used here for practicality and speed,
 * allowing compatibility with Vercel’s runtime without fully restructuring the project to use `module: "ESNext"`.
 */
let express: typeof import('express');
if (!process.env.VERCEL) {
  express = require('express');
}

let server: Express;
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
