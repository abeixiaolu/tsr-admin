import type { PaginationProps, TableColumnType, TableProps } from 'antd';
import type { EllipsisProps } from '../ellipsis';
import type { QueryFilterProps } from '../query-filter/types';

export interface ProTableActionType<SearchParams extends Record<string, any> = any> {
  reload: (resetPageIndex?: boolean) => void;
  reloadAndRest?: () => void;
  reset?: () => void;
  clearSelected?: () => void;
  getSearchParams?: () => SearchParams;
}

export interface ProTableColumn<RecordType = any> extends Omit<TableColumnType<RecordType>, 'ellipsis'> {
  ellipsis?: true | EllipsisProps;
}

export interface ProTableProps<RecordType = any, QueryParams extends Record<string, any> = any>
  extends Omit<TableProps<RecordType>, 'columns' | 'dataSource' | 'loading' | 'pagination'> {
  /** 搜索表单配置，为 false 时隐藏搜索表单 */
  search?: QueryFilterProps<QueryParams> | false;
  columns: ProTableColumn<RecordType>[];
  request: (params: QueryParams & { current: number; pageSize: number }) => Promise<{
    data: RecordType[];
    total: number;
    success?: boolean;
  }>;
  /** 工具栏渲染 */
  toolbarRender?: () => React.ReactNode;
  /** 标题渲染 */
  titleRender?: () => React.ReactNode | string;
  pagination?: ProTablePaginationConfig;
  className?: string;
}

export interface ProTablePaginationConfig
  extends Pick<PaginationProps, 'pageSize' | 'pageSizeOptions' | 'showSizeChanger' | 'showQuickJumper' | 'showTotal' | 'hideOnSinglePage'> {}
