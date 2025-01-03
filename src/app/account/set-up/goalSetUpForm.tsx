'use client';

import { Button } from '@/components/buttonLink';
import { useActionState, useState } from 'react';
import { createGoalPreference } from '../actions';
import { ControlledInput } from '@/components/controlledInput';
import * as Accordion from '@radix-ui/react-accordion';
import { RadioInput } from '@/components/radioGroup';
import { ChevronDown, TriangleAlert } from 'lucide-react';

export default function GoalSetupForm() {
  const [currentGoal, setCurrentGoal] = useState<number>(150);
  const [bodyWeight, setBodyWeight] = useState<number | null>();
  const [gramsPerLb, setGramsPerLb] = useState(0.8);
  const [calculateError, setCalculateError] = useState<string | null>(null);
  const [actionState, createGoalPreferenceAction, isPending] = useActionState(
    createGoalPreference,
    { error: '', payload: { goal: currentGoal } }
  );

  const updateGramsPerLb = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value === 'casual') setGramsPerLb(0.6);
    if (e.target.value === 'active') setGramsPerLb(0.8);
    if (e.target.value === 'recomp') setGramsPerLb(1.0);
  };

  const calculateGoalFromWeight = () => {
    if (!bodyWeight) return setCalculateError('Please enter your body weight.');
    setCurrentGoal(Math.ceil(bodyWeight * gramsPerLb));
  };

  return (
    <>
      <Accordion.Root type="single" collapsible>
        <Accordion.Item
          value="calculate-goal"
          className="flex flex-col p-4 -mx-2 border border-zinc-500/50 rounded-xl bg-zinc-100 dark:bg-zinc-950"
        >
          <Accordion.Header>
            <Accordion.Trigger className="w-full flex items-center gap-2 font-bold group">
              <ChevronDown
                size={16}
                className="group-data-[state=open]:rotate-180 transition-transform duration-200"
              />
              <span>Goal calculator</span>
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content className="data-[state=open]:animate-accordion-slide-down data-[state=closed]:animate-accordion-slide-up data-[state=open]:mt-8 data-[state=closed]:mt-0">
            <div className="flex flex-col gap-8 items-start">
              <div className="flex flex-col gap-2">
                <div className="flex flex-row justify-between items-center">
                  <label
                    className="font-bold w-2/3 flex-shrink-0"
                    htmlFor="goal"
                  >
                    Body weight (in lbs)
                  </label>
                  <div className="flex w-1/3 flex-col items-stretch">
                    <ControlledInput
                      id="goal"
                      name="goal"
                      type="number"
                      min={0}
                      required
                      onChange={e => {
                        setCalculateError(null);
                        setBodyWeight(Number(e.target.value));
                      }}
                    />
                  </div>
                </div>
                <p className={`text-sm font-medium opacity-80 italic`}>
                  We don’t store this value — it’s just for helping you
                  calculate your goal.
                </p>
              </div>

              <div className="flex flex-col gap-2 w-full">
                <p className="font-bold">Approach</p>
                <div className="flex flex-col gap-2">
                  <RadioInput
                    name="approach"
                    defaultValue="active"
                    options={[
                      {
                        value: 'casual',
                        label: (
                          <div className="w-full flex flex-col p-1 pb-2 text-left">
                            <div className="flex justify-between items-baseline">
                              <p className="font-semibold">Maintenance</p>
                              <span className="font-mono text-sm font-semibold">
                                0.6 g/lb
                              </span>
                            </div>
                            <p className="text-sm opacity-80">
                              Not working out much or at all. Not looking to
                              change body composition.
                            </p>
                          </div>
                        ),
                      },
                      {
                        value: 'active',
                        label: (
                          <div className="w-full flex flex-col p-1 pb-2 text-left">
                            <div className="flex justify-between items-baseline">
                              <p className="font-semibold">Active</p>
                              <span className="font-mono text-sm font-semibold">
                                0.8 g/lb
                              </span>
                            </div>
                            <p className="text-sm opacity-80">
                              Working out regularly. Looking to grow more muscle
                              at a sustainable pace.
                            </p>
                          </div>
                        ),
                      },
                      {
                        value: 'recomp',
                        label: (
                          <div className="w-full flex flex-col p-1 pb-2 text-left">
                            <div className="flex justify-between items-baseline">
                              <p className="font-semibold">Aggressive</p>
                              <span className="font-mono text-sm font-semibold">
                                1.0 g/lb
                              </span>
                            </div>
                            <p className="text-sm opacity-80">
                              Trying to quickly gain muscle and achieve body
                              recomposition.
                            </p>
                          </div>
                        ),
                      },
                    ]}
                    onChange={updateGramsPerLb}
                    className="w-full flex flex-col gap-0.5"
                  />
                </div>
              </div>

              <div className="w-full flex flex-col">
                <Button type="button" onClick={calculateGoalFromWeight}>
                  Calculate goal
                </Button>
                {calculateError && (
                  <div className="text-red-500 px-3 py-1 font-medium border border-red-500/20 mt-2 w-full flex items-center gap-2 bg-red-500/10 dark:bg-red-400/20 dark:text-red-300 rounded-md">
                    <TriangleAlert size={16} />
                    {calculateError}
                  </div>
                )}
              </div>
            </div>
          </Accordion.Content>
        </Accordion.Item>
      </Accordion.Root>
      <form className="flex flex-col gap-8" action={createGoalPreferenceAction}>
        <div className="flex flex-col gap-3 items-start">
          <label className="font-bold" htmlFor="goal">
            Daily protein goal (in grams)
          </label>
          <ControlledInput
            id="goal"
            name="goal"
            type="number"
            value={currentGoal}
            min={0}
            required
            onChange={e => {
              setCurrentGoal(Number(e.target.value));
            }}
          />
        </div>
        <div className="flex flex-col gap-2 items-stretch mb-4">
          <Button intent={'primary'} type="submit" disabled={isPending}>
            Save goal
          </Button>
          <p className="text-center">
            (You can always adjust your goal later!)
          </p>
        </div>
      </form>

      {actionState.error && (
        <pre>{JSON.stringify(actionState?.error, null, 2)}</pre>
      )}
      {/* <pre>{JSON.stringify(actionState?.payload, null, 2)}</pre>
      <pre>{JSON.stringify(data, null, 2)}</pre> */}
    </>
  );
}
