import { NestFactory } from "@nestjs/core";
import { SwaggerModule } from "@nestjs/swagger";
import { buildContractDocument } from "./contracts/openapi";
import { patchNestJsSwagger } from "nestjs-zod";
import { AppModule } from "./app.module";

// Делает так, чтобы Zod DTO (createZodDto) корректно превращались в OpenAPI-схемы,
// а не в пустые объекты — на этом и держится вся генерация клиента на фронте.
patchNestJsSwagger();

export function buildOpenApiDocument(_app?: Parameters<typeof SwaggerModule.createDocument>[0]) {
  return buildContractDocument();
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.setGlobalPrefix("api");

  const document = buildOpenApiDocument(app);
  SwaggerModule.setup("api-json", app, document, { jsonDocumentUrl: "api-json" });

  const port = process.env.PORT ?? 4000;
  await app.listen(port);

  console.log(`easyworkup API запущен на http://localhost:${port}/api`);

  console.log(`OpenAPI-спека: http://localhost:${port}/api-json`);
}

// Не поднимаем сервер, когда файл импортируют (например, scripts/generate-openapi.ts).
if (require.main === module) {
  void bootstrap();
}
