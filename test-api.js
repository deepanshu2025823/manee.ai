// test-api.js
const https = require('https');
const fs = require('fs');
const path = require('path');

const envPath = path.resolve(__dirname, '.env');
const envFile = fs.readFileSync(envPath, 'utf8');
const match = envFile.match(/GEMINI_API_KEY="?([^"\n\r]+)"?/);
const apiKey = match ? match[1] : null;

console.log("---------------------------------------------------");
console.log("🔍 DIAGNOSTIC MODE");
console.log("Found API Key:", apiKey ? "YES (Starts with " + apiKey.substring(0, 5) + "...)" : "NO ❌");

if (!apiKey) {
    console.error("❌ Error: API Key not found in .env file.");
    process.exit(1);
}

const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

https.get(url, (res) => {
    let data = '';

    res.on('data', (chunk) => {
        data += chunk;
    });

    res.on('end', () => {
        if (res.statusCode === 200) {
            const response = JSON.parse(data);
            console.log("\n✅ SUCCESS! Your API Key is working.");
            console.log("Here are the models available to you:");
            
            const models = response.models || [];
            const flashModel = models.find(m => m.name.includes('flash'));
            
            models.forEach(m => {
                if (m.name.includes('gemini')) {
                    console.log(` - ${m.name}`); 
                }
            });

            if (flashModel) {
                console.log(`\n🚀 RECOMMENDED FIX: Use "${flashModel.name.replace('models/', '')}" in route.ts`);
            } else {
                console.log("\n⚠️ WARNING: No 'Gemini' models found. You need to create a NEW Project in AI Studio.");
            }

        } else {
            console.error(`\n❌ API ERROR: ${res.statusCode} ${res.statusMessage}`);
            console.error("Response:", data);
            console.log("\n💡 SOLUTION: Your API Key is restricted or the Project is broken.");
            console.log("   -> Go to Google AI Studio.");
            console.log("   -> Click Top-Left Dropdown (Project).");
            console.log("   -> Click 'Create New Project' (Do NOT use 'Default').");
            console.log("   -> Create a new API Key in that new project.");
        }
        console.log("---------------------------------------------------");
    });

}).on("error", (err) => {
    console.error("Error: " + err.message);
});