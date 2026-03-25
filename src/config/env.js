const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  PORT:               process.env.PORT || 5000,
  NODE_ENV:           process.env.NODE_ENV || 'development',
  DB_HOST:            process.env.DB_HOST,
  DB_PORT:            process.env.DB_PORT,
  DB_USER:            process.env.DB_USER,
  DB_PASSWORD:        process.env.DB_PASSWORD,
  DB_NAME:            process.env.DB_NAME,
  JWT_ACCESS_SECRET:  process.env.JWT_ACCESS_SECRET,
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
  JWT_ACCESS_EXPIRES: process.env.JWT_ACCESS_EXPIRES,
  JWT_REFRESH_EXPIRES:process.env.JWT_REFRESH_EXPIRES,
  SMTP_HOST:          process.env.SMTP_HOST,
  SMTP_PORT:          process.env.SMTP_PORT,
  SMTP_SECURE:        process.env.SMTP_SECURE,
  SMTP_USER:          process.env.SMTP_USER,
  SMTP_PASS:          process.env.SMTP_PASS,
  EMAIL_FROM:         process.env.EMAIL_FROM,
  PAYSTACK_SECRET_KEY:process.env.PAYSTACK_SECRET_KEY,
  FLW_SECRET_KEY:     process.env.FLW_SECRET_KEY,
  CLIENT_URL:         process.env.CLIENT_URL,
};
