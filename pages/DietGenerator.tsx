import React, { useState, useEffect } from 'react';
import { generateDietPlan } from '../services/geminiService';
import { DietPlan } from '../types';
import { Utensils, Loader2, PieChart, Activity, Apple, Clock, Flame, Droplets, UserCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const DietGenerator: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [diet, setDiet] = useState<DietPlan | null>(null);
  const [hasProfile, setHasProfile] = useState(false);
  
  const [formData, setFormData] = useState({
    goal: 'Perder Peso',
    weight: '70',
    height: '175',
    age: '25',
    gender: 'Masculino',
    activityLevel: 'Moderadamente Ativo',
    dietType: 'Sem Restrições',
    mealsPerDay: '4'
  });

  useEffect(() => {
    const savedProfile = localStorage.getItem('fitness-ai-profile');
    if (savedProfile) {
      setHasProfile(true);
      const profile = JSON.parse(savedProfile);
      setFormData(prev => ({
        ...prev,
        weight: profile.weight,
        height: profile.height,
        age: profile.age,
        goal: profile.goal === 'Hipertrofia' ? 'Ganhar Músculo' : 'Perder Peso', // Simple mapping
        activityLevel: profile.activityLevel,
      }));
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setDiet(null);
    try {
      const plan = await generateDietPlan(
        formData.goal, 
        formData.weight, 
        formData.height, 
        formData.age, 
        formData.gender,
        formData.activityLevel,
        formData.dietType,
        formData.mealsPerDay
      );
      setDiet(plan);
    } catch (error) {
      console.error(error);
      alert("Falha ao gerar o plano de dieta.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header Form */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="bg-gradient-to-r from-emerald-600 to-teal-700 p-8 text-white relative">
           <div className="flex items-center gap-3 mb-2">
            <Apple className="text-emerald-200" />
            <h2 className="text-3xl font-extrabold tracking-tight">Nutricionista AI</h2>
          </div>
          <p className="text-emerald-100 max-w-2xl">
            Cálculo preciso de macros e sugestões de cardápio adaptadas ao seu estilo de vida e preferências.
          </p>
          {hasProfile && (
             <div className="absolute top-8 right-8 hidden md:flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full text-xs font-bold backdrop-blur-md">
                <UserCircle size={14} /> Dados do Perfil Carregados
             </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 bg-slate-50/50">
           
           <div className="lg:col-span-4 grid grid-cols-2 md:grid-cols-4 gap-4 pb-6 border-b border-gray-200 mb-2">
             <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Peso (kg)</label>
                <input type="number" className="w-full p-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none" value={formData.weight} onChange={e => setFormData({...formData, weight: e.target.value})} />
             </div>
             <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Altura (cm)</label>
                <input type="number" className="w-full p-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none" value={formData.height} onChange={e => setFormData({...formData, height: e.target.value})} />
             </div>
             <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Idade</label>
                <input type="number" className="w-full p-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none" value={formData.age} onChange={e => setFormData({...formData, age: e.target.value})} />
             </div>
             <div className="space-y-1">
               <label className="text-xs font-bold text-slate-500 uppercase">Gênero</label>
               <select className="w-full p-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none" value={formData.gender} onChange={e => setFormData({...formData, gender: e.target.value})}>
                 <option>Masculino</option><option>Feminino</option>
               </select>
             </div>
           </div>

           <div className="lg:col-span-2 space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Objetivo</label>
            <select 
              className="w-full p-3 rounded-xl border border-gray-200 bg-white hover:border-emerald-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all"
              value={formData.goal}
              onChange={(e) => setFormData({...formData, goal: e.target.value})}
            >
              <option value="Perder Peso">Perder Gordura (Déficit Calórico)</option>
              <option value="Manter Peso">Manutenção</option>
              <option value="Ganhar Músculo">Ganhar Massa (Superávit)</option>
            </select>
           </div>
           
           <div className="lg:col-span-2 space-y-2">
             <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Nível de Atividade</label>
             <select 
              className="w-full p-3 rounded-xl border border-gray-200 bg-white hover:border-emerald-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all"
              value={formData.activityLevel}
              onChange={(e) => setFormData({...formData, activityLevel: e.target.value})}
            >
              <option value="Sedentário">Sedentário (Pouco exercício)</option>
              <option value="Levemente Ativo">Leve (Treino 1-3 dias/sem)</option>
              <option value="Moderadamente Ativo">Moderado (Treino 3-5 dias/sem)</option>
              <option value="Muito Ativo">Muito Ativo (Treino pesado 6-7 dias)</option>
            </select>
           </div>

           <div className="lg:col-span-2 space-y-2">
             <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Tipo de Dieta</label>
             <select 
              className="w-full p-3 rounded-xl border border-gray-200 bg-white hover:border-emerald-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all"
              value={formData.dietType}
              onChange={(e) => setFormData({...formData, dietType: e.target.value})}
            >
              <option value="Sem Restrições">Onívora (Sem Restrições)</option>
              <option value="Flexível">Dieta Flexível (IIFYM)</option>
              <option value="Vegetariana">Vegetariana</option>
              <option value="Vegana">Vegana</option>
              <option value="Low Carb">Low Carb</option>
              <option value="Cetogênica">Cetogênica (Keto)</option>
              <option value="Paleo">Paleolítica</option>
            </select>
           </div>

           <div className="lg:col-span-2 space-y-2">
             <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Refeições por Dia</label>
             <select 
              className="w-full p-3 rounded-xl border border-gray-200 bg-white hover:border-emerald-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all"
              value={formData.mealsPerDay}
              onChange={(e) => setFormData({...formData, mealsPerDay: e.target.value})}
            >
              <option value="3">3 Refeições</option>
              <option value="4">4 Refeições</option>
              <option value="5">5 Refeições</option>
              <option value="6">6 Refeições (Atletas)</option>
            </select>
           </div>

          <div className="lg:col-span-4 mt-4">
            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-lg shadow-emerald-200 transition-all disabled:opacity-70 flex justify-center items-center gap-2 transform active:scale-95"
            >
              {loading ? <Loader2 className="animate-spin" /> : <PieChart />}
              {loading ? 'Calculando Nutrientes...' : 'Gerar Plano Nutricional'}
            </button>
            {!hasProfile && (
              <p className="text-center mt-4 text-xs text-slate-400">
                Dica: <Link to="/profile" className="text-emerald-500 underline">Crie seu perfil</Link> para preencher automaticamente.
              </p>
            )}
          </div>
        </form>
      </div>

      {diet && (
        <div className="space-y-8 animate-fade-in">
          {/* Macros Dashboard */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             <div className="md:col-span-2 bg-slate-900 text-white rounded-3xl p-8 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                  <Flame size={120} />
                </div>
                <h3 className="text-xl font-bold mb-8 flex items-center gap-2 z-10 relative">
                  <Activity className="text-emerald-400" /> Metas Diárias Calculadas
                </h3>
                
                <div className="flex flex-col md:flex-row gap-8 items-center z-10 relative">
                  <div className="text-center">
                    <div className="text-5xl font-black text-white mb-2 tracking-tighter">{diet.macros.calories}</div>
                    <div className="text-sm text-slate-400 uppercase tracking-widest font-bold">Kcal Totais</div>
                  </div>
                  
                  <div className="h-16 w-px bg-slate-700 hidden md:block"></div>

                  <div className="flex-1 w-full grid grid-cols-3 gap-4">
                    <div className="bg-slate-800/50 rounded-2xl p-4 text-center border border-slate-700">
                       <span className="block text-2xl font-bold text-emerald-400">{diet.macros.protein}</span>
                       <span className="text-xs text-slate-400">Proteína</span>
                    </div>
                    <div className="bg-slate-800/50 rounded-2xl p-4 text-center border border-slate-700">
                       <span className="block text-2xl font-bold text-blue-400">{diet.macros.carbs}</span>
                       <span className="text-xs text-slate-400">Carbo</span>
                    </div>
                    <div className="bg-slate-800/50 rounded-2xl p-4 text-center border border-slate-700">
                       <span className="block text-2xl font-bold text-yellow-400">{diet.macros.fats}</span>
                       <span className="text-xs text-slate-400">Gordura</span>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8 pt-6 border-t border-slate-800 flex items-center gap-2 text-blue-200">
                   <Droplets size={18} />
                   <span>Meta de Hidratação: <span className="font-bold text-white">{diet.hydration}</span></span>
                </div>
             </div>

             <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col justify-center items-center text-center">
               <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mb-4">
                 <Utensils size={32} />
               </div>
               <h3 className="font-bold text-slate-900 text-lg">Dieta {diet.dietType}</h3>
               <p className="text-slate-500 mt-2 text-sm">Plano otimizado para nível <br/><strong>{diet.activityLevel}</strong>.</p>
             </div>
          </div>

          {/* Meals Timeline */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
            <h3 className="text-2xl font-bold text-slate-900 mb-8">Cardápio Sugerido</h3>
            <div className="relative border-l-2 border-emerald-100 ml-3 space-y-12">
              {diet.meals.map((meal, idx) => (
                <div key={idx} className="relative pl-8">
                  <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-emerald-500 ring-4 ring-emerald-50"></div>
                  
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-2">
                    <h4 className="text-lg font-bold text-slate-800">{meal.name}</h4>
                    <div className="flex items-center gap-3 text-sm">
                      {meal.time && <span className="flex items-center gap-1 text-slate-400"><Clock size={14} /> {meal.time}</span>}
                      <span className="font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">{meal.calories}</span>
                    </div>
                  </div>

                  <div className="bg-slate-50 rounded-xl p-5 border border-slate-100">
                    <p className="text-slate-700 font-medium mb-3">{meal.suggestion}</p>
                    {meal.ingredients && (
                      <div className="flex flex-wrap gap-2">
                        {meal.ingredients.map((ing, i) => (
                           <span key={i} className="text-xs text-slate-500 bg-white border border-gray-200 px-2 py-1 rounded shadow-sm">{ing}</span>
                        ))}
                      </div>
                    )}
                     <div className="mt-3 pt-3 border-t border-gray-200 text-xs text-slate-400 font-mono">
                        Proteína Aprox: {meal.protein}
                     </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DietGenerator;