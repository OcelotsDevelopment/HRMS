// prisma/seed.ts
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // Example: Create employees
  await prisma.employee.createMany({
    data: [
    //   { "name": 'Raziq Raz', "email": "raziqsur@gmail.com", "password": "secure123", "employeeUniqueId": 'EMP001',"role": "admin" },
    ],
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
