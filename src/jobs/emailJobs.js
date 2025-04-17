import { agenda } from "../utils/agenda.js";
import { mailHelper } from "../services/mailHelper.js";

const testMailJob = "send test mail";

agenda.define(testMailJob, async (job) => {
  const { to, subject, text } = job.attrs.data;
  console.log("Starting email job with data:", job.attrs.data);
  try {
    const mailSent = await mailHelper({
      to,
      subject,
      text,
    });
    console.log("Test email sent successfully: ", mailSent);
  } catch (error) {
    console.error("Error in send test email job:", error);
    throw error;
  }
}, {priority: 'high', concurrency: 10},);

export const scheduleTestEmail = async (emailData, scheduledTime) => {
  try {

    const emailScheduled = await agenda.schedule(
      // 'one  minute',
      '2 minute',
      testMailJob,
      emailData
    );
    // console.log("Test email scheduled successfully:", emailScheduled);
  } catch (error) {
    console.error("Error scheduling test email:", error);
    throw error;
  }
};
