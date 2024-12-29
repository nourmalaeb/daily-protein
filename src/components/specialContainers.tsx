export const AnimatedBorderDiv = ({
  animate,
  borderClasses,
  className = '',
  children,
}: {
  animate: boolean;
  borderClasses: string;
  className?: string;
  children: React.ReactNode;
}) => {
  const lightModeClass = `[background:linear-gradient(45deg,theme(colors.green.500/.10),theme(colors.green.500/.10))_padding-box,linear-gradient(45deg,theme(colors.background),theme(colors.background))_padding-box,conic-gradient(from_var(--border-angle),#BDD4C1_80%,_theme(colors.teal.500)_86%,_theme(colors.teal.500)_90%,_theme(colors.teal.500)_94%,_theme(colors.green.500/.50))_border-box]`;
  const darkModeClass = `dark:[background:linear-gradient(45deg,theme(colors.green.300/.05),theme(colors.green.300/.05))_padding-box,linear-gradient(45deg,theme(colors.background),theme(colors.background))_padding-box,conic-gradient(from_var(--border-angle),theme(colors.green.500/.50)_80%,_theme(colors.green.700)_86%,_theme(colors.green.300)_90%,_theme(colors.green.700)_94%,_theme(colors.green.500/.50))_border-box]`;
  const finalClassName = (
    animate
      ? `${lightModeClass} ${darkModeClass} border border-transparent animate-border`
      : borderClasses
  ).concat(' ' + className);
  return <div className={finalClassName}>{children}</div>;
};
