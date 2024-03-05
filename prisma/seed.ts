import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
async function main() {
  await prisma.user.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
    },
  });
  await prisma.flow.upsert({
    where: { id: 1 },
    update: {},
    create: {
      when: {
        source: "localStorage",
        property: "hasCompletedFirstTodo",
        value: "true",
        op: "==",
      },
      steps: [
        {
          target: ".my-selector",
          content: "This is my super awesome feature!",
        },
      ],
      users: { connect: { id: 1 } },
    },
  });
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
