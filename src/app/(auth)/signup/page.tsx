'use client';

import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/button';
import { ControlledInput, Input } from '@/components/controlledInput';
import Link from 'next/link';
import { signup } from '../login/actions';

// export async function action({ request }: ActionFunctionArgs) {
//   const { supabaseClient, headers } = createSupabaseServerClient(request);

//   const body = await request.formData();

//   const response = await supabaseClient.auth.signUp({
//     email: String(body.get('email')),
//     password: String(body.get('password')),
//   });

//   if (!response.error) {
//     // console.log('LOGGING IN SUCCESSFULLY');
//     // console.log(response);
//     // return data(response, { headers });
//     return redirect('/confirmation-sent', { headers });
//   }

//   console.log(response);

//   return data(response, { headers });
// }

const SignupPage = () => {
  const confirmPasswordRef = useRef<HTMLInputElement>(null);
  const [passwordValue, setPasswordValue] = useState('');
  const [confirmPasswordValue, setConfirmPasswordValue] = useState('');

  useEffect(() => {
    if (passwordValue !== confirmPasswordValue) {
      confirmPasswordRef.current?.setCustomValidity('Passwords should match');
    } else {
      confirmPasswordRef.current?.setCustomValidity('');
    }
  }, [passwordValue, confirmPasswordValue]);

  // console.log(actionData);
  return (
    <div className="flex flex-col gap-10 p-4">
      <h1 className="font-bold text-2xl tracking-tight">Sign up</h1>
      <form className="flex flex-col gap-4" action={signup}>
        <div className="flex flex-col gap-1">
          <label htmlFor="email">Email</label>
          <Input type="email" name="email" id="email" required />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="password">Password</label>
          <Input
            name="password"
            type="password"
            id="password"
            value={passwordValue}
            onChange={e => setPasswordValue(e.target.value)}
            required
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="confirm-password">Confirm password</label>
          <ControlledInput
            name="confirm-password"
            type="password"
            id="confirm-password"
            value={confirmPasswordValue}
            onChange={e => setConfirmPasswordValue(e.target.value)}
            ref={confirmPasswordRef}
            required
          />
        </div>
        <pre className="text-red-500 text-sm px-2 py-1 bg-red-500/10 rounded text-wrap">
          {`Error:`}
        </pre>
        <Button type="submit">Sign up</Button>
      </form>
      <div className="p-4 border border-zinc-500 text-center">
        <h2>
          Already have an account?{' '}
          <Link
            href="/login"
            className="text-orange-600 underline hover:text-orange-700"
          >
            Log in
          </Link>
        </h2>
      </div>
    </div>
  );
};

export default SignupPage;
