## SchemaForm

`SchemaForm` 是基于 Ant Design `Form` 的声明式表单方案：使用一份 `config`（字段配置数组）描述表单结构，并通过 `dependencies` 实现字段间联动（纯计算 / 同步 patch / 异步副作用）。

- **技术栈**：React + TypeScript + Ant Design 6
- **核心目标**：配置驱动、联动清晰、性能可控（最小化字段重渲染）、支持异步联动（取消/去重/缓存）

---

## 目录结构

```text
src/components/schema-form/
  components/
    schema-form.tsx       # <SchemaForm>：渲染 Form + Fields
    field.tsx             # <Field>：单字段渲染（含 hide/清值逻辑）
    drawer-form.tsx       # DrawerForm
    modal-form.tsx        # ModalForm
  hooks.ts                # useSchemaForm：依赖图 + 执行引擎（effects/watchers）
  types.ts                # FieldConfig/DependencySpec 等类型
  utils/
    dependency-helpers.ts # 依赖图/merge/快照 key 等纯函数
    watcher-manager.ts    # watcher 调度器（debounce/throttle/abort/dedupe/cache）
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
- **name**：字段名（当前实现建议使用 string）
- **label**：表单项标题
- **props**：传给 widget 的 props
- **rules**：校验规则（AntD Form rules）
- **hide**：隐藏逻辑（支持隐藏时清值）
- **dependencies**：联动规则（见下文）
- **onChange**：字段值变化回调（对业务侧透出）

---

## dependencies（联动规则）

`dependencies` 是一个 `DependencySpec[]`，每个 spec 声明：

- **deps**：依赖字段名数组（当这些字段变化时触发）
- **compute**：纯计算（同步、无副作用），返回值注入到 `ctx.computed`
- **effects**：同步返回一个字段配置 patch（合并到目标字段配置）
- **watcher**：异步副作用（支持取消/节流/防抖/去重/缓存）；推荐 **return patch**，由运行时自动应用

运行顺序（同一条 spec）：

1. 先执行 `compute` 得到 `computed`
2. 执行 `effects(ctx)`，把返回 patch 加入“本次批量更新”
3. 调度 `watcher(ctx)`：异步执行，返回 patch 时自动 `setField(target, patch)`

### 示例 A：同步联动（effects）

```ts
{
  type: 'input',
  name: 'id',
  label: '证件号',
  dependencies: [
    {
      deps: ['userType'],
      effects: ({ changedValue }) => {
        if (changedValue === 'company') {
          return { type: 'select', props: { options: companyIdTypes } }
        }
        return { type: 'input', props: { placeholder: '请输入证件号' } }
      },
    },
  ],
}
```

### 示例 B：compute + effects（把复杂判断抽出来）

```ts
{
  name: 'company',
  type: 'select',
  label: '公司',
  dependencies: [
    {
      deps: ['userType'],
      compute: ({ formData }) => formData.userType === 'company',
      effects: ({ computed }) => ({ hidden: !computed }),
    },
  ],
}
```

### 示例 C：异步联动（watcher）+ debounce + Abort

```ts
{
  name: 'company',
  type: 'select',
  label: '公司',
  dependencies: [
    {
      deps: ['region', 'userType'],
      compute: ({ formData }) => formData.userType === 'company',
      watcher: async ({ formData, computed, signal }) => {
        if (!computed) return { props: { options: [] } }
        const options = await api.fetchCompanies(formData.region, { signal })
        return { props: { options } }
      },
      debounce: 200,
    },
  ],
}
```

### 示例 D：watcher 去重/缓存（deps snapshot key / ttl）

场景：同样的依赖值组合会被频繁触发（输入抖动、链路多次触发、重复进入页面）。

- **dedupe（默认 true）**：相同 deps 快照下，若请求正在进行中，则不重复触发
- **cacheTtl**：相同 deps 快照下，若 ttl 内已经拿到结果，则直接复用（不发请求）

```ts
{
  deps: ['region', 'userType'],
  debounce: 200,
  dedupe: true,
  cacheTtl: 30_000,
  watcher: async ({ formData, signal }) => {
    const options = await api.fetchCompanies(formData.region, { signal })
    return { props: { options } }
  },
}
```

> 注意：当前 ttl 缓存仅对 **watcher 返回 patch** 的情况生效（因为只有返回值才可复用）。

---

## hide（隐藏字段）

`hide` 提供了比 `dependencies.effects -> { hidden: true }` 更“就近”的隐藏能力，并且支持隐藏时清值。

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

## 性能与最佳实践

- **deps 要写“刚好够用”**：`deps` 越精确，联动触发越少
- **compute 保持纯函数**：不要在 compute 里 setField/setFieldValue
- **effects 做同步 UI patch**：例如 disabled/hidden/rules/props
- **watcher 做异步**：请求必须放 watcher，配合 `signal` 防止竞态
- **watcher 尽量 return patch**：比直接 setField 更利于去重/缓存

---

## 常见问题（FAQ）

### 1) watcher 里如何更新表单值？

你可以使用 `ctx.form.setFieldValue(...)`（同步写值）或根据需要写入多个值。

### 2) 为什么 cacheTtl 需要 watcher return patch？

因为缓存要复用“上一次得到的结果”。如果 watcher 内部直接调用 `setField` 且不返回结果，运行时无法通用地捕获可复用数据。

### 3) 能否完全用 dependencies 替代 hide？

可以通过 `effects` 返回 `{ hidden: true }` 实现隐藏，但 `hide` 还包含“隐藏时自动清值”的现成语义（`clearValueOnHide`），更适合高频场景。
