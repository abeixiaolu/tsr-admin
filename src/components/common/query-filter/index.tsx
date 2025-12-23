import { Button, Flex, Form, Popover, theme } from 'antd';
import { isEmpty } from 'lodash-es';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import FilterIcon from '@/icons/internal/filter.svg?react';
import { cn } from '@/utils';
import { LinkButton } from '../button';
import Icon from '../icon';
import { Field, SchemaForm, useSchemaForm } from '../schema-form';
import { useResponsiveFilter } from './hooks/use-responsive-filter';
import type { QueryFilterProps } from './types';

const PADDING = 6;
export function QueryFilter<T extends Record<string, any>>({
  config: initialConfig,
  className,
  initialValues,
  form: propForm,
  onValuesChange,
  defaultCollapsed,
  minWidth,
  gap = 16,
  showCollapseButton = true,
  onSearch,
  onReset,
  titleRender,
  simple,
  ...restProps
}: QueryFilterProps<T>) {
  const { token } = theme.useToken();
  const { t } = useTranslation();
  const [internalForm] = Form.useForm<T>();
  const form = propForm || internalForm;
  const [open, setOpen] = useState(false);
  const [values, setValues] = useState<any>({});
  const initialCollapsed = defaultCollapsed ?? true;
  const [transitionEnabled, setTransitionEnabled] = useState(initialCollapsed);
  const { fieldConfigs, orderedFields, handleValuesChange } = useSchemaForm(initialConfig, form, onValuesChange);
  const { containerRef, formRef, currentHeight, itemWidth, emptyCount, singleRowHeight, collapsed, toggleCollapse, hasMeasured } =
    useResponsiveFilter({
      defaultCollapsed,
      minWidth,
      gap,
      orderedFields,
    });
  const resolvedHeight = hasMeasured && Number.isFinite(currentHeight) ? currentHeight + PADDING * 2 : 'auto';

  const handleReset = () => {
    form.resetFields();
    setOpen(false);
    setValues({});
    onReset?.();
  };

  const handleSearch = () => {
    form.validateFields().then((values) => {
      setValues(values);
      setOpen(false);
      onSearch?.(values);
    });
  };

  const handleRemoveValue = (key: string) => {
    const newValues = { ...values, [key]: undefined };
    setValues(newValues);
    form.setFieldsValue(newValues);
    onSearch?.(newValues);
  };

  const handleToggleCollapse = () => {
    if (!transitionEnabled) {
      setTransitionEnabled(true);
    }
    toggleCollapse();
  };
  const title =
    titleRender === false ? null : typeof titleRender === 'function' ? (
      titleRender()
    ) : (
      <div className="mb-10px">
        <span className={cn('text-20px font-sx-pro-display font-bold', simple ? 'text-16px font-sx-pro' : '')}>{t('global.filters')}</span>
      </div>
    );
  const selectedValuesToTags = Object.entries(values)
    .filter(([_, value]) => value !== undefined)
    .map(([key, value]: [string, any]) => {
      const config = initialConfig?.find((c) => c.name === key);
      let label = value;
      if (config && config.type === 'select') {
        label = config.props?.options?.find((o: any) => o.value === value)?.label;
      }
      return (
        <div key={key} className="inline-flex shrink-0 items-center h-8 gap-1 px-2 bg-fill rounded-4px">
          <span>{label}</span>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleRemoveValue(key);
            }}
            className="size-5 rounded-full flex items-center justify-center cursor-pointer hover:bg-container text-assist"
          >
            <Icon name="i-lucide-x" />
          </button>
        </div>
      );
    });

  const watchValues = Form.useWatch([], form);
  const disabled = Object.keys(watchValues || {}).every((key) => isEmpty(watchValues[key]));

  return (
    <>
      {simple &&
        (() => {
          const triggerButton = <LinkButton icon={FilterIcon}>{simple.btnText || t('global.filters')}</LinkButton>;

          const popoverContent = (
            <div className="min-w-320px">
              {title}
              <SchemaForm classNames={{ label: 'font-medium!' }} form={form} config={initialConfig} {...restProps}>
                <Flex gap={16} justify="end">
                  <Button size="middle" onClick={handleReset}>
                    {t('global.reset')}
                  </Button>
                  <Button disabled={disabled} size="middle" type="primary" onClick={handleSearch}>
                    {t('global.confirm')}
                  </Button>
                </Flex>
              </SchemaForm>
            </div>
          );

          const popoverButton = (
            <Popover open={open} onOpenChange={setOpen} trigger="click" arrow={false} content={popoverContent} {...simple.popoverProps}>
              {triggerButton}
            </Popover>
          );

          if (simple.render) {
            return simple.render({
              tags: selectedValuesToTags,
              button: popoverButton,
            });
          }

          return (
            <div className={cn('inline-flex flex-wrap items-center gap-4', simple.className)}>
              {selectedValuesToTags}
              {popoverButton}
            </div>
          );
        })()}
      <div
        className={className}
        style={{
          background: token.colorBgContainer,
          borderRadius: token.borderRadiusLG,
          padding: 16,
          display: simple ? 'none' : 'block',
        }}
      >
        {title}
        <div
          ref={containerRef}
          style={{
            height: resolvedHeight,
            padding: PADDING,
            visibility: hasMeasured ? 'visible' : 'hidden',
          }}
          className={cn('relative overflow-hidden', transitionEnabled && hasMeasured && 'transition-height duration-300')}
        >
          <Form
            form={form}
            classNames={{ label: 'font-medium!' }}
            onValuesChange={handleValuesChange}
            initialValues={initialValues}
            {...restProps}
            layout="inline"
          >
            <div
              ref={formRef}
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap,
              }}
            >
              {orderedFields.map((name) => (
                <div
                  key={name}
                  style={{
                    flex: `0 0 ${itemWidth}px`,
                    maxWidth: `${itemWidth}px`,
                  }}
                >
                  <Field config={Object.assign({}, fieldConfigs[name], { noStyle: true })} />
                </div>
              ))}

              {/* Empty placeholders */}
              {Array.from({ length: emptyCount }).map((_, i) => (
                <div
                  // biome-ignore lint/suspicious/noArrayIndexKey: anyway
                  key={`empty-${i}`}
                  style={{
                    flex: `0 0 ${itemWidth}px`,
                    maxWidth: `${itemWidth}px`,
                    height: 1,
                  }}
                />
              ))}

              {/* Action Buttons - Absolute Positioned */}
              <div
                className={cn('absolute bottom-0 right-0 z-2 text-right flex items-start justify-end bg-[var(--ant-color-bg-container)]')}
                style={{
                  width: itemWidth + PADDING,
                  height: singleRowHeight + PADDING || 'auto',
                }}
              >
                <div>
                  <div className="flex justify-end gap-2">
                    <Button onClick={handleReset}>{t('global.reset')}</Button>
                    <Button type="primary" onClick={handleSearch}>
                      {t('global.search')}
                    </Button>
                    {showCollapseButton && (
                      <LinkButton
                        icon={collapsed ? 'i-lucide-chevrons-down' : 'i-lucide-chevrons-up'}
                        className="block flex items-center justify-center"
                        onClick={handleToggleCollapse}
                      ></LinkButton>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </Form>
        </div>
      </div>
    </>
  );
}
