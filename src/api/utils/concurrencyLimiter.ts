type Task<T> = () => Promise<T>;

type QueueItem<T> = {
  task: Task<T>;
  resolve: (value: T) => void;
  reject: (reason?: unknown) => void;
};

export class ConcurrencyLimiter {
  private activeCount = 0;

  private readonly queue: QueueItem<unknown>[] = [];

  constructor(private readonly maxConcurrent = 3) {}

  run<T>(task: Task<T>): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      this.queue.push({
        task,
        resolve: resolve as (value: unknown) => void,
        reject,
      });
      this.processQueue();
    });
  }

  private processQueue() {
    if (this.activeCount >= this.maxConcurrent) return;

    const next = this.queue.shift();
    if (!next) return;

    this.activeCount += 1;

    next
      .task()
      .then(next.resolve)
      .catch(next.reject)
      .finally(() => {
        this.activeCount -= 1;
        this.processQueue();
      });
  }
}

export const homeSectionsLimiter = new ConcurrencyLimiter(3);
