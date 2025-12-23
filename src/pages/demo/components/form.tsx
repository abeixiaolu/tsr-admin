import { Button, Form } from 'antd';
import { QueryFilter } from '@/components/common/query-filter';
import { DrawerForm, ModalForm, SchemaForm } from '@/components/common/schema-form';
import type { FieldConfig } from '@/components/common/schema-form/types';
import { message } from '@/utils/toast';

interface FormData {
  country?: string;
  select?: string;
  hidden?: string;
}

const demoConfig: FieldConfig<FormData>[] = [
  {
    type: 'input',
    label: 'Country',
    name: 'country',
    onChange: (value) => {
      message().success(`Country changed: ${value}`);
    },
    rules: [
      {
        required: true,
        message: 'Please input country',
      },
    ],
  },
  {
    type: 'select',
    label: 'Select Box',
    name: 'select',
    hide: ({ formData }) => {
      return formData.country === 'China';
    },
    props: {
      placeholder: 'Please select',
      showSearch: {
        optionFilterProp: 'label',
        onSearch: (value: string) => {
          message().success(`Search: ${value}`);
        },
      },
    },
  },
  {
    type: 'input',
    label: 'hidden',
    name: 'hidden',
    rules: [{ required: true, message: 'Please input hidden' }],
    hide: {
      expression: ({ formData }) => {
        return formData.select === 'a';
      },
      clearValueOnHide: false,
    },
  },
];

export default function SchemaFormDemo() {
  const [form] = Form.useForm<FormData>();
  const [drawerForm] = Form.useForm<FormData>();

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      message().success(JSON.stringify(values));
    });
  };

  const queryFilterConfig: FieldConfig<any>[] = Array.from({ length: 6 }).map((_, i) => ({
    type: 'input',
    label: `Field ${i + 1}`,
    name: `field${i + 1}`,
    props: {
      placeholder: `Please input field ${i + 1}`,
    },
  }));

  return (
    <div className="p-4">
      <h1 className="mb-4 text-xl font-bold">SchemaForm Demo</h1>
      <SchemaForm<FormData> form={form} config={demoConfig} className="mb-8 max-w-md" />
      <div className="mb-8 mt-4">
        <Button type="primary" onClick={handleSubmit}>
          Submit SchemaForm
        </Button>
      </div>

      <h1 className="mb-4 text-xl font-bold">QueryFilter Demo</h1>
      <QueryFilter
        minWidth={200}
        showCollapseButton={true}
        defaultCollapsed={true}
        config={queryFilterConfig}
        onSearch={(values) => message().success(JSON.stringify(values))}
        onReset={() => message().success('Reset')}
      />

      <h1 className="mb-4 mt-4 text-xl font-bold">DrawerForm Demo</h1>
      <DrawerForm<FormData>
        title="DrawerForm"
        form={drawerForm}
        trigger={<Button type="primary">Open DrawerForm</Button>}
        config={demoConfig}
        className="mb-8 max-w-md"
        onFinish={async (values) => {
          try {
            await drawerForm.validateFields();
            message().success(JSON.stringify(values));
            return true;
          } catch {
            return false;
          }
        }}
      />
      <h1 className="mb-4 mt-4 text-xl font-bold">ModalForm Demo</h1>
      <ModalForm<FormData> title="ModalForm" trigger={<Button type="primary">Open ModalForm</Button>} config={demoConfig} className="mb-8 max-w-md" />
    </div>
  );
}
