import React, { useEffect, useState, useRef } from 'react';
import { WorkoutPlan, WorkoutDay } from '../types';
import { BarChart, Trash2, Calendar, ChevronRight, ChevronDown, Dumbbell, Save, Play, Clock, CheckSquare, X, ArrowLeft } from 'lucide-react';

const MyWorkouts: React.FC = () => {
  const [workouts, setWorkouts] = useState<WorkoutPlan[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  
  // Active Workout State
  const [activePlanId, setActivePlanId] = useState<string | null>(null);
  const [activeDayIndex, setActiveDayIndex] = useState<number | null>(null);
  const [timer, setTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [completedSets, setCompletedSets] = useState<Record<string, boolean>>({}); // Key: "dayIdx-exIdx"
  
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('fitness-ai-workouts') || '[]');
    setWorkouts(saved);
  }, []);

  // Timer Logic
  useEffect(() => {
    if (isTimerRunning) {
      timerRef.current = window.setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    
    if (timer <= 0 && isTimerRunning) {
      setIsTimerRunning(false);
      if (timerRef.current) clearInterval(timerRef.current);
      // Could play a sound here if desired
    }

    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isTimerRunning, timer]);

  const startRest = (seconds: number) => {
    setTimer(seconds);
    setIsTimerRunning(true);
  };

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
    setWorkouts(updatedWorkouts);
  };

  const saveProgress = (workout: WorkoutPlan) => {
     const updated = workouts.map(w => w.id === workout.id ? workout : w);
     saveToLocalStorage(updated);
     alert("Progresso salvo com sucesso!");
  };

  const startActiveSession = (planId: string, dayIndex: number) => {
    setActivePlanId(planId);
    setActiveDayIndex(dayIndex);
    setCompletedSets({});
    setTimer(0);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const exitActiveSession = () => {
    if(confirm("Sair do modo de treino? O progresso não salvo será perdido.")) {
      setActivePlanId(null);
      setActiveDayIndex(null);
      setIsTimerRunning(false);
    }
  };

  const toggleSetComplete = (key: string) => {
    setCompletedSets(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // --- RENDER ACTIVE WORKOUT VIEW ---
  if (activePlanId && activeDayIndex !== null) {
    const plan = workouts.find(w => w.id === activePlanId);
    const day = plan?.schedule[activeDayIndex];

    if (!plan || !day) return <div>Erro ao carregar treino.</div>;

    const totalExercises = day.exercises.length;
    const finishedCount = day.exercises.filter((_, i) => completedSets[`${i}`]).length;
    const progressPercent = (finishedCount / totalExercises) * 100;

    return (
      <div className="max-w-3xl mx-auto space-y-6 pb-20">
        {/* Sticky Header */}
        <div className="sticky top-[4rem] z-30 bg-slate-900 text-white p-4 rounded-b-2xl shadow-xl -mx-4 md:mx-0 md:rounded-2xl">
          <div className="flex items-center justify-between mb-4">
            <button onClick={exitActiveSession} className="p-2 hover:bg-white/10 rounded-full">
              <ArrowLeft />
            </button>
            <div className="text-center">
              <h3 className="font-bold text-lg">{day.focus}</h3>
              <p className="text-xs text-slate-400">Modo Foco Ativo</p>
            </div>
            <button onClick={() => saveProgress(plan)} className="p-2 bg-indigo-600 rounded-full shadow hover:bg-indigo-500">
              <Save size={20} />
            </button>
          </div>
          
          {/* Timer Display */}
          <div className="flex items-center justify-center gap-4 py-2 bg-slate-800/50 rounded-xl mb-4 border border-slate-700">
             <Clock className={isTimerRunning ? "animate-pulse text-rose-500" : "text-slate-400"} />
             <span className={`text-4xl font-mono font-black tracking-widest ${timer > 0 ? (timer < 10 ? 'text-red-500' : 'text-white') : 'text-slate-500'}`}>
                {Math.floor(timer / 60)}:{String(timer % 60).padStart(2, '0')}
             </span>
             {isTimerRunning ? (
               <button onClick={() => setIsTimerRunning(false)} className="text-xs bg-red-500/20 text-red-400 px-3 py-1 rounded-full uppercase font-bold">Parar</button>
             ) : (
               <div className="flex gap-2">
                 <button onClick={() => startRest(30)} className="text-xs bg-slate-700 hover:bg-slate-600 px-3 py-1 rounded-full">30s</button>
                 <button onClick={() => startRest(60)} className="text-xs bg-slate-700 hover:bg-slate-600 px-3 py-1 rounded-full">60s</button>
                 <button onClick={() => startRest(90)} className="text-xs bg-slate-700 hover:bg-slate-600 px-3 py-1 rounded-full">90s</button>
               </div>
             )}
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 transition-all duration-500" 
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
        </div>

        {/* Exercises List */}
        <div className="space-y-4 px-1 md:px-0">
          {day.exercises.map((ex, idx) => {
            const isDone = completedSets[`${idx}`];
            return (
              <div key={idx} className={`bg-white p-5 rounded-2xl shadow-sm border transition-all ${isDone ? 'border-emerald-200 bg-emerald-50/30 opacity-70' : 'border-gray-200'}`}>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className={`font-bold text-lg ${isDone ? 'text-emerald-800 line-through' : 'text-slate-800'}`}>{ex.name}</h4>
                    <p className="text-sm text-slate-500">{ex.sets} séries x {ex.reps} reps</p>
                  </div>
                  <button 
                    onClick={() => toggleSetComplete(`${idx}`)}
                    className={`p-3 rounded-full transition-all ${isDone ? 'bg-emerald-500 text-white' : 'bg-gray-100 text-gray-300 hover:bg-gray-200'}`}
                  >
                    <CheckSquare size={24} />
                  </button>
                </div>
                
                <div className="flex gap-4 items-center">
                   <div className="flex-1">
                      <label className="text-xs font-bold text-slate-400 uppercase block mb-1">Carga (kg)</label>
                      <input 
                        type="number" 
                        value={ex.weight || ''} 
                        onChange={(e) => handleWeightChange(plan.id!, activeDayIndex, idx, e.target.value)}
                        placeholder="0"
                        className="w-full p-3 bg-slate-50 border border-gray-200 rounded-xl font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none"
                      />
                   </div>
                   <div className="flex-1">
                      <label className="text-xs font-bold text-slate-400 uppercase block mb-1">Descanso</label>
                      <button 
                        onClick={() => {
                          const time = parseInt(ex.rest.replace(/\D/g, '')) || 60;
                          startRest(time);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="w-full p-3 bg-orange-50 border border-orange-100 text-orange-600 rounded-xl font-bold hover:bg-orange-100 flex justify-center items-center gap-2"
                      >
                         <Clock size={16} /> {ex.rest}
                      </button>
                   </div>
                </div>
                {ex.notes && (
                  <p className="mt-3 text-xs text-slate-500 italic bg-white p-2 rounded-lg border border-gray-100">{ex.notes}</p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // --- RENDER DEFAULT LIST VIEW ---
  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-purple-100 rounded-lg text-purple-600">
          <BarChart size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Meus Planos</h2>
          <p className="text-slate-500 text-sm">Gerencie seus treinos e acompanhe sua evolução.</p>
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
            <div key={plan.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-md">
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
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {plan.schedule.map((day, dIdx) => (
                      <div key={dIdx} className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm flex flex-col justify-between">
                        <div>
                          <h4 className="font-bold text-slate-800 mb-2 pb-2 border-b border-gray-100 flex justify-between">
                            {day.day}
                            <span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded">{day.focus}</span>
                          </h4>
                          <p className="text-xs text-slate-500 mb-4">{day.exercises.length} Exercícios</p>
                        </div>
                        <button 
                           onClick={() => startActiveSession(plan.id!, dIdx)}
                           className="w-full py-3 bg-slate-900 hover:bg-indigo-600 text-white rounded-lg font-bold transition-colors flex items-center justify-center gap-2"
                        >
                           <Play size={16} fill="currentColor" /> Iniciar Treino
                        </button>
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