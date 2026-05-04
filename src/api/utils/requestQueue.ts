import { homeSectionsLimiter } from "@/api/utils/concurrencyLimiter";

type QueuePriority = "high" | "normal" | "low";

type PendingTask<T> = {
  key: string;
  priority: QueuePriority;
  run: () => Promise<T>;
  resolve: (value: T) => void;
  reject: (reason?: unknown) => void;
};

const priorityWeight: Record<QueuePriority, number> = {
  high: 0,
  normal: 1,
  low: 2,
};

export class RequestQueue {
  private readonly inFlight = new Map<string, Promise<unknown>>();

  private readonly queue: PendingTask<unknown>[] = [];

  private flushScheduled = false;

  constructor(
    private readonly runTask: <T>(task: () => Promise<T>) => Promise<T> = (
      task,
    ) => homeSectionsLimiter.run(task),
  ) {}

  enqueue<T>(
    key: string,
    task: () => Promise<T>,
    priority: QueuePriority = "normal",
  ): Promise<T> {
    const existing = this.inFlight.get(key);
    if (existing) {
      return existing as Promise<T>;
    }

    const promise = new Promise<T>((resolve, reject) => {
      this.queue.push({
        key,
        priority,
        run: task,
        resolve: resolve as (value: unknown) => void,
        reject,
      });

      this.queue.sort(
        (a, b) => priorityWeight[a.priority] - priorityWeight[b.priority],
      );

      this.scheduleFlush();
    });

    this.inFlight.set(key, promise as Promise<unknown>);

    return promise.finally(() => {
      this.inFlight.delete(key);
    });
  }

  private flush() {
    this.flushScheduled = false;
    const next = this.queue.shift();
    if (!next) return;

    void this.runTask(next.run)
      .then(next.resolve)
      .catch(next.reject)
      .finally(() => {
        this.scheduleFlush();
      });
  }

  private scheduleFlush() {
    if (this.flushScheduled) return;
    this.flushScheduled = true;
    queueMicrotask(() => {
      this.flush();
    });
  }
}

export const homeSectionsRequestQueue = new RequestQueue();
