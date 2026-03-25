const nodemailer = require('nodemailer');
const env = require('../config/env');

const sendEmail = async ({ to, subject, html }) => {
  try {
    const transporter = nodemailer.createTransport({
      host: env.SMTP_HOST,
      port: Number(env.SMTP_PORT) || 587,
      secure: env.SMTP_SECURE === 'true', // true for 465, false for 587
      auth: {
        user: env.SMTP_USER,
        pass: env.SMTP_PASS,
      },
    });

    const mailOptions = {
      from: env.EMAIL_FROM || '"IJMCS Editorial Office" <noreply@ijmcs.com>',
      to,
      subject,
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`Email sent successfully: ${info.messageId}`);
    return true;
  } catch (error) {
    console.error(`Email sending failed for ${to}:`, error.message);
    // Don't throw error to prevent crashing the registration flow, just log it.
    return false;
  }
};

module.exports = sendEmail;
