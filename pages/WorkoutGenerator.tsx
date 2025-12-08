import React, { useState, useEffect } from 'react';
import { generateWorkoutPlan } from '../services/geminiService';
import { WorkoutPlan } from '../types';
import { Dumbbell, Save, Loader2, Target, Settings, Info, Briefcase, UserCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const WorkoutGenerator: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [workout, setWorkout] = useState<WorkoutPlan | null>(null);
  const [hasProfile, setHasProfile] = useState(false);
  
  const [formData, setFormData] = useState({
    goal: 'Hipertrofia',
    level: 'Intermediário',
    split: 'ABC (Push/Pull/Legs)',
    equipment: 'Academia Completa',
    daysPerWeek: '3',
    muscleFocus: ''
  });

  useEffect(() => {
    const savedProfile = localStorage.getItem('fitness-ai-profile');
    if (savedProfile) {
      setHasProfile(true);
      const profile = JSON.parse(savedProfile);
      setFormData(prev => ({
        ...prev,
        goal: profile.goal || 'Hipertrofia',
        equipment: profile.equipment || 'Academia Completa',
      }));
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setWorkout(null);
    try {
      const plan = await generateWorkoutPlan(
        formData.goal, 
        formData.level, 
        formData.split, 
        formData.equipment,
        formData.muscleFocus,
        formData.daysPerWeek
      );
      setWorkout(plan);
    } catch (error) {
      console.error(error);
      alert("Falha ao gerar o treino. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const saveWorkout = () => {
    if (!workout) return;
    const saved = JSON.parse(localStorage.getItem('fitness-ai-workouts') || '[]');
    const newWorkout = { ...workout, id: crypto.randomUUID() };
    localStorage.setItem('fitness-ai-workouts', JSON.stringify([newWorkout, ...saved]));
    alert("Treino salvo em 'Meus Planos'!");
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header Form */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-700 p-8 text-white relative">
          <div className="flex items-center gap-3 mb-2">
            <Settings className="text-indigo-200" />
            <h2 className="text-3xl font-extrabold tracking-tight">Gerador de Treinos Pro</h2>
          </div>
          <p className="text-indigo-100 max-w-2xl">
            A IA vai montar uma periodização baseada na sua disponibilidade, equipamentos e divisão preferida.
          </p>
          {hasProfile && (
             <div className="absolute top-8 right-8 hidden md:flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full text-xs font-bold backdrop-blur-md">
                <UserCircle size={14} /> Dados do Perfil Carregados
             </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 bg-slate-50/50">
          
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Objetivo Principal</label>
            <select 
              className="w-full p-3 rounded-xl border border-gray-200 bg-white hover:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              value={formData.goal}
              onChange={(e) => setFormData({...formData, goal: e.target.value})}
            >
              <option value="Hipertrofia">Hipertrofia (Ganho de Massa)</option>
              <option value="Força">Força Bruta (Powerlifting)</option>
              <option value="Emagrecimento">Emagrecimento & Definição</option>
              <option value="Resistência">Resistência Muscular</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Nível</label>
            <select 
              className="w-full p-3 rounded-xl border border-gray-200 bg-white hover:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              value={formData.level}
              onChange={(e) => setFormData({...formData, level: e.target.value})}
            >
              <option value="Iniciante">Iniciante</option>
              <option value="Intermediário">Intermediário</option>
              <option value="Avançado">Avançado / Atleta</option>
            </select>
          </div>

          <div className="space-y-2">
             <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Equipamento</label>
             <select 
              className="w-full p-3 rounded-xl border border-gray-200 bg-white hover:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              value={formData.equipment}
              onChange={(e) => setFormData({...formData, equipment: e.target.value})}
            >
              <option value="Academia Completa">Academia Completa</option>
              <option value="Halteres e Banco">Apenas Halteres e Banco</option>
              <option value="Peso do Corpo">Calistenia (Peso do Corpo)</option>
              <option value="Crossfit">Box de Crossfit</option>
            </select>
          </div>

          <div className="space-y-2">
             <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Divisão de Treino (Split)</label>
             <select 
              className="w-full p-3 rounded-xl border border-gray-200 bg-white hover:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              value={formData.split}
              onChange={(e) => setFormData({...formData, split: e.target.value})}
            >
              <option value="Full Body">Full Body (Corpo Todo)</option>
              <option value="Upper/Lower">Upper / Lower (Superior / Inferior)</option>
              <option value="ABC (Push/Pull/Legs)">ABC (Push/Pull/Legs)</option>
              <option value="ABCD (Bro Split)">ABCD (Grupos Isolados)</option>
              <option value="ABCDE">ABCDE (1 músculo por dia)</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Dias por Semana</label>
            <select 
              className="w-full p-3 rounded-xl border border-gray-200 bg-white hover:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              value={formData.daysPerWeek}
              onChange={(e) => setFormData({...formData, daysPerWeek: e.target.value})}
            >
              {[1,2,3,4,5,6,7].map(d => <option key={d} value={d}>{d} Dias</option>)}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Foco Específico (Opcional)</label>
            <input 
              type="text"
              placeholder="Ex: Glúteos, Peitoral Superior..."
              className="w-full p-3 rounded-xl border border-gray-200 bg-white hover:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              value={formData.muscleFocus}
              onChange={(e) => setFormData({...formData, muscleFocus: e.target.value})}
            />
          </div>

          <div className="md:col-span-2 lg:col-span-3 mt-4">
            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-lg shadow-indigo-200 transition-all disabled:opacity-70 flex justify-center items-center gap-2 transform active:scale-95"
            >
              {loading ? <Loader2 className="animate-spin" /> : <Dumbbell />}
              {loading ? 'Inteligência Artificial Trabalhando...' : 'Gerar Periodização Completa'}
            </button>
            {!hasProfile && (
              <p className="text-center mt-4 text-xs text-slate-400">
                Dica: <Link to="/profile" className="text-indigo-500 underline">Crie seu perfil</Link> para preencher automaticamente.
              </p>
            )}
          </div>
        </form>
      </div>

      {workout && (
        <div className="space-y-6 animate-fade-in">
          <div className="flex flex-col md:flex-row justify-between items-end gap-4">
             <div>
                <h2 className="text-2xl font-bold text-slate-900">{workout.title}</h2>
                <div className="flex gap-2 mt-2">
                  <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-xs font-bold uppercase">{workout.split}</span>
                  <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-bold uppercase">{workout.goal}</span>
                </div>
             </div>
             <button onClick={saveWorkout} className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-all shadow-lg hover:shadow-xl">
                <Save size={18} /> Salvar em "Meus Planos"
             </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
             {workout.schedule.map((day, idx) => (
               <div key={idx} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-full hover:shadow-md transition-shadow">
                 <div className="bg-slate-50 p-4 border-b border-gray-100 flex justify-between items-center">
                    <h3 className="font-bold text-lg text-slate-800">{day.day}</h3>
                    <Briefcase size={16} className="text-slate-400" />
                 </div>
                 
                 <div className="bg-indigo-50/50 px-4 py-2 border-b border-indigo-100">
                    <p className="text-xs font-bold text-indigo-700 uppercase tracking-wide">Foco: {day.focus}</p>
                 </div>

                 <div className="p-4 space-y-4 flex-1">
                    {day.exercises.map((ex, i) => (
                      <div key={i} className="group">
                         <div className="flex justify-between items-start">
                           <p className="font-bold text-slate-700 text-sm group-hover:text-indigo-600 transition-colors">{ex.name}</p>
                           <Info size={14} className="text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                         </div>
                         
                         <div className="flex gap-2 mt-2 text-xs text-slate-500 font-medium flex-wrap">
                           <span className="bg-gray-100 px-2 py-1 rounded border border-gray-200">{ex.sets} Séries</span>
                           <span className="bg-gray-100 px-2 py-1 rounded border border-gray-200">{ex.reps} Reps</span>
                           <span className="bg-orange-50 text-orange-600 px-2 py-1 rounded border border-orange-100">{ex.rest}</span>
                         </div>
                         {ex.notes && (
                            <p className="text-xs text-slate-400 mt-1 italic border-l-2 border-gray-200 pl-2">{ex.notes}</p>
                         )}
                      </div>
                    ))}
                 </div>
               </div>
             ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkoutGenerator;