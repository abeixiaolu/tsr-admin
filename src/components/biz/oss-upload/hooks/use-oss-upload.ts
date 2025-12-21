import { message } from 'antd';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { COMMON_API } from '@/apis/common';
import { ossUpload } from '../utils';

interface UploadResult {
  uid: string;
  name: string;
  size: number;
  type: string;
  resourceId: string;
  url: string;
}

export function useOssUpload() {
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();

  const upload = async (file: File): Promise<UploadResult | null> => {
    try {
      const signRes = await COMMON_API.getSignature({
        access_type: '1',
        typeCode: 'default',
        resourceName: file.name,
      });
      const fileUrl = await ossUpload(file, signRes.data);

      if (!fileUrl) {
        message.error(t('component.upload.failed'));
        return null;
      }

      return {
        uid: (file as any).uid,
        name: file.name,
        size: file.size,
        type: file.type,
        resourceId: signRes.data?.resourceId,
        url: fileUrl as string,
      };
    } catch {
      message.error(t('component.upload.failed'));
      return null;
    }
  };

  const uploadBatch = async (files: File[]): Promise<UploadResult[]> => {
    setLoading(true);
    const results: UploadResult[] = [];

    for (const file of files) {
      const result = await upload(file);
      if (result) {
        results.push(result);
      }
    }

    setLoading(false);
    return results;
  };

  return { upload, uploadBatch, loading };
}
