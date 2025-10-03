// Email service using Resend
import { Resend } from 'resend';

export interface EmailVerificationData {
  email: string;
  username: string;
  verificationToken: string;
  verificationUrl: string;
}

export async function sendVerificationEmail(data: EmailVerificationData) {
  const apiKey = process.env.RESEND_API_KEY;
  
  if (!apiKey) {
    throw new Error('RESEND_API_KEY not configured. Please set up email service.');
  }

  const resend = new Resend(apiKey);
  
  try {
    const { email, username, verificationUrl } = data;
    
    const result = await resend.emails.send({
      from: 'WEGRAM <noreply@wegram.app>',
      to: [email],
      subject: 'Welcome to WEGRAM! Please verify your email',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <img src="https://i.ibb.co/TxdWc0kL/IMG-9101.jpg" alt="WEGRAM Logo" style="width: 80px; height: 80px; border-radius: 12px; object-fit: cover;">
            <h1 style="color: #333; margin: 20px 0 10px 0;">Welcome to WEGRAM!</h1>
            <p style="color: #666; font-size: 16px;">Hi ${username}, thanks for joining the future of social media!</p>
          </div>
          
          <div style="background: linear-gradient(135deg, #06b6d4, #8b5cf6); padding: 30px; border-radius: 12px; text-align: center; margin-bottom: 30px;">
            <h2 style="color: white; margin: 0 0 15px 0;">Verify Your Email Address</h2>
            <p style="color: white; margin: 0 0 25px 0; font-size: 16px;">Click the button below to verify your email and complete your WEGRAM account setup.</p>
            <a href="${verificationUrl}" style="background: white; color: #333; padding: 12px 30px; border-radius: 8px; text-decoration: none; font-weight: bold; display: inline-block;">Verify Email Address</a>
          </div>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h3 style="color: #333; margin: 0 0 10px 0;">What's Next?</h3>
            <ul style="color: #666; margin: 0; padding-left: 20px;">
              <li>Connect your X (Twitter) account for seamless social integration</li>
              <li>Create your first post and start building your audience</li>
              <li>Explore Web3 features like staking and token rewards</li>
              <li>Join the community and connect with like-minded creators</li>
            </ul>
          </div>
          
          <div style="text-align: center; color: #999; font-size: 14px;">
            <p>If the button doesn't work, copy and paste this link into your browser:</p>
            <p style="word-break: break-all; background: #f0f0f0; padding: 10px; border-radius: 4px; font-family: monospace;">${verificationUrl}</p>
            <p style="margin-top: 20px;">This link will expire in 24 hours for security reasons.</p>
            <p>If you didn't create a WEGRAM account, you can safely ignore this email.</p>
          </div>
        </div>
      `,
    });

    return { success: true, messageId: result.data?.id };
  } catch (error) {
    console.error('Email sending failed:', error);
    throw new Error(`Failed to send email: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
