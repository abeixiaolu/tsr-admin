import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { Form, Spin, Upload } from 'antd';
import { cloneDeep } from 'lodash-es';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { IconButton } from '@/components/button';
import Icon from '@/components/icon';
import { UPLOAD_DEFAULTS } from './constants';
import { useFileValidation } from './hooks/use-file-validation';
import { useOssUpload } from './hooks/use-oss-upload';
import { ocrExtract } from './ocr-extract';
import type { OssUploadProps } from './types';

const OssUpload: React.FC<OssUploadProps> = (props) => {
  const {
    name: formName,
    btnText: propBtnText,
    value,
    onChange,
    accept = UPLOAD_DEFAULTS.accept,
    maxFileSize = UPLOAD_DEFAULTS.maxFileSize,
    maxCount = UPLOAD_DEFAULTS.maxCount,
    maxFileNameLen = UPLOAD_DEFAULTS.maxFileNameLen,
    listType = UPLOAD_DEFAULTS.listType,
    disabled = false,
    useOcr,
    ocrDeps,
    listName,
    triggerType,
    dragHint,
    buttonProps,
  } = props;

  const { t } = useTranslation();
  const btnText = propBtnText ?? t('component.upload.btn');
  const form = Form.useFormInstance();
  const [fileList, setFileList] = React.useState<any[]>([]);

  const { validateCount, validateFile } = useFileValidation({
    maxCount,
    maxFileSize,
    maxFileNameLen,
    currentCount: fileList.length,
  });
  const { uploadBatch, loading } = useOssUpload();
  const { extract } = ocrExtract({ form, ocrDeps: ocrDeps || {}, listName, formName });

  React.useEffect(() => {
    const result = value ? (Array.isArray(value) ? value : [value]) : [];
    if (result.every((item) => typeof item === 'object')) {
      setFileList(result);
    }
  }, [value]);

  const handleBeforeUpload = async (_file: File, incomingFiles: File[]) => {
    if (!validateCount(incomingFiles.length)) return false;

    for (const f of incomingFiles) {
      if (!validateFile(f)) return false;
    }

    const results = await uploadBatch(incomingFiles);
    if (!results.length) return false;

    const newList = maxCount === 1 ? results : [...fileList, ...results];
    setFileList(newList);
    onChange?.(newList.length ? newList : undefined);

    if (useOcr) {
      await extract(results.map((r) => r.url));
    }

    return false;
  };

  const handleRemove = (file: any) => {
    const newList = cloneDeep(fileList).filter((item) => item.uid !== file.uid);
    setFileList(newList);
    onChange?.(newList.length ? newList : undefined);
  };

  const renderUploadButton = () => {
    if (listType === 'picture-card') {
      return fileList.length >= maxCount ? null : (
        <div>
          {loading ? <LoadingOutlined /> : <PlusOutlined />}
          <div className="mt-2">{btnText}</div>
        </div>
      );
    }
    return (
      <IconButton
        icon="i-lucide-upload"
        iconProps={{ className: 'text-assist transition duration-200 group-hover:text-primary-hover group-active:text-primary-active' }}
        disabled={disabled || loading}
        className="w-full"
        type="dashed"
        classNames={{ root: 'bg-fill! group' }}
        {...buttonProps}
      >
        {btnText}
      </IconButton>
    );
  };

  if (triggerType === 'drag') {
    return (
      <Spin spinning={loading}>
        <Upload.Dragger
          accept={accept}
          maxCount={maxCount}
          fileList={fileList}
          listType={listType}
          beforeUpload={handleBeforeUpload}
          onRemove={handleRemove}
          disabled={disabled}
        >
          <div className="py-8">
            <Icon className="text-2xl text-gray-400" name="i-lucide-plus" />
            <div className="mt-2 text-gray-600">{t('component.upload.text')}</div>
            {dragHint || (
              <div className="mt-2 text-xs text-gray-400">
                {t('component.upload.hint1', { accept })}
                <br />
                {t('component.upload.hint2', { maxFileSize })}
                {maxCount > 1 && (
                  <>
                    <br />
                    {t('component.upload.hint3', { maxCount })}
                  </>
                )}
              </div>
            )}
          </div>
        </Upload.Dragger>
      </Spin>
    );
  }

  return (
    <Upload
      accept={accept}
      maxCount={maxCount}
      fileList={fileList}
      listType={listType}
      beforeUpload={handleBeforeUpload}
      onRemove={handleRemove}
      disabled={disabled}
      classNames={{ root: '[&_.ant-upload]:w-full' }}
    >
      {renderUploadButton()}
    </Upload>
  );
};

export default OssUpload;
