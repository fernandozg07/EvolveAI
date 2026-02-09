import React, { useState, useEffect } from 'react';
import { Camera, TrendingUp, Calendar, Plus, Image as ImageIcon } from 'lucide-react';
import api from '../services/api';

interface BodyAnalysis {
  id: number;
  front_photo: string;
  back_photo: string;
  side_photo: string;
  created_at: string;
  analysis_result: any;
}

const PhotoComparison: React.FC = () => {
  const [analyses, setAnalyses] = useState<BodyAnalysis[]>([]);
  const [selectedPhotos, setSelectedPhotos] = useState<number[]>([]);
  const [showUpload, setShowUpload] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    loadAnalyses();
  }, []);

  const loadAnalyses = async () => {
    try {
      const { analyses } = await api.getBodyAnalyses();
      setAnalyses(analyses);
    } catch (error) {
      console.error('Erro ao carregar análises:', error);
    }
  };

  const handleUpload = async (files: { front?: File, back?: File, side?: File }) => {
    setUploading(true);
    try {
      await api.uploadBodyPhotos(files);
      await loadAnalyses();
      setShowUpload(false);
    } catch (error) {
      alert('Erro ao fazer upload');
    } finally {
      setUploading(false);
    }
  };

  const togglePhotoSelection = (id: number) => {
    if (selectedPhotos.includes(id)) {
      setSelectedPhotos(selectedPhotos.filter(p => p !== id));
    } else if (selectedPhotos.length < 2) {
      setSelectedPhotos([...selectedPhotos, id]);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const getPhotoUrl = (filename: string) => {
    return `http://localhost:3001/uploads/${filename}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-600 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">📸 Evolução Física</h1>
            <p className="text-white/80">Compare suas fotos ao longo do tempo</p>
          </div>
          <button
            onClick={() => setShowUpload(true)}
            className="bg-white text-purple-600 px-6 py-3 rounded-xl font-bold hover:bg-purple-50 transition-all flex items-center gap-2"
          >
            <Plus size={20} /> Nova Foto
          </button>
        </div>

        {/* Comparação lado a lado */}
        {selectedPhotos.length === 2 && (
          <div className="bg-white rounded-3xl shadow-2xl p-8 mb-8">
            <div className="flex items-center gap-4 mb-6">
              <TrendingUp className="text-green-600" size={32} />
              <div>
                <h2 className="text-2xl font-bold text-slate-800">Comparação</h2>
                <p className="text-slate-500">
                  {formatDate(analyses.find(a => a.id === selectedPhotos[0])?.created_at || '')} vs{' '}
                  {formatDate(analyses.find(a => a.id === selectedPhotos[1])?.created_at || '')}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8">
              {selectedPhotos.map((photoId, index) => {
                const analysis = analyses.find(a => a.id === photoId);
                if (!analysis) return null;

                return (
                  <div key={photoId}>
                    <h3 className="font-bold text-slate-700 mb-4 text-center">
                      {index === 0 ? 'Antes' : 'Depois'} - {formatDate(analysis.created_at)}
                    </h3>
                    <div className="grid grid-cols-3 gap-2">
                      {analysis.front_photo && (
                        <img
                          src={getPhotoUrl(analysis.front_photo)}
                          alt="Frente"
                          className="w-full aspect-[3/4] object-cover rounded-lg"
                        />
                      )}
                      {analysis.side_photo && (
                        <img
                          src={getPhotoUrl(analysis.side_photo)}
                          alt="Lado"
                          className="w-full aspect-[3/4] object-cover rounded-lg"
                        />
                      )}
                      {analysis.back_photo && (
                        <img
                          src={getPhotoUrl(analysis.back_photo)}
                          alt="Costas"
                          className="w-full aspect-[3/4] object-cover rounded-lg"
                        />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              onClick={() => setSelectedPhotos([])}
              className="mt-6 w-full bg-gray-200 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-300 transition-all"
            >
              Limpar Seleção
            </button>
          </div>
        )}

        {/* Timeline de fotos */}
        <div className="bg-white rounded-3xl shadow-2xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <Calendar className="text-purple-600" size={28} />
            <h2 className="text-2xl font-bold text-slate-800">Histórico</h2>
          </div>

          {analyses.length === 0 ? (
            <div className="text-center py-12">
              <ImageIcon className="mx-auto text-gray-300 mb-4" size={64} />
              <p className="text-gray-500 mb-4">Nenhuma foto ainda</p>
              <button
                onClick={() => setShowUpload(true)}
                className="bg-gradient-to-r from-pink-600 to-purple-600 text-white px-6 py-3 rounded-xl font-bold hover:from-pink-700 hover:to-purple-700 transition-all"
              >
                Adicionar Primeira Foto
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {analyses.map((analysis) => (
                <div
                  key={analysis.id}
                  onClick={() => togglePhotoSelection(analysis.id)}
                  className={`cursor-pointer border-4 rounded-2xl p-4 transition-all ${
                    selectedPhotos.includes(analysis.id)
                      ? 'border-purple-600 bg-purple-50'
                      : 'border-gray-200 hover:border-purple-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-bold text-slate-700">
                      {formatDate(analysis.created_at)}
                    </span>
                    {selectedPhotos.includes(analysis.id) && (
                      <span className="bg-purple-600 text-white text-xs px-3 py-1 rounded-full">
                        Selecionado
                      </span>
                    )}
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {analysis.front_photo && (
                      <img
                        src={getPhotoUrl(analysis.front_photo)}
                        alt="Frente"
                        className="w-full aspect-[3/4] object-cover rounded-lg"
                      />
                    )}
                    {analysis.side_photo && (
                      <img
                        src={getPhotoUrl(analysis.side_photo)}
                        alt="Lado"
                        className="w-full aspect-[3/4] object-cover rounded-lg"
                      />
                    )}
                    {analysis.back_photo && (
                      <img
                        src={getPhotoUrl(analysis.back_photo)}
                        alt="Costas"
                        className="w-full aspect-[3/4] object-cover rounded-lg"
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {selectedPhotos.length === 1 && (
            <p className="text-center text-purple-600 font-semibold mt-6">
              Selecione mais uma foto para comparar
            </p>
          )}
        </div>
      </div>

      {/* Modal de Upload */}
      {showUpload && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-8 max-w-2xl w-full">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">Adicionar Novas Fotos</h2>
            
            <UploadForm onSubmit={handleUpload} loading={uploading} />
            
            <button
              onClick={() => setShowUpload(false)}
              className="w-full mt-4 bg-gray-200 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-300 transition-all"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const UploadForm: React.FC<{ onSubmit: (files: any) => void; loading: boolean }> = ({ onSubmit, loading }) => {
  const [files, setFiles] = useState<{ front?: File; back?: File; side?: File }>({});
  const [previews, setPreviews] = useState<{ front?: string; back?: string; side?: string }>({});

  const handleFileChange = (position: 'front' | 'back' | 'side', file: File) => {
    setFiles({ ...files, [position]: file });
    setPreviews({ ...previews, [position]: URL.createObjectURL(file) });
  };

  return (
    <div>
      <div className="grid grid-cols-3 gap-4 mb-6">
        {['front', 'side', 'back'].map((position) => (
          <div key={position}>
            <label className="block cursor-pointer">
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 hover:border-purple-500 transition-all aspect-[3/4] flex items-center justify-center overflow-hidden">
                {previews[position as keyof typeof previews] ? (
                  <img
                    src={previews[position as keyof typeof previews]}
                    alt={position}
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <div className="text-center">
                    <Camera className="mx-auto text-gray-400 mb-2" size={32} />
                    <p className="text-xs text-gray-500 capitalize">
                      {position === 'front' ? 'Frente' : position === 'side' ? 'Lado' : 'Costas'}
                    </p>
                  </div>
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileChange(position as any, file);
                }}
              />
            </label>
          </div>
        ))}
      </div>

      <button
        onClick={() => onSubmit(files)}
        disabled={loading || Object.keys(files).length === 0}
        className="w-full bg-gradient-to-r from-pink-600 to-purple-600 text-white py-4 rounded-xl font-bold hover:from-pink-700 hover:to-purple-700 transition-all disabled:opacity-50"
      >
        {loading ? 'Enviando...' : 'Salvar Fotos'}
      </button>
    </div>
  );
};

export default PhotoComparison;
