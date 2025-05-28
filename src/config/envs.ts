import 'dotenv/config';
import * as joi from 'joi';

interface EnvVars {
  PORT: number;
  JWT_SECRET: string;
  DATABASE_URL: string;
}

const envsSchema = joi
  .object<EnvVars>({
    PORT: joi.number().required(),
    JWT_SECRET: joi.string().required(),
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
  DATABASE_URL: envVars.DATABASE_URL,
};