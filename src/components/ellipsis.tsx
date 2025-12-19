import { Tooltip } from 'antd';
import copy from 'copy-to-clipboard';
import { useLayoutEffect, useRef, useState } from 'react';
import { cn } from '@/utils';
import { messageApi } from '@/utils/toast';
import Icon from './icon';

export interface EllipsisProps {
  text?: string;
  lineClamp?: number;
  className?: string;
  middle?: boolean | number; // 单行情况下中间省略，true 表示中间省略，数字表示在最后 N 个字符前显示省略号
  copyable?: boolean;
  copiedText?: string;
}

export default function Ellipsis({
  text = '',
  lineClamp = 1,
  className,
  middle = false,
  copyable = false,
  copiedText = 'Copied',
}: EllipsisProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showTooltip, setShowTooltip] = useState(false);
  const [displayText, setDisplayText] = useState(text);
  const handleCopy = () => {
    copy(text);
    messageApi().success(copiedText);
  };
  useLayoutEffect(() => {
    if (!containerRef.current) {
      return;
    }

    const element = containerRef.current;

    // 中间省略模式
    if (middle && lineClamp === 1) {
      const updateMiddleEllipsis = () => {
        const containerWidth = element.clientWidth;
        if (containerWidth === 0) return;

        // 创建用于测量的 span
        const measureSpan = document.createElement('span');
        measureSpan.style.visibility = 'hidden';
        measureSpan.style.position = 'absolute';
        measureSpan.style.whiteSpace = 'nowrap';
        measureSpan.style.top = '0';
        measureSpan.style.left = '0';
        measureSpan.style.pointerEvents = 'none';
        element.appendChild(measureSpan);

        const measureTextWidth = (content: string) => {
          measureSpan.textContent = content;
          return measureSpan.offsetWidth;
        };

        try {
          const fullText = text;
          const ellipsis = '...';
          const ellipsisWidth = measureTextWidth(ellipsis);

          // 如果文本宽度小于容器宽度，不需要省略
          const fullTextWidth = measureTextWidth(fullText);
          if (fullTextWidth <= containerWidth) {
            setDisplayText(fullText);
            setShowTooltip(false);
            return;
          }

          // 如果 middle 是数字，在最后 N 个字符前显示省略号
          if (typeof middle === 'number' && middle > 0) {
            const tailLength = Math.min(middle, fullText.length);
            const backText = fullText.slice(fullText.length - tailLength);
            const backWidth = measureTextWidth(backText);

            // 如果后 N 个字符 + 省略号已经超过容器宽度，只显示省略号
            if (backWidth + ellipsisWidth > containerWidth) {
              setDisplayText(ellipsis);
              setShowTooltip(true);
              return;
            }

            // 二分查找找到合适的前文本长度
            let left = 0;
            let right = fullText.length - tailLength;
            let bestLength = 0;

            while (left <= right) {
              const mid = Math.floor((left + right) / 2);
              const frontText = fullText.slice(0, mid);
              const frontWidth = measureTextWidth(frontText);

              if (frontWidth + ellipsisWidth + backWidth <= containerWidth) {
                bestLength = mid;
                left = mid + 1;
              } else {
                right = mid - 1;
              }
            }

            if (bestLength > 0) {
              const front = fullText.slice(0, bestLength);
              setDisplayText(`${front}${ellipsis}${backText}`);
              setShowTooltip(true);
            } else {
              // 如果连一个字符都放不下，只显示省略号
              setDisplayText(ellipsis);
              setShowTooltip(true);
            }
          } else {
            // middle === true，原有的中间省略逻辑
            // 二分查找找到合适的前后文本长度
            let left = 0;
            let right = Math.floor(fullText.length / 2);
            let bestLength = 0;

            while (left <= right) {
              const mid = Math.floor((left + right) / 2);
              const frontText = fullText.slice(0, mid);
              const backText = fullText.slice(fullText.length - mid);
              const frontWidth = measureTextWidth(frontText);
              const backWidth = measureTextWidth(backText);

              if (frontWidth + ellipsisWidth + backWidth <= containerWidth) {
                bestLength = mid;
                left = mid + 1;
              } else {
                right = mid - 1;
              }
            }

            if (bestLength > 0) {
              const front = fullText.slice(0, bestLength);
              const back = fullText.slice(fullText.length - bestLength);
              setDisplayText(`${front}${ellipsis}${back}`);
              setShowTooltip(true);
            } else {
              // 如果连一个字符都放不下，只显示省略号
              setDisplayText(ellipsis);
              setShowTooltip(true);
            }
          }
        } finally {
          if (element.contains(measureSpan)) {
            element.removeChild(measureSpan);
          }
        }
      };

      updateMiddleEllipsis();

      // 监听容器大小变化
      const resizeObserver = new ResizeObserver(updateMiddleEllipsis);
      resizeObserver.observe(element);

      return () => {
        resizeObserver.disconnect();
      };
    } else {
      // 原有的末尾省略逻辑
      if (lineClamp === 1) {
        const isOverflow = element.scrollWidth > element.clientWidth;
        setShowTooltip(isOverflow);
        setDisplayText(text);
      } else {
        const isOverflow = element.scrollHeight > element.clientHeight;
        setShowTooltip(isOverflow);
        setDisplayText(text);
      }
    }
  }, [text, lineClamp, middle]);

  const ellipsisClass = cn(
    'overflow-hidden',
    lineClamp === 1 && !middle
      ? 'text-ellipsis whitespace-nowrap'
      : lineClamp === 1 && middle
        ? 'whitespace-nowrap'
        : '',
    className,
  );

  let content = (
    <div
      ref={containerRef}
      className={ellipsisClass}
      style={{ WebkitLineClamp: lineClamp }}
    >
      {displayText}
    </div>
  );

  if (copyable) {
    content = (
      <div className="flex items-center gap-1">
        <div
          ref={containerRef}
          className={cn(ellipsisClass, showTooltip ? 'flex-1 min-w-0' : '')}
          style={{ WebkitLineClamp: lineClamp }}
        >
          {displayText}
        </div>
        <button onClick={handleCopy} type="button">
          <Icon
            className="cursor-pointer hover:op-80 text-#718096 dark:text-#838383"
            name="i-solar-copy-linear"
          />
        </button>
      </div>
    );
  }

  if (!showTooltip) {
    return content;
  }

  return <Tooltip title={text}>{content}</Tooltip>;
}
