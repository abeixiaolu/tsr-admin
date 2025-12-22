import { createFileRoute } from '@tanstack/react-router';
import { Card, Form } from 'antd';
import { useEffect, useState } from 'react';
import { ProForm, type ProFormConfigItem, ProFormDependency, SchemaForm } from '@/components/pro-form';
import { ProFormSelect } from '@/components/pro-form/fields/select';
import { ProFormText } from '@/components/pro-form/fields/text';

export const Route = createFileRoute('/_dashboard/order')({
  component: RouteComponent,
});

const CURRENCY_TYPE_ENUM = {
  NGN: 'NGN',
  TZS: 'TZS',
  KES: 'KES',
  USD: 'USD',
};

const TIER2 = [CURRENCY_TYPE_ENUM.NGN, CURRENCY_TYPE_ENUM.TZS, CURRENCY_TYPE_ENUM.KES];

const CURRENCY_OPTIONS = [
  { label: 'Nigerian Naira (NGN)', value: 'NGN' },
  { label: 'Tanzanian Shilling (TZS)', value: 'TZS' },
  { label: 'Kenyan Shilling (KES)', value: 'KES' },
  { label: 'US Dollar (USD)', value: 'USD' },
];

const accountTypeOptions = [
  { label: 'Checking', value: 'checking' },
  { label: 'Savings', value: 'savings' },
];

const bankList = {
  data: [
    { bankName: 'Access Bank', bankCode: '044' },
    { bankName: 'Zenith Bank', bankCode: '057' },
  ],
};

const getBankList = async () => {
  return bankList;
};

const countryList = {
  data: [
    { name: 'Nigeria', code: 'NG' },
    { name: 'Tanzania', code: 'TZ' },
  ],
};

// Mock AddressWidget
const AddressWidget = ({ countriesKey, countries }: any) => (
  <div className="border p-2 rounded bg-gray-50">Mock Address Widget (Countries: {countriesKey || countries?.length})</div>
);

const columns: ProFormConfigItem[] = [
  {
    label: 'Account Type',
    name: 'bankAccountType',
    valueType: 'select',
    fieldProps: {
      placeholder: 'Select account type',
    },
    formItemProps: {
      rules: [{ required: true, message: 'Required' }],
    },
    valueEnum: 'accountTypeOptions',
  },
  {
    label: 'Currency',
    name: 'currencyType',
    valueType: 'select',
    fieldProps: {
      placeholder: 'Select currency',
    },
    valueEnum: 'currencyOptions',
    formItemProps: { rules: [{ required: true }] },
  },
  {
    label: 'Account Name',
    name: 'accountName',
    valueType: 'text',
    fieldProps: { placeholder: 'Enter account name' },
    formItemProps: { rules: [{ required: true }] },
  },
  {
    label: 'Account Number',
    name: 'cardNo',
    valueType: 'text',
    fieldProps: { placeholder: 'Enter account number' },
    formItemProps: { rules: [{ required: true }] },
  },
  {
    valueType: 'dependency',
    name: ['currencyType'],
    children: ({ currencyType }) => {
      // Return empty array if no currency selected to avoid error accessing includes
      if (!currencyType) return [];
      return [
        TIER2.includes(currencyType)
          ? {
              label: 'Bank Name',
              name: 'bankName',
              valueType: 'select',
              valueEnum: 'bankList',
              fieldProps: {
                showSearch: true,
                optionFilterProp: 'label',
                fieldNames: { label: 'bankName', value: 'bankCode' },
                placeholder: 'Select bank',
              },
              formItemProps: { rules: [{ required: true }] },
            }
          : {
              label: 'Bank Name',
              name: 'bankName',
              valueType: 'text',
              fieldProps: { placeholder: 'Enter bank name' },
              formItemProps: { rules: [{ required: true }] },
            },
      ];
    },
  },
  {
    valueType: 'dependency',
    name: ['currencyType'],
    children: ({ currencyType }) =>
      !currencyType || TIER2.includes(currencyType)
        ? []
        : [
            {
              label: 'Country/Region',
              name: 'accAddrCountry',
              valueType: 'select',
              valueEnum: 'countryList',
              fieldProps: { placeholder: 'Select country', fieldNames: { label: 'name', value: 'code' } },
              formItemProps: { rules: [{ required: true }] },
            },
            {
              label: 'Bank Address',
              name: 'bankAddress',
              valueType: 'text',
              fieldProps: { placeholder: 'Enter bank address' },
              formItemProps: { rules: [{ required: true }] },
            },
            {
              label: 'SWIFT',
              name: 'bankSwift',
              valueType: 'text',
            },
            {
              label: 'Recipient Address',
              name: 'recipientAddress',
              valueType: 'custom',
              renderFormItem: () => <AddressWidget countriesKey="countryList" />,
              formItemProps: { rules: [{ required: true }] },
            },
          ],
  },
  {
    label: 'Cooperation Agreement',
    name: 'serviceAgreementFile',
    renderFormItem: () => <div className="border border-dashed p-4 text-center">Mock Upload</div>,
    formItemProps: { rules: [{ required: true }] },
  },
];

// --- JSX Form Component ---

function BankAccountProForm({ defaultValues, onSubmit }: any) {
  const [form] = Form.useForm();

  const countryOptions = countryList?.data?.map((item) => ({ label: item.name, value: item.code })) ?? [];
  const bankOptions = bankList?.data?.map((item) => ({ label: item.bankName, value: item.bankCode })) ?? [];

  return (
    <ProForm
      form={form}
      layout="vertical"
      initialValues={defaultValues}
      submitter={{
        render: (_, dom) => <div className="flex justify-end gap-2">{dom}</div>,
      }}
      onFinish={onSubmit}
    >
      <div className="text-16px font-bold mb-4">Account Details (JSX)</div>

      <ProFormSelect
        name="bankAccountType"
        label="Account Type"
        placeholder="Select account type"
        options={accountTypeOptions}
        rules={[{ required: true }]}
      />

      <ProFormSelect
        name="currencyType"
        label="Currency"
        placeholder="Select currency"
        options={CURRENCY_OPTIONS}
        // disabled
        rules={[{ required: true }]}
      />

      <ProFormText name="accountName" label="Account Name" placeholder="Enter account name" rules={[{ required: true }]} />

      <ProFormText name="cardNo" label="Account Number" placeholder="Enter account number" rules={[{ required: true }]} />

      <ProFormDependency name={['currencyType']}>
        {({ currencyType }) => {
          if (!currencyType) return null;
          const isTier2 = TIER2.includes(currencyType);
          return isTier2 ? (
            <ProFormSelect name="bankName" label="Bank Name" showSearch options={bankOptions} rules={[{ required: true }]} />
          ) : (
            <ProFormText name="bankName" label="Bank Name" rules={[{ required: true }]} />
          );
        }}
      </ProFormDependency>

      <ProFormDependency name={['currencyType']}>
        {({ currencyType }) => {
          console.log('Dependency Rendered!', Date.now());
          if (!currencyType || TIER2.includes(currencyType)) return null;

          return (
            <>
              <ProFormSelect name="accAddrCountry" label="Country/Region" options={countryOptions} rules={[{ required: true }]} />
              <ProFormText name="bankAddress" label="Bank Address" rules={[{ required: true }]} />
              <ProFormText name="bankSwift" label="SWIFT" rules={[{ required: true }]} />
              <ProForm.Item name="recipientAddress" label="Recipient Address" rules={[{ required: true }]}>
                <AddressWidget countries={countryList.data} />
              </ProForm.Item>
            </>
          );
        }}
      </ProFormDependency>

      <ProForm.Item name="file" label="Cooperation Agreement">
        <div className="border border-dashed p-4 text-center">Mock Upload</div>
      </ProForm.Item>
    </ProForm>
  );
}

function RouteComponent() {
  const defaultValues = { currencyType: 'NGN' };
  const [bankList, setBankList] = useState<any[]>([]);
  useEffect(() => {
    getBankList().then((res) => {
      setBankList(res.data);
    });
  }, []);

  return (
    <Card title={'Form Demo'}>
      <div className="grid grid-cols-2 gap-8">
        <Card title="SchemaForm Example" className="shadow-sm">
          <SchemaForm
            columns={columns}
            layout="vertical"
            initialValues={defaultValues}
            onFinish={async (values) => {
              console.log('SchemaForm Submit:', values);
              alert(JSON.stringify(values, null, 2));
              return true;
            }}
            params={{
              dataSources: {
                accountTypeOptions,
                currencyOptions: CURRENCY_OPTIONS,
                bankList: bankList,
                countryList: countryList.data,
              },
            }}
          />
        </Card>

        <Card title="JSX ProForm Example" className="shadow-sm">
          <BankAccountProForm
            defaultValues={defaultValues}
            onSubmit={async (values: any) => {
              console.log('JSX Form Submit:', values);
              alert(JSON.stringify(values, null, 2));
            }}
          />
        </Card>
      </div>
    </Card>
  );
}
