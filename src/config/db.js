import mongoose from "mongoose";

const connectDb = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGOURI);
    console.log("mongo db connected");
  } catch (error) {
    console.log("error in db-->", error);
  }
};

export default connectDb;