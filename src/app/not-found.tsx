import { AppShell } from "@/app/AppShell";
import { NotFoundLottie } from "@/app/components/client/NotFoundLottie";
import SystemStatusPanel from "@/app/components/server/SystemStatusPanel";

export default function NotFound() {
  return (
    <AppShell>
      <main className="w-full flex items-center justify-center px-4 md:px-6 py-4 md:py-6 overflow-hidden">
        <SystemStatusPanel
          badge="Conteúdo não encontrado"
          title="A página que você tentou acessar não está disponível."
          description="O endereço pode ter sido alterado, removido ou não existir mais no momento."
          secondaryDescription="Você pode voltar para a página inicial e continuar navegando pelas últimas notícias."
          actionHref="/"
          actionLabel="Ir para a página inicial"
          illustration={<NotFoundLottie className="max-h-60 md:max-h-84" />}
        />
      </main>
    </AppShell>
  );
}
