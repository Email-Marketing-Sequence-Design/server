import {Agenda} from "@hokify/agenda";
import config from "../config/index.js";

const agenda = new Agenda({
  db: { address: config.MONGO_URL, collection: "mailAgendaJobs" }, processEvery: '30 seconds',
});

agenda.on("error", (error) => {
  console.error("Agenda error: ", error);
});

agenda.on('success', (job) => {
  console.log(`Job ${job.attrs.name} completed successfully`);
});
const startAgenda = async () => {
  try {
    await agenda.start();
    console.log("Agenda started successfully");
    return agenda; 
  } catch (error) {
    console.error("Error starting agenda:", error);
  }
};

export { agenda, startAgenda };
