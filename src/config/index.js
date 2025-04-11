import dotenv from "dotenv";
dotenv.config();

const config = {
  PORT: process.env.PORT || 8000,

  MONGO_URL: process.env.MONGO_URL,

  CLIENT_URL: process.env.CLIENT_URL,

  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRY: process.env.JWT_EXPIRY,

  SMTP_MAIL_HOST: process.env.SMTP_MAIL_HOST,
  SMTP_MAIL_PORT: process.env.SMTP_MAIL_PORT,
  SMTP_MAIL_USERNAME: process.env.SMTP_MAIL_USERNAME,
  SMTP_MAIL_PASSWORD: process.env.SMTP_MAIL_PASSWORD,
  SMTP_SENDER_EMAIL: process.env.SMTP_SENDER_EMAIL,
  
};

export default config;
