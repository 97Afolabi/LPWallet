import { NestFactory } from "@nestjs/core";
import { Logger, ValidationPipe } from "@nestjs/common";
import { AppModule } from "./app.module";
import helmet from "helmet";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

async function bootstrap() {
    const PORT = process.env.PORT || 3000;
    const logger = new Logger("Main");
    const app = await NestFactory.create(AppModule);

    app.use(helmet());
    app.enableCors();
    app.setGlobalPrefix("api");
    app.useGlobalPipes(new ValidationPipe());

    const config = new DocumentBuilder()
        .setTitle("LP Wallet")
        .setDescription("LP Wallet's internal API documentation")
        .setVersion("1.0")
        .addBearerAuth()
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup("doc", app, document);

    await app.listen(PORT, () => logger.log(`Server running on port ${PORT}`));
}
bootstrap();
