import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AppNotification } from '../../types';
import { 
  Bell, 
  X, 
  CheckCheck, 
  Trash2, 
  Calendar, 
  Wrench, 
  UserCheck, 
  FileText, 
  CreditCard, 
  MessageSquare,
  ArrowRight,
  ExternalLink,
  Clock,
  Filter
} from 'lucide-react';

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab?: (tab: string) => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({
  isOpen,
  onClose,
  onNavigateTab
}) => {
  const { 
    notifications, 
    unreadNotificationsCount, 
    markNotificationAsRead, 
    markAllNotificationsAsRead, 
    clearNotification,
    showToast 
  } = useApp();

  const [filterType, setFilterType] = useState<string>('all');

  if (!isOpen) return null;

  const filteredNotifications = notifications.filter(notif => {
    if (filterType === 'all') return true;
    if (filterType === 'unread') return !notif.read;
    return notif.type === filterType;
  });

  const getNotificationIcon = (type: AppNotification['type']) => {
    switch (type) {
      case 'appointment':
        return <Calendar className="w-5 h-5 text-blue-600" />;
      case 'maintenance':
        return <Wrench className="w-5 h-5 text-amber-600" />;
      case 'lead':
        return <UserCheck className="w-5 h-5 text-emerald-600" />;
      case 'contract':
        return <FileText className="w-5 h-5 text-purple-600" />;
      case 'payment':
        return <CreditCard className="w-5 h-5 text-emerald-600" />;
      case 'system':
        return <Bell className="w-5 h-5 text-rose-600" />;
      default:
        return <MessageSquare className="w-5 h-5 text-gray-600" />;
    }
  };

  const getBadgeColor = (type: AppNotification['type']) => {
    switch (type) {
      case 'appointment':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'maintenance':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'lead':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'contract':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'payment':
        return 'bg-teal-100 text-teal-800 border-teal-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getActionTab = (type: AppNotification['type']) => {
    switch (type) {
      case 'appointment': return 'calendar';
      case 'maintenance': return 'admin_dashboard';
      case 'lead': return 'agent_crm';
      case 'contract': return 'print_formats';
      case 'payment': return 'tenant_portal';
      default: return 'catalog';
    }
  };

  const handleActionClick = (notif: AppNotification) => {
    markNotificationAsRead(notif.id);
    const targetTab = getActionTab(notif.type);
    if (onNavigateTab) {
      onNavigateTab(targetTab);
    }
    onClose();
    showToast(`Navegando a la sección correspondiente: ${notif.title}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full my-auto shadow-2xl border border-[#D5E1D4] overflow-hidden flex flex-col max-h-[88vh]">
        
        {/* Header */}
        <div className="bg-[#253D31] text-white p-5 sm:p-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center">
              <Bell className="w-5 h-5 text-[#BCE2C7]" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#C36449] rounded-full text-[10px] font-bold flex items-center justify-center text-white border-2 border-[#253D31]">
                  {unreadNotificationsCount}
                </span>
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-[#3D5E4D] text-[#BEE3C8] text-[10px] font-bold uppercase tracking-wider">
                  Módulo de Alertas en Tiempo Real
                </span>
                <span className="text-xs text-white/70">
                  {unreadNotificationsCount} sin leer
                </span>
              </div>
              <h2 className="font-serif-brand text-lg sm:text-xl font-bold">
                Notificaciones de Nuevas Solicitudes
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {unreadNotificationsCount > 0 && (
              <button
                onClick={markAllNotificationsAsRead}
                className="hidden sm:inline-flex px-3 py-1.5 rounded-xl border border-white/20 hover:bg-white/10 text-white/90 text-xs font-semibold items-center gap-1.5 transition-colors"
                title="Marcar todas como leídas"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span>Marcar Leídas</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-colors"
              title="Cerrar notificaciones"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="bg-[#FAFBF9] border-b border-[#E1E8DF] p-3 sm:px-6 flex items-center justify-between gap-2 overflow-x-auto text-xs shrink-0">
          <div className="flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-gray-500 shrink-0" />
            <button
              onClick={() => setFilterType('all')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-colors ${
                filterType === 'all' ? 'bg-[#2D4539] text-white' : 'text-gray-600 hover:bg-gray-200'
              }`}
            >
              Todas ({notifications.length})
            </button>
            <button
              onClick={() => setFilterType('unread')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-colors ${
                filterType === 'unread' ? 'bg-[#2D4539] text-white' : 'text-gray-600 hover:bg-gray-200'
              }`}
            >
              No Leídas ({unreadNotificationsCount})
            </button>
            <button
              onClick={() => setFilterType('appointment')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-colors ${
                filterType === 'appointment' ? 'bg-blue-700 text-white' : 'text-gray-600 hover:bg-gray-200'
              }`}
            >
              Citas
            </button>
            <button
              onClick={() => setFilterType('maintenance')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-colors ${
                filterType === 'maintenance' ? 'bg-amber-700 text-white' : 'text-gray-600 hover:bg-gray-200'
              }`}
            >
              Mantenimiento
            </button>
            <button
              onClick={() => setFilterType('lead')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-colors ${
                filterType === 'lead' ? 'bg-emerald-700 text-white' : 'text-gray-600 hover:bg-gray-200'
              }`}
            >
              Prospectos
            </button>
          </div>

          {unreadNotificationsCount > 0 && (
            <button
              onClick={markAllNotificationsAsRead}
              className="sm:hidden text-xs text-[#2D4539] font-semibold hover:underline"
            >
              Leídas
            </button>
          )}
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3">
          {filteredNotifications.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto text-gray-400">
                <Bell className="w-6 h-6" />
              </div>
              <p className="text-sm font-semibold text-gray-700">No hay notificaciones en este filtro</p>
              <p className="text-xs text-gray-500">
                Las nuevas solicitudes de citas, tickets de reparación y clientes interesados aparecerán aquí en tiempo real.
              </p>
            </div>
          ) : (
            filteredNotifications.map((notif) => (
              <div
                key={notif.id}
                className={`p-4 rounded-2xl border transition-all ${
                  notif.read 
                    ? 'bg-white border-[#E5EDE3] opacity-80' 
                    : 'bg-[#F2F7F1] border-[#C8DDC5] shadow-xs ring-1 ring-[#9CC696]/30'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center shrink-0 shadow-2xs">
                    {getNotificationIcon(notif.type)}
                  </div>

                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-[10px] px-2 py-0.5 rounded-md font-bold uppercase border ${getBadgeColor(notif.type)}`}>
                          {notif.type.replace('_', ' ')}
                        </span>
                        {!notif.read && (
                          <span className="w-2 h-2 rounded-full bg-[#C36449]"></span>
                        )}
                      </div>
                      <span className="text-[11px] text-gray-500 flex items-center gap-1 shrink-0 font-mono">
                        <Clock className="w-3 h-3" />
                        {new Date(notif.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    <h4 className="text-xs sm:text-sm font-bold text-gray-900">
                      {notif.title}
                    </h4>

                    <p className="text-xs text-gray-600 leading-relaxed">
                      {notif.message}
                    </p>

                    <div className="pt-2 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        {!notif.read && (
                          <button
                            onClick={() => markNotificationAsRead(notif.id)}
                            className="text-[11px] font-semibold text-[#2D4539] hover:underline flex items-center gap-1"
                          >
                            <CheckCheck className="w-3 h-3" />
                            Marcar leída
                          </button>
                        )}
                        <button
                          onClick={() => clearNotification(notif.id)}
                          className="text-[11px] font-semibold text-gray-400 hover:text-rose-600 transition-colors flex items-center gap-1"
                          title="Eliminar notificación"
                        >
                          <Trash2 className="w-3 h-3" />
                          Eliminar
                        </button>
                      </div>

                      <button
                        onClick={() => handleActionClick(notif)}
                        className="px-3 py-1.5 rounded-xl bg-[#2D4539] hover:bg-[#20342A] text-white text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-colors"
                      >
                        <span>Atender Solicitud</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer info note */}
        <div className="bg-[#FAFBF9] border-t border-[#E5EDE3] p-3 sm:px-6 flex items-center justify-between text-xs text-gray-500 shrink-0">
          <span>Terranova S. de R.L. • Notificaciones de Citas, Mantenimiento y Clientes</span>
          <button
            onClick={onClose}
            className="font-semibold text-gray-700 hover:text-black"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
