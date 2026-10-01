const { test } = require("node:test");
const assert = require("node:assert/strict");
const { execFileSync } = require("node:child_process");
const { randomUUID } = require("node:crypto");
const { PrismaClient } = require("@prisma/client");
const { seed, ids } = require("../prisma/seed/base/index.cjs");
const cli = require.resolve("prisma/build/index.js");
const baseline = "20261001000000_baseline";
function run(url, ...args) {
  return execFileSync(process.execPath, [cli, ...args], {
    cwd: process.cwd(),
    env: { ...process.env, DATABASE_URL: url },
    encoding: "utf8",
    stdio: ["pipe", "pipe", "pipe"],
  });
}

// Only creates and drops randomly named schemas in the explicitly supplied test database.
test("empty and existing databases migrate without data loss", { timeout: 120000 }, async (t) => {
  assert.ok(
    process.env.TEST_DATABASE_URL,
    "Set TEST_DATABASE_URL to an expendable PostgreSQL test database"
  );
  for (const legacy of [false, true]) {
    await t.test(
      legacy ? "upgrade populated legacy schema" : "fresh install and constraints",
      async () => {
        const url = new URL(process.env.TEST_DATABASE_URL);
        const schema = `kan89_test_${randomUUID().replaceAll("-", "")}`;
        url.searchParams.set("schema", schema);
        const dbUrl = url.toString();
        const db = new PrismaClient({ datasources: { db: { url: dbUrl } } });
        const resumeId = randomUUID(),
          roadmapId = randomUUID(),
          sessionId = randomUUID();
        try {
          await db.$executeRawUnsafe(`CREATE SCHEMA "${schema}"`);
          if (legacy) {
            run(
              dbUrl,
              "db",
              "execute",
              "--file",
              `prisma/migrations/${baseline}/migration.sql`,
              "--schema",
              "prisma/schema.prisma"
            );
            await db.$executeRaw`INSERT INTO "Direction" (id,slug,title) VALUES (${ids.direction},'frontend','Frontend')`;
            await db.$executeRaw`INSERT INTO "User" (id,email,"passwordHash") VALUES (${ids.user},'seed-demo@example.invalid','!LOGIN_DISABLED')`;
            await db.$executeRaw`INSERT INTO "Skill" (id,"directionId",title,"hhKeywords") VALUES (${ids.skill},${ids.direction},'JavaScript',ARRAY['JS'])`;
            await db.$executeRaw`INSERT INTO "Resume" (id,"userId","directionId",content,"updatedAt") VALUES (${resumeId},${ids.user},${ids.direction},'{"fullName":"Preserve me"}'::jsonb,now())`;
            await db.$executeRaw`INSERT INTO "UserRoadmap" (id,"userId","directionId") VALUES (${roadmapId},${ids.user},${ids.direction})`;
            await db.$executeRaw`INSERT INTO "UserSkillProgress" (id,"roadmapId","skillId",status) VALUES (${randomUUID()},${roadmapId},${ids.skill},'PARTIAL')`;
            await db.$executeRaw`INSERT INTO "QuestionBank" (id,"directionId",type,topic,prompt) VALUES (${ids.question},${ids.direction},'TECHNICAL','JavaScript','Legacy question')`;
            await db.$executeRaw`INSERT INTO "InterviewSession" (id,"userId","directionId",type,"finishedAt") VALUES (${sessionId},${ids.user},${ids.direction},'TECHNICAL',now())`;
            await db.$executeRaw`INSERT INTO "SessionAnswer" (id,"sessionId","questionId","answerText") VALUES (${randomUUID()},${sessionId},${ids.question},'Preserve answer')`;
            run(dbUrl, "migrate", "resolve", "--applied", baseline);
          }
          run(dbUrl, "migrate", "deploy");
          await seed(db, { demoUser: true });
          await db.user.update({ where: { id: ids.user }, data: { fullName: "User-edited name" } });
          await seed(db, { demoUser: true });
          assert.equal(await db.direction.count(), 1);
          assert.equal(await db.skill.count(), 1);
          assert.equal(await db.questionBank.count(), 1);
          assert.equal(await db.roadmapTask.count(), 1);
          assert.equal(
            (await db.user.findUniqueOrThrow({ where: { id: ids.user } })).fullName,
            "User-edited name"
          );
          if (legacy) {
            assert.deepEqual(
              (await db.resume.findUniqueOrThrow({ where: { id: resumeId } })).content,
              { fullName: "Preserve me" }
            );
            assert.deepEqual((await db.resumeRevision.findFirstOrThrow()).content, {
              fullName: "Preserve me",
            });
            assert.equal((await db.sessionAnswer.findFirstOrThrow()).answerText, "Preserve answer");
            assert.equal((await db.interviewSession.findFirstOrThrow()).status, "COMPLETED");
            assert.equal((await db.questionBank.findFirstOrThrow()).skillId, ids.skill);
            assert.equal(await db.sessionQuestion.count(), 1);
            assert.equal((await db.userSkillProgress.findFirstOrThrow()).status, "PARTIAL");
          }
          const roadmap = await db.userRoadmap.upsert({
            where: { userId_directionId: { userId: ids.user, directionId: ids.direction } },
            create: { userId: ids.user, directionId: ids.direction },
            update: {},
          });
          await db.userSkillProgress.upsert({
            where: { roadmapId_skillId: { roadmapId: roadmap.id, skillId: ids.skill } },
            create: { roadmapId: roadmap.id, skillId: ids.skill, status: "NONE" },
            update: {},
          });
          await assert.rejects(
            db.userSkillProgress.create({
              data: { roadmapId: roadmap.id, skillId: ids.skill, status: "DONE" },
            }),
            { code: "P2002" }
          );
          await assert.rejects(
            db.learningDay.create({ data: { userId: ids.user, day: 8, hours: 1 } })
          );
          await db.resume.create({
            data: { userId: ids.user, directionId: ids.direction, content: {}, isActive: true },
          });
          await assert.rejects(
            db.resume.create({
              data: { userId: ids.user, directionId: ids.direction, content: {}, isActive: true },
            }),
            { code: "P2002" }
          );
          await assert.rejects(
            db.resume.create({
              data: { userId: randomUUID(), directionId: ids.direction, content: {} },
            }),
            { code: "P2003" }
          );
          await assert.rejects(db.direction.delete({ where: { id: ids.direction } }), {
            code: "P2003",
          });
          await db.user.delete({ where: { id: ids.user } });
          for (const model of [
            "resume",
            "resumeRevision",
            "userRoadmap",
            "userSkillProgress",
            "interviewSession",
            "sessionAnswer",
            "sessionQuestion",
          ])
            assert.equal(await db[model].count(), 0, `${model} cascades`);
          assert.equal(await db.skill.count(), 1, "shared catalog survives");
        } finally {
          await db.$executeRawUnsafe(`DROP SCHEMA IF EXISTS "${schema}" CASCADE`);
          await db.$disconnect();
        }
      }
    );
  }
});
