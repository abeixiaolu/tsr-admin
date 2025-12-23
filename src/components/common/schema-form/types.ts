import type { FormInstance, FormItemProps } from 'antd';
import type { ComponentProps, ComponentType } from 'react';
import type { WidgetPropsMap } from './widgets';

export type WidgetKey = keyof WidgetPropsMap;

export type EffectResult<FormData> = Partial<FieldConfig<FormData>>;

export interface DependencyHandlerCtx<FormData, Computed = any> {
  changedField: string;
  changedValue: any;
  formData: FormData;
  form: FormInstance<FormData>;
  getField: (name: string) => FieldConfig<FormData> | undefined;
  setField: (name: string, patch: Partial<FieldConfig<FormData>>, opts?: { replace?: boolean }) => void;
  computed?: Computed;
  signal?: AbortSignal;
}

export interface DependencySpec<FormData, Computed = any> {
  deps: string[];
  compute?: (ctx: { formData: FormData; changedField?: string }) => Computed;
  effects?: (ctx: DependencyHandlerCtx<FormData, Computed>) => EffectResult<FormData> | undefined;
  watcher?: (ctx: DependencyHandlerCtx<FormData, Computed>) => Promise<EffectResult<FormData> | undefined> | EffectResult<FormData> | undefined;
  throttle?: number;
  debounce?: number;
  /**
   * watcher 缓存 TTL（毫秒）。
   * 仅当 watcher 返回 patch（EffectResult）时生效。
   */
  cacheTtl?: number;
  /**
   * 是否按 deps snapshot key 做 in-flight 去重。
   * 默认：true
   */
  dedupe?: boolean;
}

type BaseFieldConfig<FormData> = FormItemProps & {
  hide?:
    | ((ctx: { formData: FormData }) => boolean)
    | {
        expression: (ctx: { formData: FormData }) => boolean;
        clearValueOnHide?: boolean;
      };
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
