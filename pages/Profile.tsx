import React, { useState, useEffect } from 'react';
import { User, Save, Activity, HeartPulse, Dumbbell, AlertTriangle, Utensils, Settings } from 'lucide-react';
import { UserProfile } from '../types';
import { useAuth } from '../contexts/AuthContext';

const Profile: React.FC = () => {
  const { currentUser } = useAuth();
  const [formData, setFormData] = useState<UserProfile>({
    name: '',
    age: '',
    weight: '',
    height: '',
    gender: 'Masculino',
    goal: 'Hipertrofia',
    activityLevel: 'Moderadamente Ativo',
    injuries: '',
    equipment: 'Academia Completa',
    dietaryRestrictions: 'Nenhuma'
  });

  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!currentUser) return;
    const savedProfile = localStorage.getItem(`fitness-ai-profile-${currentUser}`);
    if (savedProfile) {
      setFormData(JSON.parse(savedProfile));
    }
  }, [currentUser]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setSaved(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentUser) {
      localStorage.setItem(`fitness-ai-profile-${currentUser}`, JSON.stringify(formData));
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-8 text-white">
          <div className="flex items-center gap-3 mb-2">
            <Settings className="text-blue-200" size={32} />
            <h2 className="text-3xl font-extrabold tracking-tight">Configurações da Conta</h2>
          </div>
          <p className="text-blue-100 max-w-2xl">
            Estes dados são usados pela Inteligência Artificial para personalizar seus treinos, dietas e dicas no chat. Seus dados ficam salvos apenas neste dispositivo.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          
          {/* Dados Pessoais */}
          <section>
            <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2 mb-4 border-b border-gray-100 pb-2">
              <Activity className="text-indigo-500" size={20} /> Dados Corporais
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase">Nome / Apelido</label>
                <input required name="name" value={formData.name} onChange={handleChange} type="text" className="w-full p-3 rounded-xl border border-gray-200 bg-slate-50 focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="Como quer ser chamado?" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase">Idade</label>
                <input required name="age" value={formData.age} onChange={handleChange} type="number" className="w-full p-3 rounded-xl border border-gray-200 bg-slate-50 focus:ring-2 focus:ring-indigo-500 outline-none" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase">Peso (kg)</label>
                <input required name="weight" value={formData.weight} onChange={handleChange} type="number" className="w-full p-3 rounded-xl border border-gray-200 bg-slate-50 focus:ring-2 focus:ring-indigo-500 outline-none" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase">Altura (cm)</label>
                <input required name="height" value={formData.height} onChange={handleChange} type="number" className="w-full p-3 rounded-xl border border-gray-200 bg-slate-50 focus:ring-2 focus:ring-indigo-500 outline-none" />
              </div>
            </div>
          </section>

          {/* Objetivos e Contexto */}
          <section>
             <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2 mb-4 border-b border-gray-100 pb-2">
              <HeartPulse className="text-rose-500" size={20} /> Objetivos & Rotina
            </h3>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase">Objetivo Principal</label>
                  <select name="goal" value={formData.goal} onChange={handleChange} className="w-full p-3 rounded-xl border border-gray-200 bg-slate-50 focus:ring-2 focus:ring-indigo-500 outline-none">
                    <option>Hipertrofia</option>
                    <option>Emagrecimento</option>
                    <option>Força</option>
                    <option>Saúde e Bem-estar</option>
                    <option>Performance Atlética</option>
                  </select>
               </div>
               <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase">Nível de Atividade</label>
                  <select name="activityLevel" value={formData.activityLevel} onChange={handleChange} className="w-full p-3 rounded-xl border border-gray-200 bg-slate-50 focus:ring-2 focus:ring-indigo-500 outline-none">
                    <option>Sedentário</option>
                    <option>Levemente Ativo</option>
                    <option>Moderadamente Ativo</option>
                    <option>Muito Ativo</option>
                  </select>
               </div>
             </div>
          </section>

          {/* Detalhes Técnicos */}
          <section>
             <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2 mb-4 border-b border-gray-100 pb-2">
              <Dumbbell className="text-gray-600" size={20} /> Equipamentos & Limitações
            </h3>
             <div className="grid grid-cols-1 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
                     <AlertTriangle size={14} className="text-amber-500" /> Histórico de Lesões / Dores
                  </label>
                  <textarea 
                    name="injuries" 
                    value={formData.injuries} 
                    onChange={handleChange} 
                    className="w-full p-3 rounded-xl border border-gray-200 bg-slate-50 focus:ring-2 focus:ring-indigo-500 outline-none resize-none h-24" 
                    placeholder="Ex: Tenho condromalácia no joelho direito, dor no ombro esquerdo..." 
                  />
                  <p className="text-xs text-slate-400">A IA usará isso para evitar exercícios perigosos para você.</p>
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase">Equipamento Disponível</label>
                    <input name="equipment" value={formData.equipment} onChange={handleChange} type="text" className="w-full p-3 rounded-xl border border-gray-200 bg-slate-50 focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="Ex: Academia completa, Apenas halteres..." />
                  </div>
                   <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
                       <Utensils size={14} className="text-emerald-500" /> Restrições Alimentares
                    </label>
                    <input name="dietaryRestrictions" value={formData.dietaryRestrictions} onChange={handleChange} type="text" className="w-full p-3 rounded-xl border border-gray-200 bg-slate-50 focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="Ex: Intolerância a lactose, Vegano..." />
                  </div>
               </div>
             </div>
          </section>

          <div className="pt-6">
            <button 
              type="submit" 
              className={`w-full py-4 rounded-xl font-bold shadow-lg transition-all flex justify-center items-center gap-2 transform active:scale-95 text-white ${saved ? 'bg-green-600 hover:bg-green-700' : 'bg-indigo-600 hover:bg-indigo-700'}`}
            >
              <Save size={20} /> {saved ? 'Dados Salvos com Sucesso!' : 'Salvar Alterações'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default Profile;