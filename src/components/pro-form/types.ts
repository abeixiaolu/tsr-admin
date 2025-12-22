import type { FormInstance, FormItemProps, FormProps } from 'antd';
import type { NamePath } from 'antd/es/form/interface';
import type { ReactNode } from 'react';
import type { FieldKeys } from './fields';

export type ValueType = FieldKeys | 'dependency' | 'custom';

export interface ProFormProps<T = any> extends Omit<FormProps<T>, 'onFinish'> {
  onFinish?: (formData: T) => Promise<boolean | undefined>;
  submitter?:
    | boolean
    | {
        render?: (props: { form?: FormInstance<T>; onSubmit?: () => void; onReset?: () => void }, dom: ReactNode[]) => ReactNode;
        submitButtonProps?: any;
        resetButtonProps?: any;
      };
}

export interface SchemaFormProps<T = any> extends ProFormProps<T> {
  columns: ProFormConfigItem<T>[];
  params?: {
    dataSources?: Record<string, any>;
    [key: string]: any;
  };
}

type CommonProFormItem = Pick<FormItemProps, 'label' | 'className' | 'name' | 'rules'>;
export interface ProFormConfigItem<T = any> extends CommonProFormItem {
  valueType?: ValueType;
  fieldProps?: any;
  formItemProps?: FormItemProps;
  valueEnum?: any;
  children?: ProFormConfigItem[] | ((values: any) => ProFormConfigItem[]);
  // 用于 'dependency' 类型
  dependencies?: NamePath[];
  // 用于 'form' 自定义渲染
  renderFormItem?: (
    item: ProFormConfigItem<T>,
    config: { defaultRender: any; value: any; onChange: any; onSelect: any; type: string; form: FormInstance },
    form: FormInstance,
  ) => ReactNode;
}

export type ProFormFieldProps<FieldProps> = CommonProFormItem &
  FieldProps & {
    formItemProps?: FormItemProps;
  };

export type RemoteFieldProps = {
  request?: () => Promise<any[]>;
};
