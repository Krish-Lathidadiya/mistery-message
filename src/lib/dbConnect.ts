import mongoose from "mongoose";

type ConnectionObject = {
  isConnected?: number;
};

const connection: ConnectionObject = {};

async function dbConnect(): Promise<void> {
  if (connection.isConnected) {
    console.log("Alread connected to databse");
    return;
  }

  try {
    const db = await mongoose.connect(process.env.MONGO_URI || "", {});
    connection.isConnected = db.connections[0].readyState;
    console.log("DB Connected successfully");
  } catch (error) {
    console.error("Database connection failed", error);
    process.exit(1); // Exit the process with a failure code
  }
}

export default dbConnect;
