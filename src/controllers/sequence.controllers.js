import { scheduleEmailSequence } from "../jobs/scheduleEmailSequence.js";
import asyncHandler from "../services/asyncHandler.js";
import CustomError from "../services/CustomError.js";

export const scheduleSequence = asyncHandler(async (req, res) => {
  const { emailAddress, emails } = req.body;

  // Validate the input
  if (!emailAddress || !Array.isArray(emails) || emails.length === 0) {
    throw new CustomError(
      "Invalid input. Required: emailAddress and non-empty emails",
      400
    );
  }

  // Schedule the sequence 
  await scheduleEmailSequence(emailAddress, emails);

  res.json({
    success: true,
    message: "Email sequence scheduled successfully",
    data: req.body,
    totalEmails: emails.length,
  });
});


// catch (error) {
//   console.error("Error scheduling email sequence:", error);
//   res.status(500).json({
//     error: "Failed to schedule email sequence",
//     details: error.message,
//   });
// }