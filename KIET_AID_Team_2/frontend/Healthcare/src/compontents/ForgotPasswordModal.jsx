import React, { useState } from 'react';
import { FiMail, FiLock, FiX, FiArrowLeft, FiCheck, FiEye, FiEyeOff } from 'react-icons/fi';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useLanguage } from '../context/LanguageContext';
import './Auth.css';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const ForgotPasswordModal = ({ isOpen, onClose }) => {
  const { t } = useLanguage();
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: Reset Password
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpTimer, setOtpTimer] = useState(0);

  // Timer for OTP resend
  React.useEffect(() => {
    if (otpTimer > 0) {
      const timer = setTimeout(() => setOtpTimer(otpTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [otpTimer]);

  const resetForm = () => {
    setStep(1);
    setEmail('');
    setOtp('');
    setNewPassword('');
    setConfirmPassword('');
    setResetToken('');
    setOtpSent(false);
    setOtpTimer(0);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  // Step 1: Send OTP to email
  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error('Please enter your email address');
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/auth/forgot-password`,
        { email },
        { headers: { 'Content-Type': 'application/json' }, timeout: 10000 }
      );

      if (response.data.status === 'success') {
        toast.success('✅ OTP sent to your email! Check your inbox.');
        setOtpSent(true);
        setOtpTimer(300); // 5 minutes timer
        setStep(2);
      } else {
        toast.error(response.data.message || 'Failed to send OTP');
      }
    } catch (err) {
      console.error('Send OTP error:', err);
      toast.error(
        err.response?.data?.detail ||
        err.response?.data?.message ||
        'Failed to send OTP. Please check your email and try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otp.trim() || otp.length !== 6) {
      toast.error('Please enter a valid 6-digit OTP');
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/auth/verify-otp`,
        { email, otp },
        { headers: { 'Content-Type': 'application/json' }, timeout: 10000 }
      );

      if (response.data.status === 'success') {
        setResetToken(response.data.reset_token);
        toast.success('✅ OTP verified! Now reset your password.');
        setStep(3);
      } else {
        toast.error(response.data.message || 'Invalid OTP');
      }
    } catch (err) {
      console.error('Verify OTP error:', err);
      toast.error(
        err.response?.data?.detail ||
        err.response?.data?.message ||
        'OTP verification failed. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Step 3: Reset Password
  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (!newPassword.trim() || newPassword.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/auth/reset-password`,
        { reset_token: resetToken, new_password: newPassword },
        { headers: { 'Content-Type': 'application/json' }, timeout: 10000 }
      );

      if (response.data.status === 'success') {
        toast.success('✅ Password reset successfully! Please login with your new password.');
        resetForm();
        onClose();
      } else {
        toast.error(response.data.message || 'Failed to reset password');
      }
    } catch (err) {
      console.error('Reset password error:', err);
      toast.error(
        err.response?.data?.detail ||
        err.response?.data?.message ||
        'Failed to reset password. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className="modal-close-btn"
          onClick={handleClose}
          aria-label="Close modal"
        >
          <FiX size={24} />
        </button>

        <div className="modal-header">
          <div className="modal-icon">
            {step === 1 && '📧'}
            {step === 2 && '🔐'}
            {step === 3 && '🔑'}
          </div>
          <h2 className="modal-title">
            {step === 1 && 'Reset Password'}
            {step === 2 && 'Verify OTP'}
            {step === 3 && 'Create New Password'}
          </h2>
          <p className="modal-subtitle">
            {step === 1 && 'Enter your email address to receive an OTP code'}
            {step === 2 && "We've sent a 6-digit code to your email"}
            {step === 3 && 'Create a strong password for your account'}
          </p>
        </div>

        {/* Step Indicator */}
        <div style={{ padding: '0 24px', display: 'flex', gap: '8px', justifyContent: 'center' }}>
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: s <= step ? '#14b8a6' : '#e5e7eb',
                transition: 'all 0.3s ease',
              }}
            />
          ))}
        </div>

        {/* Step 1: Email */}
        {step === 1 && (
          <form onSubmit={handleSendOtp} className="modal-form">
            <div className="form-group">
              <label className="form-label" htmlFor="forgot-email">
                <FiMail className="label-icon" size={14} /> Email Address
              </label>
              <input
                id="forgot-email"
                type="email"
                placeholder="your.email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input"
                disabled={isLoading}
                required
              />
              <small style={{ color: '#6b7280', fontSize: '0.75rem', marginTop: '4px' }}>
                We'll send a verification code to this email
              </small>
            </div>

            <button
              type="submit"
              className="modal-button"
              disabled={isLoading || !email.trim()}
            >
              {isLoading ? (
                <>
                  <div className="spinner" /> Sending OTP...
                </>
              ) : (
                <>
                  <FiMail size={18} /> Send OTP Code
                </>
              )}
            </button>
          </form>
        )}

        {/* Step 2: OTP Verification */}
        {step === 2 && (
          <form onSubmit={handleVerifyOtp} className="modal-form">
            <div className="form-group">
              <label className="form-label" htmlFor="otp-input">
                <FiLock className="label-icon" size={14} /> Enter OTP Code
              </label>
              <input
                id="otp-input"
                type="text"
                placeholder="000000"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                className="form-input otp-input"
                disabled={isLoading}
                maxLength="6"
                required
              />
              {otpTimer > 0 && (
                <p className="otp-timer">
                  ⏱️ Expires in {Math.floor(otpTimer / 60)}:{(otpTimer % 60).toString().padStart(2, '0')}
                </p>
              )}
              <small style={{ color: '#6b7280', fontSize: '0.75rem', marginTop: '4px' }}>
                Check your email inbox for the 6-digit verification code
              </small>
            </div>

            <div className="modal-button-group">
              <button
                type="button"
                className="modal-button modal-button-secondary"
                onClick={() => {
                  setStep(1);
                  setOtp('');
                }}
                disabled={isLoading}
              >
                <FiArrowLeft size={16} /> Back
              </button>

              <button
                type="submit"
                className="modal-button"
                disabled={isLoading || otp.length !== 6}
              >
                {isLoading ? (
                  <>
                    <div className="spinner" /> Verifying...
                  </>
                ) : (
                  <>
                    <FiCheck size={18} /> Verify OTP
                  </>
                )}
              </button>
            </div>

            {otpTimer === 0 && otpSent && (
              <button
                type="button"
                className="modal-button modal-button-secondary"
                onClick={handleSendOtp}
                disabled={isLoading}
                style={{ marginTop: '8px' }}
              >
                Resend OTP Code
              </button>
            )}
          </form>
        )}

        {/* Step 3: Reset Password */}
        {step === 3 && (
          <form onSubmit={handleResetPassword} className="modal-form">
            <div className="form-group">
              <label className="form-label" htmlFor="new-password">
                <FiLock className="label-icon" size={14} /> New Password
              </label>
              <div className="password-input-wrapper">
                <input
                  id="new-password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="form-input"
                  disabled={isLoading}
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                >
                  {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                </button>
              </div>
              <small style={{ color: '#6b7280', fontSize: '0.75rem', marginTop: '4px' }}>
                Minimum 6 characters required
              </small>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="confirm-password">
                <FiLock className="label-icon" size={14} /> Confirm Password
              </label>
              <div className="password-input-wrapper">
                <input
                  id="confirm-password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="form-input"
                  disabled={isLoading}
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={isLoading}
                >
                  {showConfirmPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                </button>
              </div>
              {newPassword && confirmPassword && newPassword !== confirmPassword && (
                <small style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '4px' }}>
                  ❌ Passwords don't match
                </small>
              )}
              {newPassword && confirmPassword && newPassword === confirmPassword && (
                <small style={{ color: '#10b981', fontSize: '0.75rem', marginTop: '4px' }}>
                  ✅ Passwords match
                </small>
              )}
            </div>

            <div className="modal-button-group">
              <button
                type="button"
                className="modal-button modal-button-secondary"
                onClick={() => {
                  setStep(2);
                  setNewPassword('');
                  setConfirmPassword('');
                }}
                disabled={isLoading}
              >
                <FiArrowLeft size={16} /> Back
              </button>

              <button
                type="submit"
                className="modal-button"
                disabled={isLoading || !newPassword || !confirmPassword || newPassword !== confirmPassword}
              >
                {isLoading ? (
                  <>
                    <div className="spinner" /> Resetting...
                  </>
                ) : (
                  <>
                    <FiCheck size={18} /> Reset Password
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordModal;
