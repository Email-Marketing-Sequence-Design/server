import app from './app.js';
import mongoose from "mongoose";
import config from "./config/index.js";
import { verifyEmailService } from './services/mailHelper.js';
import { startAgenda } from './utils/agenda.js';

(async () => {
  try {
    await mongoose.connect(config.MONGO_URL).then(() => {
        console.log('Connected to MongoDB');
      }).catch((error) => {
        console.error('Error connecting to MongoDB:', error.message);
      });

       // Start Agenda
    await startAgenda();
    
    // Define Agenda jobs
    // defineJobs();
    
    // Verify email service
    await verifyEmailService();

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
