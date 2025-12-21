import { definePost } from '@/utils/request';

export const COMMON_API = {
  /** 获取oss上传签名 */
  getSignature: definePost<any, UploadSignaturePayload>('/fx/signature/getSignature'),
  /** 根据resourceID获取oss文件信息 */
  getOssFile: definePost<GetOssFileResponse, GetOssFilePayload>('/resource/getResourceUrl'),
  /** 提取身份证信息 */
  extractId: definePost<any, any>('/ocr/extractId'),
  /** 获取文件url */
  getFileUrl: definePost<string, { taskId: number }>('/resource/task/fileUrl'),
};

interface UploadSignaturePayload {
  access_type: string;
  typeCode: string;
  resourceName: string;
}

export interface GetOssFilePayload {
  /** 资源ID eg:1255046484550774785 */
  resourceId: string;
  /** 访问资源的终端类型 */
  accessTerm: AccessTerm;
  /** oss媒体资源处理字符串（视频截图、图片处理） */
  processString?: string;
}

export interface GetOssFileResponse {
  /** 资源id */
  resourceId: string;
  /** 资源url */
  url: string;
  /** 资源名 */
  resourceName: string;
}

/** 访问资源的终端类型 */
export const ACCESS_TERM_ENUM = {
  FRONTEND: 1,
  BACKEND: 2,
} as const;
export type AccessTerm = (typeof ACCESS_TERM_ENUM)[keyof typeof ACCESS_TERM_ENUM];
