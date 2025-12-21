/** 上传文件到OSS */
export function ossUpload(file: File, uploadConfig: any) {
  return new Promise((resolve) => {
    const xhr = new XMLHttpRequest();
    const formData = new FormData();
    uploadConfig.OSSAccessKeyId = uploadConfig.accessId;
    Object.keys(uploadConfig).forEach((key) => {
      formData.append(key, uploadConfig[key]);
    });
    formData.append('file', file);
    xhr.open('POST', uploadConfig.host);
    xhr.send(formData);
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4 && xhr.status >= 200 && xhr.status < 300) {
        const url = uploadConfig.publicRelativeUrl;
        resolve(url);
      }
      if (xhr.status > 300) {
        resolve('');
        xhr.abort();
      }
    };
    xhr.timeout = 5 * 60 * 1000;
    xhr.ontimeout = () => {
      resolve('');
    };
  });
}
