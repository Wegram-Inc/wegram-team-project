export default function Terms(): JSX.Element {
  return (
    <div
      className='fixed inset-0 w-screen h-screen overflow-y-auto bg-gray-50 text-gray-900 flex justify-center items-start p-8'
      role='dialog'
      aria-labelledby='tos-heading'>
      <main className='w-full max-w-3xl bg-white rounded-xl shadow-xl p-8 leading-relaxed'>
        <h1 id='tos-heading' className='text-3xl font-bold mb-2'>
          Terms of Service
        </h1>
        <p className='text-sm text-gray-500 mb-8'>
          Last updated: {new Date().toLocaleDateString()}
        </p>

        <section className='space-y-3 mb-6'>
          <h2 className='text-xl font-semibold'>1. Acceptance of Terms</h2>
          <p>
            By accessing or using <strong>Wegram</strong>, you agree to be bound
            by these Terms of Service and our Privacy Policy. If you do not
            agree, please do not use the platform.
          </p>
        </section>

        <section className='space-y-3 mb-6'>
          <h2 className='text-xl font-semibold'>2. Use of Wegram</h2>
          <p>
            You may use Wegram only in accordance with these Terms and all
            applicable laws. You are responsible for any activity that occurs
            under your account and for maintaining the accuracy of your
            information.
          </p>
        </section>

        <section className='space-y-3 mb-6'>
          <h2 className='text-xl font-semibold'>3. Account Security</h2>
          <p>
            Keep your login credentials private and secure. Notify us
            immediately of any unauthorized access or security breach. We are
            not liable for losses arising from compromised accounts.
          </p>
        </section>

        <section className='space-y-3 mb-6'>
          <h2 className='text-xl font-semibold'>4. User Content</h2>
          <p>
            You retain ownership of any photos, videos, posts, and other content
            you share on Wegram. However, by posting, you grant us a
            non-exclusive, worldwide license to host, display, and distribute
            your content solely for the purpose of operating and improving the
            service.
          </p>
        </section>

        <section className='space-y-3 mb-6'>
          <h2 className='text-xl font-semibold'>5. Prohibited Conduct</h2>
          <p>
            Do not use Wegram to post unlawful, harmful, or infringing content.
            Harassment, impersonation, spamming, or spreading malicious software
            are strictly prohibited. We reserve the right to suspend or
            terminate accounts that violate these guidelines.
          </p>
        </section>

        <section className='space-y-3 mb-6'>
          <h2 className='text-xl font-semibold'>6. Termination</h2>
          <p>
            We may suspend or terminate your access to Wegram at any time for
            conduct that violates these Terms or is otherwise harmful to the
            community. You may also delete your account at any time through your
            settings.
          </p>
        </section>

        <section className='space-y-3 mb-6'>
          <h2 className='text-xl font-semibold'>
            7. Disclaimers and Limitation of Liability
          </h2>
          <p>
            Wegram is provided “as is” without warranties of any kind. To the
            fullest extent permitted by law, Wegram and its team shall not be
            liable for any indirect, incidental, or consequential damages
            resulting from your use or inability to use the platform.
          </p>
        </section>

        <section className='space-y-3 mb-6'>
          <h2 className='text-xl font-semibold'>8. Changes to Terms</h2>
          <p>
            We may update these Terms from time to time. Continued use of Wegram
            after such updates indicates your acceptance of the revised Terms.
            Major updates will be communicated when practicable.
          </p>
        </section>

        <section className='space-y-3 mb-8'>
          <h2 className='text-xl font-semibold'>9. Governing Law</h2>
          <p>
            These Terms shall be governed by and interpreted in accordance with
            the laws of the Federal Republic of Nigeria, without regard to
            conflict of laws principles.
          </p>
        </section>

        <footer className='text-gray-600 text-sm border-t border-gray-200 pt-4'>
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
      </main>
    </div>
  );
}
