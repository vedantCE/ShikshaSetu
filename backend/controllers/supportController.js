const nodemailer = require('nodemailer');
const asyncHandler = require('../middleware/asyncHandler');
const AppError = require('../utils/AppError');

const requiredEnv = ['SMTP_USER', 'SMTP_APP_PASSWORD', 'SUPPORT_RECIPIENTS'];

const ensureEmailEnv = () => {
  const missing = requiredEnv.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    throw new AppError(
      `Missing email configuration: ${missing.join(', ')}`,
      500
    );
  }
};

const buildTransporter = () =>
  nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_APP_PASSWORD,
    },
  });

exports.sendHelpRequest = asyncHandler(async (req, res) => {
  ensureEmailEnv();

  const { name, email, message } = req.body || {};

  // Validation
  if (!name || !email || !message) {
    throw new AppError('Name, email, and message are required', 400);
  }

  const trimmedMessage = String(message).trim();
  if (!trimmedMessage) {
    throw new AppError('Message cannot be empty', 400);
  }

  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email));
  if (!isValidEmail) {
    throw new AppError('Please provide a valid email', 400);
  }

  // Recipients
  const recipients = process.env.SUPPORT_RECIPIENTS.split(',')
    .map((entry) => entry.trim())
    .filter(Boolean);

  if (recipients.length === 0) {
    throw new AppError('No support recipients configured', 500);
  }

  // Ticket + time
  const ticketId = `SUP-${Date.now()}`;
  const timestamp = new Date().toISOString();

  const transporter = buildTransporter();

  await transporter.sendMail({
    from: `Nuviq Help Desk <${process.env.SMTP_USER}>`,
    to: process.env.SMTP_USER,
    bcc: recipients,
    replyTo: email,
    subject: `🚨 Help Request from ${name}`,

    // TEXT VERSION (fallback)
    text: `
Hello Nuviq Support Team 👋,

Ticket ID: #${ticketId}
Time: ${timestamp}
Name: ${name}
Email: ${email}

Message:
${trimmedMessage}
    `,

    // HTML VERSION (DESIGNED EMAIL)
    html: `
    <div style="font-family: Arial, sans-serif; background:#f4f6f8; padding:20px;">
      
      <div style="max-width:600px; margin:auto; background:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 4px 12px rgba(0,0,0,0.1);">

        <!-- Header -->
        <div style="background:#1B337F; padding:16px; color:white;">
          <h2 style="margin:0;">Nuviq Support</h2>
        </div>

        <!-- Body -->
        <div style="padding:20px;">
          
          <h3 style="margin-top:0;">New Help Request 🚨</h3>

          <p style="font-size:14px; color:#374151; margin-top:10px;">
            Hello Nuviq Support Team 👋,
          </p>

          <p style="font-size:14px; color:#6b7280;">
            A new help request has been submitted. Please review the details below.
          </p>

          <hr style="margin:16px 0;" />

          <p>
            <strong>Ticket ID:</strong> 
            <span style="background:#EEF2FF; padding:4px 8px; border-radius:6px;">
              #${ticketId}
            </span>
          </p>

          <p><strong>Time:</strong> ${new Date(timestamp).toLocaleString()}</p>

          <hr style="margin:20px 0;" />

          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>

          <hr style="margin:20px 0;" />

          <p style="font-weight:600;">Message:</p>
          <div style="background:#f9fafb; padding:12px; border-radius:8px; line-height:1.5;">
            ${trimmedMessage}
          </div>

          <!-- Reply Button -->
          <a href="mailto:${email}" 
             style="display:inline-block; margin-top:20px; padding:10px 16px; background:#1B337F; color:white; border-radius:6px; text-decoration:none;">
             Reply to User
          </a>
        </div>

        <!-- Footer -->
        <div style="background:#f1f5f9; padding:12px; text-align:center; font-size:12px; color:#6b7280;">
          Sent from Nuviq App • ${new Date(timestamp).getFullYear()}
        </div>

      </div>

    </div>
    `,
  });

  res.json({
    message: 'Message sent successfully',
    ticketId,
  });
});