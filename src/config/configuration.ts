import { DBConfig } from './interfaces/db-config.interface';
import { config } from 'dotenv';
config();

export const port = parseInt(process.env.PORT, 10) || 8080;

export const db: DBConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT, 10) || 5432,
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || '@6991hniM',
  database: process.env.DB_NAME || 'tasksmanagement',
  synchronize: Boolean(process.env.DB_SYNCHRONIZE) || true
};

export const jwt = {
  private: process.env.JWT_PRIVATE,
  expiresIn: process.env.JWT_EXPIRESIN || 3600
};
