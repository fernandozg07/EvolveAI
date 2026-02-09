# 🔐 Sistema de Autenticação e Onboarding - EvolveAI

## ✨ Novas Funcionalidades Implementadas

### 1. **Autenticação Segura com JWT**
- ✅ Registro de usuários com senha criptografada (bcrypt)
- ✅ Login com email e senha
- ✅ Token JWT com validade de 30 dias
- ✅ Middleware de autenticação para rotas protegidas
- ✅ Logout seguro

### 2. **Onboarding Inteligente**
Quando o usuário se registra pela primeira vez, ele passa por um processo de onboarding em 3 etapas:

#### **Etapa 1: Informações Básicas**
- Nome completo
- Idade
- Gênero
- Peso e altura

#### **Etapa 2: Objetivos e Estilo de Vida**
- Objetivo principal (ganhar massa, perder peso, força, etc.)
- Nível de atividade física
- Equipamentos disponíveis
- Lesões ou limitações físicas
- Restrições alimentares

#### **Etapa 3: Fotos de Referência**
- Upload de 3 fotos (frente, lado, costas)
- A IA analisa as fotos para criar treinos personalizados
- Fotos são opcionais mas recomendadas

### 3. **Memória Persistente da IA**
A IA agora tem acesso ao perfil completo do usuário em todas as interações:

```typescript
// Exemplo de como a IA usa o perfil
const response = await sendChatMessage(history, message, userProfile);
```

A IA considera:
- Nome do usuário (trata pelo nome)
- Objetivos e metas
- Lesões (evita exercícios que possam agravar)
- Equipamentos disponíveis
- Restrições alimentares
- Nível de atividade

### 4. **Comparação de Fotos (Evolução Física)**
Nova página `/photos` onde o usuário pode:
- ✅ Fazer upload de novas fotos ao longo do tempo
- ✅ Comparar 2 fotos lado a lado (antes/depois)
- ✅ Ver timeline de todas as fotos
- ✅ Acompanhar evolução física visualmente

---

## 🚀 Como Usar

### **Primeiro Acesso**

1. **Criar Conta**
   ```
   - Acesse /login
   - Clique em "Não tem conta? Criar agora"
   - Preencha: nome de usuário, email, senha
   ```

2. **Onboarding**
   ```
   - Será redirecionado automaticamente para /onboarding
   - Preencha as 3 etapas
   - Tire fotos (opcional mas recomendado)
   ```

3. **Pronto!**
   ```
   - Agora a IA conhece você
   - Todas as recomendações serão personalizadas
   ```

### **Acompanhar Evolução**

1. **Tirar Novas Fotos**
   ```
   - Vá em "Evolução" no menu
   - Clique em "Nova Foto"
   - Faça upload das fotos
   ```

2. **Comparar Progresso**
   ```
   - Selecione 2 fotos diferentes
   - Veja a comparação lado a lado
   ```

---

## 🔧 Configuração do Backend

### **1. Instalar Dependências**
```bash
cd backend
npm install
```

### **2. Configurar Variáveis de Ambiente**
Crie o arquivo `backend/.env`:
```env
JWT_SECRET=sua-chave-super-secreta-aqui-123456789
PORT=3001
```

### **3. Iniciar Backend**
```bash
npm run dev
```

O backend estará rodando em `http://localhost:3001`

---

## 📁 Estrutura do Banco de Dados

### **Tabelas Criadas**

#### `users`
```sql
- id (PRIMARY KEY)
- username (UNIQUE)
- email (UNIQUE)
- password (hash bcrypt)
- created_at
```

#### `user_profiles`
```sql
- id (PRIMARY KEY)
- user_id (FOREIGN KEY)
- name, age, weight, height, gender
- goal, activity_level
- injuries, equipment
- dietary_restrictions
```

#### `body_analyses`
```sql
- id (PRIMARY KEY)
- user_id (FOREIGN KEY)
- front_photo, back_photo, side_photo
- analysis_result (JSON)
- suggested_workout (JSON)
- created_at
```

#### `workouts`
```sql
- id (PRIMARY KEY)
- user_id (FOREIGN KEY)
- title, goal, level, split
- equipment, muscle_focus
- schedule (JSON)
- created_at
```

#### `progress_logs`
```sql
- id (PRIMARY KEY)
- user_id (FOREIGN KEY)
- weight, body_fat
- notes
- created_at
```

---

## 🎯 Fluxo de Autenticação

```
1. Usuário acessa /login
   ↓
2. Cria conta ou faz login
   ↓
3. Backend gera JWT token
   ↓
4. Token salvo no localStorage
   ↓
5. Verifica se precisa onboarding
   ↓
6. Se sim → /onboarding
   Se não → /home
   ↓
7. Todas as requisições incluem token no header
   Authorization: Bearer <token>
```

---

## 🔒 Segurança

### **Senhas**
- Criptografadas com bcrypt (salt rounds: 10)
- Nunca armazenadas em texto plano

### **JWT**
- Assinado com chave secreta
- Validade de 30 dias
- Verificado em todas as rotas protegidas

### **Fotos**
- Armazenadas em `backend/uploads/<user_id>/`
- Cada usuário tem sua pasta isolada
- Limite de 10MB por foto

---

## 🤖 Como a IA Usa o Perfil

### **Exemplo no Chat**
```typescript
// Antes (sem memória)
User: "O que devo comer?"
AI: "Depende dos seus objetivos..."

// Depois (com memória)
User: "O que devo comer?"
AI: "João, como seu objetivo é ganhar massa muscular e você é 
     vegetariano, recomendo: 150g de proteína/dia com fontes 
     como tofu, lentilha, quinoa..."
```

### **Exemplo em Treinos**
```typescript
// A IA considera:
- Lesões: "Evitando agachamento profundo devido à lesão no joelho"
- Equipamentos: "Usando apenas halteres conforme disponível"
- Nível: "Progressão gradual para iniciante"
```

---

## 📸 Sistema de Fotos

### **Upload**
```typescript
const photos = { front: File, back: File, side: File };
await api.uploadBodyPhotos(photos);
```

### **Comparação**
```typescript
// Selecione 2 fotos
selectedPhotos = [1, 5]; // IDs das análises

// Sistema mostra lado a lado:
- Foto 1 (01/01/2024) vs Foto 5 (01/03/2024)
- Frente, Lado, Costas
```

---

## 🎨 Páginas Criadas

1. **`/login`** - Login e registro
2. **`/onboarding`** - Questionário inicial + fotos
3. **`/photos`** - Comparação de evolução física
4. **`/profile`** - Editar perfil (já existia)

---

## 🔄 Próximos Passos (Sugestões)

1. **Análise de Fotos com IA**
   - Usar Gemini Vision para analisar composição corporal
   - Sugerir treinos baseados na análise

2. **Notificações**
   - Lembrar de tirar fotos mensalmente
   - Avisar quando atingir metas

3. **Relatórios**
   - Gerar PDF com evolução
   - Gráficos de progresso

4. **Social**
   - Compartilhar evolução (opcional)
   - Comunidade de usuários

---

## 🐛 Troubleshooting

### **Erro: "Token inválido"**
- Faça logout e login novamente
- Verifique se o backend está rodando

### **Erro: "Usuário já existe"**
- Email já cadastrado
- Use outro email ou faça login

### **Fotos não aparecem**
- Verifique se o backend está servindo `/uploads`
- Confirme que as fotos foram salvas em `backend/uploads/<user_id>/`

---

## 📞 Suporte

Se tiver dúvidas, verifique:
1. Backend rodando em `http://localhost:3001`
2. Frontend rodando em `http://localhost:5173`
3. Arquivo `.env` configurado no backend
4. Dependências instaladas (`npm install`)

---

**Desenvolvido com ❤️ usando Google Gemini AI**
