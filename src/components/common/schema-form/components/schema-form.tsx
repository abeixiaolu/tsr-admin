import type { FormProps } from 'antd';
import { Form } from 'antd';
import type { ReactNode } from 'react';
import { useSchemaForm } from '../hooks';
import type { FieldConfig } from '../types';
import { Field } from './field';

/**
 * ## SchemaForm 使用说明
 *
 * SchemaForm 是对 Ant Design `Form` 的轻量封装：用一份 `config`（字段配置数组）描述表单结构，
 * 并通过 `dependencies` 实现字段间的联动（compute / effects / watcher）。
 *
 * ### 1) 基础用法
 *
 * ```tsx
 * const config: FieldConfig<FormData>[] = [
 *   { type: 'input', name: 'username', label: '用户名', rules: [{ required: true }] },
 *   { type: 'password', name: 'password', label: '密码', rules: [{ required: true }] },
 * ]
 *
 * <SchemaForm<FormData>
 *   form={form}
 *   config={config}
 *   onFinish={(values) => console.log(values)}
 * />
 * ```
 *
 * ### 2) 字段联动（dependencies）
 *
 * - `deps`：依赖字段名数组
 * - `effect`：副作用函数，返回 patch
 *
 * ```ts
 * {
 *   type: 'select',
 *   name: 'company',
 *   label: '公司',
 *   dependencies: [
 *     {
 *       deps: ['region'],
 *       effect: ([region]) => {
            if (region === 'china') return { props: { options: [...] } };
            return {};
         }
 *     },
 *   ],
 * }
 * ```
 *
 * ### 3) hide（隐藏字段）
 *
 * 除了用 `dependencies.effects` 返回 `{ hidden: true }` 外，也可以直接使用 `hide`：
 * - `hide: (ctx) => boolean` 或 `{ expression, clearValueOnHide }`
 * - `clearValueOnHide` 默认 `true`，隐藏时会自动清空字段值
 *
 * ### 4) 动态 type 切换
 *
 * 当字段 `type` 变化时，会强制 remount 对应 Widget，避免旧组件内部 state 泄漏。
 */
export interface SchemaFormProps<FormData extends Record<string, any> = any> extends FormProps {
  config: FieldConfig<FormData>[];
  children?: ReactNode;
}

function getFieldTypeKey(type: unknown) {
  if (typeof type === 'string') return type;
  if (typeof type === 'function') return (type as any).displayName || (type as any).name || 'custom';
  return 'custom';
}

export default function SchemaForm<T extends Record<string, any>>({
  config: initialConfig,
  className,
  initialValues,
  form: propForm,
  onValuesChange,
  children,
  ...restProps
}: SchemaFormProps<T>) {
  const [internalForm] = Form.useForm<T>();
  const form = propForm || internalForm;
  // fieldConfigs, orderedFields, handleValuesChange are returned from hook
  const { fieldConfigs, orderedFields, handleValuesChange } = useSchemaForm(initialConfig, form, onValuesChange);

  // triggerDependenciesOnInit removed as dependencies are now reactive via Form.useWatch

  return (
    <Form
      form={form}
      classNames={{ label: 'font-medium!' }}
      className={className}
      onValuesChange={handleValuesChange}
      initialValues={initialValues}
      layout="vertical"
      {...restProps}
    >
      {orderedFields.map((name) => (
        <Field key={`${name}:${getFieldTypeKey(fieldConfigs[name]?.type)}`} config={fieldConfigs[name]} />
      ))}
      {children}
    </Form>
  );
}
