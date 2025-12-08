import React, { useRef, useState, useEffect } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';
import { Camera, Mic, MicOff, Video, VideoOff, Play, Square, Loader2, Info, ChevronDown, CheckCircle } from 'lucide-react';

// Dicionário de exercícios com dicas para o usuário e contexto para a IA
const EXERCISE_GUIDES: Record<string, { label: string, context: string, tips: string[] }> = {
  'squat': {
    label: 'Agachamento (Squat)',
    context: 'O usuário vai realizar Agachamentos. Verifique: 1. Se os joelhos não estão entrando (valgo). 2. Se as costas estão retas. 3. Se a profundidade é adequada (quebrar a paralela).',
    tips: ['Mantenha o peito estufado', 'Joelhos para fora', 'Pés na largura dos ombros', 'Desça como se fosse sentar numa cadeira']
  },
  'pushup': {
    label: 'Flexão de Braço (Push-up)',
    context: 'O usuário vai realizar Flexões. Verifique: 1. Se o quadril não está caindo. 2. Se os cotovelos não estão muito abertos. 3. Amplitude completa de movimento.',
    tips: ['Corpo em linha reta (prancha)', 'Cotovelos próximos ao corpo (45 graus)', 'Toque o peito no chão se possível', 'Contraia o abdômen']
  },
  'lunge': {
    label: 'Afundo (Lunge)',
    context: 'O usuário vai realizar Afundos. Verifique: 1. O joelho da frente não deve passar muito da ponta do pé. 2. O tronco deve ficar vertical. 3. Estabilidade e equilíbrio.',
    tips: ['Passo largo para frente', 'Tronco ereto o tempo todo', 'Joelho de trás quase toca o chão', 'Peso no calcanhar da frente']
  },
  'plank': {
    label: 'Prancha (Plank)',
    context: 'O usuário vai realizar Prancha Isométrica. Verifique: 1. Se o quadril está alinhado (nem alto, nem baixo). 2. Escápulas ativadas. 3. Cabeça alinhada com a coluna.',
    tips: ['Contraia glúteos e abdômen forte', 'Não deixe a lombar arquear', 'Olhe para o chão', 'Respire controladamente']
  },
  'bicep_curl': {
    label: 'Rosca Direta (Bicep Curl)',
    context: 'O usuário vai realizar Rosca Direta com halteres ou barra. Verifique: 1. Se não está usando balanço do corpo (roubando). 2. Cotovelos fixos ao lado do tronco.',
    tips: ['Cotovelos colados na costela', 'Apenas o antebraço se move', 'Controle a descida', 'Sem balançar as costas']
  },
  'other': {
    label: 'Outro / Livre',
    context: 'O usuário fará um exercício livre. Identifique visualmente o que é e corrija a postura padrão.',
    tips: ['Mantenha a postura segura', 'Respire durante o esforço', 'Concentre-se no músculo alvo']
  }
};

const LiveCoach: React.FC = () => {
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [selectedExercise, setSelectedExercise] = useState<string>('squat');
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sessionRef = useRef<any>(null); 
  
  // Audio Refs
  const inputAudioContextRef = useRef<AudioContext | null>(null);
  const outputAudioContextRef = useRef<AudioContext | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null);
  const sourceNodeRef = useRef<MediaStreamAudioSourceNode | null>(null);
  
  const nextStartTimeRef = useRef<number>(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const frameIntervalRef = useRef<number | null>(null);

  const apiKey = process.env.API_KEY;

  useEffect(() => {
    return () => {
      stopSession();
    };
  }, []);

  const initSession = async () => {
    if (!apiKey) {
      alert("Chave API ausente");
      return;
    }
    
    setLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey });
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: true, 
        video: { width: 640, height: 480 } 
      });
      
      mediaStreamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      const inputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      const outputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      
      inputAudioContextRef.current = inputCtx;
      outputAudioContextRef.current = outputCtx;
      nextStartTimeRef.current = 0;

      // Monta o prompt do sistema com o exercício selecionado
      const exerciseContext = EXERCISE_GUIDES[selectedExercise].context;
      const systemInstruction = `Você é um personal trainer especialista via visão computacional.
      CONTEXTO ATUAL: ${exerciseContext}
      
      INSTRUÇÕES GERAIS:
      1. Observe o vídeo e dê feedback em tempo real.
      2. Se a postura estiver ruim, corrija imediatamente sendo específico (ex: "Abaixe mais o quadril", "Junte os cotovelos").
      3. Se estiver boa, elogie e conte as repetições.
      4. Seja energético e motivador.
      5. FALE APENAS EM PORTUGUÊS DO BRASIL.`;

      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } },
          },
          systemInstruction: systemInstruction,
        },
        callbacks: {
          onopen: () => {
            console.log("Session opened");
            setConnected(true);
            setLoading(false);
            
            const source = inputCtx.createMediaStreamSource(stream);
            sourceNodeRef.current = source;
            
            const scriptProcessor = inputCtx.createScriptProcessor(4096, 1, 1);
            scriptProcessorRef.current = scriptProcessor;

            scriptProcessor.onaudioprocess = (e) => {
              if (!connected && !sessionRef.current) return; 

              const inputData = e.inputBuffer.getChannelData(0);
              const pcmBlob = createBlob(inputData);
              
              if (sessionRef.current) {
                sessionRef.current.then((session: any) => {
                   session.sendRealtimeInput({ media: pcmBlob });
                });
              }
            };
            
            source.connect(scriptProcessor);
            scriptProcessor.connect(inputCtx.destination);

            startVideoStreaming();
          },
          onmessage: async (message: LiveServerMessage) => {
            const base64Audio = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (base64Audio) {
               playAudioResponse(base64Audio);
            }

            const interrupted = message.serverContent?.interrupted;
            if (interrupted) {
               stopAllAudio();
            }
          },
          onclose: () => {
            console.log("Session closed");
            stopSession();
          },
          onerror: (e) => {
            console.error("Session error", e);
            stopSession();
          }
        }
      });

      sessionRef.current = sessionPromise;

    } catch (error) {
      console.error("Failed to start session:", error);
      setLoading(false);
      stopSession();
    }
  };

  const startVideoStreaming = () => {
    if (frameIntervalRef.current) clearInterval(frameIntervalRef.current);

    frameIntervalRef.current = window.setInterval(() => {
      if (!videoRef.current || !canvasRef.current || !sessionRef.current) return;

      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      ctx.drawImage(videoRef.current, 0, 0);

      const base64Data = canvas.toDataURL('image/jpeg', 0.6).split(',')[1];
      
      sessionRef.current.then((session: any) => {
        session.sendRealtimeInput({
          media: { data: base64Data, mimeType: 'image/jpeg' }
        });
      });
      
    }, 1000); 
  };

  const stopSession = () => {
    setConnected(false);
    setLoading(false);
    mediaStreamRef.current?.getTracks().forEach(track => track.stop());
    inputAudioContextRef.current?.close();
    outputAudioContextRef.current?.close();
    if (frameIntervalRef.current) {
      clearInterval(frameIntervalRef.current);
      frameIntervalRef.current = null;
    }
    if (scriptProcessorRef.current) {
      scriptProcessorRef.current.disconnect();
      scriptProcessorRef.current = null;
    }
    if (sourceNodeRef.current) {
      sourceNodeRef.current.disconnect();
      sourceNodeRef.current = null;
    }
    sessionRef.current = null;
  };

  const createBlob = (data: Float32Array) => {
    const l = data.length;
    const int16 = new Int16Array(l);
    for (let i = 0; i < l; i++) {
      int16[i] = data[i] * 32768;
    }
    let binary = '';
    const bytes = new Uint8Array(int16.buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return {
      data: btoa(binary),
      mimeType: 'audio/pcm;rate=16000',
    };
  };

  const decode = (base64: string) => {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  };

  const decodeAudioData = async (
    data: Uint8Array,
    ctx: AudioContext,
    sampleRate: number,
    numChannels: number,
  ): Promise<AudioBuffer> => {
    const dataInt16 = new Int16Array(data.buffer);
    const frameCount = dataInt16.length / numChannels;
    const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
    for (let channel = 0; channel < numChannels; channel++) {
      const channelData = buffer.getChannelData(channel);
      for (let i = 0; i < frameCount; i++) {
        channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
      }
    }
    return buffer;
  };

  const playAudioResponse = async (base64Audio: string) => {
    if (!outputAudioContextRef.current) return;
    const ctx = outputAudioContextRef.current;
    const audioBuffer = await decodeAudioData(decode(base64Audio), ctx, 24000, 1);
    const source = ctx.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(ctx.destination);
    source.addEventListener('ended', () => {
      sourcesRef.current.delete(source);
    });
    const currentTime = ctx.currentTime;
    if (nextStartTimeRef.current < currentTime) {
      nextStartTimeRef.current = currentTime;
    }
    source.start(nextStartTimeRef.current);
    nextStartTimeRef.current += audioBuffer.duration;
    sourcesRef.current.add(source);
  };

  const stopAllAudio = () => {
    sourcesRef.current.forEach(source => source.stop());
    sourcesRef.current.clear();
    nextStartTimeRef.current = 0;
  };

  const toggleVideo = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getVideoTracks().forEach(t => t.enabled = !t.enabled);
      setIsVideoOn(!isVideoOn);
    }
  };
  
  const toggleAudio = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getAudioTracks().forEach(t => t.enabled = !t.enabled);
      setIsAudioOn(!isAudioOn);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
       <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
           <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Coach Ao Vivo IA</h2>
           <p className="text-slate-500 mt-1">Selecione o exercício e deixe a IA corrigir sua postura.</p>
        </div>
        
        {/* Exercise Selector */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <select 
              value={selectedExercise}
              onChange={(e) => !connected && setSelectedExercise(e.target.value)}
              disabled={connected}
              className="appearance-none bg-white border border-gray-300 text-slate-700 py-3 pl-4 pr-10 rounded-xl font-bold shadow-sm focus:outline-none focus:ring-2 focus:ring-rose-500 disabled:opacity-70 disabled:bg-gray-100 min-w-[200px]"
            >
              {Object.entries(EXERCISE_GUIDES).map(([key, value]) => (
                <option key={key} value={key}>{value.label}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" size={18} />
          </div>

          {!connected && !loading && (
            <button 
              onClick={initSession}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold shadow-lg shadow-rose-200 transition-all hover:scale-105"
            >
              <Play size={20} fill="currentColor" /> Iniciar
            </button>
          )}
          {loading && (
            <button disabled className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-100 text-slate-400 rounded-xl font-bold cursor-not-allowed">
              <Loader2 className="animate-spin" size={20} /> Conectando...
            </button>
          )}
          {connected && (
            <button 
              onClick={stopSession}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-900 text-white rounded-xl font-bold shadow-lg transition-all"
            >
              <Square size={20} fill="currentColor" /> Parar
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Video Area */}
        <div className="lg:col-span-2 space-y-4">
          <div className="relative bg-black rounded-3xl overflow-hidden shadow-2xl aspect-video ring-4 ring-slate-100">
            {!connected && (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white/50 z-10 bg-slate-900">
                <Camera size={64} className="mb-4 opacity-50" />
                <p className="font-medium text-lg">Câmera pronta</p>
                <p className="text-sm">Selecione o exercício acima para começar</p>
              </div>
            )}
            
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              muted 
              className={`w-full h-full object-cover transform scale-x-[-1] transition-opacity duration-500 ${connected ? 'opacity-100' : 'opacity-0'}`}
            />
            <canvas ref={canvasRef} className="hidden" />

            {connected && (
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90 to-transparent flex justify-between items-end backdrop-blur-sm">
                 <div className="flex gap-4">
                    <button 
                      onClick={toggleVideo}
                      className={`p-4 rounded-full backdrop-blur-md border border-white/20 transition-all ${isVideoOn ? 'bg-white/20 text-white hover:bg-white/30' : 'bg-red-500/80 text-white'}`}
                    >
                      {isVideoOn ? <Video size={24} /> : <VideoOff size={24} />}
                    </button>
                    <button 
                      onClick={toggleAudio}
                      className={`p-4 rounded-full backdrop-blur-md border border-white/20 transition-all ${isAudioOn ? 'bg-white/20 text-white hover:bg-white/30' : 'bg-red-500/80 text-white'}`}
                    >
                      {isAudioOn ? <Mic size={24} /> : <MicOff size={24} />}
                    </button>
                 </div>
                 
                 <div className="flex flex-col items-end">
                     <span className="flex items-center gap-2 mb-1">
                        <span className="flex h-2 w-2 relative">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                        </span>
                        <span className="text-green-400 text-xs font-bold tracking-wider uppercase">Monitorando</span>
                     </span>
                     <span className="text-white font-bold text-sm bg-black/50 px-3 py-1 rounded-full border border-white/10">
                       {EXERCISE_GUIDES[selectedExercise].label}
                     </span>
                 </div>
              </div>
            )}
          </div>
        </div>

        {/* Side Panel: Tips */}
        <div className="lg:col-span-1">
           <div className="bg-white rounded-3xl shadow-lg border border-slate-100 overflow-hidden h-full">
             <div className="bg-rose-50 p-6 border-b border-rose-100">
               <h3 className="font-bold text-rose-800 flex items-center gap-2">
                 <Info size={20} /> Técnica Correta
               </h3>
               <p className="text-rose-600 text-sm mt-1">Siga estas dicas para o {EXERCISE_GUIDES[selectedExercise].label}.</p>
             </div>
             <div className="p-6 space-y-4">
               {EXERCISE_GUIDES[selectedExercise].tips.map((tip, index) => (
                 <div key={index} className="flex gap-3">
                   <CheckCircle className="text-emerald-500 shrink-0" size={20} />
                   <p className="text-slate-600 font-medium text-sm leading-relaxed">{tip}</p>
                 </div>
               ))}
               
               <div className="mt-8 p-4 bg-slate-50 rounded-xl border border-slate-200">
                 <p className="text-xs text-slate-500 text-center uppercase tracking-wider font-bold mb-2">Instrução para IA</p>
                 <p className="text-xs text-slate-400 italic text-center">"{EXERCISE_GUIDES[selectedExercise].context}"</p>
               </div>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default LiveCoach;