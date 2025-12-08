import React, { useState } from 'react';
import { explainExercise } from '../services/geminiService';
import { ExerciseInfo } from '../types';
import { BookOpen, Search, Loader2, AlertCircle, CheckCircle } from 'lucide-react';

const ExerciseLibrary: React.FC = () => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [exercise, setExercise] = useState<ExerciseInfo | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setExercise(null);
    try {
      const data = await explainExercise(query);
      setExercise(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
       <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-cyan-100 rounded-lg text-cyan-600">
            <BookOpen size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Biblioteca de Exercícios</h2>
            <p className="text-slate-500 text-sm">Domine sua técnica com a orientação da IA.</p>
          </div>
        </div>

        <form onSubmit={handleSearch} className="relative">
          <input 
            type="text" 
            placeholder="ex: Supino, Agachamento, Prancha..." 
            className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-cyan-500 shadow-sm"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <button 
            type="submit" 
            className="absolute right-2 top-2 bottom-2 px-4 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg font-medium transition-colors"
            disabled={loading}
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : 'Buscar'}
          </button>
        </form>

        <div className="mt-4 flex flex-wrap gap-2 text-sm text-gray-500">
          <span>Populares:</span>
          {['Agachamento', 'Flexão', 'Burpee', 'Afundo'].map(t => (
            <button key={t} onClick={() => { setQuery(t); }} className="text-cyan-600 hover:underline">{t}</button>
          ))}
        </div>
      </div>

      {exercise && (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden animate-fade-in">
          <div className="bg-cyan-600 p-6 text-white">
            <h2 className="text-3xl font-bold">{exercise.name}</h2>
            <div className="mt-2 flex flex-wrap gap-2">
              {exercise.targetMuscles.map(m => (
                <span key={m} className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm">{m}</span>
              ))}
            </div>
          </div>
          
          <div className="p-6 md:p-8 space-y-8">
            <section>
              <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <CheckCircle className="text-emerald-500" /> Execução Perfeita
              </h3>
              <ul className="space-y-3">
                {exercise.technique.map((step, i) => (
                  <li key={i} className="flex gap-3 text-slate-700">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-xs">{i + 1}</span>
                    {step}
                  </li>
                ))}
              </ul>
            </section>

             <section>
              <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <AlertCircle className="text-red-500" /> Erros Comuns
              </h3>
              <ul className="space-y-3">
                {exercise.commonMistakes.map((mistake, i) => (
                  <li key={i} className="flex gap-3 text-slate-700 bg-red-50 p-3 rounded-lg border border-red-100">
                     <span className="text-red-500 font-bold">•</span> {mistake}
                  </li>
                ))}
              </ul>
            </section>

             <section>
              <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Variações</h3>
              <div className="flex flex-wrap gap-2">
                {exercise.variations.map((v, i) => (
                  <span key={i} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">{v}</span>
                ))}
              </div>
            </section>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExerciseLibrary;