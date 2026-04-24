# 🎨 BarberSim - APP

Interface web moderna para o sistema de gestão de barbearia. Desenvolvida com React e Vite para máxima performance.

## ⚙️ Stack Técnico

- **Framework**: React 18+
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Gerenciador de Pacotes**: npm
- **Linting**: ESLint

## 🎯 Funcionalidades Principais

✨ Interface responsiva e moderna  
📱 Compatível com desktop e mobile  
⚡ Carregamento rápido com Vite  
🎯 Agendamentos de clientes  
📊 Dashboard de barbeiros  
🔐 Autenticação de administrador  

## 🚀 Como Executar

### Requisitos
- Node.js 16+
- npm ou yarn

### Instalação e Desenvolvimento

```bash
# Clonar repositório
git clone https://github.com/Lopes-V/APP-PROJETO_BARBEARIA.git
cd APP-PROJETO_BARBEARIA

# Instalar dependências
npm install

# Executar servidor de desenvolvimento
npm run dev

# A aplicação abrirá em http://localhost:5173
```

### Build para Produção

```bash
npm run build
npm run preview  # Pré-visualizar build de produção
```

## 📁 Estrutura do Projeto

```
src/
├── components/      # Componentes React reutilizáveis
├── pages/          # Páginas/rotas principais
├── assets/         # Imagens e ícones
├── styles/         # Estilos globais
└── App.jsx         # Componente raiz

public/assets/      # Arquivos estáticos
```

## 🎨 Estilização

- **Tailwind CSS**: Utility-first CSS framework
- Configuração em `tailwind.config.js`
- Classes customizadas disponíveis

## 🔧 Scripts Disponíveis

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Inicia servidor de desenvolvimento |
| `npm run build` | Build para produção |
| `npm run preview` | Pré-visualiza build |
| `npm run lint` | Executa ESLint |

## 🔗 Conectar com API

Configure a URL da API em um arquivo `.env`:

```env
VITE_API_URL=http://localhost:8080/api
```

Use em seus componentes:
```javascript
const API_URL = import.meta.env.VITE_API_URL;
```

## 📦 Dependências Principais

- **React**: UI library
- **Vite**: Build tool rápido
- **Tailwind CSS**: Styling
- **ESLint**: Code quality

## 📝 Notas

- HMR (Hot Module Replacement) ativado por padrão
- ESLint pode ser customizado no `eslint.config.js`
- Para produção, considere usar React Compiler (veja documentação oficial)

---

**Repositório**: [APP-PROJETO_BARBEARIA](https://github.com/Lopes-V/APP-PROJETO_BARBEARIA)
