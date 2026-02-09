import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, User, Target, Activity, Utensils, AlertCircle } from 'lucide-react';
import api from '../services/api';

const Onboarding: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    weight: '',
    height: '',
    gender: 'male',
    goal: '',
    activity_level: '',
    injuries: '',
    equipment: '',
    dietary_restrictions: ''
  });

  const [photos, setPhotos] = useState<{
    front?: File,
    back?: File,
    side?: File
  }>({});

  const [photoPreview, setPhotoPreview] = useState<{
    front?: string,
    back?: string,
    side?: string
  }>({});

  const handlePhotoChange = (position: 'front' | 'back' | 'side', file: File) => {
    setPhotos({ ...photos, [position]: file });
    setPhotoPreview({ ...photoPreview, [position]: URL.createObjectURL(file) });
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // 1. Salvar perfil
      await api.updateProfile(formData);

      // 2. Upload de fotos
      if (photos.front || photos.back || photos.side) {
        const uploadResult = await api.uploadBodyPhotos(photos);
        
        // 3. Analisar fotos com IA (você pode chamar Gemini aqui)
        // const analysis = await analyzeBodyWithAI(uploadResult.photos);
        // await api.updateBodyAnalysis(uploadResult.id, { analysis_result: analysis });
      }

      navigate('/');
    } catch (error) {
      console.error('Erro no onboarding:', error);
      alert('Erro ao salvar dados. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-600 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Progress Bar */}
        <div className="bg-white/20 rounded-full h-2 mb-8">
          <div 
            className="bg-white h-2 rounded-full transition-all"
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>

        <div className="bg-white rounded-3xl shadow-2xl p-8">
          {/* Step 1: Informações Básicas */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <User className="mx-auto text-purple-600 mb-4" size={48} />
                <h2 className="text-2xl font-bold text-slate-800">Informações Básicas</h2>
                <p className="text-slate-500">Vamos conhecer você melhor</p>
              </div>

              <input
                type="text"
                placeholder="Nome completo"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full p-4 rounded-xl border-2 border-gray-200 focus:border-purple-500 outline-none"
              />

              <div className="grid grid-cols-2 gap-4">
                <input
                  type="number"
                  placeholder="Idade"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  className="p-4 rounded-xl border-2 border-gray-200 focus:border-purple-500 outline-none"
                />
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  className="p-4 rounded-xl border-2 border-gray-200 focus:border-purple-500 outline-none"
                >
                  <option value="male">Masculino</option>
                  <option value="female">Feminino</option>
                  <option value="other">Outro</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <input
                  type="number"
                  placeholder="Peso (kg)"
                  value={formData.weight}
                  onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                  className="p-4 rounded-xl border-2 border-gray-200 focus:border-purple-500 outline-none"
                />
                <input
                  type="number"
                  placeholder="Altura (cm)"
                  value={formData.height}
                  onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                  className="p-4 rounded-xl border-2 border-gray-200 focus:border-purple-500 outline-none"
                />
              </div>

              <button
                onClick={() => setStep(2)}
                disabled={!formData.name || !formData.age || !formData.weight || !formData.height}
                className="w-full bg-gradient-to-r from-pink-600 to-purple-600 text-white py-4 rounded-xl font-bold hover:from-pink-700 hover:to-purple-700 transition-all disabled:opacity-50"
              >
                Próximo
              </button>
            </div>
          )}

          {/* Step 2: Objetivos e Estilo de Vida */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <Target className="mx-auto text-purple-600 mb-4" size={48} />
                <h2 className="text-2xl font-bold text-slate-800">Seus Objetivos</h2>
                <p className="text-slate-500">O que você quer alcançar?</p>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Objetivo Principal</label>
                <select
                  value={formData.goal}
                  onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
                  className="w-full p-4 rounded-xl border-2 border-gray-200 focus:border-purple-500 outline-none"
                >
                  <option value="">Selecione...</option>
                  <option value="muscle_gain">Ganhar Massa Muscular</option>
                  <option value="weight_loss">Perder Peso</option>
                  <option value="strength">Ganhar Força</option>
                  <option value="endurance">Melhorar Resistência</option>
                  <option value="health">Saúde Geral</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Nível de Atividade</label>
                <select
                  value={formData.activity_level}
                  onChange={(e) => setFormData({ ...formData, activity_level: e.target.value })}
                  className="w-full p-4 rounded-xl border-2 border-gray-200 focus:border-purple-500 outline-none"
                >
                  <option value="">Selecione...</option>
                  <option value="sedentary">Sedentário (pouco ou nenhum exercício)</option>
                  <option value="light">Leve (1-3 dias/semana)</option>
                  <option value="moderate">Moderado (3-5 dias/semana)</option>
                  <option value="active">Ativo (6-7 dias/semana)</option>
                  <option value="very_active">Muito Ativo (2x por dia)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Equipamentos Disponíveis</label>
                <select
                  value={formData.equipment}
                  onChange={(e) => setFormData({ ...formData, equipment: e.target.value })}
                  className="w-full p-4 rounded-xl border-2 border-gray-200 focus:border-purple-500 outline-none"
                >
                  <option value="">Selecione...</option>
                  <option value="gym">Academia Completa</option>
                  <option value="home_basic">Casa (halteres, elásticos)</option>
                  <option value="bodyweight">Apenas Peso Corporal</option>
                </select>
              </div>

              <textarea
                placeholder="Lesões ou limitações físicas (opcional)"
                value={formData.injuries}
                onChange={(e) => setFormData({ ...formData, injuries: e.target.value })}
                className="w-full p-4 rounded-xl border-2 border-gray-200 focus:border-purple-500 outline-none"
                rows={3}
              />

              <textarea
                placeholder="Restrições alimentares (opcional)"
                value={formData.dietary_restrictions}
                onChange={(e) => setFormData({ ...formData, dietary_restrictions: e.target.value })}
                className="w-full p-4 rounded-xl border-2 border-gray-200 focus:border-purple-500 outline-none"
                rows={3}
              />

              <div className="flex gap-4">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 bg-gray-200 text-gray-700 py-4 rounded-xl font-bold hover:bg-gray-300 transition-all"
                >
                  Voltar
                </button>
                <button
                  onClick={() => setStep(3)}
                  disabled={!formData.goal || !formData.activity_level || !formData.equipment}
                  className="flex-1 bg-gradient-to-r from-pink-600 to-purple-600 text-white py-4 rounded-xl font-bold hover:from-pink-700 hover:to-purple-700 transition-all disabled:opacity-50"
                >
                  Próximo
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Fotos Corporais */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <Camera className="mx-auto text-purple-600 mb-4" size={48} />
                <h2 className="text-2xl font-bold text-slate-800">Fotos de Referência</h2>
                <p className="text-slate-500">Para a IA analisar seu corpo e criar treinos personalizados</p>
              </div>

              <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 flex gap-3">
                <AlertCircle className="text-blue-600 flex-shrink-0" size={24} />
                <div className="text-sm text-blue-800">
                  <p className="font-bold mb-1">Dicas para melhores fotos:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Use roupas justas ou traje de banho</li>
                    <li>Boa iluminação natural</li>
                    <li>Fundo neutro</li>
                    <li>Corpo inteiro visível</li>
                  </ul>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                {['front', 'side', 'back'].map((position) => (
                  <div key={position} className="text-center">
                    <label className="block cursor-pointer">
                      <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 hover:border-purple-500 transition-all aspect-[3/4] flex items-center justify-center overflow-hidden">
                        {photoPreview[position as keyof typeof photoPreview] ? (
                          <img 
                            src={photoPreview[position as keyof typeof photoPreview]} 
                            alt={position}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          <div className="text-center">
                            <Camera className="mx-auto text-gray-400 mb-2" size={32} />
                            <p className="text-xs text-gray-500 capitalize">{position === 'front' ? 'Frente' : position === 'side' ? 'Lado' : 'Costas'}</p>
                          </div>
                        )}
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handlePhotoChange(position as any, file);
                        }}
                      />
                    </label>
                  </div>
                ))}
              </div>

              <p className="text-xs text-center text-gray-500">
                As fotos são opcionais, mas ajudam a IA a criar treinos mais precisos
              </p>

              <div className="flex gap-4">
                <button
                  onClick={() => setStep(2)}
                  className="flex-1 bg-gray-200 text-gray-700 py-4 rounded-xl font-bold hover:bg-gray-300 transition-all"
                >
                  Voltar
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-pink-600 to-purple-600 text-white py-4 rounded-xl font-bold hover:from-pink-700 hover:to-purple-700 transition-all disabled:opacity-50"
                >
                  {loading ? 'Salvando...' : 'Finalizar'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
