import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Message } from '../../types';
import { Send, User, MessageSquare, Clock, ArrowLeft } from 'lucide-react';
import { motion } from 'motion/react';

interface ChatPartner {
  id: number;
  name: string;
}

export const ChatsView: React.FC = () => {
  const { user, sendChatMessage, fetchUserMessages } = useApp();
  const location = useLocation();
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [partners, setPartners] = useState<ChatPartner[]>([]);
  const [activePartner, setActivePartner] = useState<ChatPartner | null>(null);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(true);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Auto-scroll to bottom of chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Fetch all messages for user
  const loadMessages = async (selectPartner?: ChatPartner) => {
    if (!user || !user.id) return;
    try {
      const data = await fetchUserMessages();
      setMessages(data);

      // Extract unique chat partners from messages
      const partnerMap = new Map<number, string>();
      data.forEach((msg: Message) => {
        if (msg.emisorId !== user.id) {
          partnerMap.set(msg.emisorId, msg.emisorNombre);
        }
        if (msg.receptorId !== user.id) {
          partnerMap.set(msg.receptorId, msg.receptorNombre);
        }
      });

      const partnerList: ChatPartner[] = Array.from(partnerMap.entries()).map(([id, name]) => ({
        id,
        name
      }));

      // Check if we came here from "Contactar" button to start a new chat
      const redirectPartner = location.state?.startChatWith as ChatPartner | undefined;
      if (redirectPartner && redirectPartner.id !== user.id) {
        // Add redirect partner to list if they aren't there
        if (!partnerMap.has(redirectPartner.id)) {
          partnerList.unshift(redirectPartner);
        }
        // Set as active chat partner on first load
        if (!activePartner) {
          setActivePartner(redirectPartner);
        }
      }

      setPartners(partnerList);

      // Default active partner if none selected and partners exist
      if (!activePartner && !redirectPartner && partnerList.length > 0) {
        setActivePartner(partnerList[0]);
      }
      
      // If selectPartner is provided, set it
      if (selectPartner) {
        setActivePartner(selectPartner);
      }

    } catch (err) {
      console.error('Error loading chat messages:', err);
    } finally {
      setLoading(false);
    }
  };

  // Poll for new messages every 4 seconds
  useEffect(() => {
    loadMessages();
    const interval = setInterval(() => {
      loadMessages();
    }, 4000);
    return () => clearInterval(interval);
  }, [user, location.state]);

  // Scroll to bottom when active partner or messages change
  useEffect(() => {
    scrollToBottom();
  }, [activePartner, messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !activePartner || !inputText.trim()) return;

    const textToSend = inputText.trim();
    setInputText('');

    try {
      await sendChatMessage(activePartner.id, activePartner.name, textToSend);
      
      // Optimistically append message locally
      const localMsg: Message = {
        id: Math.random().toString(),
        emisorId: user.id || 0,
        emisorNombre: user.name,
        receptorId: activePartner.id,
        receptorNombre: activePartner.name,
        texto: textToSend,
        fechaRegistro: new Date().toISOString()
      };
      setMessages((prev) => [...prev, localMsg]);
      scrollToBottom();
    } catch (err) {
      console.error('Error sending chat message:', err);
    }
  };

  // Filter messages for active conversation
  const activeChatMessages = messages.filter((msg) => {
    if (!activePartner || !user) return false;
    return (
      (msg.emisorId === user.id && msg.receptorId === activePartner.id) ||
      (msg.emisorId === activePartner.id && msg.receptorId === user.id)
    );
  });

  // Helper to get last message of a partner
  const getLastMessage = (partnerId: number) => {
    if (!user) return null;
    const partnerMsgs = messages.filter(
      (m) =>
        (m.emisorId === user.id && m.receptorId === partnerId) ||
        (m.emisorId === partnerId && m.receptorId === user.id)
    );
    if (partnerMsgs.length === 0) return null;
    return partnerMsgs[partnerMsgs.length - 1];
  };

  return (
    <div className="bg-white rounded-[24px] border border-[#E9E1D4] shadow-sm overflow-hidden flex h-[600px]">
      
      {/* Left panel: Conversations List */}
      <div className={`w-full md:w-80 border-r border-[#E9E1D4] bg-[#FDFBF7] flex flex-col ${
        activePartner ? 'hidden md:flex' : 'flex'
      }`}>
        <div className="p-4 border-b border-[#E9E1D4] bg-white">
          <h3 className="text-sm font-serif italic text-brand-primary flex items-center">
            <MessageSquare className="h-4 w-4 mr-1.5 text-brand-secondary opacity-60" />
            Bandeja de Entrada
          </h3>
        </div>

        <div className="flex-grow overflow-y-auto divide-y divide-[#E5DCD0]/40">
          {loading ? (
            <div className="p-8 text-center text-xs text-brand-secondary">
              Cargando conversaciones...
            </div>
          ) : partners.length > 0 ? (
            partners.map((partner) => {
              const isActive = activePartner?.id === partner.id;
              const lastMsg = getLastMessage(partner.id);
              
              return (
                <button
                  key={partner.id}
                  id={`chat-partner-${partner.id}`}
                  onClick={() => setActivePartner(partner)}
                  className={`w-full text-left p-4 transition-colors flex items-start space-x-3 cursor-pointer ${
                    isActive ? 'bg-brand-primary-light border-l-4 border-brand-primary' : 'hover:bg-[#F5F2ED]'
                  }`}
                >
                  <div className="w-9 h-9 rounded-xl bg-[#7C8B7F]/20 text-brand-primary flex items-center justify-center font-bold text-xs uppercase flex-shrink-0">
                    {partner.name.slice(0, 2)}
                  </div>
                  <div className="flex-grow min-w-0">
                    <div className="flex justify-between items-baseline">
                      <h4 className="text-xs font-bold text-brand-primary truncate">{partner.name}</h4>
                      {lastMsg && (
                        <span className="text-[9px] text-brand-secondary opacity-80 flex items-center">
                          <Clock className="h-2.5 w-2.5 mr-0.5" />
                          {new Date(lastMsg.fechaRegistro).toLocaleTimeString('es-MX', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-brand-secondary truncate font-medium pt-0.5">
                      {lastMsg ? lastMsg.texto : 'Empezar conversación...'}
                    </p>
                  </div>
                </button>
              );
            })
          ) : (
            <div className="p-8 text-center text-xs text-brand-secondary italic">
              No tienes mensajes activos. Ve a la galería de reportes para contactar con otros vecinos.
            </div>
          )}
        </div>
      </div>

      {/* Right panel: Active Chat Log */}
      <div className={`flex-grow flex flex-col bg-white ${
        !activePartner ? 'hidden md:flex' : 'flex'
      }`}>
        {activePartner ? (
          <>
            {/* Active partner header bar */}
            <div className="p-4 border-b border-[#E9E1D4] flex items-center justify-between bg-white flex-shrink-0">
              <div className="flex items-center space-x-3">
                <button 
                  onClick={() => setActivePartner(null)}
                  className="md:hidden p-1.5 hover:bg-[#F5F2ED] rounded-lg text-brand-secondary border-0"
                >
                  <ArrowLeft className="h-4 w-4" />
                </button>
                <div className="w-8 h-8 rounded-lg bg-[#7C8B7F]/20 text-brand-primary flex items-center justify-center font-bold text-xs uppercase">
                  {activePartner.name.slice(0, 2)}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-brand-primary">{activePartner.name}</h4>
                  <p className="text-[9px] text-brand-secondary font-medium uppercase tracking-wider">Vecino de la comunidad</p>
                </div>
              </div>
            </div>

            {/* Message log */}
            <div className="flex-grow overflow-y-auto p-4 space-y-3 bg-[#FDFBF7]/30">
              {activeChatMessages.length > 0 ? (
                activeChatMessages.map((msg, index) => {
                  const isMe = msg.emisorId === user?.id;
                  return (
                    <div 
                      key={msg.id || index} 
                      className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[75%] rounded-[18px] px-4 py-2.5 shadow-sm text-xs font-semibold ${
                        isMe 
                          ? 'bg-brand-primary text-white rounded-tr-none' 
                          : 'bg-white border border-[#E9E1D4] text-[#2D2D2D] rounded-tl-none'
                      }`}>
                        <p className="leading-relaxed whitespace-pre-wrap">{msg.texto}</p>
                        <span className={`text-[8px] block text-right mt-1 opacity-70 font-medium ${
                          isMe ? 'text-white' : 'text-brand-secondary'
                        }`}>
                          {new Date(msg.fechaRegistro).toLocaleTimeString('es-MX', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="p-8 text-center text-xs text-brand-secondary italic">
                  Escribe un mensaje para iniciar la conversación con {activePartner.name}. Cooridna detalles de avistamiento o entrega de forma segura.
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input form */}
            <form onSubmit={handleSend} className="p-4 border-t border-[#E9E1D4] bg-white flex-shrink-0">
              <div className="flex space-x-3">
                <input
                  type="text"
                  id="chat-input-text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={`Escribir mensaje a ${activePartner.name}...`}
                  className="flex-grow h-11 px-4 bg-[#FDFBF7] border border-[#E9E1D4] rounded-xl focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/10 text-xs font-medium text-[#2D2D2D]"
                  required
                  autoComplete="off"
                />
                <button
                  type="submit"
                  id="chat-send-btn"
                  className="h-11 w-11 bg-brand-primary hover:bg-brand-primary-hover text-[#FDFBF7] rounded-xl flex items-center justify-center shadow-sm border-0 cursor-pointer transition-colors"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex-grow flex flex-col items-center justify-center text-center p-8 space-y-3">
            <MessageSquare className="h-10 w-10 text-brand-secondary opacity-40" />
            <h4 className="text-sm font-bold text-brand-primary">Selecciona una conversación</h4>
            <p className="text-xs text-brand-secondary max-w-xs leading-relaxed">
              Elige un vecino de la lista de la izquierda o inicia un chat privado desde la galería de reportes para coordinar búsquedas.
            </p>
          </div>
        )}
      </div>

    </div>
  );
};
