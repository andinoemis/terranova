import React, { useState } from 'react';
import { Home, Search, Building2, Phone, Compass, ArrowRight, HelpCircle } from 'lucide-react';

interface NotFoundViewProps {
  onGoHome: () => void;
  onGoCatalog: (searchTerm?: string) => void;
  onOpenManual?: () => void;
}

export const NotFoundView: React.FC<NotFoundViewProps> = ({ 
  onGoHome, 
  onGoCatalog,
  onOpenManual 
}) => {
  const [searchInput, setSearchInput] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      onGoCatalog(searchInput.trim());
    } else {
      onGoCatalog();
    }
  };

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6 sm:p-12 animate-in fade-in max-w-2xl mx-auto">
      <div className="w-20 h-20 rounded-3xl bg-[#EEF5ED] text-[#2D4539] flex items-center justify-center mb-5 shadow-sm border border-[#D5E2D3]">
        <Building2 className="w-10 h-10 text-[#436450]" />
      </div>

      <span className="font-mono text-xs font-bold text-[#C36449] uppercase tracking-widest mb-1.5 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
        Error 404 · Registro o Sección No Encontrada
      </span>

      <h1 className="font-serif-brand text-3xl sm:text-4xl font-bold text-[#1E3228] leading-tight mb-3">
        La propiedad o expediente que buscas no está disponible
      </h1>

      <p className="text-sm text-gray-600 max-w-md leading-relaxed mb-6">
        El código de inmueble pudo ser modificado, el contrato ya fue formalizado o el enlace es incorrecto. Puedes buscar directamente en el inventario activo.
      </p>

      {/* Quick Search bar */}
      <form onSubmit={handleSearchSubmit} className="w-full max-w-md mb-6 flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Buscar por código (ej. CAS-001) o colonia..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#CAD8C8] rounded-xl text-xs focus:ring-2 focus:ring-[#2D4539] focus:outline-none shadow-2xs"
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2.5 bg-[#2D4539] hover:bg-[#20342A] text-white font-semibold text-xs rounded-xl shadow-xs transition-colors shrink-0 flex items-center gap-1.5"
        >
          <span>Buscar</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </form>

      {/* Quick category chips */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-8 text-xs">
        <span className="text-gray-400 text-[11px] font-semibold">Sugerencias rápidas:</span>
        <button
          onClick={() => onGoCatalog('Casa')}
          className="px-2.5 py-1 bg-white hover:bg-gray-100 rounded-lg border border-gray-200 text-gray-700 transition-colors"
        >
          Casas
        </button>
        <button
          onClick={() => onGoCatalog('Apartamento')}
          className="px-2.5 py-1 bg-white hover:bg-gray-100 rounded-lg border border-gray-200 text-gray-700 transition-colors"
        >
          Apartamentos
        </button>
        <button
          onClick={() => onGoCatalog('Terreno')}
          className="px-2.5 py-1 bg-white hover:bg-gray-100 rounded-lg border border-gray-200 text-gray-700 transition-colors"
        >
          Terrenos & Lotes
        </button>
        <button
          onClick={() => onGoCatalog('Venta')}
          className="px-2.5 py-1 bg-white hover:bg-gray-100 rounded-lg border border-gray-200 text-gray-700 transition-colors font-semibold text-[#2D4539]"
        >
          En Venta
        </button>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          onClick={() => onGoCatalog()}
          className="px-6 py-3 bg-[#2D4539] hover:bg-[#20342A] text-white font-semibold text-xs sm:text-sm rounded-xl flex items-center gap-2 shadow-xs transition-colors"
        >
          <Compass className="w-4 h-4" />
          <span>Explorar Catálogo Completo</span>
        </button>

        <button
          onClick={onGoHome}
          className="px-6 py-3 border border-[#CAD6C8] hover:bg-[#EEF5ED] text-gray-800 font-semibold text-xs sm:text-sm rounded-xl flex items-center gap-2 transition-colors"
        >
          <Home className="w-4 h-4" />
          <span>Ir a la Portada</span>
        </button>

        {onOpenManual && (
          <button
            onClick={onOpenManual}
            className="px-5 py-3 border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 font-semibold text-xs sm:text-sm rounded-xl flex items-center gap-2 transition-colors"
          >
            <HelpCircle className="w-4 h-4 text-emerald-700" />
            <span>Guía de Uso & Ayuda</span>
          </button>
        )}
      </div>

      <div className="mt-12 pt-6 border-t border-gray-200 text-xs text-gray-500 flex items-center gap-2">
        <Phone className="w-3.5 h-3.5 text-[#C36449]" />
        <span>¿Necesitas asistencia de un asesor inmobiliario? Llámanos al <strong>+504 2235-8000</strong></span>
      </div>
    </div>
  );
};
