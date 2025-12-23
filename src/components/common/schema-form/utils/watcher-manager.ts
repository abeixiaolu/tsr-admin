import type { DependencySpec, FieldConfig } from '../types';

interface WatcherRecord {
  abort?: AbortController;
  timer?: ReturnType<typeof setTimeout>;
  lastRunAt?: number;
  pendingThrottleTimer?: ReturnType<typeof setTimeout>;
  snapshotKey?: string;
}

interface WatcherCacheEntry<T extends Record<string, any>> {
  expireAt: number;
  patch: Partial<FieldConfig<T>>;
}

export interface WatcherScheduleArgs<T extends Record<string, any>> {
  baseKey: string;
  snapshotKey: string;
  spec: DependencySpec<T>;
  execute: (signal: AbortSignal) => Promise<Partial<FieldConfig<T>> | undefined> | Partial<FieldConfig<T>> | undefined;
  applyPatch: (patch: Partial<FieldConfig<T>>) => void;
}

export interface WatcherManager<T extends Record<string, any>> {
  schedule: (args: WatcherScheduleArgs<T>) => void;
  dispose: () => void;
}

export function createWatcherManager<T extends Record<string, any>>(): WatcherManager<T> {
  const records = new Map<string, WatcherRecord>();
  const inflight = new Map<string, Promise<void>>();
  const cache = new Map<string, WatcherCacheEntry<T>>();

  function dispose() {
    records.forEach((r) => {
      r.timer && clearTimeout(r.timer);
      r.pendingThrottleTimer && clearTimeout(r.pendingThrottleTimer);
      r.abort?.abort();
    });
    records.clear();
    inflight.clear();
    cache.clear();
  }

  function schedule({ baseKey, snapshotKey, spec, execute, applyPatch }: WatcherScheduleArgs<T>) {
    const rec: WatcherRecord = records.get(baseKey) ?? {};

    const run = () => {
      const now = Date.now();

      // ttl 缓存：仅在 watcher 返回 patch 时生效
      if (spec.cacheTtl && spec.cacheTtl > 0) {
        const cached = cache.get(snapshotKey);
        if (cached && cached.expireAt > now) {
          applyPatch(cached.patch);
          return;
        }
      }

      // in-flight 去重：相同 deps snapshot key 的请求复用，不重复触发
      const dedupeEnabled = spec.dedupe !== false;
      if (dedupeEnabled) {
        const p = inflight.get(snapshotKey);
        if (p) return;
      }

      // 如果 deps 发生变化，取消同一 spec 的上一次请求
      if (rec.snapshotKey && rec.snapshotKey !== snapshotKey) rec.abort?.abort();
      rec.snapshotKey = snapshotKey;

      const abort = new AbortController();
      rec.abort = abort;
      records.set(baseKey, { ...rec });

      const p = Promise.resolve(execute(abort.signal))
        .then((ret) => {
          if (abort.signal.aborted) return;

          if (ret && typeof ret === 'object') {
            applyPatch(ret as any);
            if (spec.cacheTtl && spec.cacheTtl > 0) {
              cache.set(snapshotKey, {
                expireAt: Date.now() + spec.cacheTtl,
                patch: ret as any,
              });
            }
          }
        })
        .catch((err) => {
          if (abort.signal.aborted) return;
          console.error('[SchemaForm watcher error]', err);
        })
        .finally(() => {
          inflight.delete(snapshotKey);
        });

      if (dedupeEnabled) inflight.set(snapshotKey, p);
    };

    const invoke = () => {
      const r = records.get(baseKey) ?? rec;

      // 节流
      if (spec.throttle && spec.throttle > 0) {
        const now = Date.now();
        const last = r.lastRunAt ?? 0;
        const remain = spec.throttle - (now - last);
        if (remain > 0) {
          if (r.pendingThrottleTimer) clearTimeout(r.pendingThrottleTimer);
          const pendingThrottleTimer = setTimeout(() => {
            records.set(baseKey, { ...(records.get(baseKey) ?? r), lastRunAt: Date.now() });
            run();
          }, remain);
          records.set(baseKey, { ...r, pendingThrottleTimer });
          return;
        }
        records.set(baseKey, { ...r, lastRunAt: now });
      }

      run();
    };

    // 防抖
    if (spec.debounce && spec.debounce > 0) {
      if (rec.timer) clearTimeout(rec.timer);
      const timer = setTimeout(invoke, spec.debounce);
      records.set(baseKey, { ...rec, timer });
      return;
    }

    // 下一轮事件循环执行，避免阻塞当前 onValuesChange
    setTimeout(invoke, 0);
  }

  return { schedule, dispose };
}
