import CryptoJS from 'crypto-js';
import Base64 from 'crypto-js/enc-base64';
import JSEncrypt from 'jsencrypt';
import { Md5 } from 'ts-md5';

const PUBLIC_KEY = `MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBAK9ZDFWQNOijXxUi1HgiuALCbEyVbm5ffe1HkVRneOyXZBwUJsL94HOhQ/dcGzHYqdxaeETHlHrliGGPQgOivHsCAwEAAQ==`;

// 非对称加密
export function encrypt(val: string, publicKey: string = PUBLIC_KEY) {
  const encrypt = new JSEncrypt();
  encrypt.setPublicKey(publicKey);
  return encrypt.encrypt(val) || '';
}

// 加密支付密码
export function encryptPin(val: string, salt: string) {
  return Md5.hashStr(Md5.hashStr(val) + salt);
}

export function encryptPinSalt(val: string) {
  return Md5.hashStr(val);
}

// 签名
export function sign(params: Record<string, string | number>) {
  if (!params.timestamp) {
    params.timestamp = Date.now().toString();
  }
  const parseStr = Object.keys(params)
    .sort()
    .map((item) => {
      return `${item}${params[item]}`;
    })
    .join('');
  return Base64.stringify(CryptoJS.HmacSHA1(parseStr, Md5.hashStr(params.timestamp.toString())));
}
