
import "dotenv/config";
import { db } from "./lib/db";
import { aiRouter } from "./server/trpc/routers/ai";
import fs from "fs";

async function main() {
    console.log("🚀 Starting End-to-End Backend Test (Haiku Version)...");

    // Mask key check
    const key = process.env.ANTHROPIC_API_KEY;
    console.log("🔑 Key check:", key ? "Present" : "MISSING");

    // 1. Ensure a user exists
    console.log("👤 Ensuring test user exists...");
    const user = await db.user.upsert({
        where: { email: "test@example.com" },
        update: {},
        create: {
            email: "test@example.com",
            id: "test-user-id",
            name: "Test User"
        },
    });
    console.log("✅ User ready:", user.id);

    // 2. Create a Journey
    console.log("📝 Creating test journey...");
    const journey = await db.journey.create({
        data: {
            userId: user.id,
            title: "Haiku Test Journey " + Date.now(),
            status: "DRAFT",
        }
    });
    console.log("✅ Journey created:", journey.id);

    // 3. Invoke AI Router
    console.log("🤖 Invoking Claude (Haiku) via TRPC...");

    const caller = aiRouter.createCaller({
        db,
        headers: new Headers()
    });

    const interviewData = {
        productType: "AI Coding Assistant",
        description: "An agent that helps developers write code faster",
        problem: "Repetitive boilerplate code",
        userType: "Developers",
        experienceLevel: "Intermediate",
        primaryAction: "Generate Code",
        successDefinition: "Code compiles and passes tests"
    };

    try {
        const result = await caller.generateJourney({
            journeyId: journey.id,
            interviewData
        });

        console.log("✅ AI Response received!");

        // 4. Verify Database
        const updatedJourney = await db.journey.findUnique({
            where: { id: journey.id },
            include: { nodes: true, connections: true }
        });

        console.log("📊 Verification Results:");
        console.log(`   - Nodes Created: ${updatedJourney?.nodes.length}`);
        console.log(`   - Connections Created: ${updatedJourney?.connections.length}`);
        console.log(`   - AI Response Stored: ${!!updatedJourney?.aiResponse}`);

    } catch (error: any) {
        console.error("❌ ERROR FAILED:", error.message);
        const errorLog = {
            message: error.message,
            stack: error.stack,
            cause: error.cause, // TRPC wraps errors, cause might be the real one
            raw: error
        };
        fs.writeFileSync("last_run_error.txt", JSON.stringify(errorLog, null, 2));
    }
}

main();
