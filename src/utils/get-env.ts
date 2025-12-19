function transform<T extends Record<string, string>>(
  env: T,
): {
  [K in keyof T]: T[K] extends 'true' | 'false'
    ? boolean
    : T[K] extends boolean
      ? boolean
      : string;
} {
  const transformedEnv: any = {};

  for (const key in env) {
    if (Object.hasOwn(env, key)) {
      const value = env[key];
      transformedEnv[key] =
        value === 'true' ? true : value === 'false' ? false : value;
    }
  }

  return transformedEnv;
}

export default function getEnv() {
  return transform(import.meta.env);
}
