import { useLayoutEffect, useRef, useState } from 'react';
import { cn } from '@/utils';
import Icon from '../icon';

interface TabItem {
  label: string;
  value: string;
  icon: string;
}

interface VerticalTabsProps {
  className?: string;
  activeTab: string;
  onTabChange: (tab: string) => void;
  tabs: TabItem[];
}

export default function VerticalTabs({ className, activeTab, onTabChange, tabs }: VerticalTabsProps) {
  const itemsRef = useRef<Map<string, HTMLButtonElement>>(new Map());
  const containerRef = useRef<HTMLDivElement>(null);
  const [indicatorStyle, setIndicatorStyle] = useState<React.CSSProperties>({ opacity: 0 });

  useLayoutEffect(() => {
    if (!tabs.length) return;
    const updatePosition = () => {
      const activeElement = itemsRef.current.get(activeTab);
      if (!activeElement) return;

      const { offsetLeft, offsetTop, offsetWidth, offsetHeight } = activeElement;

      setIndicatorStyle({
        left: offsetLeft,
        top: offsetTop,
        width: offsetWidth,
        height: offsetHeight,
        opacity: 1,
      });
    };

    updatePosition();

    const observer = new ResizeObserver(() => {
      requestAnimationFrame(updatePosition);
    });

    const container = containerRef.current;
    if (container) {
      observer.observe(container);
    }
    return () => observer.disconnect();
  }, [activeTab, tabs]);

  const handleTabClick = (value: string) => {
    onTabChange(value);
    const element = itemsRef.current.get(value);
    element?.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'center',
    });
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        'relative flex w-full gap-2 rounded-12px bg-layout p-1',
        'overflow-x-auto',
        'md:max-w-268px md:flex-col md:overflow-visible md:p-4',
        className,
      )}
    >
      <div
        className="absolute rounded-8px bg-container shadow-sm transition-all duration-300 ease-in-out pointer-events-none"
        style={indicatorStyle}
      />

      {tabs.map((tab) => (
        <button
          key={tab.value}
          type="button"
          ref={(el) => {
            if (el) itemsRef.current.set(tab.value, el);
            else itemsRef.current.delete(tab.value);
          }}
          onClick={() => handleTabClick(tab.value)}
          className={cn(
            'relative z-10 flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-8px px-3 py-2 transition-all whitespace-nowrap outline-none',
            'md:flex-none md:justify-start md:py-9px',
            activeTab === tab.value ? 'font-medium text-text' : 'font-normal text-text-secondary hover:bg-black/5 dark:hover:bg-white/5',
          )}
        >
          <Icon className="size-20px text-20px shrink-0" name={tab.icon} />
          <span>{tab.label}</span>
        </button>
      ))}
    </div>
  );
}
