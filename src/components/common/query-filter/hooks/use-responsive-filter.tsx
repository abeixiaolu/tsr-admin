import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useResizeObserver } from 'usehooks-ts';

interface UseResponsiveFilterProps {
  orderedFields: any[];
  defaultCollapsed?: boolean;
  minWidth?: number;
  gap?: number;
}

const PADDING = 6;
const PLACEHOLDER_LAYOUT = {
  cols: 1,
  itemWidth: 0,
  emptyCount: 0,
};

/** 响应式搜索表单相关的逻辑 */
export function useResponsiveFilter({ defaultCollapsed = true, minWidth = 300, gap = 16, orderedFields }: UseResponsiveFilterProps) {
  const [collapsed, setCollapsed] = useState(defaultCollapsed);
  const requiresPreMeasure = !defaultCollapsed;
  const [hasMeasured, setHasMeasured] = useState(!requiresPreMeasure);
  const [singleRowHeight, setSingleRowHeight] = useState(0);
  const [measuredWidth, setMeasuredWidth] = useState<number | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const size = useResizeObserver({ ref: containerRef as any, box: 'border-box' });

  const calculateLayout = (width?: number | null) => {
    if (!width) {
      return PLACEHOLDER_LAYOUT;
    }

    const containerWidth = width - PADDING * 2;
    const calculatedCols = Math.max(Math.floor((containerWidth + gap) / (minWidth + gap)), 1);
    const calculatedItemWidth = (containerWidth - (calculatedCols - 1) * gap) / calculatedCols;
    const total = orderedFields.length;
    const remainder = total % calculatedCols;
    const needed = remainder === 0 ? 0 : calculatedCols - remainder;

    return {
      cols: calculatedCols,
      itemWidth: calculatedItemWidth,
      emptyCount: needed,
    };
  };

  const effectiveWidth = size?.width ?? measuredWidth;
  const { cols, itemWidth, emptyCount } = calculateLayout(effectiveWidth);

  useLayoutEffect(() => {
    if (!containerRef.current || !formRef.current) {
      if (!hasMeasured && orderedFields.length === 0) {
        setHasMeasured(true);
      }
      return;
    }

    const width = containerRef.current.getBoundingClientRect().width;
    const firstItem = formRef.current.firstElementChild as HTMLElement | null;
    const rowHeight = firstItem?.getBoundingClientRect().height ?? 0;

    if (width && Math.abs((measuredWidth ?? 0) - width) > 0.5) {
      setMeasuredWidth(width);
    }

    if (rowHeight && Math.abs(singleRowHeight - rowHeight) > 0.5) {
      setSingleRowHeight(rowHeight);
    }

    if (!hasMeasured && width && (rowHeight || orderedFields.length === 0)) {
      setHasMeasured(true);
    }
  }, [hasMeasured, measuredWidth, orderedFields.length, singleRowHeight]);

  useEffect(() => {
    if (size?.width) {
      setMeasuredWidth(size.width);
    }
  }, [size?.width]);

  const toggleCollapse = () => {
    setCollapsed((prev) => !prev);
  };

  const totalSlots = orderedFields.length + emptyCount;
  const safeCols = Math.max(cols, 1);
  const totalRows = Math.ceil(totalSlots / safeCols);
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
    hasMeasured,
  };
}
