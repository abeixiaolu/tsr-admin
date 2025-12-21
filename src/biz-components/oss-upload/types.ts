import type { UploadFile, UploadProps } from 'antd';
import type { ReactNode } from 'react';
import type { IconButtonProps } from '@/components/common/button/icon-button';

export type UploadTriggerType = null | 'drag';

export interface OcrDepItem {
  key: string;
  format?: (value: any) => any;
}

export type OcrDepsConfig = Record<string, OcrDepItem>;

export interface OssUploadProps extends Pick<UploadProps, 'accept' | 'maxCount' | 'disabled' | 'listType'> {
  // Form binding
  name?: string | string[];
  value?: UploadFile[];
  onChange?: (value: UploadFile[] | undefined) => void;
  listName?: string;

  // Validation
  maxFileSize?: number;
  maxFileNameLen?: number;

  // OCR
  useOcr?: boolean;
  ocrDeps?: OcrDepsConfig;

  // UI - Trigger
  triggerType?: UploadTriggerType;
  btnText?: string;
  buttonProps?: IconButtonProps;
  dragHint?: ReactNode;
}
