# Newsly - Portal de Notícias

**Newsly** é um portal de notícias moderno e funcional, desenvolvido com o objetivo de demonstrar minhas habilidades e conhecimentos na criação de aplicações full-stack. Utilizando **React** no frontend, **Node.js** no backend e **MongoDB** como banco de dados, o **Newsly** oferece uma experiência intuitiva para criação, visualização, edição e exclusão de notícias.

Este projeto também abrange minha experiência em áreas como **deploy** com **Render**, automação de testes com **Cypress** e **GitHub Actions**, garantindo um fluxo contínuo de integração e entrega. No design, utilizei **Figma** para a prototipação e **Photoshop** para a criação de elementos visuais, garantindo uma interface moderna e atraente.

**Newsly** foi concebido como uma plataforma para demonstrar minha capacidade de trabalhar com as tecnologias mais populares do mercado, integrando práticas de desenvolvimento, design e operações, além de ser uma excelente referência para quem busca entender o processo de construção de uma aplicação web completa e robusta.

---

## 🚀 Funcionalidades

### **Funcionalidades Básicas**

1. **Página Inicial Bem Organizada**
   - Exibição das principais notícias em destaque, como carrossel ou grid.
   - Categorias bem definidas, como Esportes, Política, Economia.
   - Notícias recentes ou em destaque para facilitar a navegação.

2. **Gestão de Conteúdo (CMS)**
   - Área administrativa para criar, editar e excluir notícias.
   - Upload de imagens e vídeos nas postagens.
   - Agendamento de publicações para controle total sobre o conteúdo.

3. **Busca Interna**
   - Pesquisa eficiente por títulos, palavras-chave ou categorias.
   - Sugestões de autocompletar para facilitar a busca de conteúdo.

4. **Sistema de Categorias e Tags**
   - Organização do conteúdo por temas, como Tecnologia, Cultura, Política.
   - Tags para agrupar notícias relacionadas, facilitando a navegação.

5. **Sistema de Comentários**
   - Leitores podem deixar comentários nas notícias, promovendo a interação.
   - Moderação de comentários para garantir conteúdo apropriado.

### **Funcionalidades Avançadas**

6. **Autenticação de Usuários**
   - Registro e login de usuários com diferentes permissões (leitor, editor, administrador).
7. **Personalização para Usuários**
   - Usuários podem seguir categorias ou autores favoritos.
   - Recebimento de notificações sobre novos conteúdos de interesse.

8. **Notificações e Newsletters**
   - Inscrição para newsletters, permitindo atualizações periódicas.
   - Notificações push no navegador ou por e-mail.

9. **Sistema de Anúncios**
   - Integração com plataformas como Google AdSense para exibição de anúncios.
   - Controle de banners publicitários para administradores.

10. **SEO Integrado**
    - Otimização automática de URLs, títulos e descrições para melhorar a visibilidade nos motores de busca.
    - Compatibilidade com metadados e Open Graph.

### **Funcionalidades para Engajamento**

11. **Compartilhamento Social**
    - Botões para compartilhar notícias nas principais redes sociais (Facebook, Twitter, WhatsApp).

12. **Sistema de Curtidas**
    - Usuários podem curtir ou reagir às notícias, destacando as mais populares.

13. **Sessão de Artigos Relacionados**
    - Sugestões de conteúdos similares ao final de cada notícia.

14. **Sessão de Opinião ou Blogs**
    - Colunistas ou blogueiros com artigos regulares.
    - Comentários e engajamento exclusivo para essa seção.

### **Funcionalidades Técnicas**

15. **Desempenho e Responsividade**
    - Design responsivo para garantir boa experiência em dispositivos móveis.
    - Carregamento rápido de páginas e mídia.

16. **Integração com APIs de Notícias**
    - Consome dados de fontes externas, como Google News ou RSS Feeds.

17. **Segurança**
    - Certificado SSL para tráfego seguro.
    - Prevenção de SPAM nos comentários e controle de acesso nas áreas administrativas.

18. **Análises e Relatórios**
    - Ferramentas de análise para medir visualizações e taxa de engajamento.

### **Funcionalidades Extras (Diferenciais)**

19. **Vídeos e Podcasts**
    - Sessão para vídeos, entrevistas e transmissões ao vivo.
    - Integração com plataformas como YouTube ou Spotify.

20. **Mapas Interativos**
    - Exibição de notícias geolocalizadas, como eventos e incidentes.

21. **Modo Escuro**
    - Alternância entre o modo claro e escuro, oferecendo uma experiência visual mais confortável.

22. **Pesquisa Avançada**
    - Filtros por data, relevância e autor para uma busca mais eficiente.

23. **Área Premium/Assinaturas**
    - Acesso a notícias exclusivas para assinantes.

---

## ⚙️ Configuração de Ambientes (API + Mock)

Use apenas o arquivo local no repositório:

- `.env.local` (NODE_ENV/NEWSLY_ENV e, em dev, `NEWSLY_DATA_SOURCE`)

Para staging e produção, não haja nenhum arquivo no repositório; defina
as variáveis no provedor de deploy (Vercel, Docker, Kubernetes secrets,
etc.).

### Variável de alternância de fonte de dados

`NEWSLY_DATA_SOURCE` é usada apenas em desenvolvimento local (via
`resolveDataSourceMode()`); ela não aparece em `routes.ts` porque não
há lógica de rota dependente dela. As rotas internas consomem essa
variável ao decidir se retornam mocks ou proxy para a API.

- `api`: front end solicita dados ao backend real; os endpoints `/api/sections/*` atuam como proxy para a API externa
- `mock`: as rotas internas devolvem conjuntos de mock estáticos, sem fazer nenhuma chamada externa
- `auto`: tenta a API externa e, em caso de falha, retorna mocks (comportamento idêntico ao modo `mock`)

### Arquitetura de obtenção de dados

- **Componentes e páginas não importam mocks diretamente.** Todos os dados são solicitados via serviços ou, preferencialmente, através de rotas internas sob `/api/`.
- **Rotas internas (`/api/sections/*` etc.)** fazem a decisão de fonte: consultam `NEWSLY_DATA_SOURCE`/`resolveDataSourceMode()` e devolvem mocks ou encaminham a requisição ao backend externo usando `axios` (via helper `requestJson`).
- **Serviços** (ex. `getHomeSections` em `src/api/services`) simplesmente chamam essas rotas usando `requestJson` e não se preocupam com modo de dados.
- Essa separação facilita:
  1. Trocar entre mock e API sem tocar em componentes.
  2. Tree-shaking eliminar mocks do bundle de produção.
  3. Testar o comportamento de fonte de dados variando apenas a variável de ambiente.

**Observação:** o utilitário `src/api/mocks.ts` agora checa por **ambas** as pastas `src/mock-data` (preferida) e `src/mocks` (legacy).

- Em dev, se nenhuma das duas existir, o frontend considera que não há dados mock disponíveis e mostrará a tela de serviço indisponível/aviso apropriado.
- Durante o build, a ausência de mocks não trava a geração de páginas; o sistema injeta dados placeholder mínimos para satisfazer os schemas.

Por isso você pode apagar `src/mocks` quando quiser: os arquivos verdadeiros de mock são mantidos em `src/mock-data`.
O ambiente é determinado principalmente por `NODE_ENV` (seguido
por `NEXT_PUBLIC_NEWSLY_ENV`/`NEWSLY_ENV` apenas enquanto a variável
legada estiver em uso). Em termos de política:

- `local`/`development`: permite `api`, `mock` ou `auto`
- `staging`: força `api` (não permite mock e não requer `NEWSLY_DATA_SOURCE`)
- `production`: força `api` (não permite mock e não requer `NEWSLY_DATA_SOURCE`)

### Dev Local

- Front local + rotas fictícias internas:
  - `NEXT_PUBLIC_API_URL=http://localhost:3000`
- Front local + backend externo local:
  - `NEXT_PUBLIC_API_URL=http://localhost:3001`
- Opcional:
  - `NEXT_PUBLIC_APP_ORIGIN=http://localhost:3000`
- Arquivo:
  - `.env.local`

### Staging

- `NEWSLY_ENV=staging`
- `NEXT_PUBLIC_API_URL=https://api-staging.seudominio.com`
- `NEXT_PUBLIC_APP_ORIGIN=https://staging.seudominio.com`
- não definir `NEWSLY_DATA_SOURCE`
- Use HTTPS em tudo
- Defina no provedor de deploy (não criar `.env.staging` no repositório)

### Produção

- `NEWSLY_ENV=production`
- `NEXT_PUBLIC_API_URL=https://api.seudominio.com`
- `NEXT_PUBLIC_APP_ORIGIN=https://www.seudominio.com`
- não definir `NEWSLY_DATA_SOURCE`
- Sem HTTP público; somente HTTPS/infra interna confiável
- Defina no provedor (Vercel, Docker, Kubernetes secrets), sem `.env.production` no repositório

### Checklist de deploy (staging e produção)

Antes de publicar, valide no provedor:

- [ ] `NEWSLY_ENV` definido como `staging` ou `production`
- [ ] `NEXT_PUBLIC_API_URL` definido e apontando para a API correta do ambiente
- [ ] `NEXT_PUBLIC_APP_ORIGIN` definido com a URL pública correta do frontend
- [ ] `NEWSLY_DATA_SOURCE` não definido
- [ ] Todas as URLs em HTTPS
- [ ] Não existe arquivo `.env.staging` ou `.env.production` versionado no repositório

### Exemplos rápidos

- Front local + mock interno:
  - `NEWSLY_DATA_SOURCE=mock`
  - `NEXT_PUBLIC_API_URL=http://localhost:3000`
- Front local + backend local:
  - `NEWSLY_DATA_SOURCE=api`
  - `NEXT_PUBLIC_API_URL=http://localhost:3001`
- Front em staging + API staging:
  - definir apenas `NEWSLY_ENV=staging`, `NEXT_PUBLIC_API_URL` e `NEXT_PUBLIC_APP_ORIGIN`

### **Painel Administrativo**

- **Gestão de Conteúdo**: Ferramentas completas para criar, editar e excluir notícias.
- **Gestão de Usuários**: Controle de acessos e permissões para diferentes tipos de usuários.
- **Monitoramento de Desempenho**: Relatórios sobre visualizações, interações e engajamento.

---

## � Sincronização de secrets com o orquestrador

O frontend usa um script local para enviar o conteúdo do `.env` para o Environment do repositório orquestrador. O segredo nunca fica hardcoded no script: ele é lido de `ORCHESTRATOR_PAT` no ambiente.

### Pré-requisitos

- Environment com nome exato `Environments Frontend` no repositório `newsly-portal-orchestrator`
- `ORCHESTRATOR_PAT` com permissão para gerenciar secrets do repositório alvo
- Node.js instalado

### Comandos

```powershell
$env:ORCHESTRATOR_PAT = 'seu_token'
npm run sync:secrets
```

Para forçar o envio mesmo quando o hash do `.env` não mudou:

```powershell
npm run sync:secrets -- --save
```

### Hook local

O repositório usa `.git/hooks/pre-push` para chamar `node scripts/syncSecrets.js` antes de qualquer push.

## �📦 Como Contribuir

Os usuários podem contribuir com **sugestões** e **feedback** diretamente no repositório GitHub, **através de Issues**. Para sugerir melhorias ou relatar problemas, por favor, siga as etapas abaixo:

1. Acesse a aba de **Issues** no repositório.
2. Crie uma nova **Issue** com o título claro e descrição detalhada da sugestão ou problema.
3. Discuta suas sugestões ou problemas nos comentários da **Issue**.

**Importante**: Não é permitido clonar, modificar, alterar, redistribuir ou utilizar este projeto, no todo ou em parte, para qualquer outra finalidade além de sugestões e feedback.

---

## 📝 Licença

Este projeto está licenciado sob licença **Todos os Direitos Reservados**.

Para saber mais, consulte o arquivo de licença por [AQUI](./LICENSE).

---

## 📧 Contato

Para dúvidas ou solicitações específicas, entre em contato por [AQUI](mailto:nicholasemery10@gmail.com).
