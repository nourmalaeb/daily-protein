'use client';

import { useRouter } from 'next/navigation';
import { Button, ButtonProps } from './button';

export default function DismissModalButton({
  children,
  intent,
  filled,
  size,
  ...props
}: ButtonProps) {
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
    >
      {children}
    </Button>
  );
}
