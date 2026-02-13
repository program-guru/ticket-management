import mongoose from "mongoose"

export default async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI || "");
    console.log("MongoDB is Connected!")
  } catch (error) {
    console.log("MongoDB Connnection Error: ", error)
    process.exit(1)
  }
}
