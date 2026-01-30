
import "dotenv/config";
import { db } from "../lib/db";
import { journeyRouter } from "../server/trpc/routers/journey";

async function main() {
    console.log("🚀 Testing Create Journey Procedure...");

    // Mock Context
    const ctx = {
        db,
        headers: new Headers(),
        // Add other context fields if defined in your createTRPCContext
    };

    const caller = journeyRouter.createCaller(ctx);

    try {
        const title = "Automated Backend Test " + Date.now();
        console.log(`invoking create({ title: "${title}" })`);

        const journey = await caller.create({
            title,
            description: "Created via verifcation script due to browser tool limitation"
        });

        console.log("✅ Journey Created Successfully!");
        console.log("Jump ID:", journey.id);
        console.log("Title:", journey.title);
        console.log("Status:", journey.status);

        // Verify in DB directly
        const dbCheck = await db.journey.findUnique({ where: { id: journey.id } });
        if (dbCheck) {
            console.log("✅ Database Verification: Found record in DB.");
        } else {
            console.error("❌ Database Verification: Record NOT found!");
            process.exit(1);
        }

    } catch (error) {
        console.error("❌ Failed to create journey:", error);
        process.exit(1);
    }
}

main();
