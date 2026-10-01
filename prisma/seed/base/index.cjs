const { PrismaClient } = require("@prisma/client");
const ids = {
  direction: "10000000-0000-4000-8000-000000000001",
  skill: "10000000-0000-4000-8000-000000000002",
  task: "10000000-0000-4000-8000-000000000003",
  question: "10000000-0000-4000-8000-000000000004",
  user: "10000000-0000-4000-8000-000000000005",
};

async function seed(prisma, { demoUser = false } = {}) {
  return prisma.$transaction(async (tx) => {
    const direction = await tx.direction.upsert({
      where: { slug: "frontend" },
      update: {},
      create: { id: ids.direction, slug: "frontend", title: "Frontend" },
    });
    const skill = await tx.skill.upsert({
      where: { id: ids.skill },
      update: {},
      create: {
        id: ids.skill,
        directionId: direction.id,
        title: "JavaScript",
        hhKeywords: ["JavaScript", "JS"],
      },
    });
    await tx.roadmapTask.upsert({
      where: { id: ids.task },
      update: {},
      create: {
        id: ids.task,
        skillId: skill.id,
        title: "Написать функцию группировки массива по ключу",
        taskType: "EXERCISE",
        sourceLabel: "EasyWorkUp: собственное упражнение",
        license: "Project-owned",
        estimatedHours: 1,
      },
    });
    await tx.questionBank.upsert({
      where: { id: ids.question },
      update: {},
      create: {
        id: ids.question,
        directionId: direction.id,
        skillId: skill.id,
        type: "TECHNICAL",
        topic: "JavaScript",
        prompt: "Объясните замыкание и приведите собственный пример.",
        license: "Project-owned",
      },
    });
    if (demoUser) {
      await tx.user.upsert({
        where: { email: "seed-demo@example.invalid" },
        update: {},
        create: {
          id: ids.user,
          email: "seed-demo@example.invalid",
          fullName: "Демо Пользователь",
          passwordHash: "!LOGIN_DISABLED",
          directionId: direction.id,
        },
      });
    }
    return { directionId: direction.id, skillId: skill.id };
  });
}

if (require.main === module) {
  const prisma = new PrismaClient();
  seed(prisma, { demoUser: process.env.SEED_DEMO_USER === "true" })
    .then(() => console.log("Base catalog seeded; existing records preserved."))
    .catch((error) => {
      console.error(error);
      process.exitCode = 1;
    })
    .finally(() => prisma.$disconnect());
}
module.exports = { seed, ids };
