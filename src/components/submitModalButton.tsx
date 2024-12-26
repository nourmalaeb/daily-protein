'use client';

import { useRouter } from 'next/navigation';
import { Button, ButtonProps } from './button';
import { useFormStatus } from 'react-dom';

export default function DismissModalButton({
  children,
  intent,
  filled,
  size,
  ...props
}: ButtonProps) {
  const { pending } = useFormStatus();
  const router = useRouter();

  function onDismiss() {
    router.back();
  }
  return (
    <Button
      onClick={onDismiss}
      intent={intent}
      filled={filled}
      size={size}
      {...props}
      disabled={pending}
    >
      {children}
    </Button>
  );
}
