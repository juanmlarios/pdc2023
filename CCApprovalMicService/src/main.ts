import {
  Logger,
  VERSION_NEUTRAL,
  ValidationPipe,
  VersioningType,
} from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { FastifyAdapter } from "@nestjs/platform-fastify";
import {
  DocumentBuilder,
  SwaggerDocumentOptions,
  SwaggerModule,
} from "@nestjs/swagger";
import { config } from "../config";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(
    AppModule,
    new FastifyAdapter({
      trustProxy: true,
    })
  );
  app.enableVersioning({
    type: VersioningType.HEADER,
    header: "X-CSL-APIVersion",
    defaultVersion: VERSION_NEUTRAL,
  });
  const documentOptions = new DocumentBuilder()
    .setTitle(config.NAME)
    .setDescription(config.DESC)
    .setVersion("1.0")
    .addServer(`/v1`)
    .build();
  const swaggerOptions: SwaggerDocumentOptions = {
    operationIdFactory: (controllerKey: string, methodKey: string) => methodKey,
  };
  const document = SwaggerModule.createDocument(
    app,
    documentOptions,
    swaggerOptions
  );
  const validationOptions = {
    whitelist: true,
    transform: true,
    validationError: { target: false },
  };

  // app.useWebSocketAdapter(new WsAdapter(app));
  app.useGlobalPipes(new ValidationPipe(validationOptions));
  app.setGlobalPrefix("v1");
  app.enableCors({ credentials: false });

  SwaggerModule.setup("/api", app, document);
  await app.listen(config.PORT, config.SRVHOST);

  Logger.log(`Server listening on port: ${config.PORT}`);
}
bootstrap();
