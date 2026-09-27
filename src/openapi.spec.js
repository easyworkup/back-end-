require("reflect-metadata");
const { NestFactory } = require("@nestjs/core");
const { AppModule } = require("./app.module");
const { buildOpenApiDocument } = require("./main");

test("OpenAPI uses the same /api prefix as the HTTP application", async () => {
  const app = await NestFactory.create(AppModule, { logger: false, abortOnError: false });
  try {
    app.setGlobalPrefix("api");
    const doc = buildOpenApiDocument(app);
    expect(doc.paths["/api/auth/register"]).toBeDefined();
    expect(Object.keys(doc.paths).length).toBeGreaterThan(0);
    expect(Object.keys(doc.paths).every((route) => route.startsWith("/api/"))).toBe(true);
    expect(doc.paths["/auth/register"]).toBeUndefined();
  } finally {
    await app.close();
  }
});
