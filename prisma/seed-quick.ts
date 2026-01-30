
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Seeding database...');

    // Ensure temp user
    const user = await prisma.user.upsert({
        where: { email: 'temp@example.com' },
        update: {},
        create: {
            id: 'temp-user-id', // HARCODED ID TO MATCH APP
            email: 'temp@example.com',
            name: 'Temp User',
        },
    });

    console.log('User synced:', user.id);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
