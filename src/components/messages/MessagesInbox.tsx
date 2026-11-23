import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MessageThread } from '../../types';
import { 
  MessageSquare, 
  Send, 
  User, 
  CheckCheck, 
  Search, 
  Home, 
  Clock, 
  ShieldCheck,
  Building2,
  PhoneCall,
  ArrowLeft
} from 'lucide-react';

export const MessagesInbox: React.FC = () => {
  const { messages, sendMessage, currentUser } = useApp();

  const [selectedThreadId, setSelectedThreadId] = useState<string>(messages[0]?.id || '');
  const [replyText, setReplyText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileView, setMobileView] = useState<'list' | 'chat'>('list');

  const activeThread = messages.find(m => m.id === selectedThreadId) || messages[0];

  const filteredThreads = messages.filter(t => 
    t.contactName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (t.propertyTitle && t.propertyTitle.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !activeThread) return;

    sendMessage(activeThread.id, replyText);
    setReplyText('');
  };

  return (
    <div className="bg-white rounded-3xl border border-[#D5E1D4] shadow-2xs overflow-hidden flex flex-col md:flex-row h-[78vh] min-h-[520px] max-h-[720px]">
      {/* Left List of Conversations */}
      <div className={`w-full md:w-80 border-r border-gray-200 bg-[#FAFBF9] flex-col shrink-0 ${
        mobileView === 'chat' ? 'hidden md:flex' : 'flex'
      } h-full overflow-hidden`}>
        <div className="p-4 border-b border-gray-200 space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="font-serif-brand text-lg font-bold text-gray-900 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-[#2D4539]" /> Centro de Mensajería
            </h3>
            <span className="text-[11px] font-bold bg-[#2D4539] text-white px-2 py-0.5 rounded-full">
              {messages.filter(m => m.unread).length} nuevos
            </span>
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar cliente o inmueble..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-white border border-[#CBD8CA] rounded-xl text-xs text-gray-800"
            />
          </div>
        </div>

        {/* Thread list */}
        <div className="flex-1 overflow-y-auto divide-y divide-gray-100">
          {filteredThreads.map(thread => {
            const isSelected = thread.id === activeThread?.id;
            return (
              <div
                key={thread.id}
                onClick={() => {
                  setSelectedThreadId(thread.id);
                  setMobileView('chat');
                }}
                className={`p-3.5 cursor-pointer transition-colors text-xs ${
                  isSelected ? 'bg-[#EEF5ED] border-l-4 border-[#2D4539]' : 'hover:bg-gray-100/70'
                }`}
              >
                <div className="flex justify-between items-start mb-1">
                  <span className="font-bold text-gray-900 truncate block max-w-[170px]">{thread.contactName}</span>
                  <span className="text-[10px] text-gray-400 font-mono">{thread.updatedAt}</span>
                </div>

                {thread.propertyTitle && (
                  <p className="text-[11px] text-[#3B5A47] font-semibold truncate flex items-center gap-1 mb-1">
                    <Home className="w-3 h-3 text-[#C36449] shrink-0" /> {thread.propertyTitle}
                  </p>
                )}

                <p className="text-[11px] text-gray-600 line-clamp-1">
                  {thread.lastMessage}
                </p>

                <div className="flex items-center justify-between mt-2 pt-1 border-t border-gray-200/50">
                  <span className={`text-[9px] uppercase px-1.5 py-0.2 rounded font-bold ${
                    thread.contactRole === 'tenant' ? 'bg-rose-50 text-rose-700' :
                    thread.contactRole === 'owner' ? 'bg-emerald-50 text-emerald-700' : 'bg-blue-50 text-blue-700'
                  }`}>
                    {thread.contactRole}
                  </span>
                  {thread.unread && (
                    <span className="w-2 h-2 rounded-full bg-[#C36449]"></span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right Conversation View */}
      {activeThread ? (
        <div className={`flex-1 flex flex-col bg-white min-h-0 ${
          mobileView === 'list' ? 'hidden md:flex' : 'flex'
        }`}>
          {/* Conversation Top Header */}
          <div className="p-3 sm:p-4 border-b border-gray-100 flex items-center justify-between bg-[#FAFBF9] shrink-0">
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                type="button"
                onClick={() => setMobileView('list')}
                className="md:hidden p-1.5 sm:p-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors flex items-center gap-1 text-xs font-semibold shrink-0"
                title="Volver a la lista de mensajes"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="text-[11px]">Chats</span>
              </button>

              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#2D4539] text-white flex items-center justify-center font-bold text-xs shrink-0">
                {activeThread.contactName.substring(0, 2).toUpperCase()}
              </div>
              <div className="min-w-0">
                <h4 className="font-bold text-xs text-gray-900 truncate">{activeThread.contactName}</h4>
                <p className="text-[10px] sm:text-[11px] text-gray-500 truncate">
                  {activeThread.contactEmail} · {activeThread.propertyTitle || 'Inmuebles en consulta'}
                </p>
              </div>
            </div>

            <span className="text-[10px] bg-[#EEF5ED] text-[#2D4539] font-bold px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full border border-[#D5E1D4] shrink-0">
              {activeThread.contactRole.toUpperCase()}
            </span>
          </div>

          {/* Messages list */}
          <div className="flex-1 p-3 sm:p-4 overflow-y-auto space-y-3 bg-[#F8FAF7] text-xs">
            {activeThread.messages.map(msg => {
              const isMine = msg.sender === 'agent' || msg.sender === 'admin';
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[85%] sm:max-w-[80%] p-3 rounded-2xl ${
                      isMine
                        ? 'bg-[#2D4539] text-white rounded-br-xs shadow-xs'
                        : 'bg-white text-gray-800 rounded-bl-xs border border-[#DFE6DE] shadow-2xs'
                    }`}
                  >
                    <div className="flex justify-between items-baseline gap-2 mb-1">
                      <span className={`text-[10px] font-bold ${isMine ? 'text-[#BBE0C7]' : 'text-gray-500'}`}>
                        {msg.senderName} ({msg.sender})
                      </span>
                    </div>
                    <p className="leading-relaxed break-words">{msg.text}</p>
                  </div>
                  <span className="text-[10px] text-gray-400 mt-1 px-1 font-mono">
                    {msg.timestamp}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Reply Form */}
          <form onSubmit={handleSendReply} className="p-2.5 sm:p-3 border-t border-gray-100 bg-white flex items-center gap-2 shrink-0">
            <input
              type="text"
              placeholder={`Responder a ${activeThread.contactName}...`}
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              className="flex-1 text-xs bg-[#FAFBF9] border border-[#CAD8C8] rounded-xl px-3.5 py-2.5 text-gray-800 focus:outline-hidden focus:ring-2 focus:ring-[#2D4539]"
            />
            <button
              type="submit"
              className="px-3.5 sm:px-4 py-2.5 bg-[#2D4539] hover:bg-[#20342A] text-white rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 shadow-2xs shrink-0"
            >
              <Send className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Enviar</span>
            </button>
          </form>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center p-8 text-gray-500 text-xs">
          Selecciona una conversación para responder
        </div>
      )}
    </div>
  );
};
