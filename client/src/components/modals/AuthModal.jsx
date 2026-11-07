import React from 'react';
import { Icon as IconifyIcon } from '@iconify/react';
import { Icon } from '../common/Icon.jsx';
import { CLUB_DEPARTMENTS } from '../../data/constants.js';

export function AuthModal({
  authOpen,
  setAuthOpen,
  authMode,
  setAuthMode,
  authError,
  setAuthError,
  authBusy,
  submitAuth,
  showPassword,
  setShowPassword,
  setForgotOpen,
}) {
  if (!authOpen) return null;

  return (
    <div
      className="modal-scrim"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          setAuthOpen(false);
          setShowPassword(false);
        }
      }}
    >
      <section className="auth-modal" role="dialog" aria-modal="true" aria-labelledby="auth-title">
        <button
          className="modal-close"
          onClick={() => {
            setAuthOpen(false);
            setShowPassword(false);
          }}
          aria-label="Close"
        >
          ×
        </button>
        <div className="eyebrow">
          <span className="eyebrow-line" />
          DSAVATION MEMBER ACCESS
        </div>
        <h2 id="auth-title">
          {authMode === 'signup' ? 'Create your account' : 'Welcome back'}
          <span>.</span>
        </h2>
        <p className="auth-lede">
          {authMode === 'signup'
            ? 'Use your college email to request access to the private tracker and club challenge. An administrator must approve your account.'
            : 'Sign in to save private progress and submit to the club challenge.'}
        </p>
        <form onSubmit={submitAuth} className="auth-form">
          {authMode === 'signup' && (
            <>
              <label>
                FULL NAME
                <input name="name" autoComplete="name" required minLength="2" maxLength="80" placeholder="Your name" />
              </label>
              <label>
                CLUB DEPARTMENT
                <select name="department" required defaultValue="">
                  <option value="" disabled>
                    Select your club department
                  </option>
                  {CLUB_DEPARTMENTS.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                YEAR OF STUDY
                <select name="studyYear" required defaultValue="">
                  <option value="" disabled>
                    Select your current year
                  </option>
                  <option value="first-year">First year</option>
                  <option value="second-year">Second year</option>
                  <option value="third-year">Third year</option>
                  <option value="fourth-year">Fourth year</option>
                  <option value="passed">Passed out</option>
                </select>
              </label>
              <label>
                COLLEGE EMAIL
                <input
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  pattern=".+@abes\.ac\.in"
                  title="Use your college email"
                  placeholder="you@abes.ac.in"
                />
              </label>
              <label>
                GITHUB USERNAME
                <input
                  name="githubUsername"
                  required
                  pattern="[A-Za-z0-9-]{1,39}"
                  placeholder="your-github-handle"
                />
                <small>After signup, connect GitHub to replace this with your verified username.</small>
              </label>
              <label>
                LEETCODE USERNAME
                <input
                  name="leetcodeUsername"
                  required
                  pattern="[A-Za-z0-9_-]{1,40}"
                  placeholder="your-leetcode-id"
                />
              </label>
              <label className="password-input-label">
                PASSWORD
                <div className="password-input-wrapper">
                  <input
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    minLength="10"
                    maxLength="128"
                    required
                    placeholder="At least 10 characters"
                  />
                  <button
                    type="button"
                    className="password-toggle-btn"
                    onClick={() => setShowPassword((prev) => !prev)}
                    title={showPassword ? 'Hide password' : 'Peek password'}
                    aria-label={showPassword ? 'Hide password' : 'Peek password'}
                  >
                    <IconifyIcon icon={showPassword ? 'lucide:eye-off' : 'lucide:eye'} width={18} height={18} />
                  </button>
                </div>
              </label>
            </>
          )}
          {authMode === 'login' && (
            <>
              <label>
                COLLEGE EMAIL
                <input
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  pattern=".+@abes\.ac\.in"
                  placeholder="you@abes.ac.in"
                />
              </label>
              <label className="password-input-label">
                PASSWORD
                <div className="password-input-wrapper">
                  <input
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    required
                    placeholder="Your password"
                  />
                  <button
                    type="button"
                    className="password-toggle-btn"
                    onClick={() => setShowPassword((prev) => !prev)}
                    title={showPassword ? 'Hide password' : 'Peek password'}
                    aria-label={showPassword ? 'Hide password' : 'Peek password'}
                  >
                    <IconifyIcon icon={showPassword ? 'lucide:eye-off' : 'lucide:eye'} width={18} height={18} />
                  </button>
                </div>
              </label>
            </>
          )}
          {authError && (
            <p className="form-error" role="alert">
              {authError}
            </p>
          )}
          <button className="button button-dark auth-submit" disabled={authBusy}>
            {authBusy ? 'Please wait…' : authMode === 'signup' ? 'Request account' : 'Sign in'}{' '}
            <Icon name="arrow" size={14} />
          </button>
        </form>
        <div className="auth-switch">
          {authMode === 'signup' ? 'Already a member?' : 'New to DSAvation?'}{' '}
          <button
            onClick={() => {
              setAuthMode(authMode === 'signup' ? 'login' : 'signup');
              setAuthError('');
              setShowPassword(false);
            }}
          >
            {authMode === 'signup' ? 'Sign in' : 'Create account'}
          </button>
          {authMode === 'login' && (
            <>
              <span> · </span>
              <button
                onClick={() => {
                  setAuthOpen(false);
                  setForgotOpen(true);
                }}
              >
                Forgot password?
              </button>
            </>
          )}
        </div>
      </section>
    </div>
  );
}

