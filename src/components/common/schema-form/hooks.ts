import type { FormInstance } from 'antd';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { DependencySpec, FieldConfig } from './types';
import { buildDependencyMap, getWatcherSnapshotKey, mergeFieldConfig, normalizeInitialConfig } from './utils/dependency-helpers';
import { createWatcherManager } from './utils/watcher-manager';

export function useSchemaForm<T extends Record<string, any>>(
  initialConfig: FieldConfig<T>[],
  form: FormInstance<T>,
  onValuesChange?: (changedValues: any, allValues: any) => void,
) {
  const orderedFields = useMemo(() => initialConfig.map((c) => c.name), [initialConfig]);

  const normalizedInitialConfig = useMemo(() => normalizeInitialConfig(initialConfig), [initialConfig]);

  // dependencies / watcher 运行后累计的字段配置补丁
  const [fieldPatches, setFieldPatches] = useState<Record<string, FieldConfig<T>>>({});

  const fieldConfigs = useMemo(() => {
    const next: Record<string, FieldConfig<T>> = {};
    Object.keys(normalizedInitialConfig).forEach((name) => {
      const base = normalizedInitialConfig[name];
      const patch = fieldPatches[name];
      next[name] = patch ? mergeFieldConfig(base, patch) : base;
    });
    return next;
  }, [fieldPatches, normalizedInitialConfig]);

  const getField = (name: string) => fieldConfigs[name];

  const setField = (name: string, patch: Partial<FieldConfig<T>>, _opts?: { replace?: boolean }) => {
    if (!normalizedInitialConfig[name]) return;
    setFieldPatches((curr) => {
      const prev = curr[name] ?? {};
      const nextPatch = mergeFieldConfig(prev, patch);
      return { ...curr, [name]: nextPatch };
    });
  };

  const dependencyMap = useMemo(() => buildDependencyMap(initialConfig), [initialConfig]);

  const watcherManagerRef = useRef(createWatcherManager<T>());

  useEffect(() => {
    const mgr = watcherManagerRef.current;
    return () => {
      mgr.dispose();
    };
  }, []);

  const handleValuesChange = (changedValues: any, allValues: any) => {
    const changedFields = Object.keys(changedValues);
    if (!changedFields.length) {
      onValuesChange?.(changedValues, allValues);
      return;
    }

    const pending: Record<string, Partial<FieldConfig<T>>[]> = {};

    changedFields.forEach((changedField) => {
      const targetNames = dependencyMap[changedField];
      if (targetNames) {
        targetNames.forEach((targetName) => {
          const base = fieldConfigs[targetName];
          if (!base) return;

          const specs = (base.dependencies ?? []) as DependencySpec<T>[];
          if (!specs.length) return;

          specs.forEach((spec, idx) => {
            if (!spec.deps.includes(changedField)) return;

            const computed = spec.compute?.({ formData: allValues, changedField });
            const ctx = {
              changedField,
              changedValue: changedValues[changedField],
              formData: allValues,
              form,
              getField,
              setField,
              computed,
            };

            const patch = spec.effects?.(ctx as any);
            if (patch) {
              if (!pending[targetName]) pending[targetName] = [];
              pending[targetName].push(patch);
            }

            if (spec.watcher) {
              const baseKey = `${targetName}::${idx}`;
              const snapshotKey = getWatcherSnapshotKey(targetName, idx, spec, allValues);
              watcherManagerRef.current.schedule({
                baseKey,
                snapshotKey,
                spec,
                execute: (signal) => spec.watcher?.({ ...(ctx as any), signal }),
                applyPatch: (p) => setField(targetName, p),
              });
            }
          });
        });
      }

      const field = fieldConfigs[changedField];
      if (field?.onChange) field.onChange(changedValues[changedField]);
    });

    const targetNames = Object.keys(pending);
    if (targetNames.length) {
      setFieldPatches((curr) => {
        const next = { ...curr };
        targetNames.forEach((name) => {
          const patches = pending[name];
          const mergedPatch = patches.reduce((acc, p) => mergeFieldConfig(acc, p), {} as Partial<FieldConfig<T>>);
          next[name] = mergeFieldConfig((curr[name] ?? {}) as Partial<FieldConfig<T>>, mergedPatch);
        });
        return next;
      });
    }

    onValuesChange?.(changedValues, allValues);
  };

  return {
    fieldConfigs,
    orderedFields,
    handleValuesChange,
    setField,
    getField,
  };
}
