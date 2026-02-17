import nodemailer from 'nodemailer';

// Create a transporter
// For DEV: We use Ethereal (fake SMTP)
// For PROD: We would use SendGrid, Mailgun, or Gmail
const createTransporterConfig = async () => {
  // If we have real credentials in .env, use them
  if (process.env.SMTP_HOST) {
    return {
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    };
  }

  // Otherwise, generate a test account (Development mode)
  const testAccount = await nodemailer.createTestAccount();

  return {
    host: testAccount.smtp.host,
    port: testAccount.smtp.port,
    secure: testAccount.smtp.secure,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  };
};

const configuration = await createTransporterConfig();

export const transporter = nodemailer.createTransport(configuration);