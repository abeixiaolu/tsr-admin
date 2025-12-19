declare global {
  interface Recordable<T = any> {
    [key: string]: T;
  }

  type Prettify<T> = { [P in keyof T]: T[P] } & {};

  interface APIResponse<T = unknown> {
    respCode: string;
    respMsg: string;
    data: T;
  }
}

export {};
