import { useAntdTable } from 'ahooks';
import type { TableColumnType } from 'antd';
import { Form, Table } from 'antd';
import { omit } from 'lodash-es';
import { useImperativeHandle } from 'react';
import { useIsMobile } from '@/hooks/is-mobile';
import { cn } from '@/utils';
import type { EllipsisProps } from '../ellipsis';
import Ellipsis from '../ellipsis';
import { QueryFilter } from '../query-filter';
import type { ProTableActionType, ProTablePaginationConfig, ProTableProps } from './types';

const DEFAULT_PAGINATION: ProTablePaginationConfig = {
  pageSize: 10,
  pageSizeOptions: [10, 20, 50, 100],
  showSizeChanger: true,
  showQuickJumper: false,
  showTotal: (totalCount) => `Total ${totalCount} items`,
  hideOnSinglePage: true,
};

export default function ProTable<T extends Record<string, any> = any, QueryParams extends Record<string, any> = any>({
  pagination,
  columns,
  request,
  search,
  titleRender,
  toolbarRender,
  className,
  ref,
  ...tableProps
}: ProTableProps<T, QueryParams> & { ref?: React.Ref<ProTableActionType<QueryParams>> }) {
  const isMobile = useIsMobile();
  const paginationConfig = (
    pagination ? Object.assign({}, DEFAULT_PAGINATION, pagination) : DEFAULT_PAGINATION
  ) as Required<ProTablePaginationConfig>;
  const [form] = Form.useForm<QueryParams>();

  const {
    tableProps: antdTableProps,
    search: { submit, reset },
    params,
  } = useAntdTable(
    async ({ current, pageSize }, formData) => {
      const result = await request({
        ...formData,
        current,
        pageSize,
      });
      return {
        total: result.total,
        list: result.data,
      };
    },
    {
      defaultPageSize: paginationConfig.pageSize,
      form,
    },
  );

  useImperativeHandle(ref, () => ({
    reload: (resetPageIndex?: boolean) => {
      if (resetPageIndex) {
        reset();
      } else {
        submit();
      }
    },
    reset,
    getSearchParams: () => params?.[1],
  }));

  const tableColumns: TableColumnType<T>[] = columns.map((column) => {
    if (!column.ellipsis) {
      return omit(column, 'ellipsis');
    }
    return {
      ...column,
      ellipsis: true,
      render: (value, record, index) => {
        if (column.render) {
          return column.render(value, record, index);
        }
        return <Ellipsis {...(column.ellipsis as EllipsisProps)} text={value} />;
      },
    };
  });

  return (
    <div className={cn('pro-table')}>
      {/* Query Filter Section */}
      {search && (
        <div className={cn('mb-4', isMobile ? 'bg-container px-4 py-4 rounded-16px w-full flex items-center justify-end' : undefined)}>
          <QueryFilter<QueryParams> {...search} form={form} onSearch={submit} onReset={reset} simple={isMobile ? {} : undefined} />
        </div>
      )}

      {/* Table Section */}
      <div className={cn('flex flex-col gap-4 rounded-4 bg-[var(--ant-color-bg-container)] p-6', className)}>
        <div className="flex flex-wrap items-center justify-between">
          {titleRender ? (
            titleRender()
          ) : (
            <div className="text-20px font-sx-pro-display font-bold lh-28px">
              <div>Results</div>
            </div>
          )}
          <div>{toolbarRender?.()}</div>
        </div>
        <Table<T>
          sticky={true}
          {...tableProps}
          {...antdTableProps}
          columns={tableColumns}
          pagination={{
            ...paginationConfig,
            ...antdTableProps.pagination,
            simple: isMobile ? true : undefined,
          }}
        />
      </div>
    </div>
  );
}
