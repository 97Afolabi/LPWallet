import * as path from "path";

module.exports = {
    type: "postgres",
    url: process.env.POSTGRES_URL,
    synchronize: false,
    subscribers: ["/subscriber/**/*{.ts,.js}"],
    logging: true,
    entities: [path.join(__dirname, "src", "**/*.entity.{ts,js}")],
    migrations: [path.join(__dirname, "src", "migrations", "**/*.{ts,js}")],
    cli: {
        entitiesDir: path.join(__dirname, "src", "**/entities"),
        migrationsDir: path.join(__dirname, "src", "migrations"),
    },
};
