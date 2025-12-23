import { mergeWith } from 'lodash-es';
import type { DependencySpec, FieldConfig } from '../types';

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

export function buildDependencyMap<T extends Record<string, any>>(initialConfig: FieldConfig<T>[]) {
  const depMap: Record<string, Set<string>> = {};
  initialConfig.forEach((c) => {
    const specs = (c.dependencies ?? []) as DependencySpec<T>[];
    specs.forEach((spec) => {
      spec.deps.forEach((dep) => {
        if (!depMap[dep]) depMap[dep] = new Set();
        depMap[dep].add(c.name);
      });
    });
  });
  return depMap;
}

function safeSnapshot(value: any) {
  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
}

export function getWatcherSnapshotKey<T extends Record<string, any>>(targetName: string, idx: number, spec: DependencySpec<T>, formData: T) {
  const depValues = spec.deps.map((dep) => (formData as any)?.[dep]);
  return `${targetName}::${idx}::${safeSnapshot(depValues)}`;
}
