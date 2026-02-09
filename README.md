<div align="center">

# 💪 EvolveAI

### Seu Personal Trainer com Inteligência Artificial

*Powered by Google Gemini AI*

[![React](https://img.shields.io/badge/React-19.2-61DAFB?logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.2-646CFF?logo=vite)](https://vitejs.dev/)
[![Gemini](https://img.shields.io/badge/Gemini-AI-4285F4?logo=google)](https://ai.google.dev/)

</div>

---

## 🎯 Sobre o Projeto

**EvolveAI** é uma aplicação completa de fitness com inteligência artificial que funciona como seu personal trainer virtual. Utilizando o poder do Google Gemini AI, o app oferece correção de postura em tempo real, geração de treinos personalizados, planos alimentares e muito mais.

### ✨ Funcionalidades Principais

- 🔐 **Autenticação Segura** - Sistema de login com JWT e senha criptografada
- 🎯 **Onboarding Inteligente** - Questionário inicial para personalização completa
- 📸 **Evolução Física** - Compare fotos ao longo do tempo (antes/depois)
- 🧠 **IA com Memória** - A IA lembra do seu perfil, objetivos e lesões
- 🎥 **Coach Ao Vivo** - Correção de postura em tempo real via câmera e IA
- 🏋️ **Gerador de Treinos** - Treinos personalizados baseados em seus objetivos
- 🥗 **Gerador de Dietas** - Planos alimentares customizados
- 📚 **Biblioteca de Exercícios** - Catálogo completo com instruções detalhadas
- 📊 **Acompanhamento de Progresso** - Gráficos e estatísticas da sua evolução
- 💬 **Chat com IA** - Tire dúvidas sobre fitness e nutrição (com contexto do seu perfil)
- 📝 **Meus Treinos** - Salve e gerencie seus treinos favoritos
- 👤 **Perfil Personalizado** - Configure suas metas e preferências

---

## 🚀 Começando

### 📋 Pré-requisitos

- **Node.js** (versão 14 ou superior)
- **npm** ou **yarn**
- **Chave API do Google Gemini** ([Obter aqui](https://ai.google.dev/))

### 📦 Instalação

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/seu-usuario/EvolveAI.git
   cd EvolveAI
   ```

2. **Instale as dependências do Frontend:**
   ```bash
   npm install
   ```

3. **Instale as dependências do Backend:**
   ```bash
   cd backend
   npm install
   cd ..
   ```

4. **Configure as variáveis de ambiente:**
   
   **Frontend** - Crie `.env.local` na raiz:
   ```env
   VITE_API_KEY=sua_chave_gemini_aqui
   ```
   
   **Backend** - Crie `backend/.env`:
   ```env
   JWT_SECRET=sua-chave-secreta-super-segura-123456789
   PORT=3001
   ```

5. **Inicie a aplicação:**
   
   **Opção 1 - Script automático (Windows):**
   ```bash
   start.bat
   ```
   
   **Opção 2 - Manual:**
   ```bash
   # Terminal 1 - Backend
   cd backend
   npm run dev
   
   # Terminal 2 - Frontend
   npm run dev
   ```

6. **Acesse a aplicação:**
   
   - Frontend: [http://localhost:5173](http://localhost:5173)
   - Backend: [http://localhost:3001](http://localhost:3001)

---

## 🛠️ Tecnologias Utilizadas

- **Frontend:**
  - React 19.2
  - TypeScript 5.8
  - React Router DOM 7.10
  - Tailwind CSS
  - Lucide React (ícones)

- **Backend:**
  - Node.js + Express
  - SQLite (better-sqlite3)
  - JWT (jsonwebtoken)
  - Bcrypt (criptografia de senhas)
  - Multer (upload de fotos)

- **IA & APIs:**
  - Google Gemini AI (2.5 Flash)
  - Multimodal Live API (áudio + vídeo)

- **Build & Dev:**
  - Vite 6.2
  - React Markdown
  - Recharts (gráficos)

---

## 📱 Funcionalidades Detalhadas

### 🔐 Sistema de Autenticação
- Registro com email e senha
- Login seguro com JWT
- Senha criptografada com bcrypt
- Token com validade de 30 dias
- Logout seguro

### 🎯 Onboarding Inteligente (Primeira Vez)
Quando você cria uma conta, passa por 3 etapas:

**Etapa 1 - Informações Básicas:**
- Nome, idade, gênero
- Peso e altura

**Etapa 2 - Objetivos:**
- Objetivo principal (ganhar massa, perder peso, etc.)
- Nível de atividade física
- Equipamentos disponíveis
- Lesões ou limitações
- Restrições alimentares

**Etapa 3 - Fotos de Referência:**
- Upload de 3 fotos (frente, lado, costas)
- A IA analisa para criar treinos personalizados
- Opcional mas recomendado

### 📸 Evolução Física
- Tire fotos ao longo do tempo
- Compare 2 fotos lado a lado (antes/depois)
- Timeline de todas as suas fotos
- Acompanhe visualmente seu progresso

### 🧠 IA com Memória
A IA agora conhece você e personaliza tudo:
- **Trata você pelo nome**
- **Lembra dos seus objetivos**
- **Evita exercícios que agravem suas lesões**
- **Sugere alimentos respeitando suas restrições**
- **Adapta treinos aos seus equipamentos**

Exemplo:
```
Você: "O que devo comer?"
IA: "João, como seu objetivo é ganhar massa e você é 
     vegetariano, recomendo 150g de proteína/dia com 
     tofu, lentilha, quinoa..."
```

### 🎥 Coach Ao Vivo
Análise em tempo real da sua execução de exercícios:
- ✅ Agachamento (Squat)
- ✅ Flexão de Braço (Push-up)
- ✅ Afundo (Lunge)
- ✅ Prancha (Plank)
- ✅ Rosca Direta (Bicep Curl)
- ✅ Exercício Livre

**Recursos:**
- Câmera em orientação vertical (9:16)
- Resolução Full HD (1080x1920)
- Feedback por voz em tempo real
- Contagem automática de repetições
- Alternância entre câmera frontal/traseira

### 🏋️ Gerador de Treinos
- Treinos personalizados por objetivo (hipertrofia, emagrecimento, força)
- Ajuste de nível (iniciante, intermediário, avançado)
- Duração customizável
- Salvar treinos favoritos

### 🥗 Gerador de Dietas
- Planos alimentares baseados em calorias
- Restrições alimentares (vegetariano, vegano, sem glúten, etc.)
- Número de refeições configurável
- Receitas detalhadas

---

## 📂 Estrutura do Projeto

```
EvolveAI/
├── backend/                 # Backend Node.js
│   ├── middleware/
│   │   └── auth.js         # Middleware JWT
│   ├── uploads/            # Fotos dos usuários
│   ├── database.js         # Configuração SQLite
│   ├── server.js           # Servidor Express
│   ├── .env                # Variáveis de ambiente
│   └── package.json
├── components/             # Componentes reutilizáveis
│   └── Layout.tsx         # Layout principal
├── contexts/              # Context API
│   └── AuthContext.tsx    # Autenticação
├── pages/                 # Páginas da aplicação
│   ├── Home.tsx
│   ├── Login.tsx          # Login/Registro
│   ├── Onboarding.tsx     # Questionário inicial
│   ├── PhotoComparison.tsx # Evolução física
│   ├── LiveCoach.tsx
│   ├── WorkoutGenerator.tsx
│   ├── DietGenerator.tsx
│   ├── ExerciseLibrary.tsx
│   ├── Progress.tsx
│   ├── Chat.tsx
│   ├── MyWorkouts.tsx
│   └── Profile.tsx
├── services/              # Serviços e APIs
│   ├── api.ts            # Comunicação com backend
│   └── geminiService.ts  # Integração Gemini AI
├── .env.local            # Variáveis de ambiente
├── start.bat             # Script de inicialização
├── AUTHENTICATION.md     # Documentação detalhada
├── App.tsx
├── index.tsx
└── package.json
```

---

## 🔧 Scripts Disponíveis

```bash
# Iniciar tudo (Windows)
start.bat

# Frontend
npm run dev          # Desenvolvimento
npm run build        # Build para produção
npm run preview      # Preview da build

# Backend
cd backend
npm run dev          # Desenvolvimento com hot reload
npm start            # Produção
```

---

## 🌐 Deploy

O projeto está configurado para deploy no Vercel:

1. Faça push para o GitHub
2. Conecte o repositório no [Vercel](https://vercel.com)
3. Configure a variável de ambiente `GEMINI_API_KEY`
4. Deploy automático! 🚀

---

## 🔗 Links Úteis

- [📖 Documentação Completa de Autenticação](./AUTHENTICATION.md)
- [Ver app no AI Studio](https://ai.studio/apps/drive/1A43pwtMmpFF2Mgq3PTRe1cAt4oo-mRfF)
- [Documentação Gemini AI](https://ai.google.dev/docs)
- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)

---

## 🆕 Novidades da Versão 2.0

### ✅ Implementado
- Sistema de autenticação completo com JWT
- Onboarding inteligente em 3 etapas
- Upload e comparação de fotos
- IA com memória persistente do usuário
- Backend com SQLite
- Criptografia de senhas com bcrypt
- Sistema de rotas protegidas

### 🔜 Próximas Funcionalidades
- Análise de fotos com Gemini Vision
- Notificações de progresso
- Relatórios em PDF
- Comunidade de usuários
- Integração com wearables

---

## 📄 Licença

Este projeto é privado e foi desenvolvido para fins educacionais.

---

## 👨💻 Autor

Desenvolvido com ❤️ usando Google Gemini AI

---

<div align="center">

**⭐ Se você gostou do projeto, deixe uma estrela!**

</div>
