import React from 'react';
import { Link } from 'react-router-dom';

export const VerifyEmailPage: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Check your email
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            We've sent you a verification link. Please check your email and click the link to verify your account.
          </p>
        </div>
        
        <div className="text-center">
          <p className="text-sm text-gray-500 mb-4">
            Didn't receive the email? Check your spam folder or try signing up again.
          </p>
          
          <Link
            to="/auth/signin"
            className="font-medium text-blue-600 hover:text-blue-500"
          >
            Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};
