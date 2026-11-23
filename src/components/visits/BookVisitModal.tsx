import React, { useState } from 'react';
import { Property } from '../../types';
import { useApp } from '../../context/AppContext';
import { X, Calendar, Clock, User, Mail, Phone, Video, MapPin, CheckCircle2 } from 'lucide-react';

interface BookVisitModalProps {
  property: Property | null;
  isOpen: boolean;
  onClose: () => void;
}

export const BookVisitModal: React.FC<BookVisitModalProps> = ({ property, isOpen, onClose }) => {
  const { bookVisit, currentUser } = useApp();

  const [visitorName, setVisitorName] = useState(currentUser.name || '');
  const [visitorEmail, setVisitorEmail] = useState(currentUser.email || '');
  const [visitorPhone, setVisitorPhone] = useState(currentUser.phone || '+504 9');
  const [date, setDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 2);
    return d.toISOString().split('T')[0];
  });
  const [time, setTime] = useState('10:00');
  const [type, setType] = useState<'Presencial' | 'Virtual'>('Presencial');
  const [notes, setNotes] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const [honeypot, setHoneypot] = useState('');
  const [formErrors, setFormErrors] = useState<{ email?: string; phone?: string; name?: string }>({});
  const [lastSubmitTime, setLastSubmitTime] = useState<number>(0);

  if (!isOpen || !property) return null;

  const validate = () => {
    const errors: { email?: string; phone?: string; name?: string } = {};
    const cleanName = visitorName.trim();
    if (!cleanName || cleanName.length < 3) {
      errors.name = 'El nombre completo debe tener al menos 3 caracteres.';
    } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s'-]+$/.test(cleanName)) {
      errors.name = 'El nombre solo puede contener letras y espacios (no se permiten números ni caracteres especiales).';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(visitorEmail.trim())) {
      errors.email = 'Por favor ingresa un correo electrónico válido (ej. usuario@dominio.com).';
    }

    const phoneDigits = visitorPhone.replace(/\D/g, '');
    if (phoneDigits.length < 8) {
      errors.phone = 'Ingresa un número telefónico válido de al menos 8 dígitos numéricos.';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Anti-SPAM Honeypot check: If bot filled hidden field, reject silently
    if (honeypot) {
      console.warn('Spam bot detected via honeypot.');
      return;
    }

    // 2. Anti-SPAM Rate limit cooldown (minimum 3 seconds between submits)
    const now = Date.now();
    if (now - lastSubmitTime < 3000) {
      return;
    }
    setLastSubmitTime(now);

    // 3. Strict Input Validation
    if (!validate()) return;

    bookVisit({
      propertyId: property.id,
      propertyTitle: property.title,
      visitorName: visitorName.trim(),
      visitorEmail: visitorEmail.trim(),
      visitorPhone: visitorPhone.trim(),
      date,
      time,
      type,
      agentName: property.assignedAgentName,
      notes: notes.trim()
    });

    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
    }, 2200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white border border-[#D5E1D4] rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="bg-[#263E32] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-[#97C5A2]" />
            <div>
              <h3 className="font-serif-brand text-lg font-bold">Agendar Visita a la Propiedad</h3>
              <p className="text-xs text-white/70">{property.code} - {property.title}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-full text-white/70 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        {isSuccess ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h4 className="text-xl font-bold font-serif-brand text-gray-900">¡Cita Solicitada con Éxito!</h4>
            <p className="text-sm text-gray-600">
              Hemos notificado a <strong>{property.assignedAgentName}</strong>. Te contactaremos al correo <strong>{visitorEmail}</strong> para confirmar tu visita.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
            {/* Modalidad de Visita */}
            <div>
              <label className="block font-semibold text-gray-700 mb-1.5">Modalidad de Visita</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setType('Presencial')}
                  className={`p-3 rounded-xl border flex items-center justify-center gap-2 font-medium transition-all ${
                    type === 'Presencial'
                      ? 'border-[#2D4539] bg-[#EEF5ED] text-[#1E3628] font-bold shadow-2xs'
                      : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <MapPin className="w-4 h-4 text-[#C36449]" />
                  <span>Presencial en Sitio</span>
                </button>
                <button
                  type="button"
                  onClick={() => setType('Virtual')}
                  className={`p-3 rounded-xl border flex items-center justify-center gap-2 font-medium transition-all ${
                    type === 'Virtual'
                      ? 'border-[#2D4539] bg-[#EEF5ED] text-[#1E3628] font-bold shadow-2xs'
                      : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Video className="w-4 h-4 text-blue-600" />
                  <span>Tour Virtual por Video</span>
                </button>
              </div>
            </div>

            {/* Fecha y Hora */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-gray-700 mb-1 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-[#537260]" /> Fecha Propuesta
                </label>
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-white border border-[#CAD8C8] rounded-xl p-2.5 text-gray-800"
                />
              </div>
              <div>
                <label className="block font-semibold text-gray-700 mb-1 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-[#537260]" /> Hora Preferida
                </label>
                <select
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full bg-white border border-[#CAD8C8] rounded-xl p-2.5 text-gray-800"
                >
                  <option value="09:00">09:00 AM</option>
                  <option value="10:00">10:00 AM</option>
                  <option value="11:30">11:30 AM</option>
                  <option value="14:00">02:00 PM</option>
                  <option value="15:30">03:30 PM</option>
                  <option value="17:00">05:00 PM</option>
                </select>
              </div>
            </div>

            {/* Anti-SPAM Honeypot field (hidden from humans, traps bots) */}
            <div className="hidden" aria-hidden="true">
              <input
                type="text"
                name="website_hp"
                tabIndex={-1}
                autoComplete="off"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
                placeholder="Leave this empty"
              />
            </div>

            {/* Datos de contacto */}
            <div className="space-y-3 pt-2 border-t border-gray-100">
              <div>
                <label className="block font-semibold text-gray-700 mb-1 flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-[#537260]" /> Nombre Completo
                </label>
                <input
                  type="text"
                  required
                  value={visitorName}
                  onChange={(e) => {
                    const sanitized = e.target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s'-]/g, '');
                    setVisitorName(sanitized);
                    if (formErrors.name) setFormErrors(prev => ({ ...prev, name: undefined }));
                  }}
                  placeholder="Tu nombre y apellido (solo letras)"
                  className={`w-full bg-white border rounded-xl p-2.5 text-gray-800 ${
                    formErrors.name ? 'border-rose-500 focus:ring-rose-200' : 'border-[#CAD8C8]'
                  }`}
                />
                <span className="text-[10px] text-gray-400 mt-0.5 block">Solo caracteres alfabéticos y espacios</span>
                {formErrors.name && (
                  <p className="text-[11px] text-rose-600 mt-1">{formErrors.name}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1 flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-[#537260]" /> Correo Electrónico
                  </label>
                  <input
                    type="email"
                    required
                    value={visitorEmail}
                    onChange={(e) => {
                      setVisitorEmail(e.target.value);
                      if (formErrors.email) setFormErrors(prev => ({ ...prev, email: undefined }));
                    }}
                    placeholder="correo@ejemplo.com"
                    className={`w-full bg-white border rounded-xl p-2.5 text-gray-800 ${
                      formErrors.email ? 'border-rose-500 focus:ring-rose-200' : 'border-[#CAD8C8]'
                    }`}
                  />
                  {formErrors.email && (
                    <p className="text-[11px] text-rose-600 mt-1">{formErrors.email}</p>
                  )}
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1 flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-[#537260]" /> Teléfono Celular
                  </label>
                  <input
                    type="tel"
                    required
                    value={visitorPhone}
                    onChange={(e) => {
                      const sanitized = e.target.value.replace(/[^0-9+\s-]/g, '').slice(0, 20);
                      setVisitorPhone(sanitized);
                      if (formErrors.phone) setFormErrors(prev => ({ ...prev, phone: undefined }));
                    }}
                    placeholder="+504 9876-5432"
                    className={`w-full bg-white border rounded-xl p-2.5 text-gray-800 ${
                      formErrors.phone ? 'border-rose-500 focus:ring-rose-200' : 'border-[#CAD8C8]'
                    }`}
                  />
                  <span className="text-[10px] text-gray-400 mt-0.5 block">Solo números y prefijo '+'</span>
                  {formErrors.phone && (
                    <p className="text-[11px] text-rose-600 mt-1">{formErrors.phone}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Comentarios o Preguntas Especiales</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Ej: Deseo verificar los parqueos y si se aceptan mascotas..."
                  className="w-full bg-white border border-[#CAD8C8] rounded-xl p-2.5 text-gray-800"
                ></textarea>
              </div>
            </div>

            {/* Submit */}
            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-[#2D4539] hover:bg-[#20342A] text-white font-semibold transition-colors shadow-2xs"
              >
                Confirmar Solicitud de Cita
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
