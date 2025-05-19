import 'dotenv/config';
import * as joi from 'joi';

interface EnvVars {
  PORT: number;
  // DATABASE_URL: string;
}

const envsSchema = joi
  .object<EnvVars>({
    PORT: joi.number().required(),
    // DATABASE_URL: joi.string().required(),
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
};