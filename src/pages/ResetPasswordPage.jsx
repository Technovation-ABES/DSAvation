import React from 'react';
import { Icon } from '../components/common/Icon.jsx';

export function ResetPasswordPage({
  resetToken,
  completePasswordReset,
  resetError,
  resetBusy,
  setView,
  setAuthMode,
  setAuthOpen,
}) {
  return (
    <main className="content-shell page-content reset-page">
      <section className="panel reset-password-panel">
        <div className="eyebrow">
          <span className="eyebrow-line" />
          ACCOUNT RECOVERY
        </div>
        <h1>
          Choose a new password<span>.</span>
        </h1>
        {resetToken ? (
          <>
            <p>This one-time link expires after 30 minutes and can only be used once.</p>
            <form className="auth-form" onSubmit={completePasswordReset}>
              <label>
                NEW PASSWORD
                <input
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  minLength="10"
                  maxLength="128"
                  required
                  placeholder="At least 10 characters"
                />
              </label>
              <label>
                CONFIRM NEW PASSWORD
                <input
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  minLength="10"
                  maxLength="128"
                  required
                  placeholder="Enter it again"
                />
              </label>
              {resetError && (
                <p className="form-error" role="alert">
                  {resetError}
                </p>
              )}
              <button className="button button-dark auth-submit" disabled={resetBusy}>
                {resetBusy ? 'Updating…' : 'Change password'} <Icon name="arrow" size={14} />
              </button>
            </form>
          </>
        ) : (
          <>
            <p>
              This reset link is missing or has already been used. Contact an administrator to generate a new one.
            </p>
            <button
              className="button button-dark"
              onClick={() => {
                window.history.replaceState({}, '', '/');
                setView('general');
                setAuthMode('login');
                setAuthOpen(true);
              }}
            >
              Return to sign in <Icon name="arrow" size={14} />
            </button>
          </>
        )}
      </section>
    </main>
  );
}

