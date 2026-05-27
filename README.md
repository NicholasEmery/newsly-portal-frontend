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

Use apenas arquivos locais no repositório para desenvolvimento:

- `.env.local` ou `.env.development.local` (não versionados)
- `.env.example` como referência de estrutura

Para staging e produção, não mantenha arquivos de segredo no repositório;
defina as variáveis no provedor de deploy (Vercel, Docker, Kubernetes
secrets, etc.).

### Tags de ambiente

O frontend agora entende duas dimensões:

- `NEWSLY_ENV`: `development` ou `production`
- `NEXT_PUBLIC_NEWSLY_DEPLOYMENT_TARGET`: `local` ou `docker`

As variáveis críticas podem ser duplicadas por tag:

- `NEXT_PUBLIC_API_URL_LOCAL` / `NEXT_PUBLIC_API_URL_DOCKER`
- `NEXT_PUBLIC_APP_ORIGIN_LOCAL` / `NEXT_PUBLIC_APP_ORIGIN_DOCKER`
- `NEXT_PUBLIC_NEWSLY_DATA_SOURCE_LOCAL` / `NEXT_PUBLIC_NEWSLY_DATA_SOURCE_DOCKER`

Se a versão tagueada não existir, o código ainda aceita as variáveis
legadas sem sufixo.

### Variável de alternância de fonte de dados

`NEWSLY_DATA_SOURCE` é usada apenas em desenvolvimento (via
`resolveDataSourceMode()`); ela não aparece em `routes.ts` porque não
há lógica de rota dependente dela. As rotas internas consomem a fonte
resolvida ao decidir se retornam mocks ou proxy para a API.

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
O ambiente é determinado principalmente por `NODE_ENV` e
`NEWSLY_ENV`. Em termos de política:

- `development`: permite `api`, `mock` ou `auto`
- `production`: força `api` e nunca usa mocks

### Dev Local

- Front local + backend local:
  - `NEXT_PUBLIC_NEWSLY_DEPLOYMENT_TARGET=local`
  - `NEXT_PUBLIC_API_URL_LOCAL=http://localhost:3333`
  - `NEXT_PUBLIC_APP_ORIGIN_LOCAL=http://localhost:3000`
- Front em Docker + backend local:
  - `NEXT_PUBLIC_NEWSLY_DEPLOYMENT_TARGET=docker`
  - `NEXT_PUBLIC_API_URL_DOCKER=http://localhost:3333`
  - `NEXT_PUBLIC_APP_ORIGIN_DOCKER=http://localhost:3000`
- Opcional:
  - `NEXT_PUBLIC_NEWSLY_DATA_SOURCE_LOCAL=auto`
  - `NEXT_PUBLIC_NEWSLY_DATA_SOURCE_DOCKER=auto`

### Staging

- `NEWSLY_ENV=staging`
- `NEXT_PUBLIC_NEWSLY_DEPLOYMENT_TARGET=docker`
- `NEXT_PUBLIC_API_URL_DOCKER=http://localhost:3333`
- `NEXT_PUBLIC_APP_ORIGIN_DOCKER=https://newsly.nicholasemery.dev`
- `NEXT_PUBLIC_NEWSLY_DATA_SOURCE_DOCKER=api`
- Use HTTPS em tudo
- Defina no provedor de deploy (não criar `.env.staging` no repositório)

### Produção

- `NEWSLY_ENV=production`
- `NEXT_PUBLIC_NEWSLY_DEPLOYMENT_TARGET=docker`
- `NEXT_PUBLIC_API_URL_DOCKER=http://localhost:3333`
- `NEXT_PUBLIC_APP_ORIGIN_DOCKER=https://newsly.nicholasemery.dev`
- `NEXT_PUBLIC_NEWSLY_DATA_SOURCE_DOCKER=api`
- Sem HTTP público; somente HTTPS/infra interna confiável
- Defina no provedor (Vercel, Docker, Kubernetes secrets), sem `.env.production` no repositório

### Checklist de deploy (staging e produção)

Antes de publicar, valide no provedor:

- [ ] `NEWSLY_ENV` definido como `staging` ou `production`
- [ ] `NEXT_PUBLIC_NEWSLY_DEPLOYMENT_TARGET` definido como `local` ou `docker`
- [ ] `NEXT_PUBLIC_API_URL_*` definido e apontando para a API correta do ambiente
- [ ] `NEXT_PUBLIC_APP_ORIGIN_*` definido com a URL pública correta do frontend
- [ ] `NEXT_PUBLIC_NEWSLY_DATA_SOURCE_*` definido como `api` na produção
- [ ] Todas as URLs em HTTPS
- [ ] Não existe arquivo `.env.staging` ou `.env.production` versionado no repositório

### Exemplos rápidos

- Front local + mock interno:
  - `NEXT_PUBLIC_NEWSLY_DEPLOYMENT_TARGET=local`
  - `NEXT_PUBLIC_NEWSLY_DATA_SOURCE_LOCAL=mock`
- Front local + backend local:
  - `NEXT_PUBLIC_NEWSLY_DEPLOYMENT_TARGET=local`
  - `NEXT_PUBLIC_NEWSLY_DATA_SOURCE_LOCAL=api`
  - `NEXT_PUBLIC_API_URL_LOCAL=http://localhost:3333`
- Front local + backend local:
  - `NEXT_PUBLIC_NEWSLY_DEPLOYMENT_TARGET=docker`
  - `NEXT_PUBLIC_NEWSLY_DATA_SOURCE_DOCKER=api`
  - `NEXT_PUBLIC_API_URL_DOCKER=http://localhost:3333`
- Front em staging + API staging:
  - definir `NEWSLY_ENV=production`, `NEXT_PUBLIC_NEWSLY_DEPLOYMENT_TARGET=docker`, `NEXT_PUBLIC_API_URL_DOCKER` e `NEXT_PUBLIC_APP_ORIGIN_DOCKER`

### **Painel Administrativo**

- **Gestão de Conteúdo**: Ferramentas completas para criar, editar e excluir notícias.
- **Gestão de Usuários**: Controle de acessos e permissões para diferentes tipos de usuários.
- **Monitoramento de Desempenho**: Relatórios sobre visualizações, interações e engajamento.

---

## 📦 Como Contribuir

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
