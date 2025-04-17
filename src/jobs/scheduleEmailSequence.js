import { mailHelper } from "../services/mailHelper.js";
import { agenda } from "../utils/agenda.js";

const sequenceJobName = "send email sequence";

agenda.define(sequenceJobName, async (job) => {
  const { emails, to } = job.attrs.data;

  const emailData = emails[0];

  console.log(`Sending email: `, emailData);

  try {
    const mailSent = await mailHelper({
      to,
      subject: emailData.subject,
      text: emailData.body,
    });
    console.log("Email sent successfully: ", mailSent);
    const remainingEmails = emails.slice(1);
    console.log("remainingEmails: ", remainingEmails);
    if (remainingEmails.length > 0) {
      const nextDelay = remainingEmails[0].delay ?? "";
      const data = {
        to,
        emails: remainingEmails,
      };
      await agenda.schedule(nextDelay, sequenceJobName, data);
      console.log(
        `⏳ Scheduled email "Subject: ${remainingEmails[0].subject}", after delay "${nextDelay}"`
      );
    }
  } catch (error) {
    console.error("Error in send test email job:", error);
    throw error;
  }
});

export const scheduleEmailSequence = async (emailAddress, emails) => {
  try {
    if (!emailAddress) return;
    if (!Array.isArray(emails) || emails.length === 0) return;
    console.log("scheduleEmailSequence: ", emailAddress);
    const data = {
      to: emailAddress,
      emails,
    };
    const firstDelay = emails[0].delay ?? "";
    await agenda.schedule(firstDelay, sequenceJobName, data);
  } catch (error) {
    console.error("Error scheduling sequence emails:", error);
    throw error;
  }
};
