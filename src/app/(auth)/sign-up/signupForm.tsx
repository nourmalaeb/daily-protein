'use client';

import { useState, useRef, useEffect } from 'react';
import { ControlledInput, Input } from '@/components/controlledInput';
import { Button } from '@/components/buttonLink';
import { useSignUp } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { ClerkAPIError } from '@clerk/types';
import { isClerkAPIResponseError } from '@clerk/nextjs/errors';

export const SignupForm = () => {
  const { isLoaded, signUp, setActive } = useSignUp();
  const confirmPasswordRef = useRef<HTMLInputElement>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<ClerkAPIError[]>();
  const [verifying, setVerifying] = useState(false);
  const [code, setCode] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (password !== confirmPassword) {
      confirmPasswordRef.current?.setCustomValidity('Passwords should match');
    } else {
      confirmPasswordRef.current?.setCustomValidity('');
    }
  }, [password, confirmPassword]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isLoaded) return;

    try {
      await signUp.create({ emailAddress: email, password });
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
      setVerifying(true);
    } catch (err) {
      if (isClerkAPIResponseError(err)) {
        setErrors(err.errors);
      }
      console.error(JSON.stringify(err, null, 2));
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isLoaded) return;

    try {
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code,
      });

      if (signUpAttempt.status === 'complete') {
        await setActive({ session: signUpAttempt.createdSessionId });
        router.push('/');
      } else {
        console.error(JSON.stringify(signUpAttempt, null, 2));
      }
    } catch (err) {
      if (isClerkAPIResponseError(err)) {
        setErrors(err.errors);
      }
      console.error(JSON.stringify(err, null, 2));
    }
  };

  if (verifying) {
    return (
      <form className="flex flex-col gap-4" onSubmit={handleVerify}>
        <div className="flex flex-col gap-1">
          <label htmlFor="code" className="font-semibold">
            Verification code
          </label>
          <Input
            type="code"
            name="code"
            id="code"
            value={code}
            onChange={e => setCode(e.target.value)}
            required
          />
        </div>
        <Button type="submit">Verify</Button>
      </form>
    );
  }

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
          onChange={e => setEmail(e.target.value)}
          required
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
          onChange={e => setPassword(e.target.value)}
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
          value={confirmPassword}
          onChange={e => setConfirmPassword(e.target.value)}
          ref={confirmPasswordRef}
          required
          autoComplete="new-password"
        />
      </div>
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
      <div id="clerk-captcha" />
      <Button type="submit">Sign up</Button>
    </form>
  );
};
