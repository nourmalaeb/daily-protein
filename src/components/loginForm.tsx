'use client';

import { Button } from '@/components/buttonLink';
import { Input } from './controlledInput';
import { useState } from 'react';
import { useSignIn } from '@clerk/nextjs';
import { ClerkAPIError } from '@clerk/types';
import { useRouter } from 'next/navigation';
import { isClerkAPIResponseError } from '@clerk/nextjs/errors';

export const LoginForm = () => {
  const { isLoaded, signIn, setActive } = useSignIn();
  const [errors, setErrors] = useState<ClerkAPIError[]>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setErrors(undefined);

    if (!isLoaded) return;

    try {
      const signInAttempt = await signIn.create({
        identifier: email,
        password: password,
      });

      if (signInAttempt.status === 'complete') {
        await setActive({ session: signInAttempt.createdSessionId });
        router.push('/');
      } else {
        console.error(JSON.stringify(signInAttempt, null, 2));
      }
    } catch (err) {
      if (isClerkAPIResponseError(err)) {
        setErrors(err.errors);
      }
      console.error(JSON.stringify(err, null, 2));
    }
  };

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
      <div className="flex flex-col gap-1">
        <label htmlFor="email" className="font-semibold">
          Email
        </label>
        <Input
          type="email"
          name="email"
          id="email"
          value={email}
          required
          onChange={e => setEmail(e.target.value)}
          autoComplete="username"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="password" className="font-semibold">
          Password
        </label>
        <Input
          name="password"
          type="password"
          id="password"
          value={password}
          required
          onChange={e => setPassword(e.target.value)}
          autoComplete="current-password"
        />
      </div>
      <Button type="submit">Sign in</Button>
      {errors && (
        <ul>
          {errors.map((el, idx) => (
            <li
              key={idx}
              aria-live="polite"
              className="text-red-500 font-mono px-3 py-1 bg-red-500/10 rounded-sm text-wrap"
            >
              {`Error: ${el.longMessage}`}
            </li>
          ))}
        </ul>
      )}
    </form>
  );
};
