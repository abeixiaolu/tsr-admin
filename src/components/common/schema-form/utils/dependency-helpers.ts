import { mergeWith } from 'lodash-es';
import type { FieldConfig } from '../types';

export function mergeFieldConfig<T extends Record<string, any>>(base: Partial<FieldConfig<T>>, patch: Partial<FieldConfig<T>>) {
  return mergeWith({}, base, patch, (objValue, srcValue) => {
    // 对数组类型字段（如 rules/options）采用“整体覆盖”，避免按下标深合并
    if (Array.isArray(objValue) || Array.isArray(srcValue)) return srcValue;
    return undefined;
  }) as FieldConfig<T>;
}

export function normalizeInitialConfig<T extends Record<string, any>>(initialConfig: FieldConfig<T>[]) {
  const normalized: Record<string, FieldConfig<T>> = {};
  initialConfig.forEach((c) => {
    normalized[c.name] = c;
  });
  return normalized;
}
