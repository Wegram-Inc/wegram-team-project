import React from 'react';
import { ArrowLeft, FileText } from 'lucide-react';
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
        {/* Icon */}
        <div className='flex flex-col items-center text-center mb-8'>
          <div className='w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white mb-4'>
            <FileText className='w-12 h-12' />
          </div>
          <h2 className='text-2xl font-bold gradient-text mb-2'>
            Wegram Terms of Service
          </h2>
          <p className='text-sm text-primary'>
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>

        {/* Terms Sections */}
        <div className='space-y-8 text-primary text-sm leading-relaxed'>
          <section>
            <h3 className='text-lg font-semibold mb-2'>
              1. Acceptance of Terms
            </h3>
            <p>
              By accessing or using <strong>Wegram</strong>, you agree to be
              bound by these Terms of Service and our Privacy Policy. If you do
              not agree, please discontinue use of the platform.
            </p>
          </section>

          <section>
            <h3 className='text-lg font-semibold mb-2'>
              2. Use of the Platform
            </h3>
            <p>
              You may use Wegram only for lawful purposes and in accordance with
              these Terms. You are responsible for any activity under your
              account and for keeping your credentials secure.
            </p>
          </section>

          <section>
            <h3 className='text-lg font-semibold mb-2'>3. Account Security</h3>
            <p>
              You are responsible for maintaining the confidentiality of your
              login information. Notify us immediately if you suspect
              unauthorized access. Wegram is not liable for losses resulting
              from compromised accounts.
            </p>
          </section>

          <section>
            <h3 className='text-lg font-semibold mb-2'>4. User Content</h3>
            <p>
              You retain ownership of content you post (photos, videos, text,
              etc.), but grant Wegram a limited license to host, display, and
              distribute it for platform functionality and community engagement.
            </p>
          </section>

          <section>
            <h3 className='text-lg font-semibold mb-2'>
              5. Prohibited Conduct
            </h3>
            <p>
              Do not post or share illegal, harmful, or infringing material.
              Harassment, impersonation, or distribution of malicious software
              will result in account suspension or termination.
            </p>
          </section>

          <section>
            <h3 className='text-lg font-semibold mb-2'>6. Termination</h3>
            <p>
              Wegram may suspend or terminate your access at any time if you
              violate these Terms. You may also delete your account at any time
              through your profile settings.
            </p>
          </section>

          <section>
            <h3 className='text-lg font-semibold mb-2'>
              7. Disclaimers & Limitation of Liability
            </h3>
            <p>
              Wegram is provided “as is” without warranties of any kind. To the
              fullest extent permitted by law, Wegram and its team are not
              responsible for any indirect, incidental, or consequential
              damages.
            </p>
          </section>

          <section>
            <h3 className='text-lg font-semibold mb-2'>8. Updates to Terms</h3>
            <p>
              We may update these Terms periodically. Continued use after
              changes means you accept the new Terms. Major changes will be
              communicated where possible.
            </p>
          </section>

          <section>
            <h3 className='text-lg font-semibold mb-2'>9. Governing Law</h3>
            <p>
              These Terms are governed by the laws of the Federal Republic of
              Nigeria, without regard to conflict of laws principles.
            </p>
          </section>
        </div>

        {/* Footer */}
        <footer className='mt-10 border-t border-overlay-light pt-4 text-center text-sm text-primary'>
          <p>
            For questions or support, contact us at{' '}
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
