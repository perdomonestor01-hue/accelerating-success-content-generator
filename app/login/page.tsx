'use client';

import { useState, Suspense } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError(result.error);
      } else if (result?.ok) {
        // Get the callback URL or default to home page
        const callbackUrl = searchParams.get('callbackUrl') || '/';
        router.push(callbackUrl);
        router.refresh();
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-acs-navy mb-2">
          Accelerating Success
        </h1>
        <h2 className="text-xl text-acs-blue mb-1">
          Content Generator
        </h2>
        <p className="text-acs-gray-medium text-sm">
          Sign in to generate engaging content
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <p className="text-sm font-medium">⚠️ {error}</p>
        </div>
      )}

      {/* Login Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Email Field */}
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-acs-gray-dark mb-2"
          >
            Email Address
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="info@accelerating-success.com"
            className="w-full px-4 py-3 border border-acs-gray-light rounded-lg focus:ring-2 focus:ring-acs-navy focus:border-transparent transition-all"
            disabled={loading}
          />
        </div>

        {/* Password Field */}
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-acs-gray-dark mb-2"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Enter your password"
            className="w-full px-4 py-3 border border-acs-gray-light rounded-lg focus:ring-2 focus:ring-acs-navy focus:border-transparent transition-all"
            disabled={loading}
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-acs-red hover:bg-acs-red/90 disabled:bg-acs-gray-medium text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center shadow-lg"
        >
          {loading ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Signing in...
            </>
          ) : (
            <>🔐 Sign In</>
          )}
        </button>
      </form>

      {/* Footer Info */}
      <div className="mt-8 text-center">
        <p className="text-xs text-acs-gray-medium">
          Secure authentication powered by NextAuth
        </p>
      </div>
    </div>
  );
}

function LoginFallback() {
  return (
    <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md animate-pulse">
      <div className="text-center mb-8">
        <div className="h-10 bg-gray-200 rounded w-3/4 mx-auto mb-2"></div>
        <div className="h-6 bg-gray-200 rounded w-1/2 mx-auto"></div>
      </div>
      <div className="space-y-6">
        <div className="h-12 bg-gray-200 rounded"></div>
        <div className="h-12 bg-gray-200 rounded"></div>
        <div className="h-12 bg-gray-200 rounded"></div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-acs-navy via-acs-blue to-acs-navy flex items-center justify-center p-4">
      <Suspense fallback={<LoginFallback />}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
