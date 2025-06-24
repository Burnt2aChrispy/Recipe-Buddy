import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  signIn,
  signUp,
  getUser,
  signInWithGoogle,
  signInWithMicrosoft,
  signInWithDiscord
} from '../supabase/Auth';

export default function AuthPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authType, setAuthType] = useState('signup');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getUser().then(({ data }) => {
      if (data?.user) navigate('/');
    });
  }, [navigate]);

  const handleAuth = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response =
        authType === 'login'
          ? await signIn(email, password)
          : await signUp(email, password);

      if (response.error) {
        setError(response.error.message);
      } else if (response.data?.session) {
        navigate('/');
      } else {
        setError('Check your email to confirm sign up.');
      }
    } catch {
      setError('Unexpected error occurred.');
    }
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen justify-center items-center px-4 bg-white">
      <div className="max-w-md w-full">
        <h1 className="text-3xl font-bold mb-2 text-center">
          {authType === 'login' ? 'Sign In' : 'Sign Up'}
        </h1>
        <p className="text-gray-500 mb-6 text-center">
          {authType === 'login' ? 'Enter your details to sign in' : 'Start your journey'}
        </p>

        <form onSubmit={handleAuth} className="space-y-4">
          <div>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border rounded px-3 py-2"
              placeholder="Email"
            />
          </div>

          <div>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border rounded px-3 py-2"
              placeholder="Password"
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
          >
            {loading
              ? 'Please wait...'
              : authType === 'login'
              ? 'Sign In'
              : 'Sign Up'}
          </button>
        </form>

        <div className="mt-6 text-center text-gray-500">OR</div>

        <div className="mt-4 space-y-2">
          <OAuthButton onClick={signInWithMicrosoft} icon="/microsoft.svg" size={45} label="Microsoft" />
          <OAuthButton onClick={signInWithGoogle} icon="/google.svg" size={45} label="Google" />
          <OAuthButton onClick={signInWithDiscord} icon="/discord.svg" size={45} label="Discord" />
        </div>

        <p className="mt-6 text-center text-sm">
          {authType === 'login' ? (
            <>
              Don’t have an account?{' '}
              <button
                onClick={() => {
                  setAuthType('signup');
                  setError('');
                }}
                className="text-blue-600 hover:underline"
              >
                Sign Up
              </button>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <button
                onClick={() => {
                  setAuthType('login');
                  setError('');
                }}
                className="text-blue-600 hover:underline"
              >
                Sign In
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
}

function OAuthButton({ label, onClick, icon, size = 24 }) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 border px-3 py-2 rounded hover:bg-gray-50 transition"
    >
      <img
        src={icon}
        alt={`${label} logo`}
        style={{
          width: `${size}px`,
          height: `${size}px`,
          objectFit: 'contain',
          display: 'block'
        }}
      />
    </button>
  );
}
