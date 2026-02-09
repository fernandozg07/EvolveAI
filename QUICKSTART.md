# 🚀 Guia Rápido - EvolveAI v2.0

## ✅ O que foi implementado

### 1. **Sistema de Autenticação Seguro**
- ✅ Login com email e senha
- ✅ Registro de novos usuários
- ✅ JWT com validade de 30 dias
- ✅ Senha criptografada com bcrypt
- ✅ Middleware de autenticação

### 2. **Onboarding Inteligente**
- ✅ Questionário em 3 etapas
- ✅ Upload de fotos (frente, lado, costas)
- ✅ Coleta de objetivos, lesões, restrições
- ✅ Redirecionamento automático na primeira vez

### 3. **IA com Memória**
- ✅ Perfil do usuário integrado nas chamadas da IA
- ✅ IA lembra nome, objetivos, lesões
- ✅ Recomendações personalizadas
- ✅ Evita exercícios que agravem lesões

### 4. **Comparação de Fotos**
- ✅ Upload de novas fotos ao longo do tempo
- ✅ Comparação lado a lado (antes/depois)
- ✅ Timeline de evolução
- ✅ Fotos organizadas por usuário

### 5. **Backend Completo**
- ✅ API REST com Express
- ✅ Banco SQLite com 5 tabelas
- ✅ Upload de arquivos com Multer
- ✅ CORS configurado

---

## 📦 Como Iniciar

### **Passo 1: Instalar Dependências**

```bash
# Frontend
npm install

# Backend
cd backend
npm install
cd ..
```

### **Passo 2: Configurar Variáveis**

**Frontend** - Crie `.env.local`:
```env
VITE_API_KEY=sua_chave_gemini_aqui
```

**Backend** - Crie `backend/.env`:
```env
JWT_SECRET=minha-chave-super-secreta-123456789
PORT=3001
```

### **Passo 3: Iniciar Aplicação**

**Opção A - Automático (Windows):**
```bash
start.bat
```

**Opção B - Manual:**
```bash
# Terminal 1
cd backend
npm run dev

# Terminal 2
npm run dev
```

### **Passo 4: Acessar**
- Frontend: http://localhost:5173
- Backend: http://localhost:3001

---

## 🎯 Fluxo de Uso

### **Primeira Vez**

1. **Criar Conta**
   - Acesse http://localhost:5173
   - Clique em "Não tem conta? Criar agora"
   - Preencha: nome, email, senha

2. **Onboarding**
   - Será redirecionado automaticamente
   - Preencha as 3 etapas:
     - Informações básicas
     - Objetivos e estilo de vida
     - Fotos (opcional)

3. **Pronto!**
   - Agora a IA conhece você
   - Todas as recomendações são personalizadas

### **Uso Diário**

1. **Login**
   - Email e senha
   - Token válido por 30 dias

2. **Explorar Funcionalidades**
   - 🎥 Coach Ao Vivo - Correção em tempo real
   - 🏋️ Gerador de Treinos - Personalizados
   - 🥗 Gerador de Dietas - Baseado no seu perfil
   - 💬 Chat - IA que te conhece
   - 📸 Evolução - Compare fotos

3. **Acompanhar Progresso**
   - Tire fotos mensalmente
   - Compare evolução
   - Veja gráficos de progresso

---

## 🗂️ Estrutura do Banco de Dados

### **Tabelas Criadas**

1. **users** - Usuários do sistema
2. **user_profiles** - Perfil detalhado (onboarding)
3. **body_analyses** - Fotos e análises corporais
4. **workouts** - Treinos salvos
5. **progress_logs** - Logs de progresso

Todas as tabelas são criadas automaticamente ao iniciar o backend.

---

## 🔐 Segurança

### **Senhas**
- Criptografadas com bcrypt (10 rounds)
- Nunca armazenadas em texto plano

### **JWT**
- Assinado com chave secreta
- Validade de 30 dias
- Verificado em todas as rotas protegidas

### **Fotos**
- Armazenadas em `backend/uploads/<user_id>/`
- Cada usuário tem pasta isolada
- Limite de 10MB por foto

---

## 🤖 Como a IA Usa o Perfil

### **Antes (sem memória)**
```
User: "O que devo comer?"
AI: "Depende dos seus objetivos..."
```

### **Depois (com memória)**
```
User: "O que devo comer?"
AI: "João, como seu objetivo é ganhar massa muscular 
     e você é vegetariano, recomendo 150g de proteína/dia 
     com fontes como tofu, lentilha, quinoa..."
```

### **Exemplo com Lesões**
```
User: "Posso fazer agachamento?"
AI: "João, como você tem lesão no joelho, recomendo 
     evitar agachamento profundo. Alternativas: 
     leg press com amplitude reduzida, cadeira extensora..."
```

---

## 📸 Sistema de Fotos

### **Upload**
1. Vá em "Evolução" no menu
2. Clique em "Nova Foto"
3. Selecione 3 fotos (frente, lado, costas)
4. Clique em "Salvar Fotos"

### **Comparação**
1. Selecione 2 fotos diferentes
2. Veja comparação lado a lado
3. Analise sua evolução

### **Dicas para Melhores Fotos**
- Use roupas justas ou traje de banho
- Boa iluminação natural
- Fundo neutro
- Corpo inteiro visível
- Mesma pose em todas as fotos

---

## 🐛 Troubleshooting

### **Erro: "Token inválido"**
- Faça logout e login novamente
- Verifique se o backend está rodando

### **Erro: "Usuário já existe"**
- Email já cadastrado
- Use outro email ou faça login

### **Fotos não aparecem**
- Verifique se o backend está rodando
- Confirme que as fotos foram salvas em `backend/uploads/`

### **Backend não inicia**
- Verifique se a porta 3001 está livre
- Instale as dependências: `cd backend && npm install`

### **Frontend não conecta ao backend**
- Verifique se o backend está em http://localhost:3001
- Veja o console do navegador para erros

---

## 📚 Documentação Adicional

- [AUTHENTICATION.md](./AUTHENTICATION.md) - Documentação completa do sistema
- [README.md](./README.md) - Visão geral do projeto

---

## 🎉 Próximos Passos

Agora que tudo está funcionando, você pode:

1. **Personalizar**
   - Adicionar mais campos no onboarding
   - Criar novos tipos de análise

2. **Melhorar**
   - Integrar Gemini Vision para análise de fotos
   - Adicionar notificações
   - Criar relatórios em PDF

3. **Expandir**
   - Sistema de amigos
   - Compartilhamento de treinos
   - Integração com wearables

---

**Desenvolvido com ❤️ usando Google Gemini AI**

Se tiver dúvidas, consulte a documentação ou abra uma issue!
