import React from 'react';
import { type FieldKeys, fieldMap } from './fields';
import ProFormDependency from './fields/dependency';
import ProForm from './pro-form';
import type { ProFormConfigItem, SchemaFormProps } from './types';

const SchemaForm = <T extends Record<string, any>>(props: SchemaFormProps<T>) => {
  // 解构 props，分离出 Grid 布局配置 (grid, colProps, rowProps) 和组件核心配置
  const { columns, params, ...rest } = props;

  const renderField = (column: ProFormConfigItem<T>, index: number) => {
    const { valueType, valueEnum, label, name, fieldProps, formItemProps, renderFormItem } = column;
    // 解析通用属性 (Common Props)
    // 包括 name (dataIndex), label (title), placeholder 等
    const baseProps = {
      name,
      label,
      ...formItemProps,
      fieldProps: {
        placeholder: typeof name === 'string' ? `Please enter ${name}` : undefined,
        options: valueEnum ? params?.dataSources?.[valueEnum] : undefined,
        ...fieldProps,
      },
    };
    console.log('baseProps: ', baseProps.fieldProps.options);

    // 2. 处理自定义渲染 (renderFormItem)
    // 如果定义了 renderFormItem，则将渲染控制权交给用户
    if (valueType === 'custom' && renderFormItem) {
      return (
        <ProForm.Item key={index} {...baseProps}>
          {renderFormItem(column, { ...baseProps, type: 'custom', form: rest.form! } as any, rest.form!)}
        </ProForm.Item>
      );
    }

    // 4. 处理依赖项 (Dependency)
    // 使用 ProFormDependency 包裹，实现细粒度的依赖更新
    if (valueType === 'dependency' && column.name) {
      return (
        <ProFormDependency key={column.name} name={column.name}>
          {(values) => {
            // 处理依赖列的返回
            const depCols = typeof column.children === 'function' ? column.children(values) : column.children;
            // 过滤空值
            return <>{renderColumns(depCols || [])}</>;
          }}
        </ProFormDependency>
      );
    }

    // 5. 根据 valueType 映射到具体的表单组件
    // 目前支持 Select, Digit, Money, Text 等
    const Comp: any = valueType ? fieldMap[valueType as FieldKeys] : fieldMap.text;
    return <Comp key={name} {...baseProps.fieldProps} formItemProps={{ ...baseProps }} />;
  };

  const renderColumns = (cols: ProFormConfigItem<T>[]) => {
    return cols.map((col, index) => {
      const field = renderField(col, index);
      return <React.Fragment key={col.name}>{field}</React.Fragment>;
    });
  };

  const renderedContent = renderColumns(columns);

  return <ProForm {...rest}>{renderedContent}</ProForm>;
};

export default SchemaForm;
