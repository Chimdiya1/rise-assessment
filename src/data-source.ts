import config from "config";

import { DataSource } from "typeorm";
import User from "./entities/user.entity";
import File from "./entities/file.entity";
import Folder from "./entities/folder.entity";

// const DATABASE_ENABLE_LOGGING = process.env.DATABASE_ENABLE_LOGGING === "true";
// const DATABASE_ENABLE_SYNC = process.env.DATABASE_ENABLE_SYNC === "true";

console.log(
  config.get<string>("DATABASE_HOST"),
  config.get<string>("DATABASE_USER")
);

export const AppDataSource = new DataSource({
  type: "postgres",
  host: config.get<string>("DATABASE_HOST") || "localhost",
  port: parseInt(config.get<string>("DATABASE_PORT") || "5432"),
  username: config.get<string>("DATABASE_USER"),
  password: config.get<string>("DATABASE_PASSWORD"),
  database: config.get<string>("DATABASE_NAME"),
  logging: config.get<boolean>("DATABASE_ENABLE_LOGGING"),
  synchronize: config.get<boolean>("DATABASE_ENABLE_SYNC"),
  entities: [User, File, Folder],
  migrations: ["migrations/**/*.ts"],
  subscribers: [],
  extra: {
    ssl: {
      rejectUnauthorized: false,
    },
  },
});

const DATABASE_RETRY_COUNT = process.env.DATABASE_CONNECT_RETRY_COUNT
  ? parseInt(process.env.DATABASE_CONNECT_RETRY_COUNT)
  : 5;

const DATABASE_RETRY_INTERVAL_MS = 5000;

export async function initialiseDataSource(
  retries = DATABASE_RETRY_COUNT
): Promise<boolean> {
  return AppDataSource.initialize()
    .then(() => true)
    .catch((err) => {
      const remainingRetries = retries - 1;
      console.log(config.get<string>("DATABASE_HOST"));
      console.warn(
        `Could not connect to the database, retrying ${remainingRetries} more time(s)`,
        err
      );
      if (remainingRetries === 0) {
        console.error(`Error during Data Source initialisation:`, err);
        return false;
      }
      return new Promise((resolve) => {
        setTimeout(() => {
          initialiseDataSource(remainingRetries).then(resolve);
        }, DATABASE_RETRY_INTERVAL_MS);
      });
    });
}
