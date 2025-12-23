import type { FormInstance } from 'antd';
import { useMemo } from 'react';
import type { FieldConfig } from './types';
import { normalizeInitialConfig } from './utils/dependency-helpers';

export function useSchemaForm<T extends Record<string, any>>(
  initialConfig: FieldConfig<T>[],
  _form: FormInstance<T>,
  onValuesChange?: (changedValues: any, allValues: any) => void,
) {
  const orderedFields = useMemo(() => initialConfig.map((c) => c.name), [initialConfig]);

  const normalizedInitialConfig = useMemo(() => normalizeInitialConfig(initialConfig), [initialConfig]);

  const getField = (name: string) => normalizedInitialConfig[name];

  const handleValuesChange = (changedValues: any, allValues: any) => {
    // Legacy dependency handling removed.
    // Dependencies are now handled within each Field component using Form.useWatch.

    // We can still trigger onChange for specific fields if needed,
    // but the Field component already has widgets that trigger onChange via Antd Form.
    // However, if config.onChange was used as a side-effect, we should call it?
    // The previous implementation called `field.onChange(changedValues[changedField])`.

    const changedFields = Object.keys(changedValues);
    changedFields.forEach((changedField) => {
      const field = normalizedInitialConfig[changedField];
      if (field?.onChange) {
        field.onChange(changedValues[changedField]);
      }
    });

    onValuesChange?.(changedValues, allValues);
  };

  return {
    fieldConfigs: normalizedInitialConfig,
    orderedFields,
    handleValuesChange,
    getField,
  };
}
