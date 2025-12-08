import React, { useState, useEffect } from 'react';
import { analyzeProgress } from '../services/geminiService';
import { Activity, Loader2, Send, TrendingUp } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { WorkoutPlan } from '../types';

const Progress: React.FC = () => {
  const [log, setLog] = useState('');
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [chartData, setChartData] = useState<any[]>([]);
  const [availableExercises, setAvailableExercises] = useState<string[]>([]);
  const [selectedExercise, setSelectedExercise] = useState<string>('');

  useEffect(() => {
    // Load data from local storage to build charts
    const workouts: WorkoutPlan[] = JSON.parse(localStorage.getItem('fitness-ai-workouts') || '[]');
    
    // Extract all unique exercises that have weight data
    const exercisesSet = new Set<string>();
    workouts.forEach(w => {
      w.schedule.forEach(day => {
        day.exercises.forEach(ex => {
          if (ex.weight && parseFloat(ex.weight) > 0) {
            exercisesSet.add(ex.name);
          }
        });
      });
    });
    
    const exercisesList = Array.from(exercisesSet);
    setAvailableExercises(exercisesList);
    if (exercisesList.length > 0) {
      setSelectedExercise(exercisesList[0]);
    }
  }, []);

  useEffect(() => {
    if (!selectedExercise) return;

    const workouts: WorkoutPlan[] = JSON.parse(localStorage.getItem('fitness-ai-workouts') || '[]');
    const data: any[] = [];

    // Reverse to show oldest first
    [...workouts].reverse().forEach(w => {
      const date = new Date(w.createdAt).toLocaleDateString('pt-BR', {day: '2-digit', month: '2-digit'});
      let maxWeight = 0;
      
      w.schedule.forEach(day => {
        day.exercises.forEach(ex => {
          if (ex.name === selectedExercise && ex.weight) {
            const val = parseFloat(ex.weight);
            if (val > maxWeight) maxWeight = val;
          }
        });
      });

      if (maxWeight > 0) {
        data.push({ date, weight: maxWeight });
      }
    });

    setChartData(data);

  }, [selectedExercise]);

  const handleSubmit = async () => {
    if (!log.trim()) return;
    setLoading(true);
    try {
      const response = await analyzeProgress(log);
      setFeedback(response);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20">
      
      {/* Chart Section */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
         <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                <TrendingUp className="text-emerald-500" /> Evolução de Carga
              </h2>
              <p className="text-slate-500 text-sm">Acompanhe o aumento de força nos seus exercícios principais.</p>
            </div>
            
            {availableExercises.length > 0 ? (
               <select 
                className="p-3 rounded-xl border border-gray-200 bg-slate-50 font-bold text-slate-700 outline-none focus:ring-2 focus:ring-emerald-500"
                value={selectedExercise}
                onChange={(e) => setSelectedExercise(e.target.value)}
              >
                {availableExercises.map(ex => <option key={ex} value={ex}>{ex}</option>)}
              </select>
            ) : (
              <p className="text-xs text-amber-500 font-bold bg-amber-50 px-3 py-1 rounded-full">
                Salve treinos com carga para ver gráficos
              </p>
            )}
         </div>

         <div className="h-[300px] w-full">
            {chartData.length > 1 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                  <CartesianGrid stroke="#f1f5f9" strokeDasharray="5 5" vertical={false} />
                  <XAxis 
                    dataKey="date" 
                    stroke="#94a3b8" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false} 
                  />
                  <YAxis 
                    stroke="#94a3b8" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false} 
                    unit="kg"
                  />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    itemStyle={{ color: '#0f172a', fontWeight: 'bold' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="weight" 
                    stroke="#10b981" 
                    strokeWidth={4} 
                    dot={{ r: 6, fill: '#10b981', strokeWidth: 2, stroke: '#fff' }} 
                    activeDot={{ r: 8 }} 
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-300">
                <Activity size={48} className="mb-2 opacity-50" />
                <p>Dados insuficientes para gerar gráfico.</p>
              </div>
            )}
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 flex flex-col">
           <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-amber-100 rounded-lg text-amber-600">
              <Activity size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Diário de Treino</h2>
              <p className="text-slate-500 text-sm">Descreva como se sentiu essa semana.</p>
            </div>
          </div>
          
          <textarea 
            className="flex-1 w-full p-4 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none text-slate-700 min-h-[200px]"
            placeholder="Exemplo: Aumentei carga no agachamento, mas senti o joelho. A dieta está difícil de seguir à noite..."
            value={log}
            onChange={(e) => setLog(e.target.value)}
          />

          <button 
            onClick={handleSubmit} 
            disabled={loading || !log.trim()}
            className="w-full mt-4 py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold transition-all disabled:opacity-70 flex justify-center items-center gap-2 shadow-lg shadow-amber-200"
          >
            {loading ? <Loader2 className="animate-spin" /> : <Send size={20} />}
            Analisar com IA
          </button>
        </div>

        {/* Output Section */}
        <div className={`bg-white rounded-3xl shadow-sm border border-gray-100 p-8 overflow-y-auto max-h-[500px] ${feedback ? 'opacity-100' : 'opacity-50 flex items-center justify-center'}`}>
          {feedback ? (
             <div className="prose prose-amber max-w-none">
               <h3 className="text-xl font-bold text-amber-700 mb-4 flex items-center gap-2">
                 <div className="w-2 h-2 rounded-full bg-amber-500"></div> Feedback do Coach
               </h3>
               <ReactMarkdown>{feedback}</ReactMarkdown>
             </div>
          ) : (
            <div className="text-center text-gray-400">
              <Activity size={48} className="mx-auto mb-4 opacity-20" />
              <p>Sua análise detalhada aparecerá aqui.</p>
            </div>
          )}
        </div>
      </div>

    </div>
  );
};

export default Progress;