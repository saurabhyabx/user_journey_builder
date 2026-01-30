
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Testing DB connection...');
    try {
        const start = Date.now();
        const journey = await prisma.journey.create({
            data: {
                title: "Test Journey " + Date.now(),
                userId: "test-script-user",
                status: "DRAFT"
            }
        });
        console.log(`Successfully created journey in ${Date.now() - start}ms`);
        console.log('Journey ID:', journey.id);
    } catch (e) {
        console.error('DB Error:', e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
