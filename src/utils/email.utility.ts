import nodemailer from "nodemailer"


// Create a new transporter object
export const transporter = nodemailer.createTransport({
  host: 'live.smtp.mailtrap.io',
  port: 587,
  auth: {
    user: 'api',
    pass: 'a682624ee6486842c44c12268481aad4',
  },
});
