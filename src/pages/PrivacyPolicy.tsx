import React from 'react';
import { ArrowLeft, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const PrivacyPolicy: React.FC = () => {
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
          Privacy Policy
        </h1>
      </div>

      {/* Main Content */}
      <div className='max-w-3xl mx-auto px-4 py-8 animate-in slide-in-from-top-4 duration-300'>
        {/* Icon */}
        <div className='flex flex-col items-center text-center mb-8'>
          <div className='w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-green-500 flex items-center justify-center text-white mb-4'>
            <Shield className='w-12 h-12' />
          </div>
          <h2 className='text-2xl font-bold gradient-text mb-2'>
            Wegram Privacy Policy
          </h2>
          <p className='text-sm text-primary'>
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>

        {/* Policy Sections */}
        <div className='space-y-8 text-primary text-sm leading-relaxed'>
          <section>
            <h3 className='text-lg font-semibold mb-2'>1. Introduction</h3>
            <p>
              At <strong>Wegram</strong>, your privacy is important to us. This
              Privacy Policy explains how we handle your information when you
              log in with your X (formerly Twitter) account. We only collect the
              minimum information necessary to authenticate you and provide
              access to our platform.
            </p>
          </section>

          <section>
            <h3 className='text-lg font-semibold mb-2'>
              2. Information We Collect
            </h3>
            <p>
              When you sign in to Wegram using your X account, we receive
              limited information directly from X through its API. This
              includes:
            </p>
            <ul className='list-disc list-inside mt-2 space-y-1'>
              <li>Your X username (handle)</li>
              <li>Your display name</li>
              <li>Your profile picture (avatar)</li>
              <li>Your unique X account ID (used for authentication)</li>
            </ul>
            <p className='mt-3'>
              We do <strong>not</strong> collect your X password, direct
              messages, followers, following list, or any private data from your
              X account.
            </p>
          </section>

          <section>
            <h3 className='text-lg font-semibold mb-2'>
              3. How We Use This Information
            </h3>
            <p>We use the limited information collected from X solely to:</p>
            <ul className='list-disc list-inside mt-2 space-y-1'>
              <li>Authenticate you securely into Wegram</li>
              <li>
                Display your username and profile image in your Wegram profile
              </li>
              <li>
                Personalize your in-app experience (e.g., greetings, profile
                view)
              </li>
            </ul>
            <p className='mt-3'>
              We do not sell, rent, or share your information with advertisers
              or third parties.
            </p>
          </section>

          <section>
            <h3 className='text-lg font-semibold mb-2'>
              4. Data Storage and Security
            </h3>
            <p>
              Wegram stores only the necessary public information from your X
              account (username, display name, profile picture, and user ID).
              All data is securely stored and encrypted where applicable. We
              take reasonable steps to prevent unauthorized access or misuse of
              your data.
            </p>
          </section>

          <section>
            <h3 className='text-lg font-semibold mb-2'>
              5. Third-Party Access
            </h3>
            <p>
              Your X account data is accessed only through X's official API in
              accordance with their terms. Wegram does not share your data with
              third parties except as required by law or to maintain the
              functionality of our platform (e.g., hosting services).
            </p>
          </section>

          <section>
            <h3 className='text-lg font-semibold mb-2'>6. Data Retention</h3>
            <p>
              We retain your basic profile data for as long as your Wegram
              account remains active. If you delete your account or revoke X
              access, your data will be removed from our systems within a
              reasonable period.
            </p>
          </section>

          <section>
            <h3 className='text-lg font-semibold mb-2'>
              7. Your Control and Rights
            </h3>
            <p>
              You may revoke Wegram's access to your X account at any time
              through your X account settings. You can also contact us to
              request data deletion or clarification on how your data is used.
            </p>
          </section>

          <section>
            <h3 className='text-lg font-semibold mb-2'>
              8. Updates to This Policy
            </h3>
            <p>
              We may update this Privacy Policy periodically to reflect changes
              in our data practices or legal requirements. Updated versions will
              always be posted on this page with a revised date.
            </p>
          </section>

          <section>
            <h3 className='text-lg font-semibold mb-2'>9. Contact Us</h3>
            <p>
              If you have any questions or concerns about this Privacy Policy,
              please contact our support team at{' '}
              <a
                href='mailto:support@wegram.social'
                className='text-blue-600 hover:underline'>
                support@wegram.social
              </a>
              .
            </p>
          </section>
        </div>

        {/* Footer */}
        <footer className='mt-10 border-t border-overlay-light pt-4 text-center text-sm text-primary'>
          <p>© {new Date().getFullYear()} Wegram. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
};
