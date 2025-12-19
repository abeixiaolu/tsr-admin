import { messageApi } from '../toast';
import { SUCCESS_CODE } from './enum';
import type { RequestConfig } from './types';

export function generateRequestKey(config: RequestConfig): string {
  const { url, method = 'get', params, data } = config;

  // 基础 key
  let key = `${method.toUpperCase()}:${url}`;

  // GET 请求包含 params
  if (method === 'get' && params) {
    key += `?${JSON.stringify(params)}`;
  }

  // POST 等请求可以选择性包含 data 的 hash
  if (method !== 'get' && data) {
    key += `#${JSON.stringify(data).substring(0, 100)}`; // 避免 key 过长
  }

  return key;
}

/**
 * 解析文件名从 Content-Disposition 头
 */
export function parseFileName(
  contentDisposition: string,
  defaultName = 'download',
): string {
  if (!contentDisposition) return defaultName;

  try {
    // 匹配 filename*=UTF-8''xxx 或 filename="xxx" 或 filename=xxx
    const match = contentDisposition.match(/filename\*?=['"]?([^'";]+)['"]?/i);
    if (!match) return defaultName;

    let filename = match[1];

    // 处理 RFC 5987 编码格式
    if (contentDisposition.includes('filename*=') && filename.includes("''")) {
      filename = filename.split("''")[1];
    }

    // URL 解码并移除危险字符
    return (
      decodeURIComponent(filename).replace(/[<>:"/\\|?*]/g, '_') || defaultName
    );
  } catch (error) {
    console.warn('文件名解析失败:', error);
    return defaultName;
  }
}

/**
 * 检查是否为JSON错误响应
 */
export async function checkIfJsonError(
  blob: Blob,
): Promise<{ isError: boolean; errorData?: any }> {
  const contentType = blob.type.toLowerCase();

  // 检查content-type是否为JSON相关类型
  if (
    contentType.includes('application/json') ||
    contentType.includes('text/plain') ||
    contentType.includes('text/html')
  ) {
    try {
      const text = await blob.text();
      const jsonData = JSON.parse(text);

      if (jsonData.code && jsonData.code !== SUCCESS_CODE) {
        // 根据后端返回的错误响应格式判断，这里假设有 code 字段且不等于成功码
        return { isError: true, errorData: jsonData };
      }
    } catch (error) {
      // 如果解析失败，可能不是JSON，继续当作文件处理
      console.warn('尝试解析JSON失败，当作文件处理:', error);
    }
  }

  return { isError: false };
}

/**
 * 处理文件下载
 */
export async function handleFileDownload(
  blob: Blob,
  headers: any,
): Promise<void> {
  try {
    // 首先检查是否为JSON错误响应
    const { isError, errorData } = await checkIfJsonError(blob);
    if (isError) {
      messageApi().error(errorData?.message || '文件下载失败');
      return;
    }

    const contentDisposition = headers.get('Content-Disposition');

    if (!contentDisposition) {
      messageApi().warning(
        '后端未暴露该响应头【Content-Disposition】，使用默认文件名【file】',
      );
    }

    const filename = contentDisposition
      ? parseFileName(contentDisposition)
      : 'file';
    const contentType =
      headers.get('Content-Type') || 'application/octet-stream';

    const fileBlob = new Blob([blob], { type: contentType });
    downloadBlob(fileBlob, filename);
  } catch (error) {
    console.error('文件下载失败:', error);
    messageApi().error('文件下载失败，请重试');
  }
}

/** 下载 blob 格式的文件 */
export function downloadBlob(blob: Blob, name: string) {
  const link = document.createElement('a');
  const objectURL = URL.createObjectURL(blob);
  link.href = objectURL;
  // 处理文件名，去除可能导致浏览器添加下划线的字符
  const cleanName = name.trim().replace(/^["'_]+|["'_]+$/g, '');
  link.download = cleanName;
  link.click();
  URL.revokeObjectURL(objectURL);
  link.remove();
}
