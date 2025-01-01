'use client';

import { login } from '@/app/(auth)/login/actions';
import { Button } from './button';
import { Input } from './controlledInput';
import { useActionState, useEffect, useState } from 'react';

export const LoginForm = () => {
  const [state, loginAction, isPending] = useActionState(login, {
    error: '',
    data: { email: '', password: '' },
  });
  const [clearError, setClearError] = useState(false);
  useEffect(() => {
    if (state.error) {
      setClearError(false);
    }
  }, [state]);

  return (
    <form className="flex flex-col gap-4" action={loginAction}>
      <div className="flex flex-col gap-1">
        <label htmlFor="email" className="font-semibold">
          Email
        </label>
        <Input
          type="email"
          name="email"
          id="email"
          required
          onChange={() => setClearError(true)}
          defaultValue={state.data.email}
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
          required
          onChange={() => setClearError(true)}
          defaultValue={state.data.password}
          autoComplete="current-password"
        />
      </div>
      <Button type="submit" disabled={isPending}>
        Log in
      </Button>
      {state.error && !clearError && (
        <p
          aria-live="polite"
          className="text-red-500 font-mono px-3 py-1 bg-red-500/10 rounded-sm text-wrap"
        >
          {`Error: ${state.error}`}
        </p>
      )}
    </form>
  );
};
