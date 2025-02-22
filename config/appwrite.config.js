const { Client, Storage, ID } = require('node-appwrite');
require('dotenv').config();

const client = new Client();

const endpoint = process.env.APPWRITE_ENDPOINT;
const projectId = process.env.APPWRITE_PROJECT_ID;
const apiKey = process.env.APPWRITE_API_KEY;

if (!endpoint || !projectId || !apiKey) {
    console.error("❌ ERROR: Missing Appwrite configuration! Check your .env file.");
    process.exit(1);
}

client
    .setEndpoint(endpoint)
    .setProject(projectId)
    .setKey(apiKey); // Important: Add the API key

const storage = new Storage(client);

module.exports = { client, storage, ID };
