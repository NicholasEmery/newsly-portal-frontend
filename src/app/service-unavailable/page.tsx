import { NotFoundLottie } from "@/app/components/client/NotFoundLottie";
import SystemStatusPanel from "@/app/components/server/SystemStatusPanel";
import { cookies } from "next/headers";
import { ServiceUnavailableReasonSchema } from "@/api/schemas/system";

export const dynamic = "force-dynamic";

export default async function ServiceUnavailablePage() {
  // Lê reason do cookie
  const cookieStore = await cookies();
  const cookieReason = cookieStore.get("serviceUnavailableReason")?.value;

  // Validação de reason com Zod
  const isValidReason =
    cookieReason &&
    ServiceUnavailableReasonSchema.safeParse(cookieReason).success;
  let resolvedReason = cookieReason;

  // Fallback: se não houver motivo válido, mostra conteúdo especial
  if (!isValidReason) {
    return (
      <main className="w-full min-h-dvh flex items-center justify-center px-6 py-10 bg-gray-50 dark:bg-gray-800">
        <SystemStatusPanel
          badge="Cookies necessários"
          title="Não foi possível identificar o motivo da indisponibilidade."
          description="Para acessar esta página, habilite cookies no seu navegador."
          secondaryDescription="Se o problema persistir, entre em contato com o suporte."
          actionHref="/"
          actionLabel="Ir para home"
          illustration={<NotFoundLottie />}
        />
      </main>
    );
  }

  const contentByReason = {
    "api-unavailable": {
      badge: "Ops, algo inesperado aconteceu",
      title: "Não conseguimos concluir o carregamento desta página agora.",
      description:
        "Encontramos uma instabilidade temporária durante a solicitação. Nossa equipe já está monitorando o comportamento para restabelecer a navegação completa o quanto antes.",
      secondaryDescription:
        "Você pode tentar novamente em alguns instantes para continuar lendo as últimas atualizações.",
      actionLabel: "Tentar novamente",
    },
  } as const;

  const devContentByReason = {
    "mock-directory-missing-dev": {
      badge: "Mocks ausentes no projeto",
      title: "A pasta src/mocks não foi encontrada neste ambiente local.",
      description:
        "Para usar fallback local, restaure a pasta src/mocks com os arquivos esperados pelo frontend.",
      secondaryDescription:
        "Se preferir seguir sem mocks, use NEWSLY_DATA_SOURCE=api e garanta que a API esteja disponível.",
      actionLabel: "Voltar para home",
    },
    "datasource-env-missing-dev": {
      badge: "Configuração pendente em desenvolvimento",
      title: "Defina a variável de fonte de dados para continuar.",
      description:
        "No ambiente local/dev, informe NEWSLY_DATA_SOURCE (ou NEXT_PUBLIC_NEWSLY_DATA_SOURCE) com api, mock ou auto.",
      secondaryDescription:
        "Sem essa configuração explícita, o frontend não consegue decidir a estratégia de carregamento para a home.",
      actionLabel: "Voltar para home",
    },
    "api-unavailable-use-mocks": {
      badge: "Backend indisponível no ambiente local",
      title: "A API não respondeu, mas existem dados mock disponíveis.",
      description:
        "Para continuar o desenvolvimento, altere a fonte de dados para mock ou auto (NEWSLY_DATA_SOURCE=mock|auto).",
      secondaryDescription:
        "Após ajustar a variável de ambiente, reinicie o frontend para aplicar o novo modo.",
      actionLabel: "Voltar para home",
    },
    "api-and-mock-unavailable": {
      badge: "Sem fonte de dados disponível",
      title: "Não foi possível continuar: API indisponível e mocks ausentes.",
      description:
        "No ambiente de desenvolvimento, você precisa de pelo menos uma fonte de dados ativa para carregar o frontend.",
      secondaryDescription:
        "Conecte o backend ou adicione mocks locais antes de tentar novamente.",
      actionLabel: "Voltar para home",
    },
  } as const;

  const content =
    devContentByReason[resolvedReason as keyof typeof devContentByReason] ??
    contentByReason[resolvedReason as keyof typeof contentByReason] ??
    contentByReason["api-unavailable"];

  return (
    <main className="w-full min-h-dvh flex items-center justify-center px-6 py-10 bg-gray-50 dark:bg-gray-800">
      <SystemStatusPanel
        badge={content.badge}
        title={content.title}
        description={content.description}
        secondaryDescription={content.secondaryDescription}
        actionHref="/"
        actionLabel={content.actionLabel}
        illustration={<NotFoundLottie />}
      />
    </main>
  );
}
