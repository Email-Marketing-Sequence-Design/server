import app from './app.js';
import mongoose from "mongoose";
import config from "./config/index.js";

(async () => {
  try {
    await mongoose.connect(config.MONGO_URL).then(() => {
        console.log('Connected to MongoDB');
      }).catch((error) => {
        console.error('Error connecting to MongoDB:', error.message);
      });

    app.on("error", (err) => {
      console.error("ERROR: ", err);
      throw err;
    });
    
    app.listen(config.PORT, () => {
      console.log(`Server is running on port ${config.PORT}`);
    });
  } catch (error) {
    console.error("ERROR: ", error);
    throw err;
  }
})();
