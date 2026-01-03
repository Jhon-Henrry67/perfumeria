
import React, { useState, useRef, useEffect } from 'react';
import { getFragranceAdvice } from '../services/geminiService';
import { ChatMessage } from '../types';

interface AIChatAssistantProps {
  isOpenControlled?: boolean;
  onToggleControlled?: () => void;
}

const AIChatAssistant: React.FC<AIChatAssistantProps> = ({ isOpenControlled, onToggleControlled }) => {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', content: "¡Hola! Soy tu sumiller de perfumes con IA. ¿En qué puedo ayudarte hoy?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const isOpen = isOpenControlled !== undefined ? isOpenControlled : internalIsOpen;
  const toggleOpen = onToggleControlled || (() => setInternalIsOpen(!internalIsOpen));

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async (text?: string) => {
    const messageContent = text || input;
    if (!messageContent.trim() || isLoading) return;

    const userMsg: ChatMessage = { role: 'user', content: messageContent };
    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setInput('');
    setIsLoading(true);

    const advice = await getFragranceAdvice(newHistory);
    setMessages(prev => [...prev, { role: 'model', content: advice }]);
    setIsLoading(false);
  };

  return (
    <>
      <button 
        onClick={toggleOpen}
        className="fixed bottom-6 right-6 w-14 h-14 bg-primary text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-all z-50 group"
      >
        <span className="material-symbols-outlined text-[30px] group-hover:rotate-12 transition-transform">
          {isOpen ? 'close' : 'chat'}
        </span>
        {!isOpen && (
          <span className="absolute -top-1 -left-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
          </span>
        )}
      </button>

      {isOpen && (
        <div className="fixed bottom-24 right-6 w-[90vw] md:w-[400px] h-[500px] bg-surface-dark border border-border-dark rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden animate-fade-in-up">
          <div className="bg-primary p-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <span className="material-symbols-outlined text-white">smart_toy</span>
            </div>
            <div>
              <h3 className="text-white font-bold text-sm">Asistente de Perfumes</h3>
              <p className="text-white/70 text-[10px] flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
                IA Activa
              </p>
            </div>
          </div>

          <div 
            ref={scrollRef}
            className="flex-grow overflow-y-auto p-4 flex flex-col gap-4 no-scrollbar"
          >
            {messages.map((m, idx) => (
              <div 
                key={idx} 
                className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed ${
                  m.role === 'user' 
                    ? 'bg-primary/20 text-white self-end rounded-tr-none border border-primary/20' 
                    : 'bg-background-dark text-text-secondary self-start rounded-tl-none border border-border-dark'
                }`}
              >
                {m.content}
              </div>
            ))}
            {isLoading && (
              <div className="bg-background-dark text-text-secondary p-3 rounded-2xl rounded-tl-none self-start border border-border-dark flex gap-1">
                <span className="w-1.5 h-1.5 bg-primary/50 rounded-full animate-bounce"></span>
                <span className="w-1.5 h-1.5 bg-primary/50 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-1.5 h-1.5 bg-primary/50 rounded-full animate-bounce [animation-delay:0.4s]"></span>
              </div>
            )}
          </div>

          <div className="p-4 border-t border-border-dark bg-background-dark/50">
            <div className="relative flex items-center">
              <input 
                type="text" 
                placeholder="Escribe tu consulta..."
                className="w-full bg-surface-dark border-border-dark rounded-xl focus:ring-primary focus:border-primary text-sm p-3 pr-12 text-white"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
              />
              <button 
                onClick={() => handleSend()}
                disabled={isLoading}
                className="absolute right-2 text-primary hover:text-white transition-colors disabled:opacity-50"
              >
                <span className="material-symbols-outlined">send</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AIChatAssistant;
