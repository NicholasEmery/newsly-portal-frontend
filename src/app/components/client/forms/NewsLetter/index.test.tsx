// @vitest-environment jsdom

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom/vitest";

import Newsletter from "./index";

const translations: Record<string, string> = {
  title: "Assine nossa Newsletter",
  subtitle: "Fique por dentro",
  emailPlaceholder: "Digite seu email*",
  sending: "Enviando...",
  subscriptionCompleted: "Inscricao realizada",
  emailAlreadyRegistered: "Email ja cadastrado",
  subscribe: "Inscrever-se",
  acceptTermsLabel: "Eu aceito os",
  termsOfUse: "termos de uso",
  and: "e",
  privacyPolicy: "politica de privacidade",
  termsError:
    "Voce deve aceitar os termos de uso e a politica de privacidade para continuar",
  errorProcessing: "Erro ao processar inscricao",
  invalidResponse: "Resposta invalida do servidor",
  emailAlreadyRegisteredError: "Este email ja esta cadastrado.",
  genericError: "Erro ao processar sua solicitacao",
  buttonErrorTerms: "Aceite os termos",
  buttonErrorRequest: "Falha no envio",
  buttonWarningAlreadyRegistered: "Email existente",
};

vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) => translations[key] ?? key,
}));

vi.mock("@/shadcn/components/ui/tooltip", () => ({
  Tooltip: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  TooltipTrigger: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
  TooltipContent: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

describe("Newsletter form", () => {
  afterEach(() => {
    cleanup();
  });

  beforeEach(() => {
    vi.restoreAllMocks();
    vi.stubGlobal("fetch", vi.fn());
  });

  it("starts with submit disabled and default label", () => {
    render(<Newsletter />);

    const submitButton = screen.getByRole("button", { name: "Inscrever-se" });

    expect(submitButton).toBeDisabled();
  });

  it("enables submit for valid email", async () => {
    const user = userEvent.setup();
    render(<Newsletter />);

    const emailInput = screen.getByPlaceholderText("Digite seu email*");
    const submitButton = screen.getByRole("button", { name: "Inscrever-se" });

    await user.type(emailInput, "valid@email.com");

    expect(submitButton).toBeEnabled();
  });

  it("shows loading and then success on 200 response", async () => {
    const user = userEvent.setup();
    let resolveFetch!: (value: unknown) => void;

    vi.stubGlobal(
      "fetch",
      vi.fn(
        () =>
          new Promise((resolve) => {
            resolveFetch = resolve;
          }),
      ),
    );

    render(<Newsletter />);

    const emailInput = screen.getByPlaceholderText("Digite seu email*");
    const termsCheckbox = screen.getByRole("checkbox");
    const submitButton = screen.getByRole("button", { name: "Inscrever-se" });

    await user.type(emailInput, "valid@email.com");
    await user.click(termsCheckbox);
    await user.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: "Enviando..." }),
      ).toBeDisabled();
    });

    resolveFetch({
      ok: true,
      status: 200,
      json: async () => ({ success: true, message: "ok" }),
    });

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: "Inscricao realizada" }),
      ).toBeInTheDocument();
    });

    expect(emailInput).toHaveValue("");
    expect(termsCheckbox).not.toBeChecked();
  });

  it("shows warning label for duplicate email (409)", async () => {
    const user = userEvent.setup();

    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        status: 409,
        json: async () => ({ error: "duplicado" }),
      }),
    );

    render(<Newsletter />);

    const emailInput = screen.getByPlaceholderText("Digite seu email*");
    const termsCheckbox = screen.getByRole("checkbox");

    await user.type(emailInput, "duplicate@email.com");
    await user.click(termsCheckbox);
    await user.click(screen.getByRole("button", { name: "Inscrever-se" }));

    await waitFor(() => {
      const warningButton = screen.getByRole("button", {
        name: "Email existente",
      });
      expect(warningButton).toBeInTheDocument();
      expect(warningButton).toHaveClass("bg-yellow-500");
    });
  });

  it("shows request error label for non-409 error and resets status on input change", async () => {
    const user = userEvent.setup();

    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
        json: async () => ({ message: "error" }),
      }),
    );

    render(<Newsletter />);

    const emailInput = screen.getByPlaceholderText("Digite seu email*");
    const termsCheckbox = screen.getByRole("checkbox");

    await user.type(emailInput, "fail@email.com");
    await user.click(termsCheckbox);
    await user.click(screen.getByRole("button", { name: "Inscrever-se" }));

    await waitFor(() => {
      const errorButton = screen.getByRole("button", {
        name: "Falha no envio",
      });
      expect(errorButton).toBeInTheDocument();
      expect(errorButton).toHaveClass("bg-red-500");
    });

    await user.type(emailInput, "a");

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: "Inscrever-se" }),
      ).toBeInTheDocument();
    });
  });
});
