import 'dotenv/config';
import { DataSource } from 'typeorm';
import { databaseOptions } from './database.config';
const url = process.env.DATABASE_URL;
if (!url) throw new Error('DATABASE_URL is required');
export default new DataSource(databaseOptions(url));
