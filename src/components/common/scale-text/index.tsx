import type React from 'react';
import { useLayoutEffect, useRef, useState } from 'react';
import { useResizeObserver } from 'usehooks-ts';
import { cn } from '@/utils';

interface ScaleTextProps {
  children: React.ReactNode;
  baseFontSize: number;
  className?: string;
  style?: React.CSSProperties;
}

const ScaleText: React.FC<ScaleTextProps> = ({ children, baseFontSize, className, style }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const hiddenTextRef = useRef<HTMLSpanElement>(null);
  const containerSize = useResizeObserver({ ref: containerRef as any, box: 'border-box' });
  const [fontSize, setFontSize] = useState(baseFontSize);

  useLayoutEffect(() => {
    if (!containerRef.current || !hiddenTextRef.current || !containerSize?.width) return;

    const containerWidth = containerSize.width;
    const textWidth = hiddenTextRef.current.offsetWidth;

    if (textWidth === 0) return;

    if (textWidth > containerWidth) {
      const newSize = (containerWidth / textWidth) * baseFontSize;
      setFontSize(newSize);
    } else {
      setFontSize(baseFontSize);
    }
  }, [containerSize?.width, baseFontSize]);

  return (
    <div ref={containerRef} className={cn('overflow-hidden whitespace-nowrap grid max-w-full items-center', className)} style={style}>
      <span style={{ fontSize: `${fontSize}px`, transition: 'font-size 0.1s', gridArea: '1/1' }}>{children}</span>
      <span
        ref={hiddenTextRef}
        style={{
          fontSize: `${baseFontSize}px`,
          visibility: 'hidden',
          whiteSpace: 'nowrap',
          pointerEvents: 'none',
          gridArea: '1/1',
        }}
        aria-hidden="true"
      >
        {children}
      </span>
    </div>
  );
};

export default ScaleText;
