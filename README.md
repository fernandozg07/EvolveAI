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

- 🎥 **Coach Ao Vivo** - Correção de postura em tempo real via câmera e IA
- 🏋️ **Gerador de Treinos** - Treinos personalizados baseados em seus objetivos
- 🥗 **Gerador de Dietas** - Planos alimentares customizados
- 📚 **Biblioteca de Exercícios** - Catálogo completo com instruções detalhadas
- 📊 **Acompanhamento de Progresso** - Gráficos e estatísticas da sua evolução
- 💬 **Chat com IA** - Tire dúvidas sobre fitness e nutrição
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

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Configure as variáveis de ambiente:**
   
   Crie o arquivo `.env.local` na raiz do projeto:
   ```env
   GEMINI_API_KEY=sua_chave_api_aqui
   ```

4. **Inicie o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```

5. **Acesse a aplicação:**
   
   Abra [http://localhost:5173](http://localhost:5173) no seu navegador.

---

## 🛠️ Tecnologias Utilizadas

- **Frontend:**
  - React 19.2
  - TypeScript 5.8
  - React Router DOM 7.10
  - Tailwind CSS
  - Lucide React (ícones)

- **IA & APIs:**
  - Google Gemini AI (2.5 Flash)
  - Multimodal Live API (áudio + vídeo)

- **Build & Dev:**
  - Vite 6.2
  - React Markdown
  - Recharts (gráficos)

---

## 📱 Funcionalidades Detalhadas

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
├── components/          # Componentes reutilizáveis
│   └── Layout.tsx      # Layout principal com navegação
├── contexts/           # Context API (autenticação)
│   └── AuthContext.tsx
├── pages/              # Páginas da aplicação
│   ├── Home.tsx
│   ├── LiveCoach.tsx   # Coach ao vivo
│   ├── WorkoutGenerator.tsx
│   ├── DietGenerator.tsx
│   ├── ExerciseLibrary.tsx
│   ├── Progress.tsx
│   ├── Chat.tsx
│   ├── MyWorkouts.tsx
│   ├── Profile.tsx
│   └── Login.tsx
├── services/           # Serviços e APIs
│   └── geminiService.ts
├── .env.local          # Variáveis de ambiente
├── App.tsx             # Componente raiz
├── index.tsx           # Entry point
└── package.json
```

---

## 🔧 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview da build
npm run preview
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

- [Ver app no AI Studio](https://ai.studio/apps/drive/1A43pwtMmpFF2Mgq3PTRe1cAt4oo-mRfF)
- [Documentação Gemini AI](https://ai.google.dev/docs)
- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)

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
