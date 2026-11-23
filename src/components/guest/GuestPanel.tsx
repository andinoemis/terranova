import React from 'react';
import { 
  Building2, 
  LogIn, 
  UserPlus, 
  Home, 
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Search,
  KeyRound,
  CheckCircle2
} from 'lucide-react';

interface GuestPanelProps {
  onOpenAuth: (mode: 'login' | 'register', presetEmail?: string, presetPass?: string) => void;
  onBrowseCatalog: () => void;
}

export const GuestPanel: React.FC<GuestPanelProps> = ({ onOpenAuth, onBrowseCatalog }) => {
  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Hero Welcome Banner */}
      <div className="bg-[#263E32] rounded-3xl p-6 sm:p-10 text-white relative overflow-hidden shadow-lg border border-[#3E5C4B]">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-96 h-96 bg-white/5 rounded-full pointer-events-none blur-2xl"></div>
        
        <div className="max-w-2xl relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#3D5E4E] text-[#BDE2C8] text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Portal de Bienvenida · Modo Invitado</span>
          </div>

          <h1 className="font-serif-brand text-2xl sm:text-4xl font-bold leading-tight">
            Encuentra tu próximo hogar o gestiona tu arrendamiento en Terranova
          </h1>

          <p className="text-sm sm:text-base text-white/85 leading-relaxed">
            Como invitado puedes explorar nuestro catálogo inmobiliario completo, agendar visitas, iniciar sesión con tu cuenta o registrarte como nuevo <strong>Cliente</strong> o <strong>Inquilino</strong>.
          </p>

          <div className="pt-2 flex flex-wrap gap-3">
            <button
              onClick={onBrowseCatalog}
              className="px-6 py-3 rounded-xl bg-white text-[#1E3628] font-bold text-xs sm:text-sm flex items-center gap-2 shadow-sm hover:bg-[#F0F5F1] transition-all"
            >
              <Search className="w-4 h-4 text-[#2D4539]" />
              <span>Explorar Catálogo Inmobiliario</span>
            </button>
          </div>
        </div>
      </div>

      {/* Guest Portal Core Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Option 1: Explorar Catálogo */}
        <div className="bg-white rounded-3xl border border-[#D5E1D4] p-6 shadow-2xs hover:shadow-md transition-all space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#EEF5ED] text-[#244231] flex items-center justify-center">
              <Home className="w-6 h-6 text-[#2D4539]" />
            </div>
            <h3 className="font-serif-brand text-xl font-bold text-gray-900">
              Catálogo Inmobiliario Abierto
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Visualiza residencias, casas unifamiliares, apartamentos y locales en Tegucigalpa y zonas de alta plusvalía. Filtra por canon de alquiler o precio de venta, características y solicita visitas.
            </p>
            <div className="space-y-1.5 text-[11px] text-gray-700 pt-1">
              <p className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Precios oficiales en USD y HNL
              </p>
              <p className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Fichas técnicas completas con planos y fotos
              </p>
              <p className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Solicitud directa de visitas guiadas
              </p>
            </div>
          </div>

          <button
            onClick={onBrowseCatalog}
            className="w-full py-3 rounded-xl bg-[#2D4539] hover:bg-[#20342A] text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
          >
            <span>Ver Inmuebles Disponibles</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Option 2: Acceso & Registro */}
        <div className="bg-white rounded-3xl border border-[#D5E1D4] p-6 shadow-2xs hover:shadow-md transition-all space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-800 flex items-center justify-center">
              <KeyRound className="w-6 h-6 text-rose-700" />
            </div>
            <h3 className="font-serif-brand text-xl font-bold text-gray-900">
              Acceso de Usuarios & Registro
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Inicia sesión con tus credenciales seguras para acceder a tu área personal o regístrate en la plataforma.
            </p>
            <div className="p-3 bg-[#FAFBF9] rounded-2xl border border-gray-100 text-xs text-gray-600 space-y-1.5">
              <p className="font-semibold text-gray-800">
                · Cuenta de Cliente:
              </p>
              <p className="text-[11px] text-gray-500 pl-2">
                Navegación personalizada, seguimiento de visitas y atención preferencial.
              </p>
              <p className="font-semibold text-gray-800 pt-1">
                · Cuenta de Inquilino:
              </p>
              <p className="text-[11px] text-gray-500 pl-2">
                Portal de arrendamiento privado, agenda personal de citas, mensajes con asesor y pago de rentas.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              onClick={() => onOpenAuth('login')}
              className="py-3 rounded-xl bg-[#2D4539] hover:bg-[#20342A] text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <LogIn className="w-4 h-4" />
              <span>Iniciar Sesión</span>
            </button>
            <button
              onClick={() => onOpenAuth('register')}
              className="py-3 rounded-xl bg-[#C36449] hover:bg-[#B1573D] text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <UserPlus className="w-4 h-4" />
              <span>Registrarse</span>
            </button>
          </div>
        </div>
      </div>

    </div>
  );
};
