import 'reflect-metadata';
import path from 'path';
import express from 'express';
import providers from './providers';
import config from './config';
import FileManager from './utils/file-manager';
import { startPing, stopPing } from './providers/node-monitor';
import Container from 'typedi';
import { DataSource } from 'typeorm';
import rateLimit from 'express-rate-limit';

export async function loadApp(): Promise<express.Application> {
  const app = express();

  await providers(app);

  const publicUIPath = path.join(process.cwd(), 'public');

  if (FileManager.isFile(publicUIPath, 'index.html')) {
    app.use('/', express.static(publicUIPath));
  } else {
    console.log(`UI Files not found! ${publicUIPath}`);
    app.get('/', (req, res) => {
      return res.status(200).end(`Welcome to ${config.app.name}!`);
    });
  }

  app.use(
    rateLimit({
      windowMs: 60 * 1000, // 1min
      max: 60,
      message: 'Rate Limit exceeded',
    }),
  );

  app.get('*', (req, res, next) => {
    if (req.originalUrl.startsWith('/api')) {
      return next();
    }
    return res.sendFile(path.join(publicUIPath, 'index.html'));
  });

  if (process.env.NODE_ENV !== 'test') {
    app.listen(config.app.port, () => {
      console.log(`${config.app.name} listening on port: ${config.app.port}`);
    });

    startPing();
  }

  return app;
}

async function shutDownApp(): Promise<void> {
  await Container.get<DataSource>('dataSource').destroy();
  stopPing();
}

process.on('SIGINT', shutDownApp);
process.on('SIGTERM', shutDownApp);

process.on('uncaughtException', (err) => {
  console.error('Unhandled Exception:', err);
  shutDownApp();
});

loadApp();
