import mongoose from "mongoose";
import configKeys from "../../config";

const connectDB = async () => {
  try {
    await mongoose.connect(configKeys.MONGO_DB_URL);
    console.log("Database Connected Successfully");
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};
export default connectDB;
