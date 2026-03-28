const nodemailer = require('nodemailer');
const env = require('../config/env');

const sendEmail = async ({ to, subject, html }) => {
  console.log(`[DEBUG] Attempting to send email to ${to}...`);
  console.log(`[DEBUG] SMTP Config: Host=${env.SMTP_HOST}, Port=${env.SMTP_PORT}, User=${env.SMTP_USER}`);
  
  try {
    const transporter = nodemailer.createTransport({
      host: env.SMTP_HOST,
      port: Number(env.SMTP_PORT) || 587,
      secure: String(env.SMTP_SECURE) === 'true', // Handle both boolean and string 'true'
      auth: {
        user: env.SMTP_USER,
        pass: env.SMTP_PASS,
      },
      // Increase timeout for slow relays
      connectionTimeout: 10000,
      greetingTimeout: 5000,
    });

    const mailOptions = {
      from: env.EMAIL_FROM || '"IJMCS Editorial Office" <noreply@veritas.edu.ng>',
      to,
      subject,
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`[SUCCESS] Email sent to ${to}: ${info.messageId}`);
    return true;
  } catch (error) {
    console.error(`[ERROR] Email sending failed for ${to}:`, error);
    if (error.code === 'EAUTH') {
      console.error('[ERROR] Authentication failed. Please check SMTP_USER and SMTP_PASS (App Password).');
    }
    return false;
  }
};

module.exports = sendEmail;
