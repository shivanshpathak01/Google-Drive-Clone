const { Client, Storage, ID, Account } = require('node-appwrite');
require('dotenv').config();

// Initialize Appwrite client
const client = new Client()
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject('6766cb840038edc08ef1')
    .setKey('standard_0a896fa6591cfdf0e8883c814a8b29665841b311e50b431c81a3a1c053e705422e13fe6cbde9d3aac2a4f4a2d0a657f5be00a15bbeed76999322a0eb6dfb89dc3537d50d482dabc04347c8a168475f7a806fd1a4d09589e1449fb2a6d7815cb3089b7a7b70e8a701529d53a0c1371db85180e0a5691d443f2abfbcc7916813b1');

// Initialize services
const storage = new Storage(client);
const account = new Account(client);

// Export the initialized services
module.exports = { 
    client, 
    storage, 
    account,
    ID,
    bucketId: '67b8d5c5000a9b9feb4e'
}; 