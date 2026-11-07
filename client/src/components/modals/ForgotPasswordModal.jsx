import React from 'react';
import { Icon } from '../common/Icon.jsx';

export function ForgotPasswordModal({
  forgotOpen,
  setForgotOpen,
  forgotEmail,
  setForgotEmail,
  forgotError,
  setForgotError,
  forgotSuccess,
  setForgotSuccess,
  requestPasswordReset,
  forgotBusy,
  setAuthMode,
  setAuthOpen,
}) {
  if (!forgotOpen) return null;

  const handleClose = () => {
    setForgotOpen(false);
    setForgotEmail('');
    setForgotError('');
    setForgotSuccess(false);
  };

  return (
    <div
      className="modal-scrim"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) handleClose();
      }}
    >
      <section className="auth-modal" role="dialog" aria-modal="true" aria-labelledby="forgot-title">
        <button className="modal-close" onClick={handleClose} aria-label="Close">
          ×
        </button>
        <div className="eyebrow">
          <span className="eyebrow-line" />
          RESET YOUR PASSWORD
        </div>
        <h2 id="forgot-title">
          Forgot password?<span>.</span>
        </h2>
        <p className="auth-lede">
          Enter your email address and we'll send you a one-time reset link. The link expires in 30 minutes.
        </p>
        {forgotSuccess ? (
          <>
            <p className="auth-success">Reset link successfully sent! Check your email.</p>
            <button
              className="button button-dark auth-submit"
              onClick={() => {
                setForgotOpen(false);
                setForgotSuccess(false);
                setAuthMode('login');
                setAuthOpen(true);
              }}
            >
              Back to sign in <Icon name="arrow" size={14} />
            </button>
          </>
        ) : (
          <>
            <form onSubmit={requestPasswordReset} className="auth-form">
              <label>
                COLLEGE EMAIL
                <input
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  pattern=".+@abes\.ac\.in"
                  placeholder="you@abes.ac.in"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                />
              </label>
              {forgotError && (
                <p className="form-error" role="alert">
                  {forgotError}
                </p>
              )}
              <button className="button button-dark auth-submit" disabled={forgotBusy}>
                {forgotBusy ? 'Sending…' : 'Send reset link'} <Icon name="arrow" size={14} />
              </button>
            </form>
            <p className="auth-switch">
              <button
                onClick={() => {
                  setForgotOpen(false);
                  setForgotEmail('');
                  setForgotError('');
                  setAuthMode('login');
                  setAuthOpen(true);
                }}
              >
                Back to sign in <Icon name="arrow" size={14} />
              </button>
            </p>
          </>
        )}
      </section>
    </div>
  );
}

