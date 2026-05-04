import { describe, expect, it, vi } from "vitest";
import {
  createCreatedAtFromMinutesAgo,
  formatRelativeCreatedAt,
  formatCreatedAtDisplay,
  parseDateValue,
  parseCreatedAtDisplay,
  RelativeCreatedAtKey,
} from "../src/utils/date";

const translator = (key: RelativeCreatedAtKey, values?: { count: number }) => {
  switch (key) {
    case "thisMonth":
      return "Este mês";
    case "twoWeeksAgo":
      return "Há 2 semanas";
    case "oneDayAgo":
      return "Há 1 dia";
    case "manyDaysAgo":
      return `Há ${values?.count} dias`;
    case "oneHourAgo":
      return "Há 1 hora";
    case "manyHoursAgo":
      return `Há ${values?.count} horas`;
    case "oneMinuteAgo":
      return "Há 1 minuto";
    case "manyMinutesAgo":
      return `Há ${values?.count} minutos`;
    case "oneSecondAgo":
      return "Há 1 segundo";
    case "manySecondsAgo":
      return `Há ${values?.count} segundos`;
  }
};

describe("date utils", () => {
  it("inclui o ano ao formatar CreatedAt", () => {
    const createdAt = formatCreatedAtDisplay(
      new Date("2026-03-07T14:30:00.000Z"),
    );

    expect(createdAt).toMatch(
      /^\d{2}\s[A-Za-z]{3}\s\d{4},\s\d{2}:\d{2}:\d{2}\s(AM|PM)$/,
    );
  });

  it("faz parse do formato novo com ano explícito", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 2, 10, 12, 0, 0, 0));

    expect(parseCreatedAtDisplay("07 Mar 2026, 02:30:15 PM")).toBe(
      new Date(2026, 2, 7, 14, 30, 15, 0).getTime(),
    );

    vi.useRealTimers();
  });

  it("mantém compatibilidade com o formato legado sem ano", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 2, 10, 12, 0, 0, 0));

    expect(parseCreatedAtDisplay("07 Mar, 02:30 PM")).toBe(
      new Date(2026, 2, 7, 14, 30, 0, 0).getTime(),
    );

    vi.useRealTimers();
  });

  it("resolve CreatedAt customizado para Date", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 2, 10, 12, 0, 0, 0));

    expect(parseDateValue("07 Mar 2026, 02:30:15 PM")?.getTime()).toBe(
      new Date(2026, 2, 7, 14, 30, 15, 0).getTime(),
    );

    vi.useRealTimers();
  });

  it("retorna 'Este mês' para datas acima de 3 semanas", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 2, 31, 12, 0, 0, 0));

    expect(
      formatRelativeCreatedAt("07 Mar 2026, 02:30:00 PM", translator),
    ).toBe("Este mês");

    vi.useRealTimers();
  });

  it("retorna 'Há 2 semanas' para intervalo entre 2 e 3 semanas", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 2, 31, 12, 0, 0, 0));

    expect(
      formatRelativeCreatedAt("10 Mar 2026, 09:00:00 AM", translator),
    ).toBe("Há 2 semanas");

    vi.useRealTimers();
  });

  it("retorna dias para datas abaixo de 2 semanas", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 2, 20, 12, 0, 0, 0));

    expect(
      formatRelativeCreatedAt("15 Mar 2026, 09:00:00 AM", translator),
    ).toBe("Há 5 dias");

    vi.useRealTimers();
  });

  it("retorna horas no mesmo dia quando aplicável", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 2, 10, 12, 0, 45, 0));

    expect(
      formatRelativeCreatedAt("10 Mar 2026, 09:30:45 AM", translator),
    ).toBe("Há 2 horas");

    vi.useRealTimers();
  });

  it("retorna minutos no mesmo dia quando aplicável", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 2, 10, 12, 10, 45, 0));

    expect(
      formatRelativeCreatedAt("10 Mar 2026, 12:05:00 PM", translator),
    ).toBe("Há 5 minutos");

    vi.useRealTimers();
  });

  it("retorna segundos no mesmo dia quando aplicável", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 2, 10, 12, 0, 45, 0));

    expect(
      formatRelativeCreatedAt("10 Mar 2026, 12:00:15 PM", translator),
    ).toBe("Há 30 segundos");

    vi.useRealTimers();
  });

  it("gera CreatedAt para mocks com horas/minutos/segundos", () => {
    const reference = new Date(2026, 2, 10, 12, 0, 45, 0);

    const createdAt = createCreatedAtFromMinutesAgo(
      { hours: 1, minutes: 2, seconds: 3 },
      reference,
    );

    expect(parseCreatedAtDisplay(createdAt)).toBe(
      new Date(2026, 2, 10, 10, 58, 42, 0).getTime(),
    );
  });
});
