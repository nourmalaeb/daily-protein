'use client';

import { Button } from '@/components/button';
import { RadioInput } from '@/components/radioGroup';
import { UserPreferences } from '@/lib/types';
import { useActionState, useState } from 'react';
import { updatePreferences } from './actions';
import { ControlledInput } from '@/components/controlledInput';
import dayjs from 'dayjs';

export default function AccountForm({ data }: { data: UserPreferences }) {
  const [currentGoal, setCurrentGoal] = useState(data.goal);
  const [actionState, updatePreferencesAction, isPending] = useActionState(
    updatePreferences,
    { payload: { appearance: data.appearance?.appearance, goal: data.goal } }
  );

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    console.log(e);
    e.currentTarget.form?.requestSubmit();
  };

  return (
    <div className="flex flex-col gap-12 px-4 pt-8">
      <form className="flex flex-col gap-12" action={updatePreferencesAction}>
        <div className="flex flex-col gap-3 items-start">
          <label className="font-bold" htmlFor="goal">
            Daily protein goal (in grams)
          </label>
          <p>
            Your daily protein goal should be around 1.7-2 grams per lb of body
            weight.
          </p>
          <div className="flex gap-2">
            <div className="w-20 flex flex-col">
              <ControlledInput
                id="goal"
                name="goal"
                type="number"
                defaultValue={actionState.payload?.goal || data.goal}
                min={0}
                required
                onChange={e => {
                  setCurrentGoal(Number(e.target.value));
                }}
              />
            </div>
            <Button
              intent={'primary'}
              type="submit"
              disabled={
                currentGoal === data.goal ||
                currentGoal === actionState.payload?.goal
              }
            >
              Update goal
            </Button>
          </div>
          <p>
            Updating this value will set your daily protein goal from today (
            {dayjs().format('dddd, MMMM D YYYY')}) onwards.
          </p>
        </div>
        <div className="flex flex-col gap-3 items-start">
          <label className="font-bold" htmlFor="appearance">
            Appearance
          </label>
          <RadioInput
            name="appearance"
            options={['System', 'Light', 'Dark']}
            defaultValue={
              actionState.payload?.appearance || data.appearance?.appearance
            }
            onChange={onChange}
          />
          {isPending && <div>Saving...</div>}
        </div>
      </form>

      {/* <pre>{JSON.stringify(actionState?.payload, null, 2)}</pre>
      <pre>{JSON.stringify(data, null, 2)}</pre> */}

      <div>
        <form action="/signout" method="post">
          <Button type="submit">Sign out</Button>
        </form>
      </div>
    </div>
  );
}
