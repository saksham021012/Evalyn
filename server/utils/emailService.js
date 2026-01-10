import nodemailer from 'nodemailer';
import { config } from '../config/config.js';

// Create reusable transporter
const transporter = nodemailer.createTransport({
    host: config.email.host,
    port: config.email.port,
    secure: false, // true for 465, false for other ports
    auth: {
        user: config.email.user,
        pass: config.email.password
    }
});

/**
 * Generate 6-digit OTP
 */
export const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Send OTP email
 */
export const sendOTPEmail = async (email, otp, purpose = 'signup') => {
    try {
        const subject = purpose === 'signup'
            ? 'Verify Your Email - AI Interviewer'
            : 'Reset Your Password - AI Interviewer';

        const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .otp-box { background: white; border: 2px dashed #667eea; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px; }
          .otp-code { font-size: 32px; font-weight: bold; color: #667eea; letter-spacing: 5px; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎯 AI Interviewer</h1>
          </div>
          <div class="content">
            <h2>Hello!</h2>
            <p>${purpose === 'signup' ? 'Thank you for signing up!' : 'You requested to reset your password.'}</p>
            <p>Your One-Time Password (OTP) is:</p>
            <div class="otp-box">
              <div class="otp-code">${otp}</div>
            </div>
            <p><strong>This OTP will expire in 10 minutes.</strong></p>
            <p>If you didn't request this, please ignore this email.</p>
          </div>
          <div class="footer">
            <p>© 2026 AI Interviewer. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

        const mailOptions = {
            from: `"AI Interviewer" <${config.email.user}>`,
            to: email,
            subject: subject,
            html: html
        };

        const info = await transporter.sendMail(mailOptions);

        console.log('Email sent:', info.messageId);
        return {
            success: true,
            messageId: info.messageId
        };

    } catch (error) {
        console.error('Error sending email:', error);
        return {
            success: false,
            error: error.message
        };
    }
};

/**
 * Send welcome email after successful verification
 */
export const sendWelcomeEmail = async (email, name) => {
    try {
        const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 Welcome to AI Interviewer!</h1>
          </div>
          <div class="content">
            <h2>Hi ${name}!</h2>
            <p>Your email has been successfully verified. You're all set to start your interview preparation journey!</p>
            <p><strong>What you can do:</strong></p>
            <ul>
              <li>📄 Upload your resume for AI-powered analysis</li>
              <li>🎯 Take personalized technical interviews</li>
              <li>📹 Record video responses</li>
              <li>📊 Get detailed performance feedback</li>
              <li>📈 Track your progress over time</li>
            </ul>
            <p>Ready to get started?</p>
            <div style="text-align: center;">
              <a href="#" class="button">Start Your First Interview</a>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

        const mailOptions = {
            from: `"AI Interviewer" <${config.email.user}>`,
            to: email,
            subject: 'Welcome to AI Interviewer! 🎉',
            html: html
        };

        await transporter.sendMail(mailOptions);

    } catch (error) {
        console.error('Error sending welcome email:', error);
    }
};
