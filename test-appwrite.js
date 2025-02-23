const { storage, ID } = require('./config/appwrite.config');
const fs = require('fs');
const path = require('path');

async function testConnection() {
    try {
        // Test bucket access
        const files = await storage.listFiles('67b8d5c5000a9b9feb4e');
        console.log('✅ Connection successful!');
        console.log('Files:', files);

        // Create a test file
        const testFilePath = path.join(__dirname, 'test.txt');
        fs.writeFileSync(testFilePath, 'Hello World');

        // Test file upload
        const fileData = fs.readFileSync(testFilePath);
        
        const uploadedFile = await storage.createFile(
            '67b8d5c5000a9b9feb4e',
            ID.unique(),
            fileData
        );
        
        console.log('✅ File upload successful:', uploadedFile);

        // Clean up test file
        fs.unlinkSync(testFilePath);

    } catch (error) {
        console.error('❌ Connection failed:', error);
        console.error('Error details:', error.response || error);
    }
}

testConnection(); 