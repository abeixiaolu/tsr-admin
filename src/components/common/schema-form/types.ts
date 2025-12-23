import type { FormInstance, FormItemProps } from 'antd';
import type { ComponentProps, ComponentType } from 'react';
import type { WidgetPropsMap } from './widgets';

export type WidgetKey = keyof WidgetPropsMap;

export interface DependencyContext<FormData> {
  form: FormInstance<FormData>;
  // We can add more context here if needed, e.g. formData (all values)
  // but usually values from useWatch (passed as first arg to effect) is enough.
}

export interface DependencySpec<FormData> {
  /**
   * 依赖字段名。
   * 可以是单个字段名 (string) 或字段名数组 (string[])。
   * 如果传入 []，则 effect 仅在组件 mount 时执行一次（类似 useEffect([])）。
   */
  deps: string;

  /**
   * 副作用函数。
   * 当依赖字段值变化时执行，返回一个新的 Partial<FieldConfig> 用于合并。
   * @param value 依赖字段的当前值。如果是单字段依赖，则是该字段值；如果是数组依赖，则是值数组。
   * @param ctx 上下文，包含 form 实例等
   */
  effect?: (value: any, ctx: DependencyContext<FormData>) => Partial<FieldConfig<FormData>> | undefined;
}

type BaseFieldConfig<FormData> = FormItemProps & {
  hide?: boolean;
  dependencies?: DependencySpec<FormData>[];
  onChange?: (value: any) => void;
};

export type BuiltinFieldConfig<FormData = any> = {
  [Type in WidgetKey]: BaseFieldConfig<FormData> & {
    type: Type;
    props?: WidgetPropsMap[Type];
  };
}[WidgetKey];

export type CustomFieldConfig<FormData = any, T extends ComponentType<any> = ComponentType<any>> = BaseFieldConfig<FormData> & {
  type: T;
  // TODO: runtime props lacks proper type inference
  props?: ComponentProps<T>;
};

export type FieldConfig<FormData = any> = BuiltinFieldConfig<FormData> | CustomFieldConfig<FormData>;
