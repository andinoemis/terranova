import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Property, PropertyType, TransactionType } from '../../types';
import { PropertyComparisonModal } from './PropertyComparisonModal';
import { 
  Search, 
  Filter, 
  MapPin, 
  Maximize2, 
  Bed, 
  Bath, 
  Car, 
  Calendar, 
  Printer, 
  Eye, 
  CheckCircle,
  Tag,
  ArrowRight,
  Shield,
  Layers,
  Scale,
  Coins,
  Check,
  Info,
  X
} from 'lucide-react';

interface PropertyCatalogProps {
  onSelectProperty: (property: Property) => void;
  onBookVisit: (property: Property) => void;
}

export const PropertyCatalog: React.FC<PropertyCatalogProps> = ({ onSelectProperty, onBookVisit }) => {
  const { 
    properties, 
    openPrintModal,
    activeCurrency,
    setActiveCurrency,
    exchangeRateUSDToHNL,
    formatMoney,
    comparisonProperties,
    toggleComparisonProperty,
    clearComparison,
    isComparingModalOpen,
    setIsComparingModalOpen
  } = useApp();

  // Filters
  const [activeCategory, setActiveCategory] = useState<'Todos' | 'Alquiler' | 'Venta' | 'Terrenos'>('Todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [maxPrice, setMaxPrice] = useState<number>(300000);
  const [minBedrooms, setMinBedrooms] = useState<number>(0);
  const [showLegalNotice, setShowLegalNotice] = useState(false);

  const filteredProperties = useMemo(() => {
    return properties.filter((prop) => {
      // Regla de negocio: Inmuebles suspendidos por el propietario no se muestran en catálogo público
      if (prop.status === 'Suspendida') return false;

      // Category filter (Alquiler, Venta, Terrenos)
      if (activeCategory === 'Alquiler' && prop.transactionType !== 'Alquiler') return false;
      if (activeCategory === 'Venta' && prop.transactionType !== 'Venta') return false;
      if (activeCategory === 'Terrenos' && prop.propertyType !== 'Terreno') return false;

      // Property type filter
      if (selectedType !== 'all' && prop.propertyType !== selectedType) return false;

      // Bedrooms
      if (minBedrooms > 0 && prop.bedrooms < minBedrooms) return false;

      // Max price
      if (prop.price > maxPrice) return false;

      // Search term
      if (searchTerm.trim() !== '') {
        const query = searchTerm.toLowerCase();
        const matchesTitle = prop.title.toLowerCase().includes(query);
        const matchesAddress = prop.address.toLowerCase().includes(query);
        const matchesCode = prop.code.toLowerCase().includes(query);
        const matchesNeighborhood = prop.neighborhood.toLowerCase().includes(query);
        if (!matchesTitle && !matchesAddress && !matchesCode && !matchesNeighborhood) return false;
      }

      return true;
    });
  }, [properties, activeCategory, selectedType, maxPrice, minBedrooms, searchTerm]);

  return (
    <div className="space-y-8">
      {/* Hero Banner inspired by page 27 mockup */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#1E3429] via-[#2D4A3C] to-[#456956] text-white p-8 sm:p-12 shadow-md">
        <div className="relative z-10 max-w-2xl space-y-4">
          <span className="inline-block px-3 py-1 rounded-full bg-white/15 text-[#B8DCBF] text-xs font-semibold tracking-wider uppercase backdrop-blur-xs">
            Portal Oficial de Inmuebles
          </span>
          <h1 className="font-serif-brand text-3xl sm:text-5xl font-bold tracking-tight text-white leading-tight">
            Encuentra el hogar que siempre soñaste en Honduras
          </h1>
          <p className="text-sm sm:text-base text-white/80 leading-relaxed">
            Explora las mejores residencias, apartamentos, villas de descanso y terrenos con seguridad jurídica garantizada, contratos automatizados y gestión en tiempo real.
          </p>

          {/* Quick search input */}
          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por colonia, código (ej: Casa Prince) o palabra clave..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-white text-gray-900 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-[#81A88E] shadow-sm"
              />
            </div>
            <button
              onClick={() => setActiveCategory('Todos')}
              className="px-6 py-3 bg-[#C36449] hover:bg-[#B0573E] text-white font-semibold text-sm rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2"
            >
              <span>Ver Todo</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Decorative illustration circles */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-20 pointer-events-none bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
      </div>

      {/* Categories Tabs and Currency Switcher (Cumplimiento Ley Monetaria Decreto 131-98) */}
      <div className="bg-white p-3 sm:p-4 rounded-2xl border border-[#D5E1D2] shadow-2xs space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: 'Todos', label: 'Todos los Inmuebles' },
              { id: 'Alquiler', label: 'Catálogo de Alquiler' },
              { id: 'Venta', label: 'Catálogo de Venta' },
              { id: 'Terrenos', label: 'Catálogo de Terrenos' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveCategory(tab.id as any)}
                className={`px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                  activeCategory === tab.id
                    ? 'bg-[#2E473A] text-white shadow-xs'
                    : 'text-[#486253] hover:bg-[#EEF4EC]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Right controls: Currency Switcher & Comparator shortcut */}
          <div className="flex items-center gap-2.5">
            {/* Currency Switcher */}
            <div className="flex items-center bg-[#FAFBF9] border border-[#CBD8CA] rounded-xl p-1 gap-1 text-xs">
              <span className="text-[10px] font-bold text-gray-500 uppercase px-1 hidden sm:inline">Moneda:</span>
              <button
                onClick={() => setActiveCurrency('HNL')}
                className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all flex items-center gap-1 ${
                  activeCurrency === 'HNL'
                    ? 'bg-[#2D4539] text-white shadow-2xs'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                title="Lempiras hondureños (Moneda oficial de curso legal)"
              >
                <span>HNL (L.)</span>
              </button>
              <button
                onClick={() => setActiveCurrency('USD')}
                className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all flex items-center gap-1 ${
                  activeCurrency === 'USD'
                    ? 'bg-[#2D4539] text-white shadow-2xs'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                title="Dólares estadounidenses"
              >
                <span>USD ($)</span>
              </button>
            </div>

            {/* Legal compliance tooltip trigger */}
            <button
              onClick={() => setShowLegalNotice(!showLegalNotice)}
              className="p-1.5 rounded-xl border border-[#CBD8CA] bg-[#FAFBF9] hover:bg-[#EEF4EC] text-amber-800 transition-colors"
              title="Información sobre Ley de Arrendamiento y Moneda en Honduras"
            >
              <Info className="w-4 h-4 text-amber-700" />
            </button>

            {/* Active comparison count button */}
            {comparisonProperties.length > 0 && (
              <button
                onClick={() => setIsComparingModalOpen(true)}
                className="px-3 py-1.5 rounded-xl bg-[#C36449] hover:bg-[#B1573D] text-white text-xs font-bold flex items-center gap-1.5 shadow-2xs animate-pulse transition-all"
              >
                <Scale className="w-3.5 h-3.5" />
                <span>Comparar ({comparisonProperties.length})</span>
              </button>
            )}

            <div className="text-xs text-gray-500 font-medium hidden md:block pl-2 border-l border-gray-200">
              <strong>{filteredProperties.length}</strong> de {properties.length}
            </div>
          </div>
        </div>

        {/* Legal notice popover regarding Honduras rental currency law */}
        {showLegalNotice && (
          <div className="p-3.5 bg-amber-50/90 rounded-2xl border border-amber-200 text-xs text-amber-900 flex items-start justify-between gap-3 animate-in fade-in">
            <div className="flex items-start gap-2">
              <Shield className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">
                  Marco Legal de Arrendamiento en Honduras (Decreto No. 131-98 / Ley del Banco Central)
                </p>
                <p className="text-[11px] text-amber-800/90 mt-0.5 leading-relaxed">
                  En Honduras, la moneda nacional de curso legal obligatorio para transacciones internas y contratos de alquiler habitacional es el <strong>Lempira (HNL)</strong>. La legislación prohíbe exigir exclusivamente cánones de renta en moneda extranjera sin opción de pago en Lempiras. Terranova permite alternar entre HNL y USD garantizando la conversión oficial (1 USD = {exchangeRateUSDToHNL} HNL).
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowLegalNotice(false)}
              className="text-amber-700 hover:text-amber-950 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Advanced Filter Toolbar (RF-0402) */}
      <div className="bg-[#FAFBF9] p-4 rounded-2xl border border-[#DCE5DA] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
        {/* Tipo de Propiedad */}
        <div>
          <label className="block text-gray-600 font-semibold mb-1 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-[#597463]" /> Tipo de Propiedad
          </label>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="w-full bg-white border border-[#CDD8CA] rounded-lg p-2 text-gray-800 focus:outline-hidden focus:ring-1 focus:ring-[#446251]"
          >
            <option value="all">Cualquier tipo</option>
            <option value="Casa">Casa</option>
            <option value="Apartamento">Apartamento</option>
            <option value="Terreno">Terreno</option>
            <option value="Villa">Villa Campestre</option>
            <option value="Local Comercial">Local Comercial</option>
          </select>
        </div>

        {/* Habitaciones */}
        <div>
          <label className="block text-gray-600 font-semibold mb-1 flex items-center gap-1.5">
            <Bed className="w-3.5 h-3.5 text-[#597463]" /> Habitaciones Mínimas
          </label>
          <select
            value={minBedrooms}
            onChange={(e) => setMinBedrooms(Number(e.target.value))}
            className="w-full bg-white border border-[#CDD8CA] rounded-lg p-2 text-gray-800 focus:outline-hidden focus:ring-1 focus:ring-[#446251]"
          >
            <option value={0}>Sin mínimo</option>
            <option value={1}>1+ habitación</option>
            <option value={2}>2+ habitaciones</option>
            <option value={3}>3+ habitaciones</option>
            <option value={4}>4+ habitaciones</option>
          </select>
        </div>

        {/* Precio Máximo */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-gray-600 font-semibold flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-[#597463]" /> Precio Máximo
            </label>
            <span className="font-mono font-bold text-[#274033]">
              ${maxPrice.toLocaleString()} USD
            </span>
          </div>
          <input
            type="range"
            min={500}
            max={300000}
            step={500}
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
            className="w-full accent-[#2D4539] cursor-pointer"
          />
        </div>

        {/* Limpiar Filtros */}
        <div className="flex items-end">
          <button
            onClick={() => {
              setActiveCategory('Todos');
              setSearchTerm('');
              setSelectedType('all');
              setMaxPrice(300000);
              setMinBedrooms(0);
            }}
            className="w-full py-2 px-3 rounded-lg border border-[#CAD6C7] hover:bg-white text-gray-700 font-semibold transition-colors flex items-center justify-center gap-1.5"
          >
            <Filter className="w-3.5 h-3.5" /> Restablecer Filtros
          </button>
        </div>
      </div>

      {/* Grid of Properties */}
      {filteredProperties.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-2xl border border-dashed border-gray-300">
          <p className="text-base text-gray-600 font-medium">No se encontraron propiedades que coincidan con los criterios seleccionados.</p>
          <button
            onClick={() => {
              setActiveCategory('Todos');
              setSearchTerm('');
              setSelectedType('all');
              setMaxPrice(300000);
              setMinBedrooms(0);
            }}
            className="mt-4 px-4 py-2 bg-[#2D4539] text-white rounded-xl text-xs font-semibold"
          >
            Ver catálogo completo
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProperties.map((property) => (
            <div
              key={property.id}
              className="bg-white rounded-2xl border border-[#D7E3D4] overflow-hidden shadow-2xs hover:shadow-lg transition-all duration-300 flex flex-col group"
            >
              {/* Image banner with badges */}
              <div className="relative h-56 overflow-hidden bg-gray-100">
                <img
                  src={property.images[0]}
                  alt={`${property.title} - ${property.propertyType} en ${property.neighborhood}, ${property.city} (${property.code})`}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                
                {/* Top Badges */}
                <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                  <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold tracking-wide uppercase ${
                    property.transactionType === 'Alquiler' 
                      ? 'bg-[#2E473A] text-white' 
                      : 'bg-[#C36449] text-white'
                  }`}>
                    {property.transactionType}
                  </span>

                  <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold ${
                    property.status === 'Disponible' 
                      ? 'bg-emerald-600 text-white' 
                      : property.status === 'Alquilada'
                      ? 'bg-amber-600 text-white'
                      : 'bg-slate-700 text-white'
                  }`}>
                    {property.status}
                  </span>
                </div>

                {/* Compare Checkbox Button on Card Top Right */}
                {(() => {
                  const isBeingCompared = comparisonProperties.some(p => p.id === property.id);
                  return (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleComparisonProperty(property);
                      }}
                      className={`absolute top-3 right-3 px-2.5 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1.5 shadow-md backdrop-blur-xs transition-all z-10 ${
                        isBeingCompared
                          ? 'bg-[#C36449] text-white ring-2 ring-white'
                          : 'bg-white/90 hover:bg-white text-gray-800'
                      }`}
                      title={isBeingCompared ? 'Remover del comparador' : 'Seleccionar para comparar características técnicas (máx 3)'}
                    >
                      <Scale className="w-3.5 h-3.5" />
                      <span>{isBeingCompared ? '✓ Comparando' : 'Comparar'}</span>
                    </button>
                  );
                })()}

                {/* Property Code Badge (e.g. "CASA PRINCE" as in Mockup) */}
                <div className="absolute bottom-3 left-3 bg-black/75 backdrop-blur-xs text-white px-2.5 py-1 rounded-md font-mono text-xs font-bold tracking-wider">
                  {property.code}
                </div>

                <div className="absolute bottom-3 right-3 bg-white/95 text-[#1F362A] px-2.5 py-1 rounded-md text-xs font-semibold shadow-xs">
                  {property.propertyType}
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center text-xs text-gray-500 gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#C36449] shrink-0" />
                    <span className="truncate">{property.address}, {property.city}</span>
                  </div>

                  <h3 
                    onClick={() => onSelectProperty(property)}
                    className="font-serif-brand text-lg font-bold text-[#1E3328] group-hover:text-[#325944] cursor-pointer line-clamp-1 transition-colors"
                  >
                    {property.title}
                  </h3>

                  <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                    {property.description}
                  </p>
                </div>

                {/* Features Pills */}
                <div className="grid grid-cols-4 gap-2 pt-2 border-t border-gray-100 text-center text-xs text-gray-600 font-medium">
                  <div className="bg-[#F5F8F4] p-1.5 rounded-lg">
                    <Maximize2 className="w-3.5 h-3.5 mx-auto mb-0.5 text-[#5A7765]" />
                    <span>{property.size} m²</span>
                  </div>
                  <div className="bg-[#F5F8F4] p-1.5 rounded-lg">
                    <Bed className="w-3.5 h-3.5 mx-auto mb-0.5 text-[#5A7765]" />
                    <span>{property.bedrooms > 0 ? `${property.bedrooms} hab` : 'Lote'}</span>
                  </div>
                  <div className="bg-[#F5F8F4] p-1.5 rounded-lg">
                    <Bath className="w-3.5 h-3.5 mx-auto mb-0.5 text-[#5A7765]" />
                    <span>{property.bathrooms > 0 ? `${property.bathrooms} bñ` : '-'}</span>
                  </div>
                  <div className="bg-[#F5F8F4] p-1.5 rounded-lg">
                    <Car className="w-3.5 h-3.5 mx-auto mb-0.5 text-[#5A7765]" />
                    <span>{property.parkingSpots > 0 ? `${property.parkingSpots} parq` : '-'}</span>
                  </div>
                </div>

                {/* Price and Action Buttons with formatMoney (supports HNL / USD) */}
                <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
                  <div>
                    <span className="text-[11px] text-gray-400 block font-medium">
                      {property.transactionType === 'Alquiler' ? 'Renta Mensual' : 'Precio de Venta'}
                    </span>
                    <span className="text-base sm:text-lg font-bold font-mono text-[#1E3328]">
                      {formatMoney(property.price)}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {/* Print Technical Dossier as shown in PDF mockup */}
                    <button
                      onClick={() => openPrintModal({ type: 'property_sheet', data: property })}
                      title="Ver e Imprimir Ficha Técnica de la Propiedad"
                      className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-[#EEF4EC] border border-[#CCD8CB] transition-colors"
                    >
                      <Printer className="w-4 h-4" />
                    </button>

                    {/* Book Visit */}
                    <button
                      onClick={() => onBookVisit(property)}
                      title="Agendar Cita de Visita"
                      className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-[#EEF4EC] border border-[#CCD8CB] transition-colors"
                    >
                      <Calendar className="w-4 h-4" />
                    </button>

                    {/* View Details */}
                    <button
                      onClick={() => onSelectProperty(property)}
                      className="px-3 py-2 bg-[#2E473A] hover:bg-[#203329] text-white text-xs font-semibold rounded-lg flex items-center gap-1 shadow-2xs transition-colors"
                    >
                      <span>Detalles</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Floating Bottom Comparison Dock (When 1-3 properties are selected) */}
      {comparisonProperties.length > 0 && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-11/12 max-w-2xl bg-[#1E3429]/95 text-white backdrop-blur-md rounded-2xl p-3 sm:p-4 shadow-2xl border border-white/20 flex flex-col sm:flex-row items-center justify-between gap-3 animate-in slide-in-from-bottom-5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
              <Scale className="w-5 h-5 text-[#A3C7AD]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-xs sm:text-sm">Comparador Inmobiliario</span>
                <span className="px-2 py-0.2 rounded-full bg-[#C36449] text-white text-[10px] font-bold">
                  {comparisonProperties.length} de 3
                </span>
              </div>
              <p className="text-[11px] text-white/70 hidden sm:block">
                Selecciona hasta 3 inmuebles para ver su tabla técnica comparativa.
              </p>
            </div>
          </div>

          {/* Thumbnails of selected properties */}
          <div className="flex items-center gap-1.5 overflow-x-auto">
            {comparisonProperties.map(prop => (
              <div key={prop.id} className="relative group w-10 h-10 rounded-lg overflow-hidden border border-white/30 shrink-0">
                <img src={prop.images[0]} alt={prop.code} className="w-full h-full object-cover" />
                <button
                  onClick={() => toggleComparisonProperty(prop)}
                  className="absolute inset-0 bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  title={`Quitar ${prop.code}`}
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
            {Array.from({ length: 3 - comparisonProperties.length }).map((_, i) => (
              <div key={i} className="w-10 h-10 rounded-lg border border-dashed border-white/30 flex items-center justify-center text-white/40 text-[10px] shrink-0">
                +{i + 1}
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={clearComparison}
              className="px-3 py-1.5 rounded-xl border border-white/20 hover:bg-white/10 text-white/80 text-xs font-semibold transition-colors"
            >
              Limpiar
            </button>
            <button
              onClick={() => setIsComparingModalOpen(true)}
              className="flex-1 sm:flex-none px-4 py-2 bg-[#C36449] hover:bg-[#B1573D] text-white text-xs font-bold rounded-xl transition-colors shadow-xs flex items-center justify-center gap-1.5"
            >
              <span>Ver Comparativa</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Property Comparison Modal */}
      <PropertyComparisonModal
        isOpen={isComparingModalOpen}
        onClose={() => setIsComparingModalOpen(false)}
        onSelectProperty={onSelectProperty}
        onBookVisit={onBookVisit}
      />
    </div>
  );
};
