import { execSync, spawnSync, SpawnSyncReturns } from "child_process";
import * as readline from "readline";
import { fileURLToPath } from "url";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface Deps {
  exec: (command: string) => string;
  spawn: (
    command: string,
    args: string[],
    opts?: object,
  ) => SpawnSyncReturns<string>;
  spawnPassthrough: (command: string) => void;
  prompt: (question: string) => Promise<string>;
  exit: (code: number) => never;
  log: (...args: unknown[]) => void;
  warn: (...args: unknown[]) => void;
  error: (...args: unknown[]) => void;
}

// ─── Pure helpers (exportados para testes unitários) ─────────────────────────

export function isValidSemver(version: string): boolean {
  return /^\d+\.\d+\.\d+$/.test(version);
}

export function extractVersionFromDryRun(output: string): string {
  const match = output.match(/tagging release v?(\d+\.\d+\.\d+)/);
  return match ? match[1] : "";
}

export async function promptCustomVersion(
  deps: Pick<
    Deps,
    "prompt" | "spawn" | "spawnPassthrough" | "exec" | "exit" | "log" | "error"
  >,
): Promise<string> {
  const { prompt, spawn, spawnPassthrough, exec, exit, log, error } = deps;

  const customVersion = await prompt("\n📝 Digite a versão (ex: 1.2.3): ");

  if (!isValidSemver(customVersion)) {
    error("❌ Versão inválida. Use o formato: X.Y.Z (ex: 1.2.3)");
    exit(1);
  }

  log("🔄 Buscando tags remotas...");
  spawnPassthrough("git fetch --tags");

  const tagCheck = spawn("git", ["rev-parse", `v${customVersion}`]);
  if (tagCheck.status === 0) {
    const existingTags = exec("git tag -l").split("\n").slice(-5).join("\n");
    error(
      `❌ A tag v${customVersion} já existe! Últimas versões criadas:\n${existingTags}`,
    );
    exit(1);
  }

  return customVersion;
}

// ─── Runtime deps (usados na execução real) ───────────────────────────────────

function createRuntimeDeps(): Deps {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return {
    exec: (command) => execSync(command, { encoding: "utf-8" }).trim(),

    spawn: (command, args, opts = {}) =>
      spawnSync(command, args, {
        encoding: "utf-8",
        ...opts,
      }) as SpawnSyncReturns<string>,

    spawnPassthrough: (command) => {
      spawnSync(command, { shell: true, stdio: "inherit" });
    },

    prompt: (question) =>
      new Promise((resolve) =>
        rl.question(question, (answer) => {
          resolve(answer);
          rl.close();
        }),
      ),

    exit: (code) => process.exit(code) as never,
    log: (...args) => console.log(...args),
    warn: (...args) => console.warn(...args),
    error: (...args) => console.error(...args),
  };
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export async function main(deps: Deps = createRuntimeDeps()): Promise<void> {
  const { exec, spawn, spawnPassthrough, prompt, exit, log, warn, error } =
    deps;

  // Garante que está na develop
  const currentBranch = exec("git rev-parse --abbrev-ref HEAD");
  if (currentBranch !== "develop") {
    error(
      `❌ Você precisa estar na branch 'develop' (atual: ${currentBranch})`,
    );
    exit(1);
  }

  // Garante working tree limpo
  const diffUnstaged = spawn("git", ["diff", "--quiet"], { shell: true });
  const diffStaged = spawn("git", ["diff", "--cached", "--quiet"], {
    shell: true,
  });

  if (diffUnstaged.status !== 0 || diffStaged.status !== 0) {
    error(
      "❌ Working tree sujo. Faça commit ou stash antes de iniciar a release.",
    );
    exit(1);
  }

  log("🔍 Calculando próxima versão com standard-version (dry-run)...");

  // Pega próxima versão SEM modificar nada (apenas leitura)
  const dryRunOutput = spawn("npx", ["standard-version", "--dry-run"], {
    shell: true,
  });
  const dryRunText = `${dryRunOutput.stdout ?? ""}${dryRunOutput.stderr ?? ""}`;

  const suggestedVersion = extractVersionFromDryRun(dryRunText);

  let finalVersion: string;

  if (!suggestedVersion) {
    warn("⚠️  Não foi possível determinar a próxima versão automaticamente.");
    warn("📝 Por favor, informe a versão manualmente.");
    finalVersion = await promptCustomVersion(deps);
    log(`✅ Usando versão: ${finalVersion}`);
  } else {
    log(`\n📦 Versão sugerida: ${suggestedVersion}\n`);
    const confirm = await prompt("✅ Confirma essa versão? (s/N): ");

    if (/^[sS]$/.test(confirm)) {
      finalVersion = suggestedVersion;
    } else {
      finalVersion = await promptCustomVersion(deps);
      log(`✅ Usando versão customizada: ${finalVersion}`);
    }
  }

  // Garante que working tree continua limpo após dry-run
  spawnPassthrough("git clean -fd");

  log(`\n🚀 Iniciando git flow release start ${finalVersion}...`);
  spawnPassthrough(`git flow release start ${finalVersion}`);

  log("\n🔍 Previsualizando changelog que será gerado...");
  const changelogPreview = spawn(
    "npx",
    ["standard-version", "--dry-run", "--release-as", finalVersion],
    { shell: true },
  );

  const previewText = `${changelogPreview.stdout ?? ""}${changelogPreview.stderr ?? ""}`;
  log(previewText.split("\n").slice(0, 50).join("\n"));

  const changelogConfirm = await prompt(
    "\n✅ O changelog está correto? (s/N): ",
  );

  if (!/^[sS]$/.test(changelogConfirm)) {
    error("❌ Release cancelada. Execute o comando abaixo para desfazer:");
    error(`   git flow release delete ${finalVersion}`);
    exit(1);
  }

  log("\n🔧 Aplicando versão e gerando changelog...");
  spawnPassthrough(
    `npx standard-version --skip.tag --release-as ${finalVersion}`,
  );

  log(`\n✅ Commit de versão criado na release/${finalVersion}`);
  log("\n📌 Próximos passos:");
  log(
    `  1. Opcionalmente, faça push: git push -u origin release/${finalVersion}`,
  );
  log(`  2. Revise / teste na release/${finalVersion}`);
  log(
    `  3. Quando estiver ok, finalize com: git flow release finish ${finalVersion}`,
  );
}

// ─── Entrypoint (só executa quando rodado diretamente) ───────────────────────

const isRunDirectly =
  typeof process !== "undefined" &&
  process.argv[1] === fileURLToPath(import.meta.url);

if (isRunDirectly) {
  main().catch((err) => {
    console.error("❌ Erro inesperado:", err);
    process.exit(1);
  });
}
