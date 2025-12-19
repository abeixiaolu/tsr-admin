import { makeRequest } from '@/utils/request';
import type { GetOssFilePayload, GetOssFileResponse } from './apis';

export const COMMON_API = {
  /** 获取oss上传签名 */
  getSignature: makeRequest<any, UploadSignaturePayload>({
    method: 'post',
    url: '/fx/signature/getSignature',
  }),
  /** 根据resourceID获取oss文件信息 */
  getOssFile: makeRequest<GetOssFileResponse, GetOssFilePayload>({
    method: 'post',
    url: '/resource/getResourceUrl',
  }),
  /** 提取身份证信息 */
  extractId: makeRequest<any, any>({
    method: 'post',
    url: '/ocr/extractId',
  }),
  /** 获取文件url */
  getFileUrl: makeRequest<string, { taskId: number }>({
    method: 'get',
    url: '/resource/task/fileUrl',
  }),
};

interface UploadSignaturePayload {
  access_type: string;
  typeCode: string;
  resourceName: string;
}
