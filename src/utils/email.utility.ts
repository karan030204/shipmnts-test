import nodemailer from "nodemailer"


// Create a new transporter object
export const transporter = nodemailer.createTransport({
  host: 'smtp-relay.sendinblue.com',
  port: 587,
  auth: {
    user: 'user@example.com',
    pass: 'password',
  },
});
