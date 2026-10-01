/**
 * Генерирует статичный openapi.json без поднятия HTTP-сервера — используется
 * в CI фронтового репозитория или локально, когда не хочется держать бэк запущенным
 * только ради codegen. Реальный live-эндпоинт — GET /api-json (см. main.ts).
 *
 * Запуск: pnpm generate:openapi  →  openapi.json в корне репозитория.
 */
import "reflect-metadata";
import { writeFileSync } from "fs";
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { buildContractDocument, CONTRACT_VERSION } from "../contracts/openapi";

async function main() {
  const content = JSON.stringify(buildContractDocument(), null, 2) + "\n";
  writeFileSync("openapi.json", content);
  writeFileSync(
    "openapi-source.json",
    JSON.stringify(
      {
        contractVersion: CONTRACT_VERSION,
        sourceRevision: execFileSync("git", ["rev-parse", "HEAD"], { encoding: "utf8" }).trim(),
        dirty:
          execFileSync("git", ["status", "--porcelain"], { encoding: "utf8" }).trim().length > 0,
        sha256: createHash("sha256").update(content).digest("hex"),
      },
      null,
      2
    ) + "\n"
  );
  console.log("openapi.json сгенерирован");
}

void main().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
