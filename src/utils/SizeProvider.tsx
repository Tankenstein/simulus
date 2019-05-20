import React, { useEffect, useState } from 'react';
import ResizeObserver from '@juggle/resize-observer';

const SizeProvider = <T extends HTMLElement>({
  children,
  observeRef,
}: {
  children: (size: [number, number]) => React.ReactNode;
  observeRef: React.RefObject<T>;
}) => {
  // TODO: do we have to handle ref changing by setting a resize observer ref?
  // const observerRef = useRef<ResizeObserver>();
  const [size, setSize] = useState<[number, number]>([0, 0]);

  useEffect(() => {
    const currentChildRef = observeRef.current;
    if (currentChildRef) {
      const observer = new ResizeObserver(([entry]) => {
        setSize([entry.contentRect.width, entry.contentRect.height]);
      });
      observer.observe(currentChildRef);
      return () => {
        observer.unobserve(currentChildRef);
      };
    }
  }, [observeRef.current]);

  return <>{children(size)}</>;
};

export default SizeProvider;
