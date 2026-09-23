/**
 * Генерирует статичный openapi.json без поднятия HTTP-сервера — используется
 * в CI фронтового репозитория или локально, когда не хочется держать бэк запущенным
 * только ради codegen. Реальный live-эндпоинт — GET /api-json (см. main.ts).
 *
 * Запуск: pnpm generate:openapi  →  openapi.json в корне репозитория.
 */
import "reflect-metadata";
import { writeFileSync } from "fs";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "../app.module";
import { buildOpenApiDocument } from "../main";

async function main() {
  const app = await NestFactory.create(AppModule, { logger: false });
  const document = buildOpenApiDocument(app);
  writeFileSync("openapi.json", JSON.stringify(document, null, 2));
  await app.close();
  // eslint-disable-next-line no-console
  console.log("openapi.json сгенерирован");
}

main();
