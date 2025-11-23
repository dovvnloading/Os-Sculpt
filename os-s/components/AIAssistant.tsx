import React, { useState, useRef, useEffect } from 'react';
import { generateReferenceImage, generateSculptingIdea } from '../services/geminiService';
import { ChatMessage } from '../types';

interface AIAssistantProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AIAssistant: React.FC<AIAssistantProps> = ({ isOpen, onClose }) => {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState<'chat' | 'image'>('chat');
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '1', role: 'model', text: "Os-s System Online. Ready for queries." }
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      if (mode === 'image') {
        const { imageUrl, text } = await generateReferenceImage(userMsg.text);
        const aiMsg: ChatMessage = { 
            id: (Date.now() + 1).toString(), 
            role: 'model', 
            text: text, 
            imageUrl: imageUrl || undefined 
        };
        setMessages(prev => [...prev, aiMsg]);
      } else {
        const text = await generateSculptingIdea(userMsg.text);
        const aiMsg: ChatMessage = { id: (Date.now() + 1).toString(), role: 'model', text };
        setMessages(prev => [...prev, aiMsg]);
      }
    } catch (err) {
       setMessages(prev => [...prev, { id: Date.now().toString(), role: 'model', text: "Error: Connection failed."}]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="absolute right-72 top-12 w-80 h-[calc(100vh-100px)] bg-[#1e1e1e] border border-[#333] shadow-2xl flex flex-col z-50 overflow-hidden font-mono text-xs">
      {/* Window Header */}
      <div className="bg-[#252525] p-2 border-b border-[#333] flex justify-between items-center select-none handle">
        <div className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-orange-500">
                <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/>
                <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                <path d="M12 19v4"/>
                <path d="M8 23h8"/>
            </svg>
            <h3 className="text-neutral-300 font-bold uppercase tracking-wider">AI Copilot</h3>
        </div>
        <button onClick={onClose} className="text-neutral-500 hover:text-white transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6 6 18"/>
                <path d="m6 6 12 12"/>
            </svg>
        </button>
      </div>

      {/* Mode Tabs */}
      <div className="flex bg-[#1a1a1a] border-b border-[#333]">
        <button 
            onClick={() => setMode('chat')}
            className={`flex-1 py-2 text-[10px] uppercase font-bold tracking-wider transition-colors
            ${mode === 'chat' ? 'text-orange-500 border-b-2 border-orange-500 bg-[#222]' : 'text-neutral-500 hover:bg-[#222]'}`}
        >
            Prompt
        </button>
        <button 
            onClick={() => setMode('image')}
            className={`flex-1 py-2 text-[10px] uppercase font-bold tracking-wider transition-colors
            ${mode === 'image' ? 'text-orange-500 border-b-2 border-orange-500 bg-[#222]' : 'text-neutral-500 hover:bg-[#222]'}`}
        >
            Reference
        </button>
      </div>

      {/* Terminal/Chat Area */}
      <div className="flex-1 overflow-y-auto p-3 space-y-4 bg-[#111]">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
            <div className="flex items-center gap-1 mb-1 opacity-50">
                <span className="text-[10px] uppercase">{msg.role === 'user' ? 'Artist' : 'System'}</span>
                <span className="text-[9px]">{new Date(parseInt(msg.id)).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
            </div>
            <div className={`max-w-[95%] p-2 border text-xs leading-relaxed
                ${msg.role === 'user' 
                    ? 'bg-[#1a1a1a] border-[#333] text-neutral-300 border-r-2 border-r-orange-600' 
                    : 'bg-transparent border-transparent text-orange-100/80 pl-0'}`}
            >
              {msg.text}
            </div>
            {msg.imageUrl && (
                <div className="mt-2 w-full border border-[#333] bg-[#000] p-1">
                    <img src={msg.imageUrl} alt="Generated Reference" className="w-full h-auto object-cover opacity-90" />
                    <div className="flex justify-end p-1">
                         <a href={msg.imageUrl} download="reference.png" className="text-[9px] text-orange-500 hover:text-orange-400 uppercase tracking-wider flex items-center gap-1">
                            Download
                            <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
                         </a>
                    </div>
                </div>
            )}
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start items-center gap-2 text-orange-500/50">
             <span className="animate-pulse">_processing</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <form onSubmit={handleSubmit} className="p-2 bg-[#1e1e1e] border-t border-[#333]">
        <div className="relative flex items-center bg-[#111] border border-[#333] focus-within:border-orange-600/50 transition-colors">
            <span className="pl-2 text-orange-500">❯</span>
            <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={mode === 'image' ? "Enter visual parameters..." : "Enter prompt..."}
                className="w-full bg-transparent text-white text-xs py-2 px-2 focus:outline-none placeholder-neutral-700 font-mono"
            />
            <button 
                type="submit" 
                disabled={isLoading}
                className="px-3 text-neutral-500 hover:text-orange-500 disabled:opacity-30 transition-colors"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" x2="11" y1="2" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
            </button>
        </div>
      </form>
    </div>
  );
};