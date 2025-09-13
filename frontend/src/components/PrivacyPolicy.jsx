import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { Link } from 'react-router-dom';

const PrivacyPolicy = () => {
  const { classes } = useTheme();

  return (
    <div className={`min-h-screen ${classes.bgPrimary} ${classes.textPrimary}`}>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Link 
            to="/" 
            className={`inline-flex items-center gap-2 ${classes.textSecondary} hover:${classes.textPrimary} transition-colors`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Home
          </Link>
        </div>

        <h1 className={`text-3xl font-bold mb-8 ${classes.textPrimary}`}>Privacy Policy & GDPR</h1>
        
        <div className="space-y-6">
          <section>
            <h2 className={`text-2xl font-semibold mb-4 ${classes.textPrimary}`}>Data Protection</h2>
            <p className={`mb-4 ${classes.textSecondary}`}>
              UnwindMind is committed to protecting your privacy and complying with GDPR. 
              This policy explains how we collect, use, and protect your personal information.
            </p>
          </section>

          <section>
            <h2 className={`text-2xl font-semibold mb-4 ${classes.textPrimary}`}>Your GDPR Rights</h2>
            <ul className={`list-disc pl-6 space-y-2 ${classes.textSecondary}`}>
              <li><strong>Right to Access:</strong> Request a copy of your personal data</li>
              <li><strong>Right to Rectification:</strong> Correct inaccurate data</li>
              <li><strong>Right to Erasure:</strong> Request deletion of your data</li>
              <li><strong>Right to Portability:</strong> Receive your data in machine-readable format</li>
            </ul>
          </section>

          <section>
            <h2 className={`text-2xl font-semibold mb-4 ${classes.textPrimary}`}>Contact</h2>
            <p className={`${classes.textSecondary}`}>
              For privacy questions: privacy@unwindmind.life
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;