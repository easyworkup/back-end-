import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { patchNestJsSwagger } from "nestjs-zod";
import { AppModule } from "./app.module";

// Делает так, чтобы Zod DTO (createZodDto) корректно превращались в OpenAPI-схемы,
// а не в пустые объекты — на этом и держится вся генерация клиента на фронте.
patchNestJsSwagger();

export function buildOpenApiDocument(app: Parameters<typeof SwaggerModule.createDocument>[0]) {
  const config = new DocumentBuilder()
    .setTitle("EasyWorkUp API")
    .setDescription("Резюме, роадмап, подготовка к собеседованиям — контракт для генерации фронтового клиента (orval)")
    .setVersion("0.1.0")
    .build();

  return SwaggerModule.createDocument(app, config);
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.setGlobalPrefix("api");

  const document = buildOpenApiDocument(app);
  SwaggerModule.setup("api-json", app, document, { jsonDocumentUrl: "api-json" });

  const port = process.env.PORT ?? 4000;
  await app.listen(port);
  // eslint-disable-next-line no-console
  console.log(`easyworkup API запущен на http://localhost:${port}/api`);
  // eslint-disable-next-line no-console
  console.log(`OpenAPI-спека: http://localhost:${port}/api-json`);
}

bootstrap();
