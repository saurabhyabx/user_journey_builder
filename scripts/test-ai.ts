
import Anthropic from '@anthropic-ai/sdk';
import 'dotenv/config';

async function main() {
    console.log("Testing Claude API...");
    if (!process.env.ANTHROPIC_API_KEY) {
        console.error("No API Key found in env!");
        return;
    }

    const anthropic = new Anthropic({
        apiKey: process.env.ANTHROPIC_API_KEY,
    });

    try {
        const start = Date.now();
        const msg = await anthropic.messages.create({
            model: "claude-3-haiku-20240307",
            max_tokens: 100,
            messages: [{ role: "user", content: "Say 'Hello User' and nothing else." }],
        });
        console.log(`Claude Response in ${Date.now() - start}ms`);
        
        // Extract text from content block (handle different block types)
        const textContent = msg.content.find((block) => block.type === 'text');
        if (textContent && 'text' in textContent) {
            console.log("Response:", textContent.text);
        } else {
            console.log("Response:", JSON.stringify(msg.content));
        }
    } catch (e) {
        console.error("Claude API Error:", e);
    }
}

main();
