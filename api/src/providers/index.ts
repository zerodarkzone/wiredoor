/* eslint-disable @typescript-eslint/no-explicit-any */
import Container from 'typedi';
import db from './db';
import initializer from './initializer';
import expressProvider from './express';
import express from "express";
import WireguardService from '../services/wireguard/wireguard-service';
import { HttpServicesService } from '../services/http-services-service';

export default async (expressApp: express.Application) => {
  await db();

  await initializer();

  expressProvider({ app: expressApp });
};
