import { useFormStatus } from 'react-dom';
import { Button } from './buttonLink';

export function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      intent={'primary'}
      className="grow w-1/2"
      disabled={pending}
    >
      {pending ? 'Loading...' : label}
    </Button>
  );
}
