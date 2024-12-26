import {
  type Variants,
  motion,
  type Target,
  type TargetAndTransition,
  type AnimationControls,
  type VariantLabels,
} from 'motion/react';

export function SplitLetters({
  text,
  initial,
  animate,
  variants,
  ...props
}: {
  text: string;
  initial?: boolean | Target | VariantLabels;
  animate?: AnimationControls | TargetAndTransition | VariantLabels | boolean;
  variants?: Variants;
}) {
  const letters = text.split('');
  return letters.map((letter, i) => {
    return (
      <span key={text + i}>
        <motion.div
          initial={initial}
          animate={animate}
          variants={variants}
          {...props}
          style={{ display: 'inline-block', willChange: 'transform' }}
          custom={i}
        >
          {letter}
        </motion.div>
      </span>
    );
  });
}
