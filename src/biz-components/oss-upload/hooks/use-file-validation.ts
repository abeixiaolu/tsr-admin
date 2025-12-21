import { message } from 'antd';
import { useTranslation } from 'react-i18next';

interface ValidationOptions {
  maxCount: number;
  maxFileSize: number; // MB
  maxFileNameLen: number;
  currentCount: number;
}

export function useFileValidation(options: ValidationOptions) {
  const { maxCount, maxFileSize, maxFileNameLen, currentCount } = options;
  const { t } = useTranslation();

  const validateCount = (incomingCount: number): boolean => {
    if (maxCount > 1 && currentCount + incomingCount > maxCount) {
      message.warning(t('component.upload.maxCount', { maxCount }));
      return false;
    }
    return true;
  };

  const validateSize = (size: number): boolean => {
    if (size > maxFileSize * 1024 * 1024) {
      message.warning(t('component.upload.maxSize', { maxFileSize }));
      return false;
    }
    return true;
  };

  const validateName = (name: string): boolean => {
    if (name.length > maxFileNameLen) {
      message.warning(t('component.upload.maxName', { maxFileNameLen }));
      return false;
    }
    return true;
  };

  const validateFile = (file: File): boolean => {
    return validateSize(file.size) && validateName(file.name);
  };

  return { validateCount, validateFile, validateSize, validateName };
}
