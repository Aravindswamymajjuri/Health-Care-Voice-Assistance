import React, { useState, useEffect } from 'react';
import { FiLock, FiUser, FiEye, FiEyeOff, FiLogIn, FiHome } from 'react-icons/fi';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useLanguage } from '../context/LanguageContext';
import ForgotPasswordModal from './ForgotPasswordModal';
import './Auth.css';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const Login = ({ onLoginSuccess, onSwitchToSignup, onGoHome }) => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  useEffect(() => { setTimeout(() => setIsAnimating(true), 80); }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleForgot = (e) => {
    e.preventDefault();
    setShowForgotPassword(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.post(`${API_BASE_URL}/api/auth/login`, formData, { headers: { 'Content-Type': 'application/json' }, timeout: 10000 });

      if (response.data && response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
        toast.dismiss();
        toast.success('🎉 Login successful!');
        onLoginSuccess(response.data);
      } else {
        toast.dismiss();
        toast.error('Unexpected response. Please try again.');
      }
    } catch (err) {
      toast.dismiss();
      toast.error(err.response?.data?.detail || err.response?.data?.message || (err.message === 'Network Error' ? `Network error. Is backend running on ${API_BASE_URL}?` : err.message) || 'Login failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`auth-container signin ${isAnimating ? 'active' : ''}`}>
      <button type="button" className="go-home-btn" onClick={onGoHome} aria-label="Go home" title="Go home"><FiHome size={20} /></button>
      <div className="auth-card">
        <div className="auth-hero">
          <div className="hero-icon">🩺</div>
          <h2 className="hero-title">{t('healthcareAssistant')}</h2>
          <p className="hero-sub">{t('voiceAndTextSupport')}</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form" aria-label="Login form">
          <div className="form-group">
            <label className="form-label" htmlFor="login-username"><FiUser className="label-icon" />{t('username')}</label>
            <input id="login-username" aria-label="username" type="text" name="username" placeholder={t('username')} value={formData.username} onChange={handleChange} className="form-input" disabled={isLoading} required />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="login-password"><FiLock className="label-icon" />{t('password')}</label>
            <div className="password-input-wrapper">
              <input
                id="login-password"
                aria-label="password"
                type="password"
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                className="form-input"
                disabled={isLoading}
                required
                style={{ paddingRight: '0.5rem' }}
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem', gap: '12px' }}>
              <button type="button" className="link-button" onClick={handleForgot}>{t('forgotPassword')}</button>

              <button type="submit" className={`auth-button auth-button--side ${isLoading ? 'loading' : ''}`} disabled={isLoading} aria-busy={isLoading}>
                {isLoading ? (<><div className="spinner" />{t('loading')}</>) : (<><FiLogIn />{t('loginButton')}</>)}
              </button>
            </div>
          </div>
        </form>

        <div className="auth-footer">
          <p className="auth-switch-text">{t('dontHaveAccount')} <button type="button" className="auth-switch-button" onClick={onSwitchToSignup} disabled={isLoading}>{t('signupNow')}</button></p>
        </div>
      </div>

      <ForgotPasswordModal 
        isOpen={showForgotPassword} 
        onClose={() => setShowForgotPassword(false)} 
      />
    </div>
  );
};

export default Login;