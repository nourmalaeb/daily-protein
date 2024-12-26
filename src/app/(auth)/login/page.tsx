import { Button } from '@/components/button';
import { Input } from '@/components/controlledInput';
import Link from 'next/link';
import { login } from './actions';

const LoginPage = () => {
  return (
    <div className="flex flex-col gap-10 p-4">
      <h1 className="font-bold text-2xl tracking-tight">Log in</h1>
      <form className="flex flex-col gap-4" action={login}>
        <div className="flex flex-col gap-1">
          <label htmlFor="email">Email</label>
          <Input type="email" name="email" id="email" required />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="password">Password</label>
          <Input name="password" type="password" id="password" required />
        </div>

        <pre className="text-red-500 text-sm px-2 py-1 bg-red-500/10 rounded text-wrap">
          {`Error: `}
        </pre>
        {/* <pre>{navigation.state}</pre> */}
        <Button type="submit">Log in</Button>
      </form>
      <div className="p-4 border border-zinc-500 text-center">
        <h2>
          Need an account?{' '}
          <Link
            href="/signup"
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
