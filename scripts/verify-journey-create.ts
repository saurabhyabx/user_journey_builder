import "dotenv/config";
import { db } from "../lib/db";
import { journeyRouter } from "../server/trpc/routers/journey";
import { aiRouter } from "../server/trpc/routers/ai";

async function main() {
    console.log("🚀 Testing Journey + AI Generation...");

    // Mock Context
    const ctx = {
        db,
        headers: new Headers(),
    };

    const journeyCaller = journeyRouter.createCaller(ctx);
    const aiCaller = aiRouter.createCaller(ctx);

    try {
        const title = "AI Principle Test " + Date.now();
        console.log(`\nStep 1: Creating Journey...`);

        const journey = await journeyCaller.create({
            title,
            description: "Testing First Principles Prompt"
        });

        console.log("✅ Journey Created:", journey.id);

        console.log(`\nStep 2: Invoking AI Generation (The Brain)...`);

        const testInterviewData = {
            productType: "SaaS Project Management Tool",
            userType: "Remote Teams",
            discoveryChannels: "LinkedIn",
            primaryAction: "Sign up trial",
            description: "A collaborative tool",
            problem: "Chaos and lack of visibility"
        };

        const result = await aiCaller.generateJourney({
            journeyId: journey.id,
            interviewData: testInterviewData
        });

        console.log("\n✅ AI Generation Successful!");
        console.log("Nodes generated:", result.nodes?.length);
        console.log("Connections generated:", result.connections?.length);

        if (result.nodes?.length > 0) {
            console.log("SAMPLE NODE DESC:", result.nodes[0].description);
        }

    } catch (error) {
        console.error("❌ Test Failed:", error);
        process.exit(1);
    }
}

main();
