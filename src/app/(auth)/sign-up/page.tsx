'use client';

import Link from 'next/link';
import { SignupForm } from './signupForm';

const SignupPage = () => {
  return (
    <div className="flex flex-col gap-10 p-4">
      <h1 className="font-bold text-2xl tracking-tight">Sign up</h1>
      <SignupForm />
      <div className="p-4 border border-zinc-500 text-center">
        <h2>
          Already have an account?{' '}
          <Link
            href="/sign-in"
            className="text-orange-600 underline hover:text-orange-700"
          >
            Sign in
          </Link>
        </h2>
      </div>
    </div>
  );
};

export default SignupPage;
