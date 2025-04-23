import { mailHelper } from "../services/mailHelper.js";
import { agenda } from "../utils/agenda.js";
import CustomError from "../services/CustomError.js";

const sequenceJobName = "send email sequence";

agenda.define(sequenceJobName, async (job) => {
  const { emails, to } = job.attrs.data;
  const emailData = emails[0];

  console.log(`Sending email: `, emailData);

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
});

export const scheduleEmailSequence = async (emailAddress, emails) => {
  if (!emailAddress) {
    throw new CustomError("Email address is required", 400);
  }

  if (!Array.isArray(emails) || emails.length === 0) {
    throw new CustomError("Valid email sequence array is required", 400);
  }

  console.log("scheduleEmailSequence: ", emailAddress);
  const data = {
    to: emailAddress,
    emails,
  };

  const firstDelay = emails[0].delay ?? "";
  
  try {
    await agenda.schedule(firstDelay, sequenceJobName, data);
  } catch (error) {
    console.error("Error scheduling sequence emails:", error);
    throw new CustomError("Failed to schedule email sequence", 500);
  }
};
