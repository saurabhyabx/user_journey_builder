
import "dotenv/config";
import { db } from "./lib/db";
import { journeyRouter } from "./server/trpc/routers/journey";
import { createTRPCContext } from "./server/trpc/init";

async function main() {
    console.log("🚀 Starting Live Experience Simulation...");

    // 1. Setup Context
    const ctx = await createTRPCContext({ headers: new Headers() });
    const caller = journeyRouter.createCaller(ctx);

    // 2. Ensure User
    const user = await db.user.upsert({
        where: { email: "test-live@example.com" },
        update: {},
        create: { email: "test-live@example.com", id: "test-live-id" }
    });

    // 3. Create Journey
    const journey = await db.journey.create({
        data: { title: "Live Sim " + Date.now(), userId: user.id }
    });

    // 4. Simulate Chat Transcript
    const transcript = [
        { role: "assistant" as const, content: "What are you building?" },
        { role: "user" as const, content: "A subscription box for organic glamping gear." },
        { role: "assistant" as const, content: "Interesting! What is the core value?" },
        { role: "user" as const, content: "Curated luxury camping items delivered monthly." }
    ];

    console.log("💬 Sending Chat Transcript to AI...");
    const start = Date.now();

    try {
        const result = await caller.analyzeConversation({
            journeyId: journey.id,
            messages: transcript,
            currentStage: "description"
        });

        console.log(`✅ AI Replied in ${Date.now() - start}ms`);
        console.log("-----------------------------------------");
        console.log("Visual Output Generated:");
        console.log(`Nodes: ${result.nodes.length}`);
        console.log(`Edges: ${result.edges.length}`);

        if (result.nodes.length > 0) {
            console.log("First Node:", result.nodes[0].label, `(${result.nodes[0].type})`);
            console.log("Description:", result.nodes[0].description);
        } else {
            console.log("⚠️ No nodes generated. Logic might be empty.");
        }

    } catch (e) {
        console.error("❌ Test Failed:", e);
    } finally {
        await db.$disconnect();
    }
}

main();
