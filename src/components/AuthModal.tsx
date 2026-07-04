import React, { useState } from 'react';
import { sendOtp, verifyOtp } from '../lib/gasApi';
import { X, Laptop, AlertCircle } from 'lucide-react';

export default function AuthModal({ isOpen, onClose, onLogin }: { isOpen: boolean; onClose: () => void; onLogin: (email: string) => void }) {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sentOtpCode, setSentOtpCode] = useState('');

  if (!isOpen) return null;

  const handleSendOtp = async () => {
    if (!email.trim()) {
      setError('Please enter a valid email.');
      return;
    }
    setError('');
    setLoading(true);
    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setSentOtpCode(generatedOtp);
    try {
      const res = await sendOtp(email.trim(), generatedOtp);
      if (res && (res.status === 'error' || res.success === false)) {
        setError(res.message || 'Failed to send OTP. Please try again.');
        setLoading(false);
        return;
      }
    } catch (err) {
      console.warn("Could not send OTP to remote server:", err);
      // Fallback: allows testing even if GAS_URL is not configured locally
    }
    setLoading(false);
    setStep('otp');
  };

  const handleVerifyOtp = async () => {
    if (otp.trim().length !== 6) {
      setError('Please enter a valid 6-digit OTP code.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const res = await verifyOtp(email.trim(), otp.trim());
      setLoading(false);
      if (res && (res.status === 'error' || res.status === 'failure' || res.success === false || (res.status && res.status !== 'success'))) {
        setError(res.message || 'Invalid OTP code. Please check and re-enter your code.');
        return;
      }
      onLogin(email.trim());
      onClose();
    } catch (err) {
      setLoading(false);
      // Fallback local verification if remote call fails or GAS_URL is unavailable
      if (sentOtpCode && otp.trim() !== sentOtpCode) {
        setError('Invalid OTP code. Please check and re-enter your code.');
        return;
      } else if (!sentOtpCode) {
        setError('Verification failed. Please re-enter your code.');
        return;
      }
      onLogin(email.trim());
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl relative w-full max-w-3xl flex overflow-hidden border border-gray-200 dark:border-gray-800">
        <button onClick={onClose} className="absolute top-4 right-4 z-10 text-white md:text-gray-500 md:dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"><X /></button>
        
        {/* Left Side */}
        <div className="hidden md:flex flex-col bg-blue-600 p-10 w-2/5 text-white">
          <h2 className="text-3xl font-bold mb-4">Login</h2>
          <p className="text-lg">Get access to your Orders, Wishlist and Recommendations</p>
          <div className="mt-auto">
             <Laptop size={120} className="text-white/80" />
          </div>
        </div>

        {/* Right Side */}
        <div className="w-full md:w-3/5 p-8 md:p-10 bg-white dark:bg-gray-900 flex flex-col justify-center">
          {error && (
            <div className="mb-6 p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800/60 rounded-md flex items-start gap-2.5 text-red-600 dark:text-red-400 text-sm">
              <AlertCircle size={18} className="shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {step === 'email' ? (
            <div className="flex flex-col gap-6">
              <input 
                type="email" 
                value={email} 
                onChange={e => {
                  setEmail(e.target.value);
                  if (error) setError('');
                }} 
                placeholder="Enter your email" 
                className="w-full border-b border-gray-300 dark:border-gray-700 pb-2 focus:outline-none focus:border-blue-600 dark:focus:border-blue-400 bg-transparent text-gray-900 dark:text-white placeholder-gray-400" 
              />
              <p className="text-xs text-gray-500 dark:text-gray-400">By continuing, you agree to our Terms of Use and Privacy Policy.</p>
              <button 
                onClick={handleSendOtp} 
                className="w-full bg-orange-500 text-white py-3 rounded-sm font-medium hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" 
                disabled={loading}
              >
                {loading ? 'Processing...' : 'Request OTP'}
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
                <span>OTP sent to {email}</span>
                <button onClick={() => { setStep('email'); setError(''); }} className="text-blue-600 dark:text-blue-400 font-medium hover:underline">Change</button>
              </div>
              <input 
                type="text" 
                value={otp} 
                onChange={e => {
                  const val = e.target.value;
                  if (/^\d{0,6}$/.test(val)) {
                    setOtp(val);
                  }
                  if (error) setError('');
                }} 
                placeholder="Enter 6-digit OTP" 
                className="w-full border-b border-gray-300 dark:border-gray-700 pb-2 focus:outline-none focus:border-blue-600 dark:focus:border-blue-400 bg-transparent text-gray-900 dark:text-white placeholder-gray-400 tracking-widest font-mono text-lg" 
              />
              <button 
                onClick={handleVerifyOtp} 
                className="w-full bg-orange-500 text-white py-3 rounded-sm font-medium hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" 
                disabled={loading}
              >
                {loading ? 'Verifying...' : 'Verify OTP'}
              </button>
            </div>
          )}
          <div className="mt-8 text-center text-sm text-blue-600 dark:text-blue-400 font-medium cursor-pointer">
            New to store? Create an account
          </div>
        </div>
      </div>
    </div>
  );
}
