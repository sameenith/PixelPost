import mongoose from "mongoose";
const connectDB = async () => {
  try {
   const res =  await mongoose.connect(process.env.MONGO_URL);
   
    console.log(`MongoDB Connected successfully: ${res.connection.host}`);

  } catch (error) {
    console.log("Error connecting to DB", error);
  }
};

export default connectDB;
