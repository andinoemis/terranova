import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CalendarEvent, PaymentTransaction } from '../../types';
import { PaymentProcessingModal } from './PaymentProcessingModal';
import { 
  KeyRound, 
  CreditCard, 
  FileText, 
  Wrench, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Printer, 
  Sparkles, 
  MessageSquare, 
  Send, 
  Calendar as CalendarIcon, 
  Home, 
  Plus, 
  User, 
  X,
  Phone,
  Mail,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface TenantPortalProps {
  onBrowseCatalog: () => void;
}

export const TenantPortal: React.FC<TenantPortalProps> = ({ onBrowseCatalog }) => {
  const { 
    currentUser, 
    contracts, 
    payments, 
    maintenance, 
    calendarEvents,
    addCalendarEvent,
    messages,
    sendMessage,
    processPayment, 
    createMaintenanceRequest, 
    openPrintModal,
    showToast,
    companySettings
  } = useApp();

  // Active sub-tab inside Tenant Portal
  const [tenantTab, setTenantTab] = useState<'appointments' | 'messages' | 'contract'>('appointments');

  // Determinar si el usuario autenticado es la cuenta demo Emis
  const isEmis = currentUser.email?.toLowerCase() === 'andinoemis@gmail.com' || currentUser.id === 'usr-4';

  // Buscar contrato vinculado estrictamente al usuario actual
  const activeContract = contracts.find(c => 
    c.tenantId === currentUser.id || 
    (currentUser.email && c.tenantEmail.toLowerCase() === currentUser.email.toLowerCase())
  ) || (isEmis ? contracts[0] : undefined);

  // Pagos vinculados al contrato del usuario actual
  const contractPayments = activeContract 
    ? payments.filter(p => p.contractId === activeContract.id || p.payerEmail.toLowerCase() === currentUser.email.toLowerCase())
    : payments.filter(p => p.payerEmail.toLowerCase() === currentUser.email.toLowerCase());

  // Reportes de mantenimiento del usuario actual
  const myMaintenance = maintenance.filter(m => {
    const isMyRequest = m.requestedBy.toLowerCase() === currentUser.name.toLowerCase();
    const isMyContractProp = activeContract && m.propertyId === activeContract.propertyId;
    return isMyRequest || isMyContractProp;
  });

  // Citas del inquilino actual: filtradas estrictamente para este usuario (no mezcla con Emis u otros)
  const myAppointments = calendarEvents.filter(evt => {
    const isMyDirectAppointment = (evt.clientName && evt.clientName.toLowerCase() === currentUser.name.toLowerCase()) || 
      (evt.clientEmail && evt.clientEmail.toLowerCase() === currentUser.email.toLowerCase());
    const isAssignedToMe = evt.assignedTo === currentUser.name;
    const isMyPropertyApt = Boolean(activeContract) && evt.propertyTitle && evt.propertyTitle.toLowerCase().includes(activeContract!.propertyCode.toLowerCase());
    return isMyDirectAppointment || isAssignedToMe || isMyPropertyApt;
  });

  // Schedule Appointment Modal State
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [aptTitle, setAptTitle] = useState('Revisión Técnica de Inmueble');
  const [aptType, setAptType] = useState<CalendarEvent['type']>('Mantenimiento');
  const [aptDate, setAptDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 2);
    return d.toISOString().split('T')[0];
  });
  const [aptTime, setAptTime] = useState('10:00');
  const [aptNotes, setAptNotes] = useState('Coordinar revisión y entrega de comprobante.');
  const [aptPriority, setAptPriority] = useState<CalendarEvent['priority']>('Media');

  // Payment Modal State
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'Tarjeta de Crédito' | 'Tarjeta de Débito' | 'Transferencia Bancaria'>('Tarjeta de Crédito');
  const [cardNumber, setCardNumber] = useState('4532 8821 9012 3456');
  const [cardHolder, setCardHolder] = useState(currentUser.name || 'Titular de Cuenta');
  const [cardExpiry, setCardExpiry] = useState('08/28');
  const [cardCvv, setCardCvv] = useState('492');

  // Real-time Validation and Touched states
  const [cardTouched, setCardTouched] = useState(false);
  const [expiryTouched, setExpiryTouched] = useState(false);
  const [cvvTouched, setCvvTouched] = useState(false);
  const [holderTouched, setHolderTouched] = useState(false);

  // Dedicated "Pago en proceso: Verificando transacción" Modal States
  const [showProcessingModal, setShowProcessingModal] = useState(false);
  const [isProcessingStep, setIsProcessingStep] = useState(false);
  const [recentPaymentResult, setRecentPaymentResult] = useState<PaymentTransaction | null>(null);

  // Validaciones en tiempo real para campos numéricos y longitudes válidas
  const cleanCardNumber = cardNumber.replace(/\D/g, '');
  const isCardNumberValid = cleanCardNumber.length === 16;
  const cardNumberError = cardTouched && !isCardNumberValid
    ? 'El número de tarjeta debe tener exactamente 16 dígitos numéricos.'
    : null;

  // Validación de expiración MM/AA
  const expiryFormatMatches = /^(0[1-9]|1[0-2])\/\d{2}$/.test(cardExpiry);
  let isCardExpiryValid = false;
  let cardExpiryError: string | null = null;
  if (expiryFormatMatches) {
    const [monthStr, yearStr] = cardExpiry.split('/');
    const month = parseInt(monthStr, 10);
    const year = parseInt(yearStr, 10);
    const now = new Date();
    const currentYear = now.getFullYear() % 100;
    const currentMonth = now.getMonth() + 1;
    if (year > currentYear || (year === currentYear && month >= currentMonth)) {
      isCardExpiryValid = true;
    } else {
      cardExpiryError = 'La fecha de vencimiento ingresada ya expiró.';
    }
  } else if (expiryTouched) {
    cardExpiryError = 'Formato inválido. Use MM/AA con mes de 01 a 12.';
  }

  // Validación CVV (3 o 4 dígitos)
  const isCardCvvValid = cardCvv.length >= 3 && cardCvv.length <= 4 && /^\d+$/.test(cardCvv);
  const cardCvvError = cvvTouched && !isCardCvvValid
    ? 'El CVV debe contener entre 3 y 4 dígitos numéricos.'
    : null;

  // Validación Titular
  const isCardHolderValid = cardHolder.trim().length >= 3;
  const cardHolderError = holderTouched && !isCardHolderValid
    ? 'Ingrese el nombre completo del titular (mínimo 3 caracteres).'
    : null;

  const isPaymentFormValid = paymentMethod === 'Transferencia Bancaria' || (
    isCardNumberValid && isCardExpiryValid && isCardCvvValid && isCardHolderValid
  );

  // Input masks con restricción estricta de teclas y caracteres
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCardTouched(true);
    const raw = e.target.value.replace(/\D/g, '').slice(0, 16);
    const formatted = raw.match(/.{1,4}/g)?.join(' ') || raw;
    setCardNumber(formatted);
  };

  const handleCardExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setExpiryTouched(true);
    let raw = e.target.value.replace(/\D/g, '').slice(0, 4);
    if (raw.length >= 2) {
      let month = parseInt(raw.slice(0, 2), 10);
      if (month > 12) month = 12;
      if (month === 0) month = 1;
      const monthStr = month.toString().padStart(2, '0');
      raw = `${monthStr}/${raw.slice(2)}`;
    }
    setCardExpiry(raw);
  };

  const handleCardCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCvvTouched(true);
    const raw = e.target.value.replace(/\D/g, '').slice(0, 4);
    setCardCvv(raw);
  };

  const handleCardHolderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHolderTouched(true);
    const raw = e.target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '');
    setCardHolder(raw);
  };

  // Maintenance Ticket Modal State
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [ticketType, setTicketType] = useState<'Correctivo' | 'Preventivo' | 'Emergencia'>('Correctivo');
  const [ticketPriority, setTicketPriority] = useState<'Alta' | 'Media' | 'Baja'>('Media');
  const [ticketDescription, setTicketDescription] = useState('');

  // Messages State: buscar hilo exclusivo del usuario actual o crear hilo personalizado para él
  const realThread = messages.find(m => 
    (currentUser.email && m.contactEmail.toLowerCase() === currentUser.email.toLowerCase()) || 
    m.contactName.toLowerCase() === currentUser.name.toLowerCase()
  ) || (isEmis ? messages[0] : undefined);

  const tenantThread = realThread || {
    id: `thread-${currentUser.id}`,
    contactName: 'Anthony Rafael Alfaro (Asesor Terranova)',
    contactEmail: 'anthony.alfaro@unah.hn',
    contactPhone: '+504 9912-3456',
    propertyTitle: activeContract ? activeContract.propertyTitle : 'Atención Personalizada al Inquilino',
    unread: false,
    messages: [
      {
        id: 'init-msg-1',
        sender: 'support' as const,
        senderName: 'Anthony Rafael Alfaro',
        text: `Hola ${currentUser.name}, te damos la bienvenida al portal de inquilinos. Estoy asignado como tu asesor para apoyarte en cualquier requerimiento o consulta sobre tu arrendamiento.`,
        timestamp: 'Hoy, 08:30 AM'
      }
    ]
  };

  const [chatInput, setChatInput] = useState('');

  const handleScheduleAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aptTitle.trim()) return;

    addCalendarEvent({
      title: `${aptTitle.trim()} - ${activeContract?.propertyCode || 'Inmueble Terranova'}`,
      date: aptDate,
      time: aptTime,
      type: aptType,
      priority: aptPriority,
      assignedTo: 'Anthony Rafael Alfaro',
      propertyTitle: activeContract?.propertyTitle || 'Inmueble Terranova',
      clientName: currentUser.name,
    });

    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.6 }
    });

    setShowAppointmentModal(false);
    showToast('¡Cita agendada exitosamente! Tu asesor Anthony Rafael Alfaro ha sido notificado.');
  };

  const handlePayRent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeContract || !isPaymentFormValid) return;

    // Abrir modal de procesamiento de pago inmediatamente
    setShowPaymentModal(false);
    setShowProcessingModal(true);
    setIsProcessingStep(true);

    try {
      // Breve lapso de comunicación segura para mostrar 'Pago en proceso: Verificando transacción'
      await new Promise(resolve => setTimeout(resolve, 1400));

      const result = await processPayment({
        propertyId: activeContract.propertyId,
        propertyTitle: activeContract.propertyTitle,
        contractId: activeContract.id,
        payerName: currentUser.name,
        payerEmail: currentUser.email,
        amount: activeContract.monthlyRent,
        currency: activeContract.currency,
        type: 'Pago Renta',
        paymentMethod: paymentMethod,
        monthCovered: 'Noviembre 2024'
      });

      setRecentPaymentResult(result);
      setIsProcessingStep(false);
      showToast('Pago registrado EN PROCESO. Notificación emitida a tesorería para validación.');
    } catch {
      setIsProcessingStep(false);
      setShowProcessingModal(false);
      showToast('Error de comunicación bancaria al procesar la transacción.');
    }
  };

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeContract || !ticketDescription) return;

    createMaintenanceRequest({
      propertyId: activeContract.propertyId,
      propertyTitle: activeContract.propertyTitle,
      propertyAddress: activeContract.propertyCode,
      requestedBy: currentUser.name,
      requesterRole: 'tenant',
      type: ticketType,
      priority: ticketPriority,
      description: ticketDescription
    });

    setShowTicketModal(false);
    setTicketDescription('');
  };

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || !tenantThread) return;

    sendMessage(tenantThread.id, chatInput.trim());
    setChatInput('');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header Banner - Focused on Tenant Experience */}
      <div className="bg-[#263E32] rounded-3xl p-6 sm:p-8 text-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-md border border-[#3A5647]">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full bg-[#3D5E4E] text-[#BDE2C8] text-xs font-bold uppercase tracking-wider flex items-center gap-1">
              <KeyRound className="w-3.5 h-3.5" /> Inquilino Suscrito Activo
            </span>
            <span className="text-white/60 text-xs font-mono">
              Cuenta: {currentUser.accountNumber || 'CTA-INQ-305'}
            </span>
          </div>

          <h1 className="font-serif-brand text-2xl sm:text-3xl font-bold">
            Portal Personal de Inquilino · {currentUser.name}
          </h1>

          <p className="text-xs sm:text-sm text-white/80 mt-1 max-w-2xl">
            Gestiona tus citas personales, agenda nuevas visitas técnicas con tu asesor, comunícate por mensajería directa y consulta tu contrato de arrendamiento.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setShowAppointmentModal(true)}
            className="px-4 py-2.5 rounded-xl bg-white text-[#263E32] hover:bg-[#EEF5ED] font-semibold text-xs sm:text-sm flex items-center gap-2 shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4 text-[#263E32]" />
            <span>Agendar Cita</span>
          </button>

          <button
            onClick={() => setShowPaymentModal(true)}
            className="px-4 py-2.5 rounded-xl bg-[#C36449] hover:bg-[#B0573E] text-white font-semibold text-xs sm:text-sm flex items-center gap-2 shadow-xs transition-colors"
          >
            <CreditCard className="w-4 h-4" />
            <span>Pagar Renta</span>
          </button>
        </div>
      </div>

      {/* Tenant Focused Tabs */}
      <div className="flex border-b border-[#D5E1D4] gap-2 pb-1 text-xs sm:text-sm">
        <button
          onClick={() => setTenantTab('appointments')}
          className={`px-4 py-2.5 font-semibold rounded-t-xl transition-all flex items-center gap-2 ${
            tenantTab === 'appointments'
              ? 'bg-white border-t-2 border-x border-[#D5E1D4] text-[#1E3328] shadow-2xs'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <CalendarIcon className="w-4 h-4 text-[#2D4539]" />
          <span>Mis Citas & Agendar</span>
          <span className="text-[10px] bg-[#EEF5ED] text-[#2D4539] px-2 py-0.2 rounded-full font-bold">
            {myAppointments.length}
          </span>
        </button>

        <button
          onClick={() => setTenantTab('messages')}
          className={`px-4 py-2.5 font-semibold rounded-t-xl transition-all flex items-center gap-2 ${
            tenantTab === 'messages'
              ? 'bg-white border-t-2 border-x border-[#D5E1D4] text-[#1E3328] shadow-2xs'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <MessageSquare className="w-4 h-4 text-[#C36449]" />
          <span>Mis Mensajes & Asesoría</span>
          {tenantThread?.unread && (
            <span className="w-2 h-2 rounded-full bg-[#C36449]"></span>
          )}
        </button>

        <button
          onClick={() => setTenantTab('contract')}
          className={`px-4 py-2.5 font-semibold rounded-t-xl transition-all flex items-center gap-2 ${
            tenantTab === 'contract'
              ? 'bg-white border-t-2 border-x border-[#D5E1D4] text-[#1E3328] shadow-2xs'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Home className="w-4 h-4 text-[#476753]" />
          <span>Mi Inmueble & Renta</span>
        </button>
      </div>

      {/* TAB 1: MIS CITAS & AGENDAR */}
      {tenantTab === 'appointments' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-[#D5E1D4] p-6 shadow-2xs space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 pb-4">
              <div>
                <h3 className="font-serif-brand text-xl font-bold text-gray-900 flex items-center gap-2">
                  <CalendarIcon className="w-5 h-5 text-[#2D4539]" /> Mis Citas Programadas
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Calendario de citas personales, visitas técnicas de mantenimiento y atención con tu asesor inmobiliario.
                </p>
              </div>

              <button
                onClick={() => setShowAppointmentModal(true)}
                className="px-4 py-2.5 bg-[#2D4539] hover:bg-[#20342A] text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-2xs transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>+ Agendar Nueva Cita para Mí</span>
              </button>
            </div>

            {/* Appointments List */}
            {myAppointments.length === 0 ? (
              <div className="p-8 text-center bg-[#FAFBF9] rounded-2xl border border-dashed border-gray-300 space-y-3">
                <CalendarIcon className="w-10 h-10 text-gray-400 mx-auto" />
                <p className="font-bold text-gray-800 text-sm">No tienes citas agendadas actualmente</p>
                <p className="text-xs text-gray-500 max-w-md mx-auto">
                  Puedes agendar una cita con tu asesor o una visita técnica para cualquier reparación o consulta sobre tu vivienda.
                </p>
                <button
                  onClick={() => setShowAppointmentModal(true)}
                  className="px-4 py-2 bg-[#2D4539] text-white rounded-xl text-xs font-semibold"
                >
                  Agendar Mi Primera Cita
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {myAppointments.map((apt) => (
                  <div 
                    key={apt.id} 
                    className="p-5 rounded-2xl bg-[#FAFBF9] border border-[#DCE5DA] hover:border-[#2D4539] transition-all space-y-3 relative group"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-0.5">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          apt.type === 'Visita' ? 'bg-blue-50 text-blue-800 border-blue-200' :
                          apt.type === 'Mantenimiento' ? 'bg-amber-50 text-amber-800 border-amber-200' :
                          'bg-emerald-50 text-emerald-800 border-emerald-200'
                        }`}>
                          {apt.type}
                        </span>
                        <h4 className="font-bold text-sm text-gray-900 mt-1">{apt.title}</h4>
                      </div>

                      <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                        apt.status === 'Completado' ? 'bg-emerald-100 text-emerald-800' :
                        apt.status === 'Cancelado' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {apt.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs bg-white p-3 rounded-xl border border-gray-100">
                      <div className="flex items-center gap-1.5 text-gray-700">
                        <CalendarIcon className="w-3.5 h-3.5 text-[#2D4539]" />
                        <span>Fecha: <strong>{apt.date}</strong></span>
                      </div>
                      <div className="flex items-center gap-1.5 text-gray-700">
                        <Clock className="w-3.5 h-3.5 text-[#C36449]" />
                        <span>Hora: <strong>{apt.time}</strong></span>
                      </div>
                    </div>

                    {apt.propertyTitle && (
                      <p className="text-xs text-gray-600 flex items-center gap-1.5">
                        <Home className="w-3.5 h-3.5 text-[#4A6956]" />
                        <span>Inmueble: <strong>{apt.propertyTitle}</strong></span>
                      </p>
                    )}

                    <div className="pt-2 border-t border-gray-200/60 flex items-center justify-between text-[11px] text-gray-500">
                      <span>Asesor: <strong>{apt.assignedTo}</strong></span>
                      {apt.notes && (
                        <span className="italic max-w-[200px] truncate" title={apt.notes}>
                          "{apt.notes}"
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: MIS MENSAJES & ASESORÍA */}
      {tenantTab === 'messages' && (
        <div className="bg-white rounded-3xl border border-[#D5E1D4] shadow-2xs overflow-hidden flex flex-col h-[560px]">
          {/* Chat Header */}
          <div className="bg-[#2D4539] text-white p-4 sm:p-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center border border-white/20">
                <User className="w-5 h-5 text-[#A3C7AD]" />
              </div>
              <div>
                <h4 className="font-bold text-sm">
                  {tenantThread?.contactName || 'Anthony Rafael Alfaro - Asesor Inmobiliario'}
                </h4>
                <p className="text-xs text-white/70">
                  Asesor asignado para {activeContract?.propertyTitle || 'Casa Prince'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-emerald-400 rounded-full animate-pulse" title="En línea"></span>
              <span className="text-xs text-emerald-200 font-medium hidden sm:inline">En Línea</span>
            </div>
          </div>

          {/* Chat Conversation Body */}
          <div className="flex-1 p-5 overflow-y-auto space-y-3.5 bg-[#FAFBF9] text-xs">
            {tenantThread?.messages && tenantThread.messages.length > 0 ? (
              tenantThread.messages.map((m) => {
                const isMe = m.sender === 'user';
                return (
                  <div
                    key={m.id}
                    className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-[80%] sm:max-w-[70%] p-3.5 rounded-2xl ${
                        isMe
                          ? 'bg-[#2D4539] text-white rounded-br-xs shadow-xs'
                          : 'bg-white border border-[#D8E3D6] text-gray-800 rounded-bl-xs shadow-2xs'
                      }`}
                    >
                      <p className="text-[11px] font-bold mb-1 opacity-80">
                        {m.senderName}
                      </p>
                      <p className="leading-relaxed text-xs">{m.text}</p>
                    </div>
                    <span className="text-[10px] text-gray-400 mt-0.5 px-1 font-mono">
                      {m.timestamp}
                    </span>
                  </div>
                );
              })
            ) : (
              <p className="text-center text-gray-400 py-10">No hay mensajes anteriores en esta conversación.</p>
            )}
          </div>

          {/* Chat Input Bar */}
          <form onSubmit={handleSendChat} className="p-3.5 border-t border-gray-100 bg-white flex gap-2">
            <input
              type="text"
              placeholder="Escribe tu mensaje a Anthony Alfaro sobre tu inmueble, pagos o citas..."
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              className="flex-1 text-xs bg-[#FAFBF9] border border-[#CAD8C8] rounded-xl px-4 py-2.5 text-gray-800 focus:outline-hidden focus:ring-2 focus:ring-[#2D4539]"
            />
            <button
              type="submit"
              className="px-5 py-2.5 bg-[#2D4539] text-white rounded-xl hover:bg-[#20342A] font-semibold text-xs transition-colors flex items-center gap-1.5 shadow-2xs"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Enviar</span>
            </button>
          </form>
        </div>
      )}

      {/* TAB 3: MI INMUEBLE & RENTA */}
      {tenantTab === 'contract' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Active Contract Card */}
            {activeContract ? (
              <div className="bg-white rounded-3xl border border-[#D5E1D4] p-6 shadow-2xs space-y-5">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-[#EEF5ED] text-[#294435] flex items-center justify-center">
                      <Home className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="font-mono text-xs text-gray-500 font-semibold">{activeContract.contractNumber}</span>
                      <h3 className="font-serif-brand text-xl font-bold text-gray-900 leading-tight">
                        {activeContract.propertyTitle}
                      </h3>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                      {activeContract.status}
                    </span>
                    <button
                      onClick={() => openPrintModal({ type: 'contract', data: activeContract })}
                      className="p-2 rounded-xl text-gray-600 hover:text-gray-900 hover:bg-[#EEF4EC] border border-[#CCD8CB] transition-colors"
                      title="Imprimir Contrato Completo"
                    >
                      <Printer className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Contract Metrics */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#FAFBF9] p-4 rounded-2xl border border-[#DEE6DD] text-center">
                  <div>
                    <span className="text-[11px] text-gray-500 block">Renta Mensual</span>
                    <span className="font-mono font-bold text-base text-[#1E3328]">
                      ${activeContract.monthlyRent} <span className="text-xs font-normal">{activeContract.currency}</span>
                    </span>
                  </div>
                  <div>
                    <span className="text-[11px] text-gray-500 block">Depósito en Garantía</span>
                    <span className="font-mono font-bold text-base text-[#1E3328]">
                      ${activeContract.depositAmount} <span className="text-xs font-normal">{activeContract.currency}</span>
                    </span>
                  </div>
                  <div>
                    <span className="text-[11px] text-gray-500 block">Fecha Inicio</span>
                    <span className="font-bold text-xs text-gray-800">{activeContract.startDate}</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-gray-500 block">Fecha Vencimiento</span>
                    <span className="font-bold text-xs text-[#C36449]">{activeContract.endDate}</span>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex flex-wrap gap-2 pt-2">
                  <button
                    onClick={() => setShowPaymentModal(true)}
                    className="px-4 py-2.5 rounded-xl bg-[#2D4539] hover:bg-[#20342A] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs"
                  >
                    <CreditCard className="w-3.5 h-3.5" /> Pagar Cuota de Renta
                  </button>
                  <button
                    onClick={() => setShowTicketModal(true)}
                    className="px-4 py-2.5 rounded-xl border border-[#CAD6C7] hover:bg-[#EEF4EC] text-gray-800 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <Wrench className="w-3.5 h-3.5 text-[#C36449]" /> Reportar Incidencia / Reparación
                  </button>
                  <button
                    onClick={() => openPrintModal({ type: 'contract', data: activeContract })}
                    className="px-4 py-2.5 rounded-xl border border-[#CAD6C7] hover:bg-[#EEF4EC] text-gray-800 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <FileText className="w-3.5 h-3.5" /> Ver Cláusulas
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-3xl border border-[#D5E1D4] p-8 text-center space-y-4 shadow-2xs">
                <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-700 flex items-center justify-center mx-auto border border-rose-100">
                  <KeyRound className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="font-serif-brand text-2xl font-bold text-gray-900">
                    Cuenta de Inquilino Activa · {currentUser.name}
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">Identificador de Cuenta: {currentUser.accountNumber || 'CTA-INQ'}</p>
                </div>
                <p className="text-xs text-gray-600 max-w-md mx-auto leading-relaxed">
                  Tu cuenta está habilitada en el sistema. Aún no tienes un contrato de arrendamiento formal vinculado a tu expediente. El Administrador puede emitir tu contrato desde la administración de usuarios y contratos, o puedes agendar una cita con tu asesor asignado.
                </p>
                <div className="flex flex-wrap justify-center gap-3 pt-2">
                  <button
                    onClick={() => setTenantTab('appointments')}
                    className="px-5 py-2.5 rounded-xl bg-[#2D4539] hover:bg-[#20342A] text-white text-xs font-semibold"
                  >
                    Agendar Cita con Mi Asesor
                  </button>
                  <button
                    onClick={onBrowseCatalog}
                    className="px-5 py-2.5 rounded-xl border border-[#CAD6C8] hover:bg-[#EEF5ED] text-gray-800 text-xs font-semibold"
                  >
                    Explorar Inmuebles en Catálogo
                  </button>
                </div>
              </div>
            )}

            {/* Payment history */}
            <div className="bg-white rounded-3xl border border-[#D5E1D4] p-6 shadow-2xs space-y-4">
              <h3 className="font-serif-brand text-lg font-bold text-gray-900">
                Historial de Pagos y Recibos
              </h3>
              <div className="divide-y divide-gray-100 text-xs">
                {contractPayments.map((p) => (
                  <div key={p.id} className="py-3 flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="font-bold text-gray-800">{p.receiptNumber} · {p.monthCovered}</p>
                      <p className="text-[11px] text-gray-500">{p.date} · Método: {p.paymentMethod}</p>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono font-bold text-sm text-[#1E3328]">
                        ${p.amount} {p.currency}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border flex items-center gap-1 ${
                        p.status === 'En Proceso' || p.status === 'Pendiente'
                          ? 'bg-amber-100 text-amber-800 border-amber-300'
                          : 'bg-emerald-100 text-emerald-800 border-emerald-300'
                      }`}>
                        <Clock className="w-3 h-3" />
                        {p.status === 'En Proceso' ? 'En Proceso' : p.status}
                      </span>
                      <button
                        onClick={() => openPrintModal({ type: 'receipt', data: p })}
                        className="px-2.5 py-1.5 rounded-lg border border-[#CCD8CB] hover:bg-[#EEF4EC] text-gray-700 text-xs font-semibold flex items-center gap-1"
                        title="Ver Comprobante Oficial"
                      >
                        <Printer className="w-3.5 h-3.5" /> Comprobante
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right column: Repairs tracking */}
          <div className="space-y-6">
            <div className="bg-white rounded-3xl border border-[#D5E1D4] p-5 shadow-2xs space-y-4 text-xs">
              <div className="flex justify-between items-center">
                <h4 className="font-serif-brand text-base font-bold text-gray-900 flex items-center gap-2">
                  <Wrench className="w-4 h-4 text-[#C36449]" /> Reportes de Mantenimiento
                </h4>
                <button
                  onClick={() => setShowTicketModal(true)}
                  className="px-2.5 py-1 bg-[#2D4539] text-white rounded-lg text-xs font-semibold"
                >
                  + Reportar
                </button>
              </div>

              {myMaintenance.length === 0 ? (
                <p className="text-gray-400 py-3 text-center">No hay reportes de mantenimiento activos.</p>
              ) : (
                <div className="space-y-3">
                  {myMaintenance.map((m) => (
                    <div key={m.id} className="p-3.5 rounded-2xl bg-[#FAFBF9] border border-[#DEE6DC] space-y-1.5">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-gray-800">{m.ticketNumber}</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          m.status === 'Reparado' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {m.status}
                        </span>
                      </div>
                      <p className="text-gray-600">{m.description}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Agendar Cita para Inquilino */}
      {showAppointmentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white border border-[#CCD8CB] rounded-3xl max-w-md w-full overflow-hidden shadow-2xl">
            <div className="bg-[#263E32] text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <CalendarIcon className="w-5 h-5 text-[#9EC7A9]" />
                <div>
                  <h3 className="font-serif-brand text-lg font-bold">Agendar Cita para Mí</h3>
                  <p className="text-xs text-white/70">Coordinación directa con tu asesor inmobiliario</p>
                </div>
              </div>
              <button 
                onClick={() => setShowAppointmentModal(false)}
                className="text-white/70 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleScheduleAppointment} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Motivo / Tipo de Cita</label>
                <select
                  value={aptType}
                  onChange={(e) => {
                    const t = e.target.value as CalendarEvent['type'];
                    setAptType(t);
                    if (t === 'Mantenimiento') setAptTitle('Visita Técnica de Mantenimiento');
                    else if (t === 'Visita') setAptTitle('Cita Presencial con Mi Asesor');
                    else if (t === 'Firma Contrato') setAptTitle('Revisión de Cláusulas y Contrato');
                  }}
                  className="w-full bg-[#FAFBF9] border border-[#CBD8CA] rounded-xl p-2.5 text-gray-800 font-medium"
                >
                  <option value="Mantenimiento">Visita Técnica de Mantenimiento / Reparación</option>
                  <option value="Visita">Cita Presencial con Mi Asesor Inmobiliario</option>
                  <option value="Firma Contrato">Revisión de Contrato / Renovación</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Título de la Cita</label>
                <input
                  type="text"
                  required
                  value={aptTitle}
                  onChange={(e) => setAptTitle(e.target.value)}
                  placeholder="Ej. Inspección de fontanería, entrega de llaves..."
                  className="w-full bg-[#FAFBF9] border border-[#CBD8CA] rounded-xl p-2.5 text-gray-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Fecha</label>
                  <input
                    type="date"
                    required
                    value={aptDate}
                    onChange={(e) => setAptDate(e.target.value)}
                    className="w-full bg-[#FAFBF9] border border-[#CBD8CA] rounded-xl p-2.5 text-gray-800"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Hora Deseada</label>
                  <input
                    type="time"
                    required
                    value={aptTime}
                    onChange={(e) => setAptTime(e.target.value)}
                    className="w-full bg-[#FAFBF9] border border-[#CBD8CA] rounded-xl p-2.5 text-gray-800 font-mono"
                  />
                </div>
              </div>

              <div className="p-3 bg-[#EEF5ED] rounded-xl border border-[#CCE0CD] space-y-1">
                <p className="font-semibold text-gray-800">Detalles de Asignación:</p>
                <p className="text-gray-600">Inmueble: <strong>{activeContract?.propertyTitle || 'Casa Prince'}</strong></p>
                <p className="text-gray-600">Asesor Responsable: <strong>Anthony Rafael Alfaro</strong></p>
                <p className="text-gray-600">Inquilino Solicitante: <strong>{currentUser.name}</strong></p>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Notas / Instrucciones Adicionales</label>
                <textarea
                  rows={2}
                  value={aptNotes}
                  onChange={(e) => setAptNotes(e.target.value)}
                  placeholder="Ej. Estaré disponible a partir de las 10:00 AM en el inmueble..."
                  className="w-full bg-[#FAFBF9] border border-[#CBD8CA] rounded-xl p-2.5 text-gray-800"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAppointmentModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#2D4539] hover:bg-[#20342A] text-white font-semibold flex items-center gap-1.5 shadow-2xs transition-colors"
                >
                  <Check className="w-4 h-4" />
                  <span>Confirmar y Agendar Cita</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Online Rent Payment Modal */}
      {showPaymentModal && activeContract && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white border border-[#CCD8CB] rounded-3xl max-w-md w-full overflow-hidden shadow-2xl">
            <div className="bg-[#2D4539] text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-[#9EC7A9]" />
                <div>
                  <h3 className="font-serif-brand text-lg font-bold">Pasarela de Pago de Renta</h3>
                  <p className="text-xs text-white/70">Transacción Segura SSL 256-Bit</p>
                </div>
              </div>
              <button onClick={() => setShowPaymentModal(false)} className="text-white/70 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handlePayRent} className="p-6 space-y-4 text-xs">
              <div className="p-3.5 bg-[#FAFBF9] rounded-2xl border border-[#DEE6DD]">
                <div className="flex justify-between items-center text-gray-600 mb-1">
                  <span>Inmueble:</span>
                  <span className="font-bold text-gray-800">{activeContract.propertyCode}</span>
                </div>
                <div className="flex justify-between items-center text-gray-600 mb-1">
                  <span>Periodo a Cancelar:</span>
                  <span className="font-bold text-gray-800">Noviembre 2024</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                  <span className="font-bold text-gray-800 text-sm">Total a Pagar:</span>
                  <span className="font-mono font-bold text-lg text-[#1E3328]">
                    ${activeContract.monthlyRent} {activeContract.currency}
                  </span>
                </div>
              </div>

              {/* Payment Methods sin duplicidad de texto */}
              <div>
                <label className="block font-semibold text-gray-700 mb-1.5">Seleccionar Método de Pago</label>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  {[
                    { id: 'Tarjeta de Crédito' as const, label: 'Crédito', type: 'Tarjeta' },
                    { id: 'Tarjeta de Débito' as const, label: 'Débito', type: 'Tarjeta' },
                    { id: 'Transferencia Bancaria' as const, label: 'Transferencia', type: 'Bancaria' }
                  ].map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setPaymentMethod(m.id)}
                      className={`p-2.5 rounded-xl border text-center transition-all ${
                        paymentMethod === m.id
                          ? 'border-[#2D4539] bg-[#EEF5ED] text-[#1E3628] shadow-2xs font-bold ring-2 ring-[#2D4539]'
                          : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <span className="block font-bold text-gray-900">{m.label}</span>
                      <span className="block text-[10px] text-gray-500 font-normal">{m.type}</span>
                    </button>
                  ))}
                </div>
              </div>

              {paymentMethod !== 'Transferencia Bancaria' ? (
                <div className="space-y-3">
                  <div>
                    <label className="block font-medium text-gray-700 mb-1">Titular de la Tarjeta</label>
                    <input
                      type="text"
                      required
                      value={cardHolder}
                      onChange={handleCardHolderChange}
                      onBlur={() => setHolderTouched(true)}
                      placeholder="Nombre como aparece en la tarjeta"
                      className={`w-full bg-white border rounded-xl p-2.5 text-gray-800 transition-colors ${
                        cardHolderError 
                          ? 'border-rose-400 bg-rose-50/30' 
                          : holderTouched && isCardHolderValid 
                          ? 'border-emerald-500 bg-emerald-50/20' 
                          : 'border-[#CBD8CA]'
                      }`}
                    />
                    {cardHolderError && (
                      <p className="text-[10px] text-rose-600 mt-1 font-medium">{cardHolderError}</p>
                    )}
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="block font-medium text-gray-700">Número de Tarjeta (Solo Dígitos)</label>
                      <span className="text-[10px] text-gray-400 font-mono">16 dígitos</span>
                    </div>
                    <input
                      type="text"
                      required
                      inputMode="numeric"
                      pattern="[0-9 ]*"
                      maxLength={19}
                      value={cardNumber}
                      onChange={handleCardNumberChange}
                      onBlur={() => setCardTouched(true)}
                      onKeyDown={(e) => {
                        if (['Backspace', 'Delete', 'Tab', 'Escape', 'Enter', 'ArrowLeft', 'ArrowRight'].includes(e.key)) return;
                        if (!/^\d$/.test(e.key)) {
                          e.preventDefault();
                        }
                      }}
                      placeholder="4532 8821 9012 3456"
                      className={`w-full bg-white border rounded-xl p-2.5 text-gray-800 font-mono tracking-wider transition-colors ${
                        cardNumberError 
                          ? 'border-rose-400 bg-rose-50/30' 
                          : cardTouched && isCardNumberValid 
                          ? 'border-emerald-500 bg-emerald-50/20' 
                          : 'border-[#CBD8CA]'
                      }`}
                    />
                    {cardNumberError && (
                      <p className="text-[10px] text-rose-600 mt-1 font-medium">{cardNumberError}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label className="block font-medium text-gray-700">Vencimiento (MM/AA)</label>
                        <span className="text-[10px] text-gray-400 font-mono">Mes 01-12</span>
                      </div>
                      <input
                        type="text"
                        required
                        inputMode="numeric"
                        maxLength={5}
                        value={cardExpiry}
                        onChange={handleCardExpiryChange}
                        onBlur={() => setExpiryTouched(true)}
                        onKeyDown={(e) => {
                          if (['Backspace', 'Delete', 'Tab', 'Escape', 'Enter', 'ArrowLeft', 'ArrowRight'].includes(e.key)) return;
                          if (!/^\d$/.test(e.key)) {
                            e.preventDefault();
                          }
                        }}
                        placeholder="MM/AA"
                        className={`w-full bg-white border rounded-xl p-2.5 text-gray-800 font-mono text-center transition-colors ${
                          cardExpiryError 
                            ? 'border-rose-400 bg-rose-50/30' 
                            : expiryTouched && isCardExpiryValid 
                            ? 'border-emerald-500 bg-emerald-50/20' 
                            : 'border-[#CBD8CA]'
                        }`}
                      />
                      {cardExpiryError && (
                        <p className="text-[10px] text-rose-600 mt-1 font-medium">{cardExpiryError}</p>
                      )}
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label className="block font-medium text-gray-700">CVV (Solo Dígitos)</label>
                        <span className="text-[10px] text-gray-400 font-mono">3-4 dígitos</span>
                      </div>
                      <input
                        type="password"
                        required
                        inputMode="numeric"
                        maxLength={4}
                        value={cardCvv}
                        onChange={handleCardCvvChange}
                        onBlur={() => setCvvTouched(true)}
                        onKeyDown={(e) => {
                          if (['Backspace', 'Delete', 'Tab', 'Escape', 'Enter', 'ArrowLeft', 'ArrowRight'].includes(e.key)) return;
                          if (!/^\d$/.test(e.key)) {
                            e.preventDefault();
                          }
                        }}
                        placeholder="•••"
                        className={`w-full bg-white border rounded-xl p-2.5 text-gray-800 font-mono text-center tracking-widest transition-colors ${
                          cardCvvError 
                            ? 'border-rose-400 bg-rose-50/30' 
                            : cvvTouched && isCardCvvValid 
                            ? 'border-emerald-500 bg-emerald-50/20' 
                            : 'border-[#CBD8CA]'
                        }`}
                      />
                      {cardCvvError && (
                        <p className="text-[10px] text-rose-600 mt-1 font-medium">{cardCvvError}</p>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-amber-900 space-y-3 text-[11px]">
                  <p className="font-bold text-xs text-amber-950">Cuentas Oficiales para Transferencia Bancaria Directa:</p>
                  <div className="space-y-2">
                    {companySettings.bankAccounts.map((b) => (
                      <div 
                        key={b.id} 
                        className={`p-2.5 rounded-xl border ${b.isDefaultReceiving ? 'border-amber-400 bg-amber-100/70 font-semibold' : 'border-amber-200 bg-white/70'}`}
                      >
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-gray-900">{b.bankName}</span>
                          {b.isDefaultReceiving && <span className="text-[10px] bg-amber-200 text-amber-900 px-1.5 py-0.5 rounded font-bold">Principal Receptora</span>}
                        </div>
                        <p className="text-gray-700">Cuenta de {b.accountType}: <strong className="font-mono">{b.accountNumber}</strong> ({b.currency})</p>
                        <p className="text-gray-500 text-[10px]">Beneficiario: {b.beneficiaryName} · RTN: {b.rtn}</p>
                      </div>
                    ))}
                  </div>
                  <p className="text-[10px] text-amber-800 italic">
                    * Al transferir, notifica tu comprobante a tu asesor o en tus mensajes para emitir tu recibo fiscal oficial.
                  </p>
                </div>
              )}

              <div className="pt-2">
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowPaymentModal(false)}
                    className="px-4 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-semibold"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={!isPaymentFormValid}
                    className={`px-5 py-2.5 rounded-xl font-semibold transition-all flex items-center gap-2 ${
                      isPaymentFormValid
                        ? 'bg-[#2D4539] hover:bg-[#20342A] text-white shadow-2xs cursor-pointer'
                        : 'bg-gray-200 text-gray-400 border border-gray-300 cursor-not-allowed opacity-75'
                    }`}
                  >
                    Confirmar Pago de ${activeContract.monthlyRent}
                  </button>
                </div>
                {!isPaymentFormValid && (
                  <p className="text-[10px] text-rose-600 font-medium text-right mt-1.5">
                    * Completa los campos numéricos con longitud válida (16 dígitos de tarjeta, MM/AA y CVV) para habilitar el pago.
                  </p>
                )}
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Pago en Proceso / Verificación Bancaria */}
      <PaymentProcessingModal
        isOpen={showProcessingModal}
        isProcessing={isProcessingStep}
        paymentResult={recentPaymentResult}
        onClose={() => setShowProcessingModal(false)}
        onViewVoucher={() => {
          setShowProcessingModal(false);
          if (recentPaymentResult) {
            openPrintModal({ type: 'receipt', data: recentPaymentResult });
          }
        }}
      />

      {/* Maintenance Request Modal */}
      {showTicketModal && activeContract && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white border border-[#CCD8CB] rounded-3xl max-w-md w-full overflow-hidden shadow-2xl">
            <div className="bg-[#2D4539] text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Wrench className="w-5 h-5 text-[#9EC7A9]" />
                <div>
                  <h3 className="font-serif-brand text-lg font-bold">Reportar Problema / Mantenimiento</h3>
                  <p className="text-xs text-white/70">{activeContract.propertyCode}</p>
                </div>
              </div>
              <button onClick={() => setShowTicketModal(false)} className="text-white/70 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTicket} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Tipo de Mantenimiento</label>
                <select
                  value={ticketType}
                  onChange={(e) => setTicketType(e.target.value as any)}
                  className="w-full bg-white border border-[#CBD8CA] rounded-xl p-2.5 text-gray-800"
                >
                  <option value="Correctivo">Correctivo (Reparación de desperfecto)</option>
                  <option value="Preventivo">Preventivo (Inspección / Limpieza programada)</option>
                  <option value="Emergencia">Emergencia (Fuga mayor, falla eléctrica crítica)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Prioridad</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Baja', 'Media', 'Alta'] as const).map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setTicketPriority(p)}
                      className={`p-2 rounded-xl border text-center font-semibold transition-all ${
                        ticketPriority === p
                          ? 'border-[#2D4539] bg-[#EEF5ED] text-[#1E3628]'
                          : 'border-gray-200 text-gray-600'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Descripción del Problema</label>
                <textarea
                  required
                  rows={3}
                  value={ticketDescription}
                  onChange={(e) => setTicketDescription(e.target.value)}
                  placeholder="Explica qué área del inmueble requiere atención..."
                  className="w-full bg-white border border-[#CBD8CA] rounded-xl p-2.5 text-gray-800"
                ></textarea>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowTicketModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#2D4539] hover:bg-[#20342A] text-white font-semibold transition-colors"
                >
                  Enviar Ticket de Soporte
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
