import { Tag } from 'antd';
import { IconButton } from '@/components/common/button';
import type { FieldConfig } from '@/components/common/schema-form/types';
import { ProTable, type ProTableColumn } from '@/components/common/table';

interface User {
  id: string;
  name: string;
  email: string;
  status: 'active' | 'inactive' | 'pending';
  role: string;
  createdAt: string;
}

interface QueryParams {
  name?: string;
  status?: 'active' | 'inactive' | 'pending';
  role?: string;
}

// Mock data generator
function generateMockUsers(count: number, params: QueryParams = {}): User[] {
  const statuses: User['status'][] = ['active', 'inactive', 'pending'];
  const roles = ['Admin', 'User', 'Manager', 'Developer'];

  return Array.from({ length: count }, (_, i) => ({
    id: `user-${i + 1}`,
    name: `User ${i + 1}`,
    email: `user${i + 1}@example.com`,
    status: statuses[i % 3],
    role: roles[i % 4],
    createdAt: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
  })).filter((user) => {
    // Apply filters
    if (params.name && !user.name.toLowerCase().includes(params.name.toLowerCase())) {
      return false;
    }
    if (params.status && user.status !== params.status) {
      return false;
    }
    if (params.role && user.role !== params.role) {
      return false;
    }
    return true;
  });
}

// Mock async request
async function mockRequest(params: QueryParams & { current: number; pageSize: number }) {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  const allData = generateMockUsers(100, params);
  const start = (params.current - 1) * params.pageSize;
  const end = start + params.pageSize;

  return {
    data: allData.slice(start, end),
    total: allData.length,
    success: true,
  };
}

const searchConfig: FieldConfig<QueryParams>[] = [
  {
    name: 'name',
    label: '姓名',
    type: 'input',
    props: {
      placeholder: '请输入姓名',
    },
  },
  {
    name: 'status',
    label: '状态',
    type: 'select',
    props: {
      placeholder: '请选择状态',
      options: [
        { label: '激活', value: 'active' },
        { label: '未激活', value: 'inactive' },
        { label: '待审核', value: 'pending' },
      ],
    },
  },
  {
    name: 'role',
    label: '角色',
    type: 'select',
    props: {
      placeholder: '请选择角色',
      options: [
        { label: 'Admin', value: 'Admin' },
        { label: 'User', value: 'User' },
        { label: 'Manager', value: 'Manager' },
        { label: 'Developer', value: 'Developer' },
      ],
    },
  },
];

export default function ProTableDemo() {
  const columns: ProTableColumn<User>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 120,
    },
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
      width: 150,
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
      width: 140,
      ellipsis: { copyable: true, middle: 3 },
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status: User['status']) => {
        const colorMap = {
          active: 'green',
          inactive: 'red',
          pending: 'orange',
        };
        const textMap = {
          active: '激活',
          inactive: '未激活',
          pending: '待审核',
        };
        return <Tag color={colorMap[status]}>{textMap[status]}</Tag>;
      },
    },
    {
      title: '角色',
      dataIndex: 'role',
      key: 'role',
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 180,
      render: (date: string) => new Date(date).toLocaleString('zh-CN'),
    },
  ];

  return (
    <ProTable<User, QueryParams>
      columns={columns}
      request={mockRequest}
      rowKey="id"
      search={{ config: searchConfig, defaultCollapsed: false, showCollapseButton: false }}
      scroll={{ x: 826 }}
      toolbarRender={() => (
        <IconButton icon="i-solar-music-note-3-broken" type="primary">
          添加
        </IconButton>
      )}
    />
  );
}
