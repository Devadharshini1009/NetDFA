import mongoose from 'mongoose';

let isConnected = false;

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/domain_dns_tool';
  
  try {
    mongoose.set('strictQuery', true);
    
    // Connect with a reasonable server selection timeout so startup isn't blocked indefinitely if DB is offline
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 3000,
      connectTimeoutMS: 5000,
    });

    isConnected = true;
    console.log(`[MongoDB] Connected successfully to ${mongoose.connection.host}/${mongoose.connection.name}`);
  } catch (err) {
    isConnected = false;
    console.warn(`[MongoDB] Connection failed: ${err.message}. Running in offline database mode.`);
  }

  mongoose.connection.on('connected', () => {
    isConnected = true;
    console.log('[MongoDB] Connection state: Connected');
  });

  mongoose.connection.on('error', (err) => {
    isConnected = false;
    console.error(`[MongoDB] Connection error: ${err.message}`);
  });

  mongoose.connection.on('disconnected', () => {
    isConnected = false;
    console.warn('[MongoDB] Connection state: Disconnected');
  });
};

export const getDbStatus = () => ({
  connected: isConnected && mongoose.connection.readyState === 1,
  readyState: mongoose.connection.readyState,
  host: isConnected ? mongoose.connection.host : null,
  name: isConnected ? mongoose.connection.name : null,
});
