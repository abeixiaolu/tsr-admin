import { Form } from 'antd';
import { omit } from 'lodash-es';
import type React from 'react';
import type { ComponentType } from 'react';
import { useMemo } from 'react';
import type { DependencySpec, FieldConfig } from '../types';
import { mergeFieldConfig } from '../utils/dependency-helpers';
import { widgets } from '../widgets';
import RecursiveWatcher from './recursive-watcher';

interface FieldProps {
  config: FieldConfig;
  watchedValues?: Record<string, any>;
}

function getOmitConfig(config: FieldConfig) {
  return omit(config, ['type', 'props', 'hide', 'onChange', 'dependencies']);
}

function isCustomWidget(type: unknown): type is ComponentType<any> {
  return typeof type === 'object' || typeof type === 'function';
}

function getDependencyNames(config: FieldConfig): string[] {
  const specs = (config as any).dependencies as DependencySpec<any>[] | undefined;
  if (!specs || !Array.isArray(specs)) return [];

  const allDeps = new Set<string>();
  specs.forEach((spec) => {
    if (Array.isArray(spec.deps)) {
      spec.deps.forEach((d) => {
        allDeps.add(d);
      });
    } else {
      allDeps.add(spec.deps);
    }
  });
  return Array.from(allDeps);
}

export const FieldInner: React.FC<FieldProps> = ({ config: initialConfig, watchedValues }) => {
  const form = Form.useFormInstance();
  const depNames = useMemo(() => getDependencyNames(initialConfig), [initialConfig]);
  const mergedConfig = useMemo(() => {
    if (!depNames.length) return initialConfig;
    const specs = initialConfig.dependencies;

    let currentConfig = { ...initialConfig };
    if (specs) {
      specs.forEach((spec) => {
        if (spec.effect) {
          const patch = spec.effect(watchedValues, { form });
          if (patch) {
            currentConfig = mergeFieldConfig(currentConfig, patch);
          }
        }
      });
    }
    return currentConfig;
  }, [initialConfig, depNames, watchedValues, form]);

  if (!mergedConfig) return null;

  if (mergedConfig.type === 'title') {
    return (
      <Form.Item {...getOmitConfig(mergedConfig)} noStyle>
        {mergedConfig.label}
      </Form.Item>
    );
  }

  const Widget = isCustomWidget(mergedConfig.type) ? mergedConfig.type : widgets[mergedConfig.type];
  if (!Widget) {
    console.warn(`Widget type "${mergedConfig.type}" not found.`);
    return null;
  }

  const renderField = () => (
    <Form.Item {...getOmitConfig(mergedConfig)}>
      <Widget {...mergedConfig.props} />
    </Form.Item>
  );
  if (mergedConfig.hide) return null;
  return renderField();
};

export function Field({ config }: FieldProps) {
  const form = Form.useFormInstance();
  const depNames = getDependencyNames(config);
  if (!depNames.length) return <FieldInner config={config} />;
  return (
    <RecursiveWatcher names={depNames} form={form} values={{}}>
      {(values) => <FieldInner config={config} watchedValues={values} />}
    </RecursiveWatcher>
  );
}
