'use client';

import { useActionState, useEffect, useRef, useState } from 'react';
import { signup } from '../login/actions';
import { ControlledInput, Input } from '@/components/controlledInput';
import { Button } from '@/components/button';

export const SignupForm = () => {
  const confirmPasswordRef = useRef<HTMLInputElement>(null);
  const [confirmPasswordValue, setConfirmPasswordValue] = useState('');

  const [actionState, signupAction, isPending] = useActionState(signup, {
    error: '',
    data: { email: '', password: '' },
  });

  const [passwordValue, setPasswordValue] = useState(actionState.data.password);
  useEffect(() => {
    if (passwordValue !== confirmPasswordValue) {
      confirmPasswordRef.current?.setCustomValidity('Passwords should match');
    } else {
      confirmPasswordRef.current?.setCustomValidity('');
    }
  }, [passwordValue, confirmPasswordValue]);

  const [clearError, setClearError] = useState(false);
  useEffect(() => {
    if (actionState.error) {
      setClearError(false);
    }
  }, [actionState]);

  return (
    <form className="flex flex-col gap-4" action={signupAction}>
      <div className="flex flex-col gap-1">
        <label htmlFor="email" className="font-semibold">
          Email
        </label>
        <Input
          type="email"
          name="email"
          id="email"
          required
          defaultValue={actionState.data.email}
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
          value={passwordValue}
          onChange={e => setPasswordValue(e.target.value)}
          required
          pattern="[A-Za-z0-9#?!@$ %^&*\-]{12,}"
          autoComplete="new-password"
        />
        <p className="opacity-90">
          Password requirements: at least 12 characters long, using letters,
          numbers, spaces, and any of these symbols: #?!@$%^&*-
        </p>
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="confirm-password" className="font-semibold">
          Confirm password
        </label>
        <ControlledInput
          name="confirm-password"
          type="password"
          id="confirm-password"
          value={confirmPasswordValue}
          onChange={e => setConfirmPasswordValue(e.target.value)}
          ref={confirmPasswordRef}
          required
          autoComplete="new-password"
        />
      </div>
      {actionState.error && !clearError && (
        <p
          aria-live="polite"
          className="text-red-500 font-mono px-3 py-1 bg-red-500/10 rounded-sm text-wrap"
        >
          {`Error: ${actionState.error}`}
        </p>
      )}
      <Button type="submit" disabled={isPending}>
        Sign up
      </Button>
    </form>
  );
};
