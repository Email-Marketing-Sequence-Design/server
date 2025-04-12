import {Agenda} from "@hokify/agenda";
import config from "../config/index.js";

const agenda = new Agenda({
  db: { address: config.MONGO_URL, collection: "mailAgendaJobs" },
});

agenda.on("error", (error) => {
  console.error("Agenda error: ", error);
});

const startAgenda = async () => {
  try {
    await agenda.start();
    console.log("Agenda started successfully");
  } catch (error) {
    console.error("Error starting agenda:", error);
  }
};

export { agenda, startAgenda };
