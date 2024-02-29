import { config } from 'dotenv';

config();

export const PORT = process.env.PORT;

export const ZENMONEY_API_BASE_URL = process.env.ZENMONEY_API_BASE_URL;
export const ZENMONEY_API_CONSUMER_KEY = process.env.ZENMONEY_API_CONSUMER_KEY;
export const ZENMONEY_API_CONSUMER_SECRET = process.env.ZENMONEY_API_CONSUMER_SECRET;
export const ZENMONEY_API_REDIRECT_URI = process.env.ZENMONEY_API_REDIRECT_URI;
