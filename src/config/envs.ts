import 'dotenv/config';
import * as joi from 'joi';

interface EnvVars {
  PORT: number;
  JWT_SECRET: string;
  JWT_REFRESH_SECRET: string;
  JWT_ACCESS_EXPIRATION: string;
  JWT_REFRESH_EXPIRATION: string;
  DATABASE_URL: string;
}

const envsSchema = joi
  .object<EnvVars>({
    PORT: joi.number().required(),
    JWT_SECRET: joi.string().required(),
    JWT_REFRESH_SECRET: joi.string().required(),
    JWT_ACCESS_EXPIRATION: joi.string().default('15m'),
    JWT_REFRESH_EXPIRATION: joi.string().default('30d'),
    DATABASE_URL: joi.string().required(),
  })
  .unknown(true);

const validation = envsSchema.validate({
  ...process.env,
});

if (validation.error) {
  throw new Error(`Error validating envs: ${validation.error.message}`);
}

const envVars: EnvVars = validation.value;

export const envs = {
  PORT: envVars.PORT,
  JWT_SECRET: envVars.JWT_SECRET,
  JWT_REFRESH_SECRET: envVars.JWT_REFRESH_SECRET,
  JWT_ACCESS_EXPIRATION: envVars.JWT_ACCESS_EXPIRATION,
  JWT_REFRESH_EXPIRATION: envVars.JWT_REFRESH_EXPIRATION,
  DATABASE_URL: envVars.DATABASE_URL,
};