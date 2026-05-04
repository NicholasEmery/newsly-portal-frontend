import { describe, expect, it } from "vitest";
import { ConcurrencyLimiter } from "./concurrencyLimiter";

const sleep = (ms: number) =>
  new Promise<void>((resolve) => {
    setTimeout(resolve, ms);
  });

describe("ConcurrencyLimiter", () => {
  it("respeita o maximo de tarefas simultaneas", async () => {
    const limiter = new ConcurrencyLimiter(1);
    let active = 0;
    let observedMax = 0;

    const task = async (id: number) => {
      active += 1;
      observedMax = Math.max(observedMax, active);
      await sleep(10);
      active -= 1;
      return id;
    };

    const results = await Promise.all([
      limiter.run(() => task(1)),
      limiter.run(() => task(2)),
      limiter.run(() => task(3)),
    ]);

    expect(results).toEqual([1, 2, 3]);
    expect(observedMax).toBe(1);
  });
});
