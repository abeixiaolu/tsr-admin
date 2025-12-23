## SchemaForm

`SchemaForm` 是基于 Ant Design `Form` 的声明式表单方案：使用一份 `config`（字段配置数组）描述表单结构，并通过 `dependencies` 实现字段间的联动。

- **技术栈**：React + TypeScript + Ant Design 6
- **核心目标**：配置驱动、联动清晰、基于 `Form.useWatch` 的响应式更新

---

## 目录结构

```text
src/components/schema-form/
  components/
    schema-form.tsx       # <SchemaForm>：渲染 Form + Fields
    field.tsx             # <Field>：单字段渲染（含 hide/清值逻辑）
    drawer-form.tsx       # DrawerForm
    modal-form.tsx        # ModalForm
  hooks.ts                # useSchemaForm：配置归一化
  types.ts                # FieldConfig/DependencySpec 等类型
  utils/
    dependency-helpers.ts # Merge/Normalize 工具函数
  widgets/                # 内置 widgets
  index.tsx               # 对外导出
```

---

## 快速开始

### 1) 基础表单

```tsx
import type { FieldConfig } from '@/components/schema-form/types'
import { Form } from 'antd'
import { SchemaForm } from '@/components/schema-form'

interface FormData {
  username: string
  password: string
}

const config: FieldConfig<FormData>[] = [
  { type: 'input', name: 'username', label: '用户名', rules: [{ required: true }] },
  { type: 'password', name: 'password', label: '密码', rules: [{ required: true }] },
]

export default function Demo() {
  const [form] = Form.useForm<FormData>()

  return (
    <SchemaForm<FormData>
      form={form}
      config={config}
      onFinish={values => console.log(values)}
    />
  )
}
```

### 2) 自定义按钮区域

```tsx
<SchemaForm form={form} config={config} onFinish={handleSubmit}>
  <Button type="primary" htmlType="submit">提交</Button>
</SchemaForm>
```

---

## FieldConfig（字段配置）

字段配置类型为 `FieldConfig<FormData>`（见 `types.ts`），本质是 `Form.Item` 的 props + 一些 SchemaForm 扩展。

常用字段：

- **type**：内置 widget key（如 `input/select/inputNumber/textarea/datePicker/rangePicker/upload/...`）或自定义 React 组件
- **name**：字段名（建议使用 string）
- **label**：表单项标题
- **props**：传给 widget 的 props
- **rules**：校验规则（AntD Form rules）
- **hide**：隐藏逻辑（支持隐藏时清值）
- **dependencies**：联动规则（见下文）
- **onChange**：字段值变化回调（对业务侧透出）

---

## dependencies（联动规则）

`dependencies` 是一个 `DependencySpec[]`，每个 spec 声明：

- **deps**：依赖字段名（string）或数组（string[]）。
- **effect**：副作用函数，当依赖变化时执行，返回一个字段配置 patch（合并到目标字段配置）。

```ts
export interface DependencySpec<FormData> {
  deps: string | string[];
  effect?: (
    values: any, // 依赖字段的当前值 (单值或数组)
    ctx: DependencyContext<FormData>
  ) => Partial<FieldConfig<FormData>> | undefined;
}
```

### 示例：联动 UI 属性

```ts
{
  type: 'select',
  name: 'company',
  label: '公司',
  dependencies: [
    {
      deps: ['region'], // 监听 region 字段
      effect: ([region]) => { // region 变化时触发
        // 根据 region 返回不同的 options
        if (region === 'china') {
           return { props: { options: chinaCompanies } };
        }
        return { props: { options: globalCompanies } };
      },
    },
  ],
}
```

---

## hide（隐藏字段）

`hide` 提供了比 `dependencies` 返回 `{ hidden: true }` 更“就近”的隐藏能力，并且支持隐藏时清值。

支持两种写法：

1. 函数：

```ts
hide: ({ formData }) => formData.currencyType === 'NGN'
```

2. 对象：

```ts
hide: {
  expression: ({ formData }) => formData.select === 'a',
  clearValueOnHide: false,
}
```

- **clearValueOnHide** 默认 `true`：隐藏时会自动把该字段值置为 `undefined`

---

## 动态 type 切换

当字段 `type` 在联动后发生变化时（例如 input <-> select），SchemaForm 会用 `key=name:type` 强制 remount 该字段组件，以避免旧组件内部 state 泄漏。

---

## DrawerForm / ModalForm

对外导出：

- `DrawerForm`
- `ModalForm`

它们本质上是把 `SchemaForm` 包装进 Drawer/Modal 的快捷组件，用法与 `SchemaForm` 保持一致。

---

## 最佳实践

- **按需依赖**：`deps` 只声明需要监听的字段，借助 `Form.useWatch` 实现精确更新。
- **Effect 纯净**：`effect` 函数应专注于返回配置补丁 (Patch)，避免直接操作 DOM 或大量副作用。
- **异步数据**：若需要异步加载数据（如 Select options），建议在自定义 Widget 内部处理（使用 `useRequest` 等），或者让 `effect` 仅控制 loading 状态/参数，数据获取逻辑解耦。

---
