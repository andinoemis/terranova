import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CalendarEvent } from '../../types';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Plus, 
  CheckCircle2, 
  AlertCircle, 
  X, 
  Trash2, 
  Filter, 
  User, 
  Home, 
  Tag,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface WorkCalendarViewProps {
  forcedAssignee?: string; // e.g. if embedded in Agent or Admin view
}

export const WorkCalendarView: React.FC<WorkCalendarViewProps> = ({ forcedAssignee }) => {
  const { 
    calendarEvents, 
    addCalendarEvent, 
    updateCalendarEventStatus, 
    deleteCalendarEvent, 
    properties, 
    currentUser,
    users 
  } = useApp();

  const isTenant = currentUser.role === 'tenant';

  const [filterType, setFilterType] = useState<string>('all');
  const [filterAssignee, setFilterAssignee] = useState<string>(forcedAssignee || 'all');
  const [showAddModal, setShowAddModal] = useState(false);

  // New Event Form
  const [eventTitle, setEventTitle] = useState(isTenant ? 'Visita Técnica de Mantenimiento' : '');
  const [eventDate, setEventDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [eventTime, setEventTime] = useState('10:00');
  const [eventType, setEventType] = useState<CalendarEvent['type']>(isTenant ? 'Mantenimiento' : 'Visita');
  const [eventPriority, setEventPriority] = useState<CalendarEvent['priority']>('Media');
  const [eventAssignedTo, setEventAssignedTo] = useState(isTenant ? 'Anthony Rafael Alfaro' : (currentUser.name || 'Anthony Rafael Alfaro'));
  const [eventPropertyTitle, setEventPropertyTitle] = useState(properties[0]?.title || '');
  const [eventClientName, setEventClientName] = useState(isTenant ? currentUser.name : '');
  const [eventNotes, setEventNotes] = useState('');

  const filteredEvents = calendarEvents.filter((evt) => {
    if (isTenant) {
      const isClient = evt.clientName && (
        evt.clientName.toLowerCase().includes('emis') || 
        evt.clientName.toLowerCase() === currentUser.name.toLowerCase()
      );
      const isAssigned = evt.assignedTo === currentUser.name;
      const isProp = evt.propertyTitle?.toLowerCase().includes('prince');
      if (!isClient && !isAssigned && !isProp) return false;
    } else {
      if (filterType !== 'all' && evt.type !== filterType) return false;
      if (filterAssignee !== 'all' && evt.assignedTo !== filterAssignee) return false;
    }
    return true;
  });

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventTitle.trim()) return;

    addCalendarEvent({
      title: eventTitle.trim(),
      date: eventDate,
      time: eventTime,
      type: eventType,
      priority: eventPriority,
      assignedTo: isTenant ? 'Anthony Rafael Alfaro' : eventAssignedTo,
      propertyTitle: eventPropertyTitle,
      clientName: isTenant ? currentUser.name : (eventClientName.trim() || undefined),
      notes: eventNotes.trim() || undefined
    });

    setShowAddModal(false);
    setEventTitle(isTenant ? 'Visita Técnica de Mantenimiento' : '');
    setEventClientName(isTenant ? currentUser.name : '');
    setEventNotes('');
  };

  const getTypeBadgeColor = (type: CalendarEvent['type']) => {
    switch (type) {
      case 'Visita': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Cobro': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Mantenimiento': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Firma Contrato': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const getPriorityBadgeColor = (priority: CalendarEvent['priority']) => {
    switch (priority) {
      case 'Alta': return 'bg-rose-100 text-rose-800';
      case 'Media': return 'bg-amber-100 text-amber-800';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-[#D5E1D4] p-6 shadow-2xs space-y-6 animate-in fade-in">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-[#2D4539]" />
            <h3 className="font-serif-brand text-xl font-bold text-gray-900">
              {isTenant ? 'Mis Citas Agendadas & Agenda de Inquilino' : 'Calendario de Trabajo & Citas Pendientes'}
            </h3>
          </div>
          <p className="text-xs text-gray-500 mt-0.5">
            {isTenant 
              ? 'Consulta tus citas programadas con tu asesor inmobiliario, visitas técnicas y mantenimientos de tu vivienda.'
              : 'Agenda personal y de equipo para seguimiento de visitas a inmuebles, vencimientos de contrato y tareas operativas.'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2.5 bg-[#2D4539] hover:bg-[#20342A] text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>{isTenant ? '+ Agendar Cita para Mí' : 'Programar Tarea / Cita'}</span>
          </button>
        </div>
      </div>

      {/* Filter Toolbar (Only show staff selector if not tenant) */}
      {!isTenant && (
        <div className="flex flex-wrap items-center justify-between gap-3 bg-[#FAFBF9] p-3.5 rounded-2xl border border-[#DEE6DD] text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-semibold text-gray-600 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5 text-[#5A7765]" /> Tipo:
            </span>
            {['all', 'Visita', 'Cobro', 'Mantenimiento', 'Firma Contrato'].map((t) => (
              <button
                key={t}
                onClick={() => setFilterType(t)}
                className={`px-3 py-1 rounded-lg font-medium transition-all ${
                  filterType === t
                    ? 'bg-[#2D4539] text-white shadow-2xs'
                    : 'bg-white border border-[#CBD8CA] text-gray-700 hover:bg-[#EEF5ED]'
                }`}
              >
                {t === 'all' ? 'Todos los tipos' : t}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-600">Asignado a:</span>
            <select
              value={filterAssignee}
              onChange={(e) => setFilterAssignee(e.target.value)}
              className="bg-white border border-[#CBD8CA] rounded-lg px-2.5 py-1 text-gray-800 font-medium"
            >
              <option value="all">Todo el equipo</option>
              <option value="Anthony Rafael Alfaro">Anthony Alfaro (Agente)</option>
              <option value="Kenneth Adonay Zúniga">Kenneth Zúniga (Admin)</option>
            </select>
          </div>
        </div>
      )}

      {/* Events List / Agenda */}
      <div className="space-y-3">
        {filteredEvents.length === 0 ? (
          <div className="p-8 text-center bg-[#FAFBF9] rounded-2xl border border-dashed border-gray-300 space-y-2">
            <p className="text-gray-500 font-medium text-xs">No hay tareas o citas programadas con los filtros seleccionados.</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="text-xs text-[#2D4539] font-bold hover:underline"
            >
              + Agregar nueva tarea ahora
            </button>
          </div>
        ) : (
          filteredEvents.map((evt) => (
            <div
              key={evt.id}
              className={`p-4 rounded-2xl border transition-all flex flex-wrap items-center justify-between gap-3 text-xs ${
                evt.status === 'Completado'
                  ? 'bg-gray-50/80 border-gray-200 opacity-75'
                  : 'bg-white border-[#DEE6DD] hover:border-[#CAD8C8] shadow-2xs'
              }`}
            >
              <div className="flex items-start gap-3">
                <button
                  onClick={() => updateCalendarEventStatus(evt.id, evt.status === 'Completado' ? 'Pendiente' : 'Completado')}
                  className={`mt-0.5 p-1 rounded-lg border transition-colors ${
                    evt.status === 'Completado'
                      ? 'bg-emerald-600 text-white border-emerald-600'
                      : 'border-gray-300 hover:border-emerald-600 text-transparent hover:text-emerald-600'
                  }`}
                  title={evt.status === 'Completado' ? 'Marcar como pendiente' : 'Marcar como completada'}
                >
                  <CheckCircle2 className="w-4 h-4" />
                </button>

                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`font-bold text-sm ${evt.status === 'Completado' ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                      {evt.title}
                    </span>
                    <span className={`px-2 py-0.5 rounded-md font-semibold text-[10px] border ${getTypeBadgeColor(evt.type)}`}>
                      {evt.type}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${getPriorityBadgeColor(evt.priority)}`}>
                      Prioridad {evt.priority}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-gray-500">
                    <span className="flex items-center gap-1 font-semibold text-gray-700">
                      <CalendarIcon className="w-3.5 h-3.5 text-[#537260]" /> {evt.date} · {evt.time}
                    </span>
                    <span className="flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-gray-400" /> Asignado: <strong>{evt.assignedTo}</strong>
                    </span>
                    {evt.propertyTitle && (
                      <span className="flex items-center gap-1">
                        <Home className="w-3.5 h-3.5 text-gray-400" /> {evt.propertyTitle}
                      </span>
                    )}
                    {evt.clientName && (
                      <span>Cliente: <strong>{evt.clientName}</strong></span>
                    )}
                  </div>

                  {evt.notes && (
                    <p className="text-[11px] text-gray-600 pt-0.5 italic">
                      "{evt.notes}"
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                  evt.status === 'Completado' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                }`}>
                  {evt.status}
                </span>
                <button
                  onClick={() => deleteCalendarEvent(evt.id)}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                  title="Eliminar evento"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Event Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white border border-[#CAD8C8] rounded-3xl max-w-md w-full shadow-2xl overflow-hidden">
            <div className="bg-[#2D4539] text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-[#A3C7AD]" />
                <h3 className="font-serif-brand text-lg font-bold">Programar Tarea o Cita Pendiente</h3>
              </div>
              <button onClick={() => setShowAddModal(false)} className="text-white/70 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateEvent} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Título de la Actividad</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Recorrido presencial con comprador"
                  value={eventTitle}
                  onChange={(e) => setEventTitle(e.target.value)}
                  className="w-full bg-[#FAFBF9] border border-[#CBD8CA] rounded-xl p-2.5 text-gray-800 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Fecha</label>
                  <input
                    type="date"
                    required
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="w-full bg-[#FAFBF9] border border-[#CBD8CA] rounded-xl p-2.5 text-gray-800 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Hora</label>
                  <input
                    type="time"
                    required
                    value={eventTime}
                    onChange={(e) => setEventTime(e.target.value)}
                    className="w-full bg-[#FAFBF9] border border-[#CBD8CA] rounded-xl p-2.5 text-gray-800 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Tipo de Actividad</label>
                  <select
                    value={eventType}
                    onChange={(e) => setEventType(e.target.value as any)}
                    className="w-full bg-[#FAFBF9] border border-[#CBD8CA] rounded-xl p-2.5 text-gray-800"
                  >
                    <option value="Visita">Visita Guiada</option>
                    <option value="Cobro">Cobro de Renta</option>
                    <option value="Mantenimiento">Mantenimiento</option>
                    <option value="Firma Contrato">Firma Contrato</option>
                    <option value="Reunión">Reunión General</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Prioridad</label>
                  <select
                    value={eventPriority}
                    onChange={(e) => setEventPriority(e.target.value as any)}
                    className="w-full bg-[#FAFBF9] border border-[#CBD8CA] rounded-xl p-2.5 text-gray-800"
                  >
                    <option value="Alta">Alta</option>
                    <option value="Media">Media</option>
                    <option value="Baja">Baja</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Asignar a</label>
                  <select
                    value={eventAssignedTo}
                    onChange={(e) => setEventAssignedTo(e.target.value)}
                    className="w-full bg-[#FAFBF9] border border-[#CBD8CA] rounded-xl p-2.5 text-gray-800"
                  >
                    <option value="Anthony Rafael Alfaro">Anthony Rafael Alfaro (Agente)</option>
                    <option value="Kenneth Adonay Zúniga">Kenneth Adonay Zúniga (Admin)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Nombre del Cliente (Opcional)</label>
                  <input
                    type="text"
                    placeholder="Ej: Lic. Claudia Meza"
                    value={eventClientName}
                    onChange={(e) => setEventClientName(e.target.value)}
                    className="w-full bg-[#FAFBF9] border border-[#CBD8CA] rounded-xl p-2.5 text-gray-800"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Inmueble Vinculado</label>
                <select
                  value={eventPropertyTitle}
                  onChange={(e) => setEventPropertyTitle(e.target.value)}
                  className="w-full bg-[#FAFBF9] border border-[#CBD8CA] rounded-xl p-2.5 text-gray-800"
                >
                  <option value="">Ninguno / Tarea administrativa general</option>
                  {properties.map(p => (
                    <option key={p.id} value={p.title}>{p.code} - {p.title}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Notas u Objetivos</label>
                <textarea
                  rows={2}
                  value={eventNotes}
                  onChange={(e) => setEventNotes(e.target.value)}
                  placeholder="Detalles sobre llaves, documentación a presentar..."
                  className="w-full bg-[#FAFBF9] border border-[#CBD8CA] rounded-xl p-2.5 text-gray-800"
                ></textarea>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#2D4539] hover:bg-[#20342A] text-white font-semibold transition-colors"
                >
                  Guardar en Calendario
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
