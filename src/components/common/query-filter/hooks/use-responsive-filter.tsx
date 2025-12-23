import { useEffect, useRef, useState } from 'react';
import { useResizeObserver } from 'usehooks-ts';

interface UseResponsiveFilterProps {
  orderedFields: any[];
  defaultCollapsed?: boolean;
  minWidth?: number;
  gap?: number;
}

const PADDING = 6;
/** 响应式搜索表单相关的逻辑 */
export function useResponsiveFilter({ defaultCollapsed = true, minWidth = 300, gap = 16, orderedFields }: UseResponsiveFilterProps) {
  const [collapsed, setCollapsed] = useState(defaultCollapsed);

  const containerRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const size = useResizeObserver({ ref: containerRef as any, box: 'border-box' });

  const [singleRowHeight, setSingleRowHeight] = useState(0);

  const calculateLayout = () => {
    if (!size?.width) {
      return { cols: 4, itemWidth: 0, emptyCount: 0 };
    }
    const containerWidth = size.width - PADDING * 2;
    const calculatedCols = Math.floor((containerWidth + gap) / (minWidth + gap)) || 1;
    const calculatedItemWidth = (containerWidth - (calculatedCols - 1) * gap) / calculatedCols;
    const total = orderedFields.length;
    const remainder = total % calculatedCols;
    const needed = calculatedCols - remainder;
    return {
      cols: calculatedCols,
      itemWidth: calculatedItemWidth,
      emptyCount: needed,
    };
  };

  const { cols, itemWidth, emptyCount } = calculateLayout();

  useEffect(() => {
    if (formRef.current) {
      const firstItem = formRef.current.firstElementChild as HTMLElement;
      if (firstItem) {
        setSingleRowHeight(firstItem.offsetHeight);
      }
    }
  }, []);

  const toggleCollapse = () => {
    setCollapsed(!collapsed);
  };

  const totalRows = Math.ceil((orderedFields.length + emptyCount) / cols);
  const expandedHeight = totalRows * singleRowHeight + (totalRows > 1 ? (totalRows - 1) * gap : 0);
  const currentHeight = collapsed ? singleRowHeight : expandedHeight;

  return {
    emptyCount,
    itemWidth,
    singleRowHeight,
    currentHeight,
    containerRef,
    formRef,
    collapsed,
    toggleCollapse,
  };
}
