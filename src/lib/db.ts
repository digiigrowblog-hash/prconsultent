import mongoose from "mongoose";

// Check if already connected to avoid multiple connections
let isConnected = false;

export async function Db() {
  // If already connected, return early
  if (isConnected && mongoose.connection.readyState === 1) {
    return;
  }

  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      throw new Error("MONGO_URI environment variable is not set");
    }

    // Connection options for MongoDB (handles both Atlas and local)
    const options: mongoose.ConnectOptions = {
      serverSelectionTimeoutMS: 10000, // Timeout after 10s
      socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
    };

    // For mongodb+srv:// (MongoDB Atlas), TLS is automatically enabled
    // For regular mongodb:// connections, check if SSL is needed
    if (mongoUri.startsWith("mongodb+srv://")) {
      // MongoDB Atlas automatically handles TLS, no need to set it explicitly
      // But we can add retry options
      options.retryWrites = true;
      options.w = 'majority';
      
      // If SSL error persists, you can temporarily set ALLOW_INSECURE_TLS=true in .env
      // WARNING: Only use this for development/testing, never in production!
      if (process.env.ALLOW_INSECURE_TLS === 'true' && process.env.NODE_ENV !== 'production') {
        console.warn('⚠️  WARNING: Insecure TLS mode enabled. This should only be used for development!');
        options.tlsAllowInvalidCertificates = true;
      }
    } else if (mongoUri.includes("ssl=true") || mongoUri.includes("tls=true")) {
      // For regular mongodb:// with SSL/TLS
      options.tls = true;
    }

    await mongoose.connect(mongoUri, options);
    
    const connection = mongoose.connection;
    isConnected = true;

    connection.on("connected", () => {
      console.log("MongoDB is connected successfully");
      isConnected = true;
    });

    connection.on("error", (err) => {
      console.log("MongoDB connection error: " + err);
      isConnected = false;
      // Don't exit process in Next.js API routes, just log the error
      if (process.env.NODE_ENV === 'production') {
        console.error("MongoDB connection failed in production");
      }
    });

    connection.on("disconnected", () => {
      console.log("MongoDB disconnected");
      isConnected = false;
    });

  } catch (error) {
    console.log("Error in MongoDB connection:");
    console.error(error);
    isConnected = false;
    throw error; // Re-throw to let the caller handle it
  }
}