"use client";

import React, { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation'
import { authService } from '@/services/api';
import { Suspense } from 'react';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      authService.setToken(token);
      router.push('/');
    }
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center ">
      <div className="bg-[#fcffdf] rounded-lg shadow-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">Login</h1>
        <button
          className="w-full flex items-center justify-center bg-[#643861] hover:bg-[#d35c13] text-white py-3 px-4 rounded-lg transition"
          onClick={() => authService.loginWithGoogle()}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 48 48"
            className="w-6 h-6 mr-2"
          >
            <path
              fill="#EA4335"
              d="M24 9.5c3.33 0 6.32 1.22 8.68 3.22l6.5-6.5C35.27 3.4 30.02 1 24 1 14.62 1 7.14 6.61 4.25 14.23l7.6 5.89C13.58 12.6 18.47 9.5 24 9.5z"
            />
            <path
              fill="#4285F4"
              d="M47.53 24.55c0-.98-.08-1.92-.2-2.84H24v5.38h13.33c-.57 3-2.28 5.51-4.8 7.14l7.61 5.88c4.43-4.09 7.39-10.12 7.39-15.56z"
            />
            <path
              fill="#FBBC05"
              d="M8.86 28.03A14.8 14.8 0 0 1 8 24c0-1.38.23-2.71.65-3.97l-7.6-5.89A23.95 23.95 0 0 0 0 24c0 3.93.94 7.63 2.61 10.86l7.62-5.83z"
            />
            <path
              fill="#34A853"
              d="M24 47c6.48 0 11.91-2.14 15.88-5.8l-7.6-5.89c-2.09 1.4-4.77 2.22-8.28 2.22-5.52 0-10.41-3.12-12.89-7.67l-7.62 5.83C7.08 41.99 14.88 47 24 47z"
            />
            <path fill="none" d="M0 0h48v48H0z" />
          </svg>
          Login with Google
        </button>
      </div>
    </div>
  );
}

function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginContent />
    </Suspense>
  );
}

export default LoginPage;