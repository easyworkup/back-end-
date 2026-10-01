const { buildContractDocument, exampleFor, routes } = require("./openapi");
const { schemas } = require("./schemas");
const { zodToOpenAPI } = require("nestjs-zod");

describe("published MVP contract", () => {
  test("all fixtures satisfy their Zod wire schema", () => {
    for (const [name, schema] of Object.entries(schemas)) {
      const result = schema.safeParse(exampleFor(buildContractDocument().components.schemas[name]));
      if (!result.success) throw new Error(`${name}: ${result.error.message}`);
    }
  });
  test("unique operation ids, concrete successes, auth and planned status", () => {
    const doc = buildContractDocument();
    expect(new Set(routes.map((r) => r[2])).size).toBe(routes.length);
    for (const [method, path, , , request, response, code, access] of routes) {
      const operation = doc.paths["/api" + path][method];
      expect(operation).toHaveProperty("x-implementation", "planned");
      expect(operation.security?.length).toBe(access === "public" ? 0 : 1);
      expect(operation.responses[code]).toBeDefined();
      expect(operation.responses[409]).toBeDefined();
      if (request)
        expect(operation.requestBody).toHaveProperty(
          "content.application/json.schema.$ref",
          `#/components/schemas/${request}`
        );
      if (response && response !== "StreamEvent")
        expect(operation.responses[code]).toHaveProperty(
          "content.application/json.schema.$ref",
          `#/components/schemas/${response}`
        );
    }
    const refs = [
      ...JSON.stringify(doc).matchAll(/"\$ref":"#\/components\/schemas\/([^\"]+)"/g),
    ].map((m) => m[1]);
    for (const name of refs) expect(doc.components.schemas[name]).toBeDefined();
  });
  test("invalid autosave, hours and auth inputs are rejected", () => {
    expect(schemas.RevisionRequest.safeParse({ revision: 0 }).success).toBe(false);
    expect(schemas.TaskProgressRequest.safeParse({ done: true, actualHours: -1 }).success).toBe(
      false
    );
    expect(
      schemas.RegisterRequest.safeParse({
        fullName: "Test",
        email: "wrong",
        password: "short",
        acceptedTerms: false,
      }).success
    ).toBe(false);
    expect(schemas.StartInterviewRequest.shape).not.toHaveProperty("userId");
    expect(
      schemas.CodeRequest.safeParse({
        questionId: "wrong",
        clientMessageId: "wrong",
        language: "shell",
        code: "ls",
      }).success
    ).toBe(false);
  });
  test("stream requires identity; hidden coding data never enter public session", () => {
    expect(schemas.StreamEvent.safeParse({ type: "delta", text: "partial" }).success).toBe(false);
    expect(JSON.stringify(zodToOpenAPI(schemas.InterviewSession))).not.toMatch(
      /referenceSolution|testCases|passwordHash/
    );
  });
});
