const { client, storage, ID } = require('./config/appwrite.config');

async function testConnection() {
    try {
        // Try to list files in your bucket
        const files = await storage.listFiles(process.env.APPWRITE_BUCKET_ID);
        console.log('Connection successful!');
        console.log('Files:', files);
    } catch (error) {
        console.error('Connection failed:', error);
    }
}

testConnection();
