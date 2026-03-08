import { vi, describe, it, expect } from "vitest";
import {
  isValidSemver,
  extractVersionFromDryRun,
  promptCustomVersion,
  main,
  Deps,
} from "./start-release";

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Cria um mock de Deps com valores padrão para o cenário "tudo ok":
 * - branch: develop
 * - working tree limpo
 * - standard-version sugere 1.2.0
 * - usuário confirma versão e changelog
 */
function createMockDeps(overrides: Partial<Deps> = {}): Deps {
  const spawnMap: Record<
    string,
    { status: number; stdout: string; stderr: string }
  > = {
    "git diff --quiet": { status: 0, stdout: "", stderr: "" },
    "git diff --cached --quiet": { status: 0, stdout: "", stderr: "" },
    "npx standard-version --dry-run": {
      status: 0,
      stdout: "",
      stderr:
        "✔ bumping version in package.json from 1.1.0 to 1.2.0\n✔ tagging release v1.2.0",
    },
    "npx standard-version --dry-run --release-as 1.2.0": {
      status: 0,
      stdout: "### Features\n* feat: nova feature",
      stderr: "",
    },
  };

  const defaultDeps: Deps = {
    exec: vi.fn((cmd: string) => {
      if (cmd === "git rev-parse --abbrev-ref HEAD") return "develop";
      if (cmd === "git tag -l") return "v1.0.0\nv1.1.0";
      return "";
    }),

    spawn: vi.fn((command: string, args: string[]) => {
      const key = `${command} ${args.join(" ")}`;
      const result = spawnMap[key] ?? { status: 0, stdout: "", stderr: "" };
      return result as ReturnType<Deps["spawn"]>;
    }),

    spawnPassthrough: vi.fn(),

    prompt: vi
      .fn()
      .mockResolvedValueOnce("s") // confirma versão sugerida
      .mockResolvedValueOnce("s"), // confirma changelog

    exit: vi.fn().mockImplementation((code: number) => {
      throw new Error(`EXIT:${code}`);
    }) as unknown as Deps["exit"],

    log: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  };

  return { ...defaultDeps, ...overrides };
}

// ─── Pure helpers ─────────────────────────────────────────────────────────────

describe("isValidSemver", () => {
  it("aceita versões semver válidas", () => {
    expect(isValidSemver("1.0.0")).toBe(true);
    expect(isValidSemver("0.1.0")).toBe(true);
    expect(isValidSemver("10.20.30")).toBe(true);
  });

  it("rejeita formatos inválidos", () => {
    expect(isValidSemver("1.0")).toBe(false);
    expect(isValidSemver("v1.0.0")).toBe(false);
    expect(isValidSemver("1.0.0-beta")).toBe(false);
    expect(isValidSemver("abc")).toBe(false);
    expect(isValidSemver("")).toBe(false);
  });
});

describe("extractVersionFromDryRun", () => {
  it("extrai versão com prefixo v", () => {
    expect(extractVersionFromDryRun("✔ tagging release v1.2.0")).toBe("1.2.0");
  });

  it("extrai versão sem prefixo v", () => {
    expect(extractVersionFromDryRun("✔ tagging release 2.0.0")).toBe("2.0.0");
  });

  it("retorna string vazia quando não encontra versão", () => {
    expect(extractVersionFromDryRun("nenhuma versão aqui")).toBe("");
    expect(extractVersionFromDryRun("")).toBe("");
  });
});

// ─── main() ──────────────────────────────────────────────────────────────────

describe("main", () => {
  describe("validações de pré-condição", () => {
    it("encerra com erro se não estiver na branch develop", async () => {
      const deps = createMockDeps({
        exec: vi.fn(() => "feature/minha-feature"),
      });

      await expect(main(deps)).rejects.toThrow("EXIT:1");
      expect(deps.error).toHaveBeenCalledWith(
        expect.stringContaining("Você precisa estar na branch 'develop'"),
      );
    });

    it("encerra com erro se working tree tiver arquivos staged sujos", async () => {
      const deps = createMockDeps({
        spawn: vi.fn((command: string, args: string[]) => {
          const key = `${command} ${args.join(" ")}`;
          if (key === "git diff --cached --quiet")
            return { status: 1, stdout: "", stderr: "" };
          return { status: 0, stdout: "", stderr: "" };
        }) as unknown as Deps["spawn"],
      });

      await expect(main(deps)).rejects.toThrow("EXIT:1");
      expect(deps.error).toHaveBeenCalledWith(
        expect.stringContaining("Working tree sujo"),
      );
    });

    it("encerra com erro se working tree tiver arquivos unstaged sujos", async () => {
      const deps = createMockDeps({
        spawn: vi.fn((command: string, args: string[]) => {
          const key = `${command} ${args.join(" ")}`;
          if (key === "git diff --quiet")
            return { status: 1, stdout: "", stderr: "" };
          return { status: 0, stdout: "", stderr: "" };
        }) as unknown as Deps["spawn"],
      });

      await expect(main(deps)).rejects.toThrow("EXIT:1");
      expect(deps.error).toHaveBeenCalledWith(
        expect.stringContaining("Working tree sujo"),
      );
    });
  });

  describe("fluxo com versão sugerida", () => {
    it("executa fluxo completo com versão sugerida confirmada", async () => {
      const deps = createMockDeps();

      await main(deps);

      expect(deps.spawnPassthrough).toHaveBeenCalledWith("git clean -fd");
      expect(deps.spawnPassthrough).toHaveBeenCalledWith(
        "git flow release start 1.2.0",
      );
      expect(deps.spawnPassthrough).toHaveBeenCalledWith(
        "npx standard-version --skip.tag --release-as 1.2.0",
      );
      expect(deps.log).toHaveBeenCalledWith(
        expect.stringContaining("Commit de versão criado na release/1.2.0"),
      );
    });

    it("pede versão manual ao usuário se standard-version não detectar versão", async () => {
      const deps = createMockDeps({
        spawn: vi.fn((command: string, args: string[]) => {
          const key = `${command} ${args.join(" ")}`;
          if (key === "npx standard-version --dry-run") {
            return { status: 0, stdout: "", stderr: "sem versão aqui" };
          }
          // tag não existe
          if (key === "git rev-parse v2.1.0")
            return { status: 1, stdout: "", stderr: "" };
          return {
            status: 0,
            stdout: "### Features\n* feat: algo",
            stderr: "",
          };
        }) as unknown as Deps["spawn"],
        prompt: vi
          .fn()
          .mockResolvedValueOnce("2.1.0") // usuário digita versão manual
          .mockResolvedValueOnce("s"), // confirma changelog
      });

      await main(deps);

      expect(deps.warn).toHaveBeenCalledWith(
        expect.stringContaining("Não foi possível determinar a próxima versão"),
      );
      expect(deps.spawnPassthrough).toHaveBeenCalledWith(
        "git flow release start 2.1.0",
      );
      expect(deps.spawnPassthrough).toHaveBeenCalledWith(
        "npx standard-version --skip.tag --release-as 2.1.0",
      );
    });

    it("encerra se versão manual digitada for inválida quando standard-version falha", async () => {
      const deps = createMockDeps({
        spawn: vi.fn((command: string, args: string[]) => {
          const key = `${command} ${args.join(" ")}`;
          if (key === "npx standard-version --dry-run") {
            return { status: 0, stdout: "", stderr: "sem versão aqui" };
          }
          return { status: 0, stdout: "", stderr: "" };
        }) as unknown as Deps["spawn"],
        prompt: vi.fn().mockResolvedValueOnce("v2.0.0"), // formato inválido
      });

      await expect(main(deps)).rejects.toThrow("EXIT:1");
      expect(deps.error).toHaveBeenCalledWith(
        expect.stringContaining("Versão inválida"),
      );
    });

    it("encerra se changelog não for confirmado", async () => {
      const deps = createMockDeps({
        prompt: vi
          .fn()
          .mockResolvedValueOnce("s") // confirma versão
          .mockResolvedValueOnce("n"), // rejeita changelog
      });

      await expect(main(deps)).rejects.toThrow("EXIT:1");
      expect(deps.error).toHaveBeenCalledWith(
        expect.stringContaining("Release cancelada"),
      );
      expect(deps.error).toHaveBeenCalledWith(
        expect.stringContaining("git flow release delete"),
      );
    });
  });

  describe("fluxo com versão customizada", () => {
    it("usa versão customizada válida quando usuário rejeita a sugerida", async () => {
      const deps = createMockDeps({
        spawn: vi.fn((command: string, args: string[]) => {
          const key = `${command} ${args.join(" ")}`;
          if (key === "npx standard-version --dry-run") {
            return {
              status: 0,
              stdout: "",
              stderr: "✔ tagging release v1.2.0",
            };
          }
          // tag não existe
          if (key === "git rev-parse v2.0.0")
            return { status: 1, stdout: "", stderr: "" };
          return { status: 0, stdout: "### Features", stderr: "" };
        }) as unknown as Deps["spawn"],
        prompt: vi
          .fn()
          .mockResolvedValueOnce("n") // rejeita versão sugerida
          .mockResolvedValueOnce("2.0.0") // digita versão customizada
          .mockResolvedValueOnce("s"), // confirma changelog
      });

      await main(deps);

      expect(deps.spawnPassthrough).toHaveBeenCalledWith(
        "git flow release start 2.0.0",
      );
      expect(deps.spawnPassthrough).toHaveBeenCalledWith(
        "npx standard-version --skip.tag --release-as 2.0.0",
      );
    });

    it("encerra se versão customizada tiver formato inválido", async () => {
      const deps = createMockDeps({
        prompt: vi
          .fn()
          .mockResolvedValueOnce("n") // rejeita sugerida
          .mockResolvedValueOnce("v2.0.0"), // formato inválido (tem prefixo v)
      });

      await expect(main(deps)).rejects.toThrow("EXIT:1");
      expect(deps.error).toHaveBeenCalledWith(
        expect.stringContaining("Versão inválida"),
      );
    });

    it("encerra se tag da versão customizada já existir", async () => {
      const deps = createMockDeps({
        spawn: vi.fn((command: string, args: string[]) => {
          const key = `${command} ${args.join(" ")}`;
          if (key === "npx standard-version --dry-run") {
            return {
              status: 0,
              stdout: "",
              stderr: "✔ tagging release v1.2.0",
            };
          }
          // simula que a tag v1.1.0 já existe
          if (key === "git rev-parse v1.1.0")
            return { status: 0, stdout: "abc123", stderr: "" };
          return { status: 0, stdout: "", stderr: "" };
        }) as unknown as Deps["spawn"],
        prompt: vi
          .fn()
          .mockResolvedValueOnce("n") // rejeita sugerida
          .mockResolvedValueOnce("1.1.0"), // digita versão que já existe
      });

      await expect(main(deps)).rejects.toThrow("EXIT:1");
      expect(deps.error).toHaveBeenCalledWith(
        expect.stringContaining("já existe"),
      );
    });
  });

  // ─── promptCustomVersion ────────────────────────────────────────────────────

  describe("promptCustomVersion", () => {
    function createPromptDeps(overrides: Partial<Deps> = {}): Deps {
      return createMockDeps(overrides);
    }

    it("retorna versão válida quando tag não existe", async () => {
      const deps = createPromptDeps({
        spawn: vi.fn(() => ({
          status: 1,
          stdout: "",
          stderr: "",
        })) as unknown as Deps["spawn"],
        prompt: vi.fn().mockResolvedValueOnce("3.0.0"),
      });

      const result = await promptCustomVersion(deps);
      expect(result).toBe("3.0.0");
    });

    it("encerra se versão tiver formato inválido", async () => {
      const deps = createPromptDeps({
        prompt: vi.fn().mockResolvedValueOnce("v3.0.0"),
      });

      await expect(promptCustomVersion(deps)).rejects.toThrow("EXIT:1");
      expect(deps.error).toHaveBeenCalledWith(
        expect.stringContaining("Versão inválida"),
      );
    });

    it("encerra se tag já existir", async () => {
      const deps = createPromptDeps({
        spawn: vi.fn(() => ({
          status: 0,
          stdout: "abc123",
          stderr: "",
        })) as unknown as Deps["spawn"],
        prompt: vi.fn().mockResolvedValueOnce("1.0.0"),
      });

      await expect(promptCustomVersion(deps)).rejects.toThrow("EXIT:1");
      expect(deps.error).toHaveBeenCalledWith(
        expect.stringContaining("já existe"),
      );
    });
  });
});
