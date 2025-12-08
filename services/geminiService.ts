import { GoogleGenAI, Type } from "@google/genai";
import { WorkoutPlan, DietPlan, ExerciseInfo, UserProfile, ShoppingItem } from "../types";

const apiKey = process.env.API_KEY;
if (!apiKey) {
  console.error("API_KEY is missing from environment variables.");
}

const ai = new GoogleGenAI({ apiKey: apiKey || 'dummy-key-for-types' });

// 1. Generate Advanced Workout Plan
export const generateWorkoutPlan = async (
  goal: string,
  level: string,
  split: string,
  equipment: string,
  muscleFocus: string,
  daysPerWeek: string
): Promise<WorkoutPlan> => {
  const model = "gemini-2.5-flash";
  
  const prompt = `Atue como um treinador de elite. Crie um plano de musculação detalhado.
  
  PERFIL DO ALUNO:
  - Nível: ${level}
  - Objetivo: ${goal}
  - Dias disponíveis: ${daysPerWeek} dias/semana
  - Divisão de Treino (Split): ${split} (Ex: ABC, PPL, FullBody)
  - Equipamento disponível: ${equipment}
  - Ênfase/Foco Muscular: ${muscleFocus || "Equilibrado"}

  REGRAS:
  1. Use nomes de exercícios em Português do Brasil (ex: 'Supino Reto com Halteres').
  2. Seja específico nas repetições (ex: '8-12' ou 'Até a falha').
  3. Adapte os exercícios para o equipamento '${equipment}'.
  4. Responda APENAS com o JSON.`;

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING, description: "Nome criativo do treino (ex: Protocolo Hipertrofia ABC)" },
          schedule: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                day: { type: Type.STRING, description: "Ex: Treino A, Segunda-feira" },
                focus: { type: Type.STRING, description: "Ex: Empurrar (Peito/Ombro/Tríceps)" },
                exercises: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      name: { type: Type.STRING },
                      sets: { type: Type.NUMBER },
                      reps: { type: Type.STRING },
                      rest: { type: Type.STRING, description: "Ex: 60s, 90s" },
                      notes: { type: Type.STRING, description: "Dica técnica curta (ex: 'Controle a descida')" },
                      weight: { type: Type.STRING, description: "Deixe vazio (string vazia)" } 
                    },
                    required: ["name", "sets", "reps", "rest"],
                  },
                },
              },
              required: ["day", "focus", "exercises"],
            },
          },
        },
        required: ["title", "schedule"],
      },
    },
  });

  if (!response.text) throw new Error("No response from AI");
  
  const data = JSON.parse(response.text);
  return {
    ...data,
    goal,
    level,
    split,
    equipment,
    muscleFocus,
    createdAt: Date.now(),
  };
};

// 2. Generate Advanced Diet Plan
export const generateDietPlan = async (
  goal: string,
  weight: string,
  height: string,
  age: string,
  gender: string,
  activityLevel: string,
  dietType: string,
  mealsPerDay: string
): Promise<DietPlan> => {
  const model = "gemini-2.5-flash";
  
  const prompt = `Atue como nutricionista esportivo. Calcule e crie uma dieta.
  
  DADOS:
  - Sexo: ${gender}, Idade: ${age}, Peso: ${weight}kg, Altura: ${height}cm.
  - Nível de Atividade: ${activityLevel}.
  - Objetivo: ${goal}.
  - Preferência Alimentar: ${dietType} (Ex: Vegana, Keto, Flexível).
  - Refeições por dia: ${mealsPerDay}.

  TAREFAS:
  1. Calcule as calorias e macros ideais para o objetivo.
  2. Crie um cardápio variado respeitando a preferência '${dietType}'.
  3. Responda APENAS JSON.`;

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          macros: {
            type: Type.OBJECT,
            properties: {
              protein: { type: Type.STRING, description: "Gramas totais" },
              carbs: { type: Type.STRING, description: "Gramas totais" },
              fats: { type: Type.STRING, description: "Gramas totais" },
              calories: { type: Type.STRING, description: "Kcal totais" },
            },
            required: ["protein", "carbs", "fats", "calories"],
          },
          hydration: { type: Type.STRING, description: "Meta de água (ex: 3.5 Litros)" },
          meals: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING, description: "Ex: Café da Manhã" },
                time: { type: Type.STRING, description: "Horário sugerido" },
                suggestion: { type: Type.STRING, description: "Descrição do prato" },
                ingredients: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Lista simples de ingredientes" },
                calories: { type: Type.STRING, description: "Calorias desta refeição" },
                protein: { type: Type.STRING, description: "Proteína desta refeição" },
              },
              required: ["name", "suggestion", "calories"],
            },
          },
        },
        required: ["macros", "meals", "hydration"],
      },
    },
  });

  if (!response.text) throw new Error("No response from AI");
  
  const data = JSON.parse(response.text);
  return {
    ...data,
    goal,
    dietType,
    activityLevel,
    createdAt: Date.now()
  };
};

// 3. Generate Shopping List from Diet
export const generateShoppingList = async (dietPlan: DietPlan): Promise<ShoppingItem[]> => {
  const model = "gemini-2.5-flash";
  const mealsJson = JSON.stringify(dietPlan.meals);
  
  const prompt = `
  Com base neste plano alimentar (JSON abaixo), crie uma lista de compras consolidada para o supermercado.
  Agrupe os itens por categoria (Ex: Hortifruti, Carnes/Ovos, Grãos, Laticínios, Outros).
  Some as quantidades se possível ou liste os itens genéricos.
  Responda APENAS JSON.

  Plano: ${mealsJson}
  `;

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            category: { type: Type.STRING, description: "Nome da categoria (ex: Hortifruti)" },
            items: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Lista de itens para comprar" }
          },
          required: ["category", "items"]
        }
      }
    }
  });

  if (!response.text) throw new Error("No shopping list generated");
  return JSON.parse(response.text);
};

// 4. Explain Exercise
export const explainExercise = async (exerciseName: string): Promise<ExerciseInfo> => {
  const model = "gemini-2.5-flash";
  const prompt = `Explique o exercício "${exerciseName}" detalhadamente em Português do Brasil. Foco em técnica de musculação.`;

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING, description: "Nome do exercício" },
          targetMuscles: { type: Type.ARRAY, items: { type: Type.STRING } },
          technique: { type: Type.ARRAY, items: { type: Type.STRING } },
          commonMistakes: { type: Type.ARRAY, items: { type: Type.STRING } },
          variations: { type: Type.ARRAY, items: { type: Type.STRING } },
        },
        required: ["name", "targetMuscles", "technique", "commonMistakes"],
      },
    },
  });

  if (!response.text) throw new Error("No response from AI");
  return JSON.parse(response.text);
};

// 5. Analyze Progress
export const analyzeProgress = async (log: string): Promise<string> => {
  const model = "gemini-2.5-flash";
  const response = await ai.models.generateContent({
    model,
    contents: `Atue como um coach experiente. Analise este feedback do aluno e dê conselhos práticos para quebrar platôs ou melhorar a recuperação: "${log}". Responda em Português. Use formatação Markdown.`,
  });
  return response.text || "Sem análise.";
};

// 6. General Chat with Profile Integration
export const sendChatMessage = async (
  history: { role: string; parts: { text: string }[] }[], 
  message: string,
  userProfile?: UserProfile
): Promise<string> => {
  const model = "gemini-2.5-flash";

  let systemInstruction = "Você é um personal trainer elite e nutricionista esportivo. Responda em Português do Brasil. Seja direto, técnico mas acessível.";

  // Enrich System Prompt with User Profile if available
  if (userProfile) {
    systemInstruction += `
    
    MEMÓRIA DO ALUNO (USE ISSO PARA PERSONALIZAR A RESPOSTA):
    - Nome: ${userProfile.name}
    - Idade: ${userProfile.age} anos
    - Peso/Altura: ${userProfile.weight}kg / ${userProfile.height}cm
    - Objetivo Principal: ${userProfile.goal}
    - Nível de Atividade: ${userProfile.activityLevel}
    - Histórico de Lesões/Dores: ${userProfile.injuries || "Nenhuma relatada"} (CRUCIAL: Se sugerir exercícios, evite os que agravem essas lesões).
    - Equipamentos Disponíveis: ${userProfile.equipment || "Não especificado"}
    - Restrições Alimentares: ${userProfile.dietaryRestrictions || "Nenhuma"}

    Se o usuário perguntar "O que devo comer?", baseie-se nas restrições dele.
    Se perguntar "Posso fazer agachamento?", verifique se ele tem lesão no joelho na lista acima.
    Trate-o pelo nome. Seja motivador como um coach real.`;
  }

  const chat = ai.chats.create({
    model,
    history: history,
    config: {
      systemInstruction: systemInstruction,
    }
  });

  const response = await chat.sendMessage({ message });
  return response.text || "Erro no chat.";
};
