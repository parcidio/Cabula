//This file is responsible for getting environment variables from the .env file
// and throwing an error if the variable is not set and no default value is provided.
export const getEnv = (key: string, defaultValue: string = ""): string => {
    const value = process.env[key];
    if (value === undefined) {
      if (defaultValue) {
        return defaultValue;
      }
      throw new Error(`Enviroment variable ${key} is not set`);
    }
    return value;
  };