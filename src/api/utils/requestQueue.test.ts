import { describe, expect, it, vi } from "vitest";
import { RequestQueue } from "./requestQueue";

const sleep = (ms: number) =>
  new Promise<void>((resolve) => {
    setTimeout(resolve, ms);
  });

describe("RequestQueue", () => {
  it("deduplica tarefas iguais em voo", async () => {
    const queue = new RequestQueue((task) => task());
    const task = vi.fn(async () => {
      await sleep(5);
      return "ok";
    });

    const [a, b] = await Promise.all([
      queue.enqueue("latest:1", task),
      queue.enqueue("latest:1", task),
    ]);

    expect(a).toBe("ok");
    expect(b).toBe("ok");
    expect(task).toHaveBeenCalledTimes(1);
  });

  it("prioriza tarefas high antes de low", async () => {
    const queue = new RequestQueue((task) => task());
    const executionOrder: string[] = [];

    await Promise.all([
      queue.enqueue(
        "low-task",
        async () => {
          executionOrder.push("low");
          return "low";
        },
        "low",
      ),
      queue.enqueue(
        "high-task",
        async () => {
          executionOrder.push("high");
          return "high";
        },
        "high",
      ),
    ]);

    expect(executionOrder[0]).toBe("high");
  });
});
