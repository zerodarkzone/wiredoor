import db from './db';
import initializer from './initializer';
import expressProvider from './express';
import express from 'express';

export default async (expressApp: express.Application): Promise<void> => {
  await db();

  await initializer();

  expressProvider({ app: expressApp });
};
