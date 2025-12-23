import { Form } from 'antd';
import { omit } from 'lodash-es';
import type React from 'react';
import type { ComponentType } from 'react';
import type { FieldConfig } from '../types';
import { widgets } from '../widgets';

interface FieldProps {
  config: FieldConfig;
}

function getOmitConfig(config: FieldConfig) {
  return omit(config, ['type', 'props', 'hide', 'onChange', 'dependencies']);
}

function isCustomWidget(type: unknown): type is ComponentType<any> {
  return typeof type === 'object' || typeof type === 'function';
}

function getDependencyNames(config: FieldConfig): string[] {
  const deps = (config as any).dependencies;
  if (!Array.isArray(deps)) return [];
  return deps.flatMap((d: any) => (Array.isArray(d?.deps) ? d.deps : []));
}

export const Field: React.FC<FieldProps> = ({ config }) => {
  if (!config) return null;

  if (config.type === 'title') {
    return (
      <Form.Item {...getOmitConfig(config)} noStyle>
        {config.label}
      </Form.Item>
    );
  }

  const Widget = isCustomWidget(config.type) ? config.type : widgets[config.type];
  if (!Widget) {
    console.warn(`Widget type "${config.type}" not found.`);
    return null;
  }

  const renderField = () => (
    <Form.Item {...getOmitConfig(config)}>
      <Widget {...config.props} />
    </Form.Item>
  );

  if (config.hide) {
    const dependencies = getDependencyNames(config);
    const shouldUpdate = (prev: Record<string, any>, curr: Record<string, any>) => {
      if (dependencies.length) return dependencies.some((dep) => prev?.[dep] !== curr?.[dep]);

      let isHiddenPrev = false;
      let isHiddenCurr = false;

      if (typeof config.hide === 'function') {
        isHiddenPrev = config.hide({ formData: prev });
        isHiddenCurr = config.hide({ formData: curr });
      } else if (typeof config.hide === 'object') {
        isHiddenPrev = config.hide.expression({ formData: prev });
        isHiddenCurr = config.hide.expression({ formData: curr });
      }

      return isHiddenPrev !== isHiddenCurr;
    };

    return (
      <Form.Item noStyle shouldUpdate={shouldUpdate}>
        {({ getFieldsValue, setFieldValue }) => {
          const formData = getFieldsValue();
          let isHidden = false;
          let clearValueOnHide = true;

          if (typeof config.hide === 'function') {
            isHidden = config.hide({ formData });
          } else if (typeof config.hide === 'object') {
            isHidden = config.hide.expression({ formData });
            clearValueOnHide = config.hide.clearValueOnHide ?? true;
          }

          if (isHidden && clearValueOnHide) {
            const currentValue = getFieldsValue([config.name])[config.name];
            if (currentValue !== undefined) {
              setFieldValue(config.name, undefined);
            }
          }
          return isHidden ? null : renderField();
        }}
      </Form.Item>
    );
  }

  return renderField();
};
