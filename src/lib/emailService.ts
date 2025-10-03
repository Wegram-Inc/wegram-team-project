// Simple email verification - just logs to console
export interface EmailVerificationData {
  email: string;
  username: string;
  verificationToken: string;
  verificationUrl: string;
}

export async function sendVerificationEmail(data: EmailVerificationData) {
  console.log('📧 EMAIL VERIFICATION');
  console.log('====================');
  console.log(`To: ${data.email}`);
  console.log(`Username: ${data.username}`);
  console.log(`Verification URL: ${data.verificationUrl}`);
  console.log('====================');
  
  return { success: true };
}
