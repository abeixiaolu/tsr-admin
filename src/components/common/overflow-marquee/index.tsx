import { useLayoutEffect, useRef, useState } from 'react';
import Marquee from 'react-fast-marquee';

interface OverflowMarqueeProps {
  children: React.ReactNode;
}
const MarqueeComponent = (Marquee as any).default;
export default function OverflowMarquee({ children }: OverflowMarqueeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [isOverflow, setIsOverflow] = useState(false);
  const overflowRef = useRef(false);

  useLayoutEffect(() => {
    const checkOverflow = () => {
      if (containerRef.current && contentRef.current) {
        const containerWidth = containerRef.current.clientWidth;
        const contentWidth = contentRef.current.scrollWidth;
        const isTextOverflow = contentWidth > containerWidth;
        // 只有变化时才 setState，避免 effect 中直接 set 更新
        if (overflowRef.current !== isTextOverflow) {
          overflowRef.current = isTextOverflow;
          setIsOverflow(isTextOverflow);
        }
      }
    };
    // 监听窗口大小变化
    const resizeObserver = new ResizeObserver(checkOverflow);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <div ref={containerRef} className="overflow-hidden">
      {isOverflow ? (
        <MarqueeComponent speed={40} gradient={false} pauseOnHover>
          <div ref={contentRef} className="whitespace-nowrap">
            {children}
          </div>
        </MarqueeComponent>
      ) : (
        <div ref={contentRef} className="whitespace-nowrap">
          {children}
        </div>
      )}
    </div>
  );
}
