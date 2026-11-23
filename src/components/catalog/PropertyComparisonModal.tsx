import React from 'react';
import { useApp } from '../../context/AppContext';
import { Property } from '../../types';
import { 
  X, 
  Check, 
  Minus, 
  MapPin, 
  Bed, 
  Bath, 
  Car, 
  Maximize2, 
  Calendar, 
  Printer, 
  Eye, 
  ShieldCheck, 
  Layers, 
  DollarSign,
  Award,
  Sparkles,
  ArrowRight,
  Info
} from 'lucide-react';

interface PropertyComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProperty: (property: Property) => void;
  onBookVisit: (property: Property) => void;
}

export const PropertyComparisonModal: React.FC<PropertyComparisonModalProps> = ({
  isOpen,
  onClose,
  onSelectProperty,
  onBookVisit
}) => {
  const { 
    comparisonProperties, 
    toggleComparisonProperty, 
    clearComparison, 
    formatMoney, 
    openPrintModal,
    activeCurrency 
  } = useApp();

  if (!isOpen || comparisonProperties.length === 0) return null;

  // Calculate best metrics to highlight differences
  const lowestPrice = Math.min(...comparisonProperties.map(p => p.price));
  const largestSize = Math.max(...comparisonProperties.map(p => p.size));
  const mostBeds = Math.max(...comparisonProperties.map(p => p.bedrooms));

  // Collect unique amenities across all compared properties
  const allAmenities = Array.from(
    new Set(comparisonProperties.flatMap(p => p.features || []))
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/70 backdrop-blur-xs animate-in fade-in overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-5xl w-full my-auto shadow-2xl border border-[#D5E1D4] overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="bg-[#263E32] text-white p-5 sm:p-6 flex items-center justify-between shrink-0">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-[#3D5E4E] text-[#BEE3C8] text-[10px] font-bold uppercase tracking-wider">
                Herramienta de Decisión
              </span>
              <span className="text-xs text-white/70">
                {comparisonProperties.length} de 3 propiedades seleccionadas
              </span>
            </div>
            <h2 className="font-serif-brand text-xl sm:text-2xl font-bold tracking-tight">
              Tabla Comparativa de Inmuebles
            </h2>
            <p className="text-xs text-white/80 max-w-2xl">
              Analiza características técnicas, dimensiones, precios en {activeCurrency} y amenidades para tomar la mejor decisión inmobiliaria.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={clearComparison}
              className="hidden sm:inline-flex px-3 py-1.5 rounded-xl border border-white/20 hover:bg-white/10 text-white/90 text-xs font-semibold transition-colors"
            >
              Limpiar Comparativa
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-colors"
              title="Cerrar ventana"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Table Container */}
        <div className="overflow-x-auto overflow-y-auto flex-1 p-4 sm:p-6 text-xs">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="p-3 text-left font-semibold text-gray-500 w-44 min-w-[170px] bg-gray-50/70 rounded-l-2xl border-b border-gray-100">
                  Parámetro Técnico
                </th>
                {comparisonProperties.map((prop) => {
                  const isBestPrice = prop.price === lowestPrice;
                  return (
                    <th key={prop.id} className="p-3 text-left min-w-[240px] sm:min-w-[270px] border-b border-gray-100 align-top">
                      <div className="relative rounded-2xl overflow-hidden border border-[#D5E1D4] bg-[#FAFBF9] p-3 space-y-2">
                        {/* Remove button */}
                        <button
                          onClick={() => toggleComparisonProperty(prop)}
                          className="absolute top-2 right-2 p-1 rounded-full bg-white/90 hover:bg-rose-100 text-gray-400 hover:text-rose-600 shadow-xs z-10 transition-colors"
                          title="Remover de la comparativa"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>

                        {/* Image */}
                        <div className="h-32 rounded-xl overflow-hidden relative bg-gray-100">
                          <img
                            src={prop.images[0]}
                            alt={prop.title}
                            className="w-full h-full object-cover"
                          />
                          <span className="absolute bottom-1.5 left-1.5 px-2 py-0.5 rounded-md bg-black/75 text-white font-mono text-[10px] font-bold">
                            {prop.code}
                          </span>
                          {isBestPrice && (
                            <span className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded-md bg-emerald-600 text-white text-[10px] font-bold flex items-center gap-1 shadow-xs">
                              <Sparkles className="w-3 h-3" /> Mejor Precio
                            </span>
                          )}
                        </div>

                        {/* Title */}
                        <h4 className="font-serif-brand font-bold text-gray-900 text-sm line-clamp-1">
                          {prop.title}
                        </h4>
                        <div className="flex items-center text-[11px] text-gray-500 gap-1 truncate">
                          <MapPin className="w-3 h-3 text-[#C36449] shrink-0" />
                          <span className="truncate">{prop.neighborhood}, {prop.city}</span>
                        </div>

                        {/* Action buttons */}
                        <div className="pt-2 flex items-center gap-1.5">
                          <button
                            onClick={() => {
                              onSelectProperty(prop);
                              onClose();
                            }}
                            className="flex-1 py-1.5 bg-[#2D4539] hover:bg-[#20342A] text-white font-semibold rounded-lg text-center transition-colors shadow-2xs"
                          >
                            Ver Ficha
                          </button>
                          <button
                            onClick={() => {
                              onBookVisit(prop);
                              onClose();
                            }}
                            className="p-1.5 border border-[#CAD8C8] hover:bg-white text-gray-700 rounded-lg transition-colors"
                            title="Agendar Cita de Visita"
                          >
                            <Calendar className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => openPrintModal({ type: 'property_sheet', data: prop })}
                            className="p-1.5 border border-[#CAD8C8] hover:bg-white text-gray-700 rounded-lg transition-colors"
                            title="Imprimir Dossier Técnico"
                          >
                            <Printer className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              
              {/* Row: Precio / Canon */}
              <tr className="hover:bg-gray-50/60 transition-colors">
                <td className="p-3 font-semibold text-gray-700 flex items-center gap-1.5">
                  <DollarSign className="w-4 h-4 text-[#2D4539]" />
                  <span>Precio ({activeCurrency})</span>
                </td>
                {comparisonProperties.map(prop => {
                  const isBest = prop.price === lowestPrice;
                  return (
                    <td key={prop.id} className="p-3">
                      <span className={`text-base font-bold font-mono ${isBest ? 'text-emerald-700 font-extrabold' : 'text-gray-900'}`}>
                        {formatMoney(prop.price)}
                      </span>
                      <span className="text-[11px] text-gray-400 block">
                        {prop.transactionType === 'Alquiler' ? 'Renta mensual' : 'Valor total venta'}
                      </span>
                    </td>
                  );
                })}
              </tr>

              {/* Row: Tipo de Operación */}
              <tr className="hover:bg-gray-50/60 transition-colors">
                <td className="p-3 font-semibold text-gray-700">Operación</td>
                {comparisonProperties.map(prop => (
                  <td key={prop.id} className="p-3">
                    <span className={`inline-block px-2.5 py-0.5 rounded-md text-[11px] font-bold uppercase ${
                      prop.transactionType === 'Alquiler' ? 'bg-[#2D4539] text-white' : 'bg-[#C36449] text-white'
                    }`}>
                      {prop.transactionType}
                    </span>
                  </td>
                ))}
              </tr>

              {/* Row: Tipo de Propiedad */}
              <tr className="hover:bg-gray-50/60 transition-colors">
                <td className="p-3 font-semibold text-gray-700 flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-gray-500" />
                  <span>Tipo de Inmueble</span>
                </td>
                {comparisonProperties.map(prop => (
                  <td key={prop.id} className="p-3 font-medium text-gray-800">
                    {prop.propertyType}
                  </td>
                ))}
              </tr>

              {/* Row: Superficie en m² */}
              <tr className="hover:bg-gray-50/60 transition-colors">
                <td className="p-3 font-semibold text-gray-700 flex items-center gap-1.5">
                  <Maximize2 className="w-4 h-4 text-[#2D4539]" />
                  <span>Área Total</span>
                </td>
                {comparisonProperties.map(prop => {
                  const isLargest = prop.size === largestSize;
                  return (
                    <td key={prop.id} className="p-3">
                      <span className={`font-mono font-bold ${isLargest ? 'text-emerald-700' : 'text-gray-800'}`}>
                        {prop.size} m²
                      </span>
                      {isLargest && (
                        <span className="ml-1.5 text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded font-bold">
                          Mayor espacio
                        </span>
                      )}
                    </td>
                  );
                })}
              </tr>

              {/* Row: Habitaciones */}
              <tr className="hover:bg-gray-50/60 transition-colors">
                <td className="p-3 font-semibold text-gray-700 flex items-center gap-1.5">
                  <Bed className="w-4 h-4 text-gray-500" />
                  <span>Habitaciones</span>
                </td>
                {comparisonProperties.map(prop => (
                  <td key={prop.id} className="p-3 text-gray-800 font-medium">
                    {prop.bedrooms > 0 ? `${prop.bedrooms} habitaciones` : 'No aplica (Lote/Comercial)'}
                  </td>
                ))}
              </tr>

              {/* Row: Baños */}
              <tr className="hover:bg-gray-50/60 transition-colors">
                <td className="p-3 font-semibold text-gray-700 flex items-center gap-1.5">
                  <Bath className="w-4 h-4 text-gray-500" />
                  <span>Baños</span>
                </td>
                {comparisonProperties.map(prop => (
                  <td key={prop.id} className="p-3 text-gray-800 font-medium">
                    {prop.bathrooms > 0 ? `${prop.bathrooms} baños completos` : '1 baño básico'}
                  </td>
                ))}
              </tr>

              {/* Row: Estacionamientos */}
              <tr className="hover:bg-gray-50/60 transition-colors">
                <td className="p-3 font-semibold text-gray-700 flex items-center gap-1.5">
                  <Car className="w-4 h-4 text-gray-500" />
                  <span>Parqueos</span>
                </td>
                {comparisonProperties.map(prop => (
                  <td key={prop.id} className="p-3 text-gray-800 font-medium">
                    {prop.parkingSpots > 0 ? `${prop.parkingSpots} vehículos` : 'Sin parqueo asignado'}
                  </td>
                ))}
              </tr>

              {/* Row: Cuota de Mantenimiento Mensual */}
              <tr className="hover:bg-gray-50/60 transition-colors">
                <td className="p-3 font-semibold text-gray-700">Mantenimiento Mensual</td>
                {comparisonProperties.map(prop => (
                  <td key={prop.id} className="p-3 text-gray-700 font-mono">
                    {prop.monthlyMaintenanceFee 
                      ? formatMoney(prop.monthlyMaintenanceFee)
                      : 'Incluido en el canon'}
                  </td>
                ))}
              </tr>

              {/* Row: Ubicación */}
              <tr className="hover:bg-gray-50/60 transition-colors">
                <td className="p-3 font-semibold text-gray-700">Ubicación y Sector</td>
                {comparisonProperties.map(prop => (
                  <td key={prop.id} className="p-3 text-gray-700">
                    <p className="font-semibold text-gray-900">{prop.neighborhood}</p>
                    <p className="text-[11px] text-gray-500">{prop.address}</p>
                    <p className="text-[10px] text-gray-400">{prop.city}</p>
                  </td>
                ))}
              </tr>

              {/* Row: Estado */}
              <tr className="hover:bg-gray-50/60 transition-colors">
                <td className="p-3 font-semibold text-gray-700">Disponibilidad</td>
                {comparisonProperties.map(prop => (
                  <td key={prop.id} className="p-3">
                    <span className={`inline-block px-2.5 py-0.5 rounded-md font-bold text-[11px] ${
                      prop.status === 'Disponible' 
                        ? 'bg-emerald-100 text-emerald-800' 
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {prop.status}
                    </span>
                  </td>
                ))}
              </tr>

              {/* Row: Amenidades y Características */}
              {allAmenities.map((amenity, idx) => (
                <tr key={idx} className="hover:bg-gray-50/40 transition-colors">
                  <td className="p-3 text-gray-600 pl-6 border-l-2 border-emerald-600/30">
                    {amenity}
                  </td>
                  {comparisonProperties.map(prop => {
                    const hasAmenity = prop.features?.includes(amenity);
                    return (
                      <td key={prop.id} className="p-3">
                        {hasAmenity ? (
                          <div className="flex items-center gap-1.5 text-emerald-700 font-semibold">
                            <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center">
                              <Check className="w-3 h-3 text-emerald-700" />
                            </div>
                            <span className="text-[11px]">Incluido</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5 text-gray-400">
                            <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center">
                              <Minus className="w-3 h-3 text-gray-400" />
                            </div>
                            <span className="text-[11px]">No disponible</span>
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-3 shrink-0 text-xs">
          <div className="flex items-center gap-2 text-gray-500 text-[11px]">
            <Info className="w-4 h-4 text-[#2D4539] shrink-0" />
            <span>
              Precios calculados en base a tasa referencial del BCH (1 USD = 24.75 HNL). Cumplimiento legal de arrendamientos en moneda nacional (Decreto 131-98).
            </span>
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-[#2D4539] hover:bg-[#20342A] text-white font-semibold rounded-xl transition-colors shadow-2xs"
          >
            Regresar al Catálogo
          </button>
        </div>

      </div>
    </div>
  );
};
