import mongoose, { Mongoose } from "mongoose";
import { cache } from "react";
const MONGODB_URL = process.env.MongoDB_URL;

interface MongooseConnection {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
}

let cached: MongooseConnection = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = {
    conn: null,
    promise: null,
  };
}

/**
 * connectToDatabase is an asynchronous function that connects to a MongoDB database.
 * 
 * It first checks if a connection to the database already exists. If it does, it
 * returns the existing connection.
 * 
 * If no existing connection exists, it checks if the MongoDB_URL environment
 * variable is defined. If it is not defined, it throws an error.
 * 
 * If the MongoDB_URL environment variable is defined, it creates a new connection
 * to the database using mongoose.connect(). It sets the database name to "imaginify"
 * and disables buffering of commands.
 * 
 * Finally, it waits for the connection promise to resolve and returns the connection.
 * 
 * @returns {Promise<Mongoose>} A promise that resolves to the MongoDB connection.
 */
export const connectToDatabase = async () => {
  // Check if a connection to the database already exists
  if (cached.conn) return cached.conn;

  // Check if the MongoDB_URL environment variable is defined
  if (!MONGODB_URL) throw new Error("MongoDB_URL is not defined");

  // Create a new connection to the database if one does not exist
  cached.promise =
    cached.promise ||
    mongoose.connect(MONGODB_URL, {
      // Set the database name to "imaginify"
      dbName: "imaginify",
      // Disable buffering of commands
      bufferCommands: false,
    });

  // Wait for the connection promise to resolve and return the connection
  cached.conn = await cached.promise;

  return cached.conn;
};
