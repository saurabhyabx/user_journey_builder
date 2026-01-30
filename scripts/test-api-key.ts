import Anthropic from '@anthropic-ai/sdk';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const apiKey = process.env.ANTHROPIC_API_KEY;

if (!apiKey) {
    console.log('❌ ANTHROPIC_API_KEY is not set in .env file');
    process.exit(1);
}

console.log('🔑 API Key found:', apiKey.substring(0, 15) + '...' + apiKey.substring(apiKey.length - 4));

const client = new Anthropic({ apiKey });

async function testApiKey() {
    console.log('\n🧪 Testing Anthropic API connection...\n');

    try {
        const startTime = Date.now();

        const response = await client.messages.create({
            model: 'claude-sonnet-4-20250514',
            max_tokens: 100,
            messages: [{ role: 'user', content: 'Say "API is working!" in a fun way' }]
        });

        const elapsed = Date.now() - startTime;

        console.log('✅ API Key is WORKING!');
        console.log(`⏱️  Response time: ${elapsed}ms`);
        console.log(`📝 Model: ${response.model}`);
        console.log(`🔢 Tokens used: ${response.usage.input_tokens} input, ${response.usage.output_tokens} output`);
        console.log(`\n💬 Response: ${response.content[0].type === 'text' ? response.content[0].text : 'N/A'}`);

    } catch (error: any) {
        console.log('❌ API Key Error!');
        console.log(`   Status: ${error.status || 'N/A'}`);
        console.log(`   Message: ${error.message}`);

        if (error.status === 401) {
            console.log('\n⚠️  Your API key appears to be invalid or expired.');
            console.log('   Please check your API key at: https://console.anthropic.com/');
        }
    }
}

testApiKey();
