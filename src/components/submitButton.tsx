import { useFormStatus } from 'react-dom';
import { Button } from './buttonLink';

export function SubmitButton({
  label,
  ...props
}: { label: string } & React.ComponentPropsWithoutRef<'button'>) {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      intent={'primary'}
      className="grow w-1/2"
      disabled={pending}
      {...props}
    >
      {pending ? 'Loading...' : label}
    </Button>
  );
}
