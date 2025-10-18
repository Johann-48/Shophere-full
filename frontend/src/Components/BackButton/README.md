# BackButton Component

Componente de botão "Voltar" bonito, animado e interativo para navegação.

## 🎨 Características

- ✨ **Animações suaves** com Framer Motion
- 🎭 **3 variantes de estilo**: primary, secondary, minimal
- 🌓 **Suporte para Dark/Light Mode**
- ♿ **Acessível** com suporte a teclado e focus ring
- 📱 **Responsivo** e adaptável

## 📦 Uso

```jsx
import BackButton from '../BackButton';

// Voltar para página anterior
<BackButton />

// Navegar para rota específica
<BackButton to="/home" />

// Com label personalizado
<BackButton label="Voltar ao início" />

// Variante secondary
<BackButton variant="secondary" />

// Variante minimal
<BackButton variant="minimal" />

// Classes adicionais
<BackButton className="mt-4" />
```

## 🔧 Props

| Prop | Tipo | Padrão | Descrição |
|------|------|--------|-----------|
| `to` | `string` | `undefined` | Rota específica para navegar. Se omitido, usa `navigate(-1)` |
| `label` | `string` | `"Voltar"` | Texto do botão |
| `variant` | `"primary"` \| `"secondary"` \| `"minimal"` | `"primary"` | Estilo visual |
| `className` | `string` | `""` | Classes CSS adicionais |

## 🎨 Variantes

### Primary
- Gradiente azul/roxo
- Borda colorida com efeito hover
- Sombra pronunciada
- **Uso**: Ação principal de navegação

### Secondary
- Background do tema atual
- Borda sutil
- Sombra moderada
- **Uso**: Ação secundária

### Minimal
- Background transparente
- Apenas hover sutil
- Sem sombra
- **Uso**: Navegação discreta

## 🎬 Animações

- **Entrada**: Fade + slide da esquerda
- **Hover**: Move 4px para esquerda
- **Click**: Scale down (95%)
- **Ícone**: Animação de "pulso" contínua

## 🌐 Exemplos Reais

```jsx
// Página de produto
<BackButton />

// Voltar para login
<BackButton to="/login" label="Voltar para o login" variant="minimal" />

// Erro 404
<BackButton to="/" label="Voltar ao início" variant="secondary" />
```

## 🔄 Substituição em Massa

Este componente foi criado para substituir todos os botões "Voltar" simples do projeto:

**Antes:**
```jsx
<button onClick={() => navigate(-1)}>
  <FaArrowLeft /> Voltar
</button>
```

**Depois:**
```jsx
<BackButton />
```

## 🎯 Componentes Atualizados

- ✅ Product
- ✅ Commerce
- ✅ CompareProduct
- ✅ ForgotPassword
- ✅ ResetPassword
- ✅ Seller
- ✅ PrivacyPolicy (próximo)
- ✅ TermsOfService (próximo)
