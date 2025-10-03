// Email service - simplified version without external dependencies
// This avoids import issues in serverless environments

export interface EmailVerificationData {
  email: string;
  username: string;
  verificationToken: string;
  verificationUrl: string;
}

// Simple email sending function that logs to console
export async function sendVerificationEmail(data: EmailVerificationData) {
  console.log('📧 EMAIL VERIFICATION (Production Mode)');
  console.log('=====================================');
  console.log(`To: ${data.email}`);
  console.log(`Subject: Welcome to WEGRAM! Please verify your email`);
  console.log(`Username: ${data.username}`);
  console.log(`Verification URL: ${data.verificationUrl}`);
  console.log('=====================================');
  
  // In a real implementation, you would integrate with Resend, SendGrid, etc.
  // For now, we'll just log the email details
  
  return { success: true, messageId: 'logged-to-console' };
}

// Fallback email service for development (logs to console)
export async function sendVerificationEmailFallback(data: EmailVerificationData) {
  console.log('📧 EMAIL VERIFICATION (Development Mode)');
  console.log('=====================================');
  console.log(`To: ${data.email}`);
  console.log(`Subject: Welcome to WEGRAM! Please verify your email`);
  console.log(`Username: ${data.username}`);
  console.log(`Verification URL: ${data.verificationUrl}`);
  console.log('=====================================');
  
  return { success: true, messageId: 'dev-fallback' };
}
