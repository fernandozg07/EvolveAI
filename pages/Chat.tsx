import React, { useState, useRef, useEffect } from 'react';
import { sendChatMessage } from '../services/geminiService';
import { ChatMessage, UserProfile } from '../types';
import { MessageCircle, Send, Loader2, Bot, User, Trash2, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | undefined>(undefined);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load History and Profile on Mount
  useEffect(() => {
    // 1. Load Profile
    const savedProfile = localStorage.getItem('fitness-ai-profile');
    if (savedProfile) {
      setUserProfile(JSON.parse(savedProfile));
    }

    // 2. Load Chat History
    const savedHistory = localStorage.getItem('fitness-ai-chat-history');
    if (savedHistory) {
      setMessages(JSON.parse(savedHistory));
    } else {
      // Default welcome message if no history
      const initialMsg: ChatMessage = { 
        id: '1', 
        role: 'model', 
        text: savedProfile 
          ? `Olá ${JSON.parse(savedProfile).name}! Analisei seu perfil. Vi que seu objetivo é ${JSON.parse(savedProfile).goal}. Como posso ajudar hoje?`
          : "Olá! Sou seu assistente fitness. Para uma experiência melhor, preencha seu Perfil no menu.", 
        timestamp: Date.now() 
      };
      setMessages([initialMsg]);
    }
  }, []);

  // Save History whenever messages change
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('fitness-ai-chat-history', JSON.stringify(messages));
    }
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const clearHistory = () => {
    if(confirm("Deseja apagar todo o histórico de conversa?")) {
      localStorage.removeItem('fitness-ai-chat-history');
      setMessages([{ 
        id: Date.now().toString(), 
        role: 'model', 
        text: "Histórico limpo. Vamos começar de novo!", 
        timestamp: Date.now() 
      }]);
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      // Format history for Gemini
      // Filter out only essential history to avoid context limit issues if history is huge, 
      // or send full history if small. For simplicity, sending last 20 messages.
      const historyForAI = messages.slice(-20).map(m => ({
        role: m.role === 'model' ? 'model' : 'user',
        parts: [{ text: m.text }]
      }));

      const responseText = await sendChatMessage(historyForAI, userMsg.text, userProfile);
      
      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText,
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, botMsg]);

    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-8rem)] flex flex-col bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      
      {/* Header */}
      <div className="p-4 border-b border-gray-100 bg-pink-50/50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-pink-100 rounded-lg text-pink-600">
            <MessageCircle size={20} />
          </div>
          <div>
            <h2 className="font-bold text-slate-800">Chat Inteligente</h2>
            {userProfile ? (
              <p className="text-xs text-pink-600 font-medium flex items-center gap-1">
                 <User size={10} /> Conectado a: {userProfile.name}
              </p>
            ) : (
              <Link to="/profile" className="text-xs text-amber-600 font-bold underline flex items-center gap-1">
                <AlertCircle size={10} /> Configure seu perfil
              </Link>
            )}
          </div>
        </div>
        <button onClick={clearHistory} className="p-2 text-slate-400 hover:text-red-500 transition-colors" title="Limpar Histórico">
           <Trash2 size={18} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex gap-3 max-w-[85%] md:max-w-[70%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${msg.role === 'user' ? 'bg-indigo-100 text-indigo-600' : 'bg-pink-100 text-pink-600'}`}>
                {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
              </div>
              <div className={`p-4 rounded-2xl text-sm leading-relaxed ${
                msg.role === 'user' 
                  ? 'bg-indigo-600 text-white rounded-tr-none' 
                  : 'bg-white border border-gray-200 text-slate-700 rounded-tl-none shadow-sm'
              }`}>
                <ReactMarkdown>{msg.text}</ReactMarkdown>
              </div>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
             <div className="flex gap-3 max-w-[80%]">
               <div className="flex-shrink-0 w-8 h-8 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center">
                 <Bot size={16} />
               </div>
               <div className="bg-white border border-gray-200 px-4 py-3 rounded-2xl rounded-tl-none shadow-sm">
                 <Loader2 className="animate-spin text-gray-400" size={16} />
               </div>
             </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 bg-white border-t border-gray-100">
        <form onSubmit={handleSend} className="flex gap-2">
          <input 
            type="text" 
            className="flex-1 p-3 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-pink-500"
            placeholder={userProfile ? `Pergunte sobre seu treino de ${userProfile.goal}...` : "Pergunte algo..."}
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button 
            type="submit" 
            disabled={loading || !input.trim()}
            className="px-4 bg-pink-600 hover:bg-pink-700 text-white rounded-xl transition-colors disabled:opacity-50"
          >
            <Send size={20} />
          </button>
        </form>
      </div>

    </div>
  );
};

export default Chat;