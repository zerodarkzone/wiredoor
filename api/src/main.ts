import "reflect-metadata";
import path from 'path';
import express from "express";
import providers from './providers';
import config from './config';
import FileManager from './utils/file-manager';

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
  }

  return app;
}

loadApp();