import { Suspense, type ComponentType } from 'react';

export default function HOCWithSuspense(
  Component: ComponentType,
  Fallback: ComponentType,
) {
  return (props: any) => (
    <Suspense fallback={<Fallback />}>
      <Component {...props} />
    </Suspense>
  );
}
