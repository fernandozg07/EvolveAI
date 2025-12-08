import React from 'react';
import { Link } from 'react-router-dom';
import { Dumbbell, Utensils, BookOpen, Activity, MessageCircle, BarChart, ArrowRight, Camera, Sparkles } from 'lucide-react';

const Home: React.FC = () => {
  const features = [
    {
      title: "Coach Ao Vivo",
      desc: "Análise de postura em tempo real via câmera.",
      icon: <Camera className="text-white" size={24} />,
      to: "/live-coach",
      color: "from-rose-500 to-orange-600",
      textColor: "text-rose-600",
      featured: true
    },
    {
      title: "Gerar Treino",
      desc: "Planos de treino personalizados para seus objetivos.",
      icon: <Dumbbell className="text-white" size={24} />,
      to: "/workout",
      color: "from-indigo-500 to-purple-600",
      textColor: "text-indigo-600"
    },
    {
      title: "Plano de Dieta",
      desc: "Nutrição com macros calculados para você.",
      icon: <Utensils className="text-white" size={24} />,
      to: "/diet",
      color: "from-emerald-500 to-teal-600",
      textColor: "text-emerald-600"
    },
    {
      title: "Biblioteca",
      desc: "Aprenda a técnica correta dos exercícios.",
      icon: <BookOpen className="text-white" size={24} />,
      to: "/exercises",
      color: "from-cyan-500 to-blue-600",
      textColor: "text-cyan-600"
    },
    {
      title: "Chat com IA",
      desc: "Tire dúvidas sobre saúde e fitness.",
      icon: <MessageCircle className="text-white" size={24} />,
      to: "/chat",
      color: "from-pink-500 to-fuchsia-600",
      textColor: "text-pink-600"
    },
    {
      title: "Analisar Progresso",
      desc: "Registre sua evolução e receba feedback.",
      icon: <Activity className="text-white" size={24} />,
      to: "/progress",
      color: "from-amber-500 to-orange-600",
      textColor: "text-amber-600"
    },
  ];

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-slate-900 text-white shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-slate-900 to-purple-900 opacity-80"></div>
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-purple-500 rounded-full blur-3xl opacity-20"></div>
        <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-indigo-500 rounded-full blur-3xl opacity-20"></div>
        
        <div className="relative z-10 p-8 md:p-16 text-center max-w-4xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 text-sm font-medium text-indigo-200">
            <Sparkles size={16} /> Agora com Visão Computacional em Tempo Real
          </div>
          <h1 className="text-5xl md:text-6xl font-black tracking-tight leading-tight">
            Treine Melhor com <br/>
            <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">Gemini AI</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto font-light leading-relaxed">
            Seu treinador pessoal inteligente. Gere planos, corrija sua postura com a câmera e controle sua nutrição — tudo em um só lugar.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-4">
             <Link to="/live-coach" className="px-8 py-4 bg-white text-slate-900 rounded-full font-bold hover:bg-indigo-50 transition-colors shadow-lg flex items-center justify-center gap-2">
               <Camera size={20} /> Testar Coach Ao Vivo
             </Link>
             <Link to="/workout" className="px-8 py-4 bg-indigo-600 text-white rounded-full font-bold hover:bg-indigo-500 transition-colors shadow-lg shadow-indigo-900/50">
               Gerar Plano
             </Link>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, idx) => (
          <Link 
            key={idx} 
            to={feature.to}
            className={`group relative overflow-hidden bg-white rounded-3xl shadow-sm border border-slate-100 p-8 flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${feature.featured ? 'ring-2 ring-rose-100' : ''}`}
          >
            <div className={`absolute top-0 right-0 p-3 opacity-0 group-hover:opacity-10 transition-opacity duration-500`}>
             <div className={`w-32 h-32 rounded-full bg-gradient-to-br ${feature.color} blur-3xl`}></div>
            </div>

            <div className="relative z-10">
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center shadow-lg shadow-gray-200 mb-6 group-hover:scale-110 transition-transform duration-300`}>
                {feature.icon}
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">{feature.title}</h3>
              <p className="text-slate-500 text-base leading-relaxed mb-6">{feature.desc}</p>
            </div>
            
            <div className={`flex items-center text-sm font-bold ${feature.textColor} mt-auto`}>
              <span className="group-hover:mr-2 transition-all">Abrir Recurso</span> 
              <ArrowRight size={16} className="ml-1 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Home;