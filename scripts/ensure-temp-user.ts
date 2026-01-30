
import "dotenv/config";
import { db } from "../lib/db";

async function main() {
    console.log("👤 Checking for temp user...");

    const tempUserId = "temp-user-id";

    const user = await db.user.upsert({
        where: { id: tempUserId },
        update: {}, // No updates if exists
        create: {
            id: tempUserId,
            email: "temp@example.com",
            name: "Temporary User",
            emailVerified: new Date(),
        },
    });

    console.log(`✅ User ensured: ${user.id} (${user.email})`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    });
