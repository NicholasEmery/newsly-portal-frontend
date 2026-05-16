# GitHub Actions - frontend

O repositório `newsly-portal-frontend` usa um workflow para notificar o orchestrator quando houver push em `main`.

Requisitos antes de ativar CI completo:

- Secret `ORCHESTRATOR_PAT`: token pessoal (ou token de máquina) com permissão para `repo` no repositório `newsly-portal-orchestrator` ou permissão para `repo:dispatch` (GitHub App / PAT). Coloque este valor em Settings → Secrets → Actions com o nome `ORCHESTRATOR_PAT`.
- Runner self-hosted disponível para o `orchestrator` (não é necessário rodar o runner aqui).

Notas operacionais:
- O workflow que chama o orchestrator está em `.github/workflows/notify-orchestrator.yml`.
- O token em `ORCHESTRATOR_PAT` deve ser criado por um usuário/UUID com permissão para disparar `repository_dispatch` no repositório alvo.

Como testar localmente:
- Fazer um push de teste para `main` (ou disparo manual do workflow) e verificar se o orchestrator recebeu o evento.
