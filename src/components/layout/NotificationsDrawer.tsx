import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Bell, 
  X, 
  CheckCheck, 
  Calendar, 
  Wrench, 
  UserPlus, 
  FileText, 
  Mail, 
  DollarSign, 
  ArrowRight, 
  Trash2,
  Clock
} from 'lucide-react';

interface NotificationsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab: (tab: string) => void;
}

export const NotificationsDrawer: React.FC<NotificationsDrawerProps> = ({
  isOpen,
  onClose,
  onNavigateTab
}) => {
  const { 
    notifications, 
    unreadNotificationsCount, 
    markNotificationAsRead, 
    markAllNotificationsAsRead, 
    clearNotification 
  } = useApp();

  const [filterType, setFilterType] = useState<string>('all');

  if (!isOpen) return null;

  const filteredNotifications = notifications.filter(n => {
    if (filterType === 'all') return true;
    return n.type === filterType;
  });

  const getIconForType = (type: string) => {
    switch (type) {
      case 'appointment':
        return <Calendar className="w-4 h-4 text-blue-600" />;
      case 'maintenance':
        return <Wrench className="w-4 h-4 text-amber-600" />;
      case 'lead':
        return <UserPlus className="w-4 h-4 text-cyan-600" />;
      case 'contract':
        return <FileText className="w-4 h-4 text-emerald-600" />;
      case 'email':
        return <Mail className="w-4 h-4 text-purple-600" />;
      case 'payment':
        return <DollarSign className="w-4 h-4 text-emerald-600" />;
      default:
        return <Bell className="w-4 h-4 text-gray-600" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'appointment': return 'Cita de Visita';
      case 'maintenance': return 'Mantenimiento';
      case 'lead': return 'Prospecto / Solicitud';
      case 'contract': return 'Contrato';
      case 'email': return 'Correo Despachado';
      case 'payment': return 'Pago';
      default: return 'Sistema';
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/40 backdrop-blur-xs animate-in fade-in">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col border-l border-[#D5E1D4]">
          
          {/* Header */}
          <div className="p-4 sm:p-5 bg-[#263E32] text-white flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center">
                <Bell className="w-5 h-5 text-[#B8DCBF]" />
              </div>
              <div>
                <h3 className="font-serif-brand font-bold text-base">Centro de Notificaciones</h3>
                <p className="text-[11px] text-white/70">
                  {unreadNotificationsCount > 0 
                    ? `${unreadNotificationsCount} solicitudes o alertas pendientes` 
                    : 'Todas las solicitudes atendidas'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              {unreadNotificationsCount > 0 && (
                <button
                  onClick={markAllNotificationsAsRead}
                  title="Marcar todas como leídas"
                  className="p-1.5 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                >
                  <CheckCheck className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={onClose}
                className="p-1.5 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-1.5 p-2 bg-[#FAFBF9] border-b border-gray-100 overflow-x-auto text-[11px]">
            {[
              { id: 'all', label: 'Todas' },
              { id: 'appointment', label: 'Citas' },
              { id: 'maintenance', label: 'Mantenimiento' },
              { id: 'lead', label: 'Prospectos' },
              { id: 'contract', label: 'Contratos' },
              { id: 'email', label: 'Correos' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setFilterType(tab.id)}
                className={`px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap transition-colors ${
                  filterType === tab.id
                    ? 'bg-[#2D4539] text-white shadow-2xs'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Notifications List */}
          <div className="flex-1 overflow-y-auto divide-y divide-gray-100 text-xs">
            {filteredNotifications.length === 0 ? (
              <div className="p-12 text-center text-gray-400 space-y-2">
                <Bell className="w-8 h-8 mx-auto text-gray-300 stroke-1" />
                <p className="font-semibold text-gray-600">No hay notificaciones en este filtro</p>
                <p className="text-[11px]">Las nuevas solicitudes de visitas, tickets o prospectos se mostrarán aquí en tiempo real.</p>
              </div>
            ) : (
              filteredNotifications.map((notif) => (
                <div 
                  key={notif.id}
                  className={`p-4 transition-colors flex items-start gap-3 group ${
                    notif.read ? 'bg-white hover:bg-gray-50/70' : 'bg-[#F2F7F1] hover:bg-[#E9F2E7]'
                  }`}
                >
                  {/* Category icon */}
                  <div className="w-8 h-8 rounded-xl bg-white border border-gray-200 shadow-2xs flex items-center justify-center shrink-0 mt-0.5">
                    {getIconForType(notif.type)}
                  </div>

                  {/* Body */}
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#3D5B4B]">
                        {getTypeLabel(notif.type)}
                      </span>
                      <span className="text-[10px] text-gray-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {notif.timestamp}
                      </span>
                    </div>

                    <h4 className={`text-xs font-bold ${notif.read ? 'text-gray-800' : 'text-gray-900 font-extrabold'}`}>
                      {notif.title}
                    </h4>

                    <p className="text-[11px] text-gray-600 leading-relaxed">
                      {notif.message}
                    </p>

                    {/* Actions */}
                    <div className="pt-1.5 flex items-center justify-between gap-2">
                      {notif.targetTab ? (
                        <button
                          onClick={() => {
                            markNotificationAsRead(notif.id);
                            onNavigateTab(notif.targetTab!);
                            onClose();
                          }}
                          className="inline-flex items-center gap-1 font-semibold text-[11px] text-[#2D4539] hover:underline"
                        >
                          <span>{notif.linkText || 'Ver Detalle'}</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      ) : <div />}

                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {!notif.read && (
                          <button
                            onClick={() => markNotificationAsRead(notif.id)}
                            className="text-[10px] text-gray-500 hover:text-gray-800 px-1.5 py-0.5 rounded hover:bg-white"
                          >
                            Leído
                          </button>
                        )}
                        <button
                          onClick={() => clearNotification(notif.id)}
                          className="text-gray-400 hover:text-rose-600 p-1 rounded hover:bg-white"
                          title="Eliminar"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="p-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-500">
            <span>Sistema Web Terranova S. de R.L.</span>
            <button
              onClick={markAllNotificationsAsRead}
              className="text-[#2D4539] font-bold hover:underline"
            >
              Marcar todo como leído
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
