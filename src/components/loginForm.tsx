'use client';

import { login } from '@/app/(auth)/login/actions';
import { Button } from './button';
import { ControlledInput } from './controlledInput';
import { useActionState, useEffect, useRef, useState } from 'react';

export const LoginForm = () => {
  const [state, loginAction, isPending] = useActionState(login, {
    error: '',
    data: { email: '', password: '' },
  });
  const [clearError, setClearError] = useState(false);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (emailRef.current && passwordRef.current) {
      emailRef.current.value = state.data.email;
      passwordRef.current.value = state.data.password;
    }

    if (state.error) {
      setClearError(false);
    }
  }, [state]);

  return (
    <form className="flex flex-col gap-4" action={loginAction}>
      <div className="flex flex-col gap-1">
        <label htmlFor="email">Email</label>
        <ControlledInput
          ref={emailRef}
          type="email"
          name="email"
          id="email"
          required
          onChange={() => setClearError(true)}
        />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="password">Password</label>
        <ControlledInput
          ref={passwordRef}
          name="password"
          type="password"
          id="password"
          required
          onChange={() => setClearError(true)}
        />
      </div>
      <Button type="submit" disabled={isPending}>
        Log in
      </Button>
      {state.error && !clearError && (
        <p
          aria-live="polite"
          className="text-red-500 font-mono px-3 py-1 bg-red-500/10 rounded text-wrap"
        >
          {`Error: ${state.error}`}
        </p>
      )}
    </form>
  );
};
