export interface Exercise {
  name: string;
  sets: number;
  reps: string;
  rest: string;
  notes?: string;
  weight?: string; // Carga em kg
}

export interface WorkoutDay {
  day: string;
  focus: string; // Ex: Peito e Tríceps (Push)
  exercises: Exercise[];
}

export interface WorkoutPlan {
  id?: string;
  title: string;
  goal: string; // Hipertrofia, Força
  level: string;
  split: string; // ABC, Full Body, Upper/Lower
  equipment: string; // Academia, Halteres, Peso do Corpo
  muscleFocus?: string; // Foco específico ex: "Ombros"
  schedule: WorkoutDay[];
  createdAt: number;
}

export interface MacroNutrients {
  protein: string;
  carbs: string;
  fats: string;
  calories: string;
}

export interface Meal {
  name: string;
  time?: string;
  suggestion: string;
  ingredients: string[];
  calories: string;
  protein: string;
}

export interface DietPlan {
  id?: string;
  goal: string;
  dietType: string; // Vegana, Keto, Onívora
  activityLevel: string; // Sedentário, Ativo
  macros: MacroNutrients;
  meals: Meal[];
  hydration: string;
  createdAt: number;
}

export interface ExerciseInfo {
  name: string;
  targetMuscles: string[];
  technique: string[];
  commonMistakes: string[];
  variations: string[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export interface UserProfile {
  name: string;
  age: string;
  weight: string;
  height: string;
  gender: string;
  goal: string;
  activityLevel: string;
  injuries: string; // Histórico de lesões
  equipment: string; // O que tem em casa
  dietaryRestrictions: string; // Vegano, alergias, etc
}