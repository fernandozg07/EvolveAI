import React, { useEffect, useState } from 'react';
import { WorkoutPlan } from '../types';
import { BarChart, Trash2, Calendar, ChevronRight, ChevronDown, Dumbbell, Save, Edit3 } from 'lucide-react';

const MyWorkouts: React.FC = () => {
  const [workouts, setWorkouts] = useState<WorkoutPlan[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('fitness-ai-workouts') || '[]');
    setWorkouts(saved);
  }, []);

  const saveToLocalStorage = (updatedWorkouts: WorkoutPlan[]) => {
    localStorage.setItem('fitness-ai-workouts', JSON.stringify(updatedWorkouts));
    setWorkouts(updatedWorkouts);
  };

  const deleteWorkout = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Tem certeza que deseja excluir este treino?")) {
      const updated = workouts.filter(w => w.id !== id);
      saveToLocalStorage(updated);
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleWeightChange = (workoutId: string, dayIndex: number, exerciseIndex: number, weight: string) => {
    const updatedWorkouts = [...workouts];
    const wIndex = updatedWorkouts.findIndex(w => w.id === workoutId);
    if (wIndex === -1) return;

    updatedWorkouts[wIndex].schedule[dayIndex].exercises[exerciseIndex].weight = weight;
    // Don't save to local storage on every keystroke, strictly speaking, but for this demo using a Save button is better
    setWorkouts(updatedWorkouts);
  };

  const saveProgress = (workout: WorkoutPlan, e: React.MouseEvent) => {
     e.stopPropagation();
     const updated = workouts.map(w => w.id === workout.id ? workout : w);
     saveToLocalStorage(updated);
     alert("Cargas salvas com sucesso!");
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-purple-100 rounded-lg text-purple-600">
          <BarChart size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Meus Planos e Cargas</h2>
          <p className="text-slate-500 text-sm">Acompanhe sua evolução registrando o peso em cada exercício.</p>
        </div>
      </div>

      {workouts.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-300">
          <Dumbbell className="mx-auto text-gray-300 mb-4" size={48} />
          <p className="text-gray-500 font-medium">Nenhum treino salvo ainda.</p>
          <p className="text-gray-400 text-sm">Gere um treino na aba "Treino" para começar.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {workouts.map((plan) => (
            <div key={plan.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden transition-all duration-300">
              {/* Card Header */}
              <div 
                onClick={() => plan.id && toggleExpand(plan.id)}
                className="p-6 cursor-pointer hover:bg-slate-50 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-xl text-slate-900">{plan.title}</h3>
                    <div className="flex items-center gap-2 md:hidden">
                       <button onClick={(e) => plan.id && deleteWorkout(plan.id, e)} className="text-gray-400 hover:text-red-500 p-2"><Trash2 size={18} /></button>
                       {expandedId === plan.id ? <ChevronDown size={20} className="text-indigo-500" /> : <ChevronRight size={20} className="text-gray-400" />}
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 text-xs font-bold uppercase mt-2 tracking-wide">
                    <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded-md">{plan.split || "Geral"}</span>
                    <span className="bg-indigo-100 text-indigo-700 px-2 py-1 rounded-md">{plan.goal}</span>
                    {plan.muscleFocus && <span className="bg-pink-100 text-pink-700 px-2 py-1 rounded-md">Foco: {plan.muscleFocus}</span>}
                  </div>
                  
                  <div className="flex items-center gap-2 text-xs text-slate-400 mt-3">
                    <Calendar size={12} /> Criado em {new Date(plan.createdAt).toLocaleDateString('pt-BR')}
                  </div>
                </div>

                <div className="hidden md:flex items-center gap-4">
                   <button 
                    onClick={(e) => plan.id && deleteWorkout(plan.id, e)}
                    className="p-3 rounded-xl hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors"
                    title="Excluir Treino"
                  >
                    <Trash2 size={20} />
                  </button>
                  <div className={`p-3 rounded-full bg-slate-100 text-slate-500 transition-transform duration-300 ${expandedId === plan.id ? 'rotate-180 bg-indigo-100 text-indigo-600' : ''}`}>
                    <ChevronDown size={20} />
                  </div>
                </div>
              </div>

              {/* Expanded Content */}
              {expandedId === plan.id && (
                <div className="border-t border-gray-100 bg-slate-50/50 p-6 animate-fade-in">
                  <div className="flex justify-end mb-4">
                     <button 
                      onClick={(e) => saveProgress(plan, e)}
                      className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold shadow hover:bg-indigo-700 transition-all active:scale-95"
                    >
                       <Save size={16} /> Salvar Cargas
                     </button>
                  </div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {plan.schedule.map((day, dIdx) => (
                      <div key={dIdx} className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
                        <h4 className="font-bold text-slate-800 mb-4 pb-2 border-b border-gray-100 flex justify-between">
                          {day.day}
                          <span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded">{day.focus}</span>
                        </h4>
                        <div className="space-y-4">
                          {day.exercises.map((ex, eIdx) => (
                            <div key={eIdx} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                               <div className="flex-1">
                                 <p className="font-medium text-slate-700 text-sm">{ex.name}</p>
                                 <p className="text-xs text-slate-400">{ex.sets}x {ex.reps} • {ex.rest}</p>
                               </div>
                               <div className="flex items-center gap-2">
                                  <label className="text-xs font-bold text-slate-400 uppercase">Carga (kg)</label>
                                  <input 
                                    type="text" 
                                    placeholder="0"
                                    className="w-20 p-2 text-center rounded-lg border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all font-bold text-slate-800"
                                    value={ex.weight || ''}
                                    onChange={(e) => plan.id && handleWeightChange(plan.id, dIdx, eIdx, e.target.value)}
                                  />
                               </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyWorkouts;