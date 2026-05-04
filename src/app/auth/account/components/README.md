# Componentes de Autenticação (Auth Account Page)

Estrutura hierárquica de componentes para a página de login/signup (`src/app/auth/account/page.tsx`).

## Arquitetura de Componentes

```
Page (page.tsx)
└── BackgroundGradients (elementos decorativos de fundo)
└── AuthContainer
    ├── AuthContent
    │   ├── AuthHeader
    │   │   ├── LogoBadge
    │   │   └── HeaderActions (ThemeModeBtn, LanguageSelector, HomeLink)
    │   ├── TitleSection (títulos e subtítulos)
    │   ├── AuthModeTabs (aba Login/Signup)
    │   ├── AuthForm
    │   │   ├── FormField (fullName, email)
    │   │   ├── PasswordField (com toggle de visibilidade)
    │   │   ├── ForgotPasswordLink (apenas login)
    │   │   ├── TermsCheckbox (apenas signup)
    │   │   ├── SubmitButton
    │   │   ├── SubmitStatus
    │   │   ├── GoogleDivider
    │   │   └── GoogleButton
    │   ├── AuthModeSwitchLink (switch entre login/signup)
    │   └── MobileOnboarding (visível apenas mobile)
    └── DesktopOnboarding (aside - visível apenas desktop)
```

## Componentes Básicos (Leaf Nodes)

### `BackgroundGradients.tsx`
Renders decorative gradient blurs in the background.

### `LogoBadge.tsx`
Branded badge com "Newsly Portal".

### `HeaderActions.tsx`
Group de ações: tema, idioma e botão home.

### `TitleSection.tsx`
Título principal e subtítulo da página.

### `AuthModeTabs.tsx`
Tabs para alternar entre login e signup com animação de slider.

### `FormField.tsx`
Componente genérico de input com suporte a react-hook-form.
- Funciona com `register()` spread
- Exibe erros de validação
- Estilos compartilhados

### `PasswordField.tsx`
Input de senha com toggle de visibilidade.
- Inclui `PasswordEyeToggle`
- Responde a `visible` e `onToggleVisibility`

### `ForgotPasswordLink.tsx`
Link "Esqueceu a senha?" (apenas login).

### `TermsCheckbox.tsx`
Checkbox com links para Termos e Privacidade (apenas signup).

### `SubmitButton.tsx`
Botão de envio com estados:
- Loading (spinner)
- Error (fundo vermelho com shake)
- Normal

### `SubmitStatus.tsx`
Mensagem de sucesso/erro após submissão.

### `GoogleDivider.tsx`
Divider com texto "Ou continuar com".

### `GoogleButton.tsx`
Botão de login com Google.

### `AuthModeSwitchLink.tsx`
Link para alternar entre login/signup com texto dinâmico.

### `MobileOnboarding.tsx`
Seção de onboarding visível apenas em mobile (lg:hidden).

### `DesktopOnboarding.tsx`
Aside de onboarding com gradiente azul (hidden até lg).

## Componentes Compostos

### `AuthHeader.tsx`
Combina `LogoBadge` + `HeaderActions`.

### `AuthForm.tsx`
Formulário completo que compõe:
- Campos de entrada (FormField, PasswordField, TermsCheckbox)
- Ações (ForgotPasswordLink, SubmitButton, SubmitStatus)
- Divisor e Google button
- Responsivo baseado no modo (login/signup)

**Props principais:**
- `register`, `watch`, `errors` (react-hook-form)
- `mode`: "login" | "signup"
- `isPasswordVisible`, `isConfirmPasswordVisible`: estado de visibilidade
- `isSubmitEnabled`: controla se botão pode ser clicado
- `validationPulse`: ativa animação de erro

### `AuthContent.tsx`
Conteúdo da seção esquerda combinando:
- AuthHeader
- TitleSection
- AuthModeTabs
- AuthForm
- AuthModeSwitchLink
- MobileOnboarding

### `AuthContainer.tsx`
Container principal que combina:
- AuthContent (lado esquerdo, 54% em lg)
- DesktopOnboarding (lado direito, 46% em lg)
- Animação de entrada (fade + slide up)
- Estilos de border/shadow/rounded

### `LoginPage` (page.tsx)
Page component que:
- Gerencia estado com `useState`
- Setup react-hook-form com schemas de validação
- Passes props para AuthContainer
- Renderiza BackgroundGradients e AuthContainer dentro de `<main>`

## Padrões e Convenções

### React Hook Form Integration
```tsx
// No componente pai (page.tsx)
const { register, watch, handleSubmit, ... } = useForm<AuthFormData>({...})

// Passado para componentes filhos
<FormField {...register("email")} />
<TermsCheckbox {...register("acceptTerms")} />
```

### Modo Condicionado
Muitos componentes renderizam conteúdo diferente baseado em `mode`:
```tsx
{isLogin ? <ForgotPasswordLink /> : <TermsCheckbox />}
```

### Internacionalização
Todos os textos usam `useTranslations("auth")` para i18n.

### Tailwind Classes
- Classes de base reutilizáveis em `inputBaseClass`
- Estados de erro com cores vermelhas
- Dark mode suportado em todos os componentes
- Breakpoints responsivos (lg:)

## Vantagens da Arquitetura

1. **Separação de Responsabilidades**: Cada componente tem um único propósito
2. **Reutilização**: FormField, PasswordField podem ser usados em outros lugares
3. **Testabilidade**: Componentes pequenos são mais fáceis de testar
4. **Manutenibilidade**: Mudanças isoladas em componentes específicos
5. **Escalabilidade**: Fácil adicionar novos campos ou seções
6. **Performance**: Componentes podem ser memoizados individuamente se necessário

## Melhorias Futuras

- [ ] Memoizar componentes puros com `React.memo()`
- [ ] Extrair estilos para `const styles` ou arquivo CSS
- [ ] Adicionar more validation messages
- [ ] Criar variações (loading states, skeleton screens)
- [ ] Adicionar testes unitários por componente
