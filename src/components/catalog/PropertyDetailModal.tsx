import React, { useState } from 'react';
import { Property } from '../../types';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  MapPin, 
  Maximize2, 
  Bed, 
  Bath, 
  Car, 
  Calendar, 
  Printer, 
  FileText, 
  Check, 
  UserCheck, 
  DollarSign, 
  Calculator,
  ShieldCheck,
  Share2
} from 'lucide-react';

interface PropertyDetailModalProps {
  property: Property | null;
  onClose: () => void;
  onBookVisit: (prop: Property) => void;
}

export const PropertyDetailModal: React.FC<PropertyDetailModalProps> = ({
  property,
  onClose,
  onBookVisit
}) => {
  const { openPrintModal, showToast } = useApp();
  const [selectedImageIdx, setSelectedImageIdx] = useState(0);
  const [downPaymentPct, setDownPaymentPct] = useState(20);
  const [loanYears, setLoanYears] = useState(20);
  const [annualRate, setAnnualRate] = useState(8.5); // 8.5% tasa hipotecaria promedio Honduras

  if (!property) return null;

  // Mortgage Calculator
  const loanAmount = property.price * (1 - downPaymentPct / 100);
  const monthlyRate = annualRate / 100 / 12;
  const numPayments = loanYears * 12;
  const monthlyPayment = property.transactionType === 'Venta'
    ? (loanAmount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -numPayments))
    : property.price;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white border border-[#CDD8CB] rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-2xl flex flex-col">
        {/* Modal Top Bar */}
        <div className="p-4 sm:p-6 border-b border-gray-100 flex items-center justify-between bg-[#FAFBF9] rounded-t-3xl sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <span className="font-mono bg-[#2E473A] text-white px-3 py-1 rounded-lg text-xs font-bold tracking-wider">
              {property.code}
            </span>
            <div>
              <h2 className="font-serif-brand text-xl sm:text-2xl font-bold text-[#1F362A] leading-tight">
                {property.title}
              </h2>
              <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-[#C36449]" /> {property.address}, {property.city}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => openPrintModal({ type: 'property_sheet', data: property })}
              className="px-3 py-1.5 rounded-xl border border-[#CCD8CB] hover:bg-[#EEF4EC] text-xs font-semibold text-[#2D4539] flex items-center gap-1.5 transition-colors"
              title="Imprimir Ficha Técnica Oficial"
            >
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline">Ficha Imprimible</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 space-y-6">
          {/* Gallery View */}
          <div className="space-y-3">
            <div className="w-full h-72 sm:h-96 rounded-2xl overflow-hidden bg-gray-100 relative shadow-inner">
              <img
                src={property.images[selectedImageIdx] || property.images[0]}
                alt={`Fotografía principal de ${property.title} (${property.code}) en ${property.address}`}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-xs text-white px-3 py-1 rounded-full text-xs font-medium">
                {property.status} · {property.transactionType}
              </div>
            </div>

            {/* Thumbnails */}
            {property.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-1">
                {property.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIdx(idx)}
                    className={`w-20 h-16 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                      selectedImageIdx === idx ? 'border-[#2E473A] scale-102 shadow-xs' : 'border-transparent opacity-70'
                    }`}
                  >
                    <img 
                      src={img} 
                      alt={`Vista ${idx + 1} de la propiedad ${property.code}`} 
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover" 
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Quick Specifications Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#F4F7F3] p-4 rounded-2xl border border-[#D5E1D3] text-center">
            <div>
              <Maximize2 className="w-4 h-4 mx-auto text-[#486653] mb-1" />
              <span className="text-xs text-gray-500 block">Área Construida</span>
              <span className="font-bold text-sm text-[#1F3528]">{property.size} m²</span>
            </div>
            <div>
              <Bed className="w-4 h-4 mx-auto text-[#486653] mb-1" />
              <span className="text-xs text-gray-500 block">Habitaciones</span>
              <span className="font-bold text-sm text-[#1F3528]">
                {property.bedrooms > 0 ? `${property.bedrooms} Dormitorios` : 'No aplica'}
              </span>
            </div>
            <div>
              <Bath className="w-4 h-4 mx-auto text-[#486653] mb-1" />
              <span className="text-xs text-gray-500 block">Baños</span>
              <span className="font-bold text-sm text-[#1F3528]">{property.bathrooms} Baños</span>
            </div>
            <div>
              <Car className="w-4 h-4 mx-auto text-[#486653] mb-1" />
              <span className="text-xs text-gray-500 block">Estacionamiento</span>
              <span className="font-bold text-sm text-[#1F3528]">{property.parkingSpots} Vehículos</span>
            </div>
          </div>

          {/* Main Info Columns */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left 2 Cols: Description, Features, Documents */}
            <div className="lg:col-span-2 space-y-5">
              <div>
                <h3 className="font-serif-brand text-lg font-bold text-[#1E3328] mb-2">
                  Descripción General
                </h3>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {property.description}
                </p>
              </div>

              {/* Features List */}
              <div>
                <h3 className="font-serif-brand text-lg font-bold text-[#1E3328] mb-3">
                  Amenidades y Características
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {property.features.map((feat, i) => (
                    <div key={i} className="flex items-center gap-2 text-gray-700 bg-white p-2.5 rounded-xl border border-[#DFE6DE]">
                      <div className="w-5 h-5 rounded-full bg-[#E5EFE4] text-[#2F4D3B] flex items-center justify-center shrink-0">
                        <Check className="w-3 h-3" />
                      </div>
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Related Documentation (RF-0403) */}
              <div className="bg-[#FAFBF9] p-4 rounded-2xl border border-[#D8E3D6]">
                <h3 className="font-serif-brand text-base font-bold text-[#1E3328] flex items-center gap-2 mb-2">
                  <FileText className="w-4 h-4 text-[#C36449]" /> Expediente y Documentación Legal
                </h3>
                <p className="text-xs text-gray-500 mb-3">
                  Documentos auditados y certificados por el equipo legal de Terranova.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-[#D0DDD0] text-xs font-medium text-gray-700">
                    <Check className="w-3.5 h-3.5 text-emerald-600" /> Plano Arquitectónico Aprobado
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-[#D0DDD0] text-xs font-medium text-gray-700">
                    <Check className="w-3.5 h-3.5 text-emerald-600" /> Certificado Catastral Vigente
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-[#D0DDD0] text-xs font-medium text-gray-700">
                    <Check className="w-3.5 h-3.5 text-emerald-600" /> Solvencia Municipal al Día
                  </span>
                </div>
              </div>
            </div>

            {/* Right Col: Price, Calculator, Agent contact */}
            <div className="space-y-5">
              {/* Price card */}
              <div className="bg-[#2D4539] text-white p-5 rounded-2xl shadow-sm space-y-4">
                <div>
                  <span className="text-xs text-white/70 block uppercase tracking-wider font-semibold">
                    {property.transactionType === 'Alquiler' ? 'Renta Mensual' : 'Precio de Venta'}
                  </span>
                  <div className="text-3xl font-bold font-mono text-white mt-1">
                    ${property.price.toLocaleString()} <span className="text-sm font-normal text-white/70">{property.currency}</span>
                  </div>
                  {property.monthlyMaintenanceFee && property.monthlyMaintenanceFee > 0 && (
                    <span className="text-xs text-white/75 mt-1 block">
                      + ${property.monthlyMaintenanceFee} USD cuota de mantenimiento residencial
                    </span>
                  )}
                </div>

                <div className="pt-2 border-t border-white/15 space-y-2">
                  <button
                    onClick={() => {
                      onClose();
                      onBookVisit(property);
                    }}
                    className="w-full py-3 bg-[#C36449] hover:bg-[#B1573D] text-white font-semibold text-xs sm:text-sm rounded-xl transition-colors flex items-center justify-center gap-2 shadow-xs"
                  >
                    <Calendar className="w-4 h-4" />
                    <span>Agendar Visita Guiada</span>
                  </button>

                  <button
                    onClick={() => {
                      navigator.clipboard?.writeText(window.location.href);
                      showToast('Enlace de la propiedad copiado al portapapeles');
                    }}
                    className="w-full py-2 bg-white/10 hover:bg-white/20 text-white font-medium text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Share2 className="w-3.5 h-3.5" /> Compartir Inmueble
                  </button>
                </div>
              </div>

              {/* Agent card */}
              <div className="bg-white p-4 rounded-2xl border border-[#DCE5DC] shadow-2xs space-y-3">
                <span className="text-[11px] uppercase tracking-wider text-gray-400 font-bold block">
                  Agente Inmobiliario Asignado
                </span>
                <div className="flex items-center gap-3">
                  <img
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80"
                    alt={property.assignedAgentName}
                    className="w-12 h-12 rounded-xl object-cover border border-[#CCD8CB]"
                  />
                  <div>
                    <h4 className="text-sm font-bold text-gray-900">{property.assignedAgentName}</h4>
                    <p className="text-xs text-[#526F5D] font-medium">Asesor Certificado Terranova</p>
                    <p className="text-[11px] text-gray-500">+504 9912-3456</p>
                  </div>
                </div>
              </div>

              {/* Interactive Mortgage Calculator (if Venta) */}
              {property.transactionType === 'Venta' && (
                <div className="bg-[#FAFBF9] p-4 rounded-2xl border border-[#D8E2D6] space-y-3 text-xs">
                  <div className="flex items-center gap-1.5 font-bold text-[#1E3328]">
                    <Calculator className="w-4 h-4 text-[#C36449]" />
                    <span>Calculadora de Cuota Hipotecaria</span>
                  </div>

                  <div>
                    <div className="flex justify-between text-gray-600 mb-1">
                      <span>Prima ({downPaymentPct}%):</span>
                      <span className="font-mono font-bold">${(property.price * downPaymentPct / 100).toLocaleString()}</span>
                    </div>
                    <input
                      type="range"
                      min={10}
                      max={50}
                      value={downPaymentPct}
                      onChange={(e) => setDownPaymentPct(Number(e.target.value))}
                      className="w-full accent-[#2D4539]"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-gray-600 mb-1">
                      <span>Plazo:</span>
                      <span className="font-mono font-bold">{loanYears} años</span>
                    </div>
                    <input
                      type="range"
                      min={5}
                      max={30}
                      step={5}
                      value={loanYears}
                      onChange={(e) => setLoanYears(Number(e.target.value))}
                      className="w-full accent-[#2D4539]"
                    />
                  </div>

                  <div className="p-3 bg-[#EAF2E8] rounded-xl text-center">
                    <span className="text-[11px] text-gray-600 block">Cuota Mensual Estimada</span>
                    <span className="text-lg font-bold font-mono text-[#1F392B]">
                      ${Math.round(monthlyPayment).toLocaleString()} USD / mes
                    </span>
                    <span className="text-[10px] text-gray-500 block mt-0.5">Tasa referencial 8.5% anual en USD</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
