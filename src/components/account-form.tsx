'use client';

import { Button } from '@/components/buttonLink';
import { UserPreferences } from '@/lib/types';
import { useActionState, useState } from 'react';
import {
  updatePreferences,
  UpdatePreferencesActionState,
} from '@/app/account/actions';
import { ControlledInput } from '@/components/controlledInput';
import dayjs from 'dayjs';
import { today } from '@/lib/utils';
import { useProteinStore } from '@/providers/protein-provider';

export default function AccountForm({
  preferences,
}: {
  preferences: UserPreferences;
}) {
  const { updateGoal, updatePreference } = useProteinStore(state => state);
  const [currentGoal, setCurrentGoal] = useState(preferences.goal);
  const initialState = {
    error: undefined,
    payload: { goal: preferences.goal },
    data: undefined,
  };
  const [actionState, updatePreferencesAction, isPending] = useActionState(
    async (prevState: UpdatePreferencesActionState, formData: FormData) => {
      const result = await updatePreferences(prevState, formData);
      if (result.data) {
        // Handle success
        console.log(result);
        updateGoal(result.data.goalData);
        updatePreference(result.data.preferenceData);
      }
      return result;
    },
    initialState
  );

  return (
    <>
      <form className="flex flex-col gap-4" action={updatePreferencesAction}>
        <label className="font-bold" htmlFor="goal">
          Daily protein goal (in grams)
        </label>
        <p>
          Your daily protein goal should be around 0.5–1 grams per lb of body
          weight.
        </p>
        <div className="flex gap-2">
          <div className="w-20 flex flex-col">
            <ControlledInput
              id="goal"
              name="goal"
              type="number"
              defaultValue={actionState.payload?.goal || preferences.goal}
              min={0}
              required
              onChange={e => {
                setCurrentGoal(Number(e.target.value));
              }}
            />
          </div>
          <input name="date" className="hidden" defaultValue={today()} />
          <Button
            intent={'primary'}
            type="submit"
            disabled={
              isPending ||
              currentGoal === preferences.goal ||
              currentGoal === actionState.payload?.goal
            }
          >
            {isPending ? 'Saving...' : 'Update goal'}
          </Button>
        </div>
        <p>
          Updating this value will set your daily protein goal from today (
          {dayjs(today()).format('dddd, MMMM D YYYY')}) onwards.
        </p>
        {actionState.error && (
          <pre>{JSON.stringify(actionState?.error, null, 2)}</pre>
        )}
      </form>
    </>
  );
}
