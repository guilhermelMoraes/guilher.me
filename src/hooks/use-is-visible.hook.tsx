import {
  useEffect,
  useState,
  type DependencyList,
  type RefObject,
} from 'react';

export default function useIsVisible(
  element: RefObject<HTMLElement | null>,
  deps?: DependencyList,
) {
  const [elementVisible, setElementVisible] = useState(true);

  useEffect(() => {
    const { current } = element;
    if (!current) return;

    const observer = new IntersectionObserver(([entry]) => {
      setElementVisible(entry.isIntersecting);
    });

    observer.observe(current);

    return () => observer.disconnect();
  }, deps);

  return elementVisible;
}
