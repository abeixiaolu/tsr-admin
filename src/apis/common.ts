import { definePost } from '@/utils/request';
import type { CommonResData } from './apis';
import type { AccessTermEnum, OtpBizTypeEnum } from './enum';

export const COMMON_API = {
  /** 获取oss上传签名 */
  getSignature: definePost<any, UploadSignaturePayload>('/fx/signature/getSignature'),
  /** 根据resourceID获取oss文件信息 */
  getOssFile: definePost<GetOssFileResponse, GetOssFilePayload>('/resource/getResourceUrl'),
  /** 提取身份证信息 */
  extractId: definePost<any, any>('/ocr/extractId'),
  /** 获取文件url */
  getFileUrl: definePost<string, { taskId: number }>('/resource/task/fileUrl'),
  sendOtpWithUser: definePost<CommonResData, SendOtpWithUserPayload>('/fx/otp/sendWithUser'),
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
  accessTerm: AccessTermEnum;
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

export interface SendOtpWithUserPayload {
  bizType: OtpBizTypeEnum;
}
