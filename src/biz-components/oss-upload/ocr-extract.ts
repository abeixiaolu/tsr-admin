import type { FormInstance } from 'antd/es/form';
import { COMMON_API } from '@/apis/common';
import type { OcrDepsConfig } from './types';

interface OcrOptions {
  form: FormInstance;
  ocrDeps: OcrDepsConfig;
  listName?: string;
  formName?: string | string[];
}

export function ocrExtract(options: OcrOptions) {
  const { form, ocrDeps, listName, formName } = options;

  const buildFieldPath = (depKey: string): (string | number)[] => {
    const path: (string | number)[] = [];

    if (listName) {
      path.push(listName);
      if (Array.isArray(formName)) {
        path.push(formName[0]);
      }
    }

    const keyParts = depKey.includes('.') ? depKey.split('.') : [depKey];
    path.push(...keyParts);

    return path;
  };

  const extract = async (fileUrls: string[]): Promise<void> => {
    if (!Object.keys(ocrDeps).length) return;

    const res = await COMMON_API.extractId({ data: { fileList: fileUrls } });

    if (res.err) return;

    const ocrResult = res.data || {};

    Object.entries(ocrDeps).forEach(([ocrKey, config]) => {
      const fieldPath = buildFieldPath(config.key);
      const rawValue = ocrResult[ocrKey];
      const finalValue = config.format ? config.format(rawValue) : rawValue;

      form.setFieldValue(fieldPath.length === 1 ? fieldPath[0] : fieldPath, finalValue);
    });
  };

  return { extract };
}
