import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Terms: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div
      className='min-h-screen relative'
      style={{ backgroundColor: 'var(--bg)' }}>
      {/* Header */}
      <div
        className='sticky top-0 z-50 bg-opacity-95 backdrop-blur-sm px-4 py-3 flex items-center gap-3'
        style={{ backgroundColor: 'var(--bg)' }}>
        <button
          onClick={() => navigate(-1)}
          className='p-2 hover:bg-overlay-light rounded-lg transition-colors'>
          <ArrowLeft className='w-5 h-5 text-primary' />
        </button>
        <h1 className='text-xl font-bold text-primary flex-1'>
          Terms of Service
        </h1>
      </div>

      {/* Main Content */}
      <div className='max-w-3xl mx-auto px-4 py-8 animate-in slide-in-from-top-4 duration-300'>
        <h2 className='text-2xl font-bold text-primary mb-2'>
          Terms of Service
        </h2>
        <p className='text-sm text-secondary mb-8'>
          Last updated: {new Date().toLocaleDateString()}
        </p>

        <div className='space-y-6 text-primary text-sm leading-relaxed'>
          <section>
            <h3 className='text-lg font-semibold mb-2'>1. Acceptance of Terms</h3>
            <p>
              By accessing or using <strong>Wegram</strong>, you agree to be bound
              by these Terms of Service and our Privacy Policy. If you do not
              agree, please do not use the platform.
            </p>
          </section>

          <section>
            <h3 className='text-lg font-semibold mb-2'>2. Use of Wegram</h3>
            <p>
              You may use Wegram only in accordance with these Terms and all
              applicable laws. You are responsible for any activity that occurs
              under your account and for maintaining the accuracy of your
              information.
            </p>
          </section>

          <section>
            <h3 className='text-lg font-semibold mb-2'>3. Account Security</h3>
            <p>
              Keep your login credentials private and secure. Notify us
              immediately of any unauthorized access or security breach. We are
              not liable for losses arising from compromised accounts.
            </p>
          </section>

          <section>
            <h3 className='text-lg font-semibold mb-2'>4. User Content</h3>
            <p>
              You retain ownership of any photos, videos, posts, and other content
              you share on Wegram. However, by posting, you grant us a
              non-exclusive, worldwide license to host, display, and distribute
              your content solely for the purpose of operating and improving the
              service.
            </p>
          </section>

          <section>
            <h3 className='text-lg font-semibold mb-2'>5. Prohibited Conduct</h3>
            <p>
              Do not use Wegram to post unlawful, harmful, or infringing content.
              Harassment, impersonation, spamming, or spreading malicious software
              are strictly prohibited. We reserve the right to suspend or
              terminate accounts that violate these guidelines.
            </p>
          </section>

          <section>
            <h3 className='text-lg font-semibold mb-2'>6. Termination</h3>
            <p>
              We may suspend or terminate your access to Wegram at any time for
              conduct that violates these Terms or is otherwise harmful to the
              community. You may also delete your account at any time through your
              settings.
            </p>
          </section>

          <section>
            <h3 className='text-lg font-semibold mb-2'>
              7. Disclaimers and Limitation of Liability
            </h3>
            <p>
              Wegram is provided "as is" without warranties of any kind. To the
              fullest extent permitted by law, Wegram and its team shall not be
              liable for any indirect, incidental, or consequential damages
              resulting from your use or inability to use the platform.
            </p>
          </section>

          <section>
            <h3 className='text-lg font-semibold mb-2'>8. Changes to Terms</h3>
            <p>
              We may update these Terms from time to time. Continued use of Wegram
              after such updates indicates your acceptance of the revised Terms.
              Major updates will be communicated when practicable.
            </p>
          </section>

          <section>
            <h3 className='text-lg font-semibold mb-2'>9. Governing Law</h3>
            <p>
              These Terms shall be governed by and interpreted in accordance with
              the laws of the Federal Republic of Nigeria, without regard to
              conflict of laws principles.
            </p>
          </section>
        </div>

        {/* Footer */}
        <footer className='mt-10 border-t border-overlay-light pt-4 text-sm text-secondary'>
          <p>
            If you have any questions about these Terms, contact us at{' '}
            <a
              href='mailto:support@wegram.social'
              className='text-blue-600 hover:underline'>
              support@wegram.social
            </a>
            .
          </p>
        </footer>
      </div>
    </div>
  );
};
