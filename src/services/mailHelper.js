import config from "../config/index.js";
import transporter from "../config/transporter.config.js";

const verifyEmailService = async () => {
  try {
    await transporter.verify();
    console.log("Email service is ready");
  } catch (error) {
    console.log("Email service verification failed: ", error);
  }
};

const mailHelper = async ({ to, subject, text }) => {
  try {
    const emailInfo = await transporter.sendMail({
      from: config.SMTP_SENDER_EMAIL,
      to,
      subject,
      text,
    });
    console.log('Email sent successfully:', emailInfo.messageId);
    return emailInfo
  } catch (error) {
    console.error("Error sending email: ", error);
    throw error;
  }
};
export {verifyEmailService, mailHelper}