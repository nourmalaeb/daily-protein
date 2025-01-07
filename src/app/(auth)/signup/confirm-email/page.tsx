'use client';

const SignupPage = () => {
  // console.log(actionData);
  return (
    <div className="flex flex-col gap-2 p-4">
      <h1 className="font-bold text-2xl tracking-tight">Check your inbox</h1>
      <p>
        Please check your email for a confirmation link. If you don’t see it,
        check your spam folder.
      </p>
      <p>(You can close this window now.)</p>
    </div>
  );
};

export default SignupPage;
