const env = require('../config/env');

/**
 * Generates the official IJMCS HTML Email Template
 * 
 * @param {Object} params
 * @param {string} params.title - Main heading of the email
 * @param {string} params.recipientName - Name of the receiver (e.g., "Dr. Smith")
 * @param {string} params.bodyHtml - The core message inner HTML
 * @param {string} [params.buttonText] - Optional text for the primary Call To Action button
 * @param {string} [params.buttonUrl] - Optional URL for the primary Call To Action button
 * @returns {string} - Full HTML string ready to be sent via Nodemailer
 */
const generateEmailTemplate = ({ title, recipientName, bodyHtml, buttonText, buttonUrl }) => {
  const ctaBlock = buttonText && buttonUrl ? `
    <div style="text-align: center; margin: 35px 0;">
      <a href="${buttonUrl}" style="background-color: #d4622a; color: #ffffff; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: bold; font-family: 'Helvetica Neue', Arial, sans-serif; display: inline-block; box-shadow: 0 4px 6px rgba(212, 98, 42, 0.2);">
        ${buttonText}
      </a>
    </div>
    <p style="font-size: 13px; color: #666; margin-top: 20px;">
      If the button above does not work, copy and paste this link into your web browser:<br/>
      <a href="${buttonUrl}" style="color: #3b72a8; word-break: break-all;">${buttonUrl}</a>
    </p>
  ` : '';

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 0; color: #334155; line-height: 1.6; }
    .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.05); }
    .header { background-color: #1a3a5c; padding: 30px 40px; text-align: center; border-bottom: 4px solid #d4622a; }
    .header h1 { color: #ffffff; margin: 0; font-size: 24px; font-family: Georgia, serif; letter-spacing: 1px; }
    .header p { color: #94a3b8; margin: 5px 0 0 0; font-size: 12px; text-transform: uppercase; letter-spacing: 2px; }
    .content { padding: 40px; }
    .content h2 { color: #1a3a5c; font-size: 20px; margin-top: 0; }
    .content p { font-size: 15px; margin-bottom: 20px; }
    .footer { background-color: #f1f5f9; padding: 30px 40px; text-align: center; border-top: 1px solid #e2e8f0; }
    .footer p { margin: 0; font-size: 12px; color: #64748b; line-height: 1.5; }
    .footer a { color: #1a3a5c; text-decoration: none; font-weight: bold; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>IJMCS</h1>
      <p>Igniting Journal of Multidisciplinary and Contemporary Studies</p>
    </div>
    
    <div class="content">
      <h2>${title}</h2>
      <p>Dear ${recipientName},</p>
      
      <div style="margin: 25px 0;">
        ${bodyHtml}
      </div>
      
      ${ctaBlock}
      
      <p style="margin-top: 30px; font-size: 14px; color: #475569;">
        Best regards,<br/>
        <strong>The IJMCS Editorial Team</strong>
      </p>
    </div>
    
    <div class="footer">
      <p>
        This email was sent by the <strong>IJMCS Editorial Office</strong>.<br/>
        If you have any questions, please reply directly to <a href="mailto:${env.EMAIL_FROM || 'journal.ignitingmultidisciplinary@lasu.edu.ng'}">${env.EMAIL_FROM || 'journal.ignitingmultidisciplinary@lasu.edu.ng'}</a>.
      </p>
      <p style="margin-top: 15px; font-size: 11px; color: #94a3b8;">
        &copy; ${new Date().getFullYear()} IJMCS. All rights reserved.<br/>
        Strictly confidential and intended solely for the use of the individual or entity to whom they are addressed.
      </p>
    </div>
  </div>
</body>
</html>
  `;
};

module.exports = generateEmailTemplate;
