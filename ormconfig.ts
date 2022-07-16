import * as path from "path";
import { DatabaseConfig } from "./src/interfaces/dbConfig";
export const db = process.env as unknown as DatabaseConfig;

module.exports = {
    type: "postgres",
    host: db.POSTGRES_HOST,
    port: db.POSTGRES_PORT,
    username: db.POSTGRES_USER,
    password: db.POSTGRES_PASSWORD,
    database: db.POSTGRES_DATABASE,
    synchronize: false,
    subscribers: ["/subscriber/**/*{.ts,.js}"],
    logging: true,
    entities: [path.join(__dirname, "src", "**/*.entity.{ts,js}")],
    migrations: [path.join(__dirname, "migrations", "**/*.{ts,js}")],
    cli: {
        entitiesDir: path.join(__dirname, "src", "**/entities"),
        migrationsDir: path.join(__dirname, "migrations"),
    },
};
