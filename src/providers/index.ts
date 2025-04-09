import db from './db';
import initializer from './initializer';
import expressProvider from './express';
import express from 'express';
import { startPing } from './node-monitor';

export default async (expressApp: express.Application): Promise<void> => {
  await db();

  await initializer();

  startPing();

  expressProvider({ app: expressApp });
};
