
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Checking Prisma Client models...');

    const models = [
        'carbonEntry',
        'waterReport',
        'company',
        'membershipRequest'
    ];

    for (const model of models) {
        if ((prisma as any)[model]) {
            console.log(`✅ Model '${model}' exists.`);
        } else {
            console.error(`❌ Model '${model}' MISSING in PrismaClient!`);
        }
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
