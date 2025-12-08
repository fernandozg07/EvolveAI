import React, { useState } from 'react';
import { analyzeProgress } from '../services/geminiService';
import { Activity, Loader2, Send } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const Progress: React.FC = () => {
  const [log, setLog] = useState('');
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

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
    <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 h-[calc(100vh-8rem)]">
      
      {/* Input Section */}
      <div className="flex flex-col gap-4">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
           <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-amber-100 rounded-lg text-amber-600">
              <Activity size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Análise de Progresso</h2>
              <p className="text-slate-500 text-sm">Conte como você está se sentindo, suas cargas ou sua dieta essa semana.</p>
            </div>
          </div>
          
          <textarea 
            className="w-full h-64 p-4 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none text-slate-700"
            placeholder="Exemplo: Tenho me sentido mais forte no supino (aumentei 5kg!), mas minha energia cai à tarde. Segui a dieta 80% do tempo..."
            value={log}
            onChange={(e) => setLog(e.target.value)}
          />

          <button 
            onClick={handleSubmit} 
            disabled={loading || !log.trim()}
            className="w-full mt-4 py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold transition-all disabled:opacity-70 flex justify-center items-center gap-2 shadow-lg shadow-amber-200"
          >
            {loading ? <Loader2 className="animate-spin" /> : <Send size={20} />}
            Analisar Progresso
          </button>
        </div>
      </div>

      {/* Output Section */}
      <div className={`bg-white rounded-2xl shadow-sm border border-gray-100 p-8 overflow-y-auto ${feedback ? 'opacity-100' : 'opacity-50 flex items-center justify-center'}`}>
        {feedback ? (
           <div className="prose prose-amber max-w-none">
             <h3 className="text-xl font-bold text-amber-700 mb-4">Feedback do Coach</h3>
             <ReactMarkdown>{feedback}</ReactMarkdown>
           </div>
        ) : (
          <div className="text-center text-gray-400">
            <Activity size={48} className="mx-auto mb-4 opacity-20" />
            <p>Sua análise aparecerá aqui.</p>
          </div>
        )}
      </div>

    </div>
  );
};

export default Progress;