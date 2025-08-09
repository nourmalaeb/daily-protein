import Link from 'next/link';
import { LoginForm } from '@/components/loginForm';

const LoginPage = () => {
  return (
    <div className="flex flex-col gap-10 p-4">
      <h1 className="font-bold text-2xl tracking-tight">Sign in</h1>
      <LoginForm />
      <div className="p-4 border border-zinc-500 text-center">
        <h2>
          Need an account?{' '}
          <Link
            href="/sign-up"
            className="text-orange-600 underline hover:text-orange-700"
          >
            Sign up
          </Link>
        </h2>
      </div>
    </div>
  );
};

export default LoginPage;
