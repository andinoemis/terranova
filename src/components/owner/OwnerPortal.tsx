import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Property, MaintenanceRequest } from '../../types';
import { PropertyImageUploader } from '../common/PropertyImageUploader';
import { 
  Building2, 
  TrendingUp, 
  DollarSign, 
  Users, 
  Wrench, 
  Plus, 
  Printer, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  FileText,
  Calendar,
  X,
  Coins,
  Lock,
  ShieldCheck
} from 'lucide-react';

export const OwnerPortal: React.FC = () => {
  const { 
    currentUser, 
    properties, 
    contracts, 
    payments, 
    maintenance, 
    addProperty, 
    generatePropertyCode,
    createMaintenanceRequest,
    openPrintModal,
    formatMoney,
    showToast 
  } = useApp();

  // Filter properties owned by this user (or show all in demo if current user is owner)
  const myProperties = properties.filter(p => p.ownerId === currentUser.id || p.ownerName === currentUser.name || currentUser.role === 'admin');
  const availableProperties = myProperties.length > 0 ? myProperties : properties;

  // Calculate Owner Financials
  const myContracts = contracts.filter(c => availableProperties.some(p => p.id === c.propertyId));
  const myPayments = payments.filter(pay => availableProperties.some(p => p.id === pay.propertyId));
  const myMaintenance = maintenance.filter(m => availableProperties.some(p => p.id === m.propertyId));

  const totalMonthlyIncome = myContracts
    .filter(c => c.status === 'Vigente')
    .reduce((sum, c) => sum + c.monthlyRent, 0);

  const totalCollectedThisMonth = myPayments
    .filter(p => p.status === 'Completado')
    .reduce((sum, p) => sum + p.amount, 0);

  const occupiedCount = availableProperties.filter(p => p.status === 'Alquilada').length;
  const occupancyRate = availableProperties.length > 0 ? Math.round((occupiedCount / availableProperties.length) * 100) : 0;

  // Add Property Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [newPropCode, setNewPropCode] = useState('');
  const [newPropTitle, setNewPropTitle] = useState('');
  const [newPropAddress, setNewPropAddress] = useState('');
  const [newPropCity, setNewPropCity] = useState('Tegucigalpa, M.D.C.');
  const [newPropSize, setNewPropSize] = useState(180);
  const [newPropType, setNewPropType] = useState<Property['propertyType']>('Casa');
  const [newPropTxn, setNewPropTxn] = useState<Property['transactionType']>('Alquiler');
  const [newPropPrice, setNewPropPrice] = useState(1100);
  const [newPropBeds, setNewPropBeds] = useState(3);
  const [newPropBaths, setNewPropBaths] = useState(2);
  const [newPropParks, setNewPropParks] = useState(2);
  const [newPropDesc, setNewPropDesc] = useState('');
  const [newPropImages, setNewPropImages] = useState<string[]>([
    'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=900&auto=format&fit=crop&q=80'
  ]);

  // Maintenance Request Modal for Owner
  const [showMntModal, setShowMntModal] = useState(false);
  const [selectedPropId, setSelectedPropId] = useState(properties[0]?.id || '');
  const [mntType, setMntType] = useState<MaintenanceRequest['type']>('Preventivo');
  const [mntPriority, setMntPriority] = useState<MaintenanceRequest['priority']>('Media');
  const [mntContractor, setMntContractor] = useState('Carlos Murillo (Servicios Pro)');
  const [mntEstimatedCost, setMntEstimatedCost] = useState(150);
  const [mntDesc, setMntDesc] = useState('');

  const handleAddPropertySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPropTitle || !newPropAddress) return;

    const propertyImages = newPropImages.length > 0
      ? newPropImages
      : ['https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=900&auto=format&fit=crop&q=80'];

    addProperty({
      code: generatePropertyCode(newPropType),
      title: newPropTitle,
      address: newPropAddress,
      city: newPropCity,
      neighborhood: 'Sector Residencial',
      size: Number(newPropSize),
      propertyType: newPropType,
      transactionType: newPropTxn,
      price: Number(newPropPrice),
      currency: 'USD',
      status: 'Disponible',
      bedrooms: Number(newPropBeds),
      bathrooms: Number(newPropBaths),
      parkingSpots: Number(newPropParks),
      description: newPropDesc || 'Propiedad recién ingresada al catálogo de Terranova.',
      features: ['Seguridad Privada', 'Excelente Ubicación', 'Documentación al Día'],
      images: propertyImages,
      ownerId: currentUser.id,
      ownerName: currentUser.name,
      assignedAgentId: 'usr-2',
      assignedAgentName: 'Anthony Rafael Alfaro',
      yearBuilt: 2023
    });

    setShowAddModal(false);
  };

  const handleCreateOwnerMnt = (e: React.FormEvent) => {
    e.preventDefault();
    const targetId = selectedPropId || properties[0]?.id;
    const prop = properties.find(p => p.id === targetId);
    if (!prop || !mntDesc.trim()) return;

    createMaintenanceRequest({
      propertyId: prop.id,
      propertyTitle: prop.title,
      propertyAddress: prop.address,
      requestedBy: currentUser.name,
      requesterRole: 'owner',
      type: mntType,
      priority: mntPriority,
      description: mntDesc.trim(),
      contractorName: mntContractor,
      estimatedCost: Number(mntEstimatedCost)
    });

    setShowMntModal(false);
    setMntDesc('');
    showToast(`Solicitud de mantenimiento programada para ${prop.code}`);
  };

  return (
    <div className="space-y-8">
      {/* Banner */}
      <div className="bg-[#263E32] rounded-3xl p-6 sm:p-8 text-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-md">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-[#3D5E4E] text-[#BDE2C8] text-xs font-bold uppercase tracking-wider">
              Portal del Propietario Inversionista
            </span>
            <span className="text-white/60 text-xs">Titular: {currentUser.name}</span>
          </div>
          <h1 className="font-serif-brand text-2xl sm:text-3xl font-bold">
            Gestión de Cartera de Propiedades
          </h1>
          <p className="text-xs sm:text-sm text-white/80 mt-1">
            Supervisa el estado de ocupación, rentabilidad neta, recaudación mensual de alquileres y mantenimientos.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2.5 rounded-xl bg-[#C36449] hover:bg-[#B0573E] text-white font-semibold text-xs sm:text-sm flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Registrar Propiedad</span>
          </button>
          <button
            onClick={() => setShowMntModal(true)}
            className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs sm:text-sm flex items-center gap-1.5 transition-colors"
          >
            <Wrench className="w-4 h-4" />
            <span>Programar Mantenimiento</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-[#D5E1D4] shadow-2xs">
          <span className="text-xs text-gray-500 font-medium block">Propiedades en Portafolio</span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-2xl font-bold font-mono text-[#1E3328]">{myProperties.length}</span>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
              {occupiedCount} alquiladas
            </span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#D5E1D4] shadow-2xs">
          <span className="text-xs text-gray-500 font-medium block">Tasa de Ocupación</span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-2xl font-bold font-mono text-[#1E3328]">{occupancyRate}%</span>
            <span className="text-xs text-gray-500">Objetivo: 90%</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#D5E1D4] shadow-2xs">
          <span className="text-xs text-gray-500 font-medium block">Flujo Mensual Contractual</span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-2xl font-bold font-mono text-[#1E3328]">${totalMonthlyIncome.toLocaleString()}</span>
            <span className="text-xs text-gray-400">USD/mes</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#D5E1D4] shadow-2xs">
          <span className="text-xs text-gray-500 font-medium block">Ingresos Recaudados (Histórico)</span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-2xl font-bold font-mono text-emerald-700">${totalCollectedThisMonth.toLocaleString()}</span>
            <span className="text-xs text-emerald-600 font-bold">100% Cobrado</span>
          </div>
        </div>
      </div>

      {/* Mis Propiedades Grid */}
      <div className="bg-white rounded-3xl border border-[#D5E1D4] p-6 shadow-2xs space-y-5">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-serif-brand text-xl font-bold text-gray-900">Mis Inmuebles Registrados</h3>
            <p className="text-xs text-gray-500">Supervisión directa de disponibilidad, arrendatario actual y estado físico</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-3 py-1.5 rounded-xl border border-[#CAD6C7] text-gray-700 hover:bg-[#EEF5ED] text-xs font-semibold transition-colors flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" /> Agregar Inmueble
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {myProperties.map((prop) => {
            const propContract = contracts.find(c => c.propertyId === prop.id && c.status === 'Vigente');
            return (
              <div key={prop.id} className="border border-[#DFE7DE] rounded-2xl overflow-hidden bg-[#FAFBF9] flex flex-col justify-between">
                <div>
                  <div className="relative h-44">
                    <img src={prop.images[0]} alt={prop.title} className="w-full h-full object-cover" />
                    <span className="absolute top-3 left-3 bg-[#2D4539] text-white text-[11px] font-mono px-2 py-0.5 rounded font-bold">
                      {prop.code}
                    </span>
                    <span className={`absolute top-3 right-3 text-[11px] font-bold px-2 py-0.5 rounded ${
                      prop.status === 'Alquilada' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {prop.status}
                    </span>
                  </div>

                  <div className="p-4 space-y-2 text-xs">
                    <h4 className="font-bold text-sm text-gray-900 line-clamp-1">{prop.title}</h4>
                    <p className="text-gray-500 text-[11px] truncate">{prop.address}</p>

                    <div className="pt-2 border-t border-gray-200/70 space-y-1">
                      <div className="flex justify-between text-gray-600">
                        <span>Valoración / Renta:</span>
                        <span className="font-mono font-bold text-gray-900">${prop.price.toLocaleString()} {prop.currency}</span>
                      </div>
                      <div className="flex justify-between text-gray-600">
                        <span>Inquilino Actual:</span>
                        <span className="font-semibold text-[#2C4939]">{propContract ? propContract.tenantName : 'Ninguno (Disponible)'}</span>
                      </div>
                      {propContract && (
                        <div className="flex justify-between text-gray-600">
                          <span>Vigencia hasta:</span>
                          <span className="font-mono text-gray-800">{propContract.endDate}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-white border-t border-gray-200 flex justify-between items-center text-xs">
                  <button
                    onClick={() => openPrintModal({ type: 'property_sheet', data: prop })}
                    className="text-gray-600 hover:text-gray-900 flex items-center gap-1 font-medium"
                  >
                    <Printer className="w-3.5 h-3.5" /> Ficha Técnica
                  </button>

                  {propContract && (
                    <button
                      onClick={() => openPrintModal({ type: 'contract', data: propContract })}
                      className="text-[#2D4539] hover:underline flex items-center gap-1 font-semibold"
                    >
                      <FileText className="w-3.5 h-3.5" /> Ver Contrato
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECCIÓN EXCLUSIVA: TASA DE GANANCIA Y LIQUIDACIÓN DE TERRENOS / VENTAS */}
      <div className="bg-white rounded-3xl border border-[#D5E1D4] p-6 shadow-2xs space-y-5 text-xs">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-gray-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <Coins className="w-5 h-5 text-emerald-800" />
              <h3 className="font-serif-brand text-xl font-bold text-gray-900">
                Liquidación de Terrenos & Ventas · Tasa de Ganancia
              </h3>
            </div>
            <p className="text-gray-500 text-xs mt-0.5">
              Supervisión de corretaje, tasa de ganancia pactada y depósitos acreditados a tu cuenta bancaria.
            </p>
          </div>

          <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-900 font-bold text-xs border border-amber-300 flex items-center gap-1.5 shrink-0">
            <Lock className="w-3.5 h-3.5 text-amber-800" />
            Acceso Exclusivo: Dueño del Terreno & Administración
          </span>
        </div>

        {/* Aviso de Confidencialidad Legal */}
        <div className="p-3 bg-amber-50/80 rounded-2xl border border-amber-200 text-amber-950 flex items-start gap-2.5">
          <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <div className="text-[11px] leading-relaxed">
            <strong>Protección de Información Confidencial:</strong> La tasa de ganancia sobre el valor de venta ({contracts.find(c => c.totalCommissionRate)?.totalCommissionRate || 20}%) y el desglose de corretaje son <strong>estrictamente confidenciales</strong> entre tú (dueño del terreno) y la administración de Terranova. Ni el comprador ni el agente inmobiliario tienen acceso a este margen global en sus paneles ni contratos de cara al cliente.
          </div>
        </div>

        {/* Listado de Contratos de Venta del Propietario */}
        <div className="space-y-4">
          {contracts
            .filter(c => (c.contractType === 'Venta' || c.contractType === 'Venta a Plazos') && (c.ownerName === currentUser.name || currentUser.role === 'admin' || currentUser.role === 'owner'))
            .map(ctr => {
              const isDirect = ctr.contractType === 'Venta';
              const totalVal = ctr.totalValue || ctr.monthlyRent || 0;
              const totalRate = ctr.totalCommissionRate || 20;
              const ownerRate = ctr.ownerNetRate || (100 - totalRate);
              const ownerTotalNet = ctr.ownerNetAmount || Math.round(totalVal * (ownerRate / 100));
              const ownerDisbursed = ctr.ownerNetPaid || (isDirect ? ownerTotalNet : (ctr.downPayment ? Math.round(ctr.downPayment * (ownerRate / 100)) : 0));
              const isFullyDisbursed = ownerDisbursed >= ownerTotalNet;
              const agencyRate = ctr.agencyCommissionRate || 18;
              const agentRate = ctr.agentCommissionRate || 2;

              return (
                <div key={ctr.id} className="p-5 rounded-2xl border border-gray-200 bg-[#FAFBF9] space-y-4">
                  {/* Encabezado del Inmueble y Modalidad */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-gray-200 pb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-sm text-gray-900">{ctr.contractNumber}</span>
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          isDirect ? 'bg-purple-100 text-purple-900 border border-purple-300' : 'bg-blue-100 text-blue-900 border border-blue-300'
                        }`}>
                          {isDirect ? 'Venta Directa (Al Contado)' : 'Venta a Plazos (Financiamiento)'}
                        </span>
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          isFullyDisbursed ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-amber-100 text-amber-800 border border-amber-300'
                        }`}>
                          {isFullyDisbursed ? '✓ Totalmente Acreditado' : 'Depósitos en Curso'}
                        </span>
                      </div>
                      <h4 className="font-bold text-gray-900 text-sm mt-1">{ctr.propertyTitle} ({ctr.propertyCode})</h4>
                      <p className="text-[11px] text-gray-500">
                        Comprador Adquirente: <strong>{ctr.tenantName}</strong> · Asesor Responsable: {ctr.agentName}
                      </p>
                    </div>

                    <button
                      onClick={() => openPrintModal({ type: 'contract', data: ctr })}
                      className="px-3.5 py-1.5 rounded-xl bg-white border border-[#CBD8CA] hover:bg-[#EEF5ED] text-gray-800 font-semibold text-xs flex items-center gap-1 shadow-2xs"
                    >
                      <FileText className="w-3.5 h-3.5 text-gray-600" />
                      <span>Ver Contrato de Venta</span>
                    </button>
                  </div>

                  {/* Tarjetas de Tasa de Ganancia y Distribución */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3 bg-white p-4 rounded-xl border border-gray-200">
                    <div>
                      <span className="text-gray-500 text-[10px] block uppercase font-bold">Valor de Venta Convenido</span>
                      <span className="font-mono font-bold text-gray-900 text-base">
                        ${totalVal.toLocaleString()} USD
                      </span>
                      <span className="text-[10px] text-gray-400 block mt-0.5">Precio pactado en escritura</span>
                    </div>

                    <div className="bg-amber-50/50 p-2.5 rounded-lg border border-amber-200">
                      <span className="text-amber-900 text-[10px] block uppercase font-bold">Tasa de Ganancia / Corretaje</span>
                      <span className="font-mono font-bold text-amber-950 text-base">
                        {totalRate}% (${Math.round(totalVal * (totalRate / 100)).toLocaleString()} USD)
                      </span>
                      <span className="text-[10px] text-amber-800 block mt-0.5">
                        Terranova {agencyRate}% · Asesor {agentRate}%
                      </span>
                    </div>

                    <div className="bg-emerald-50/60 p-2.5 rounded-lg border border-emerald-200">
                      <span className="text-emerald-900 text-[10px] block uppercase font-bold">Tu Porcentaje Neto como Dueño</span>
                      <span className="font-mono font-bold text-emerald-950 text-base font-serif-brand">
                        {ownerRate}% (${ownerTotalNet.toLocaleString()} USD)
                      </span>
                      <span className="text-[10px] text-emerald-700 block mt-0.5">Ingreso líquido a percibir</span>
                    </div>

                    <div>
                      <span className="text-gray-500 text-[10px] block uppercase font-bold">Depositado a la Fecha</span>
                      <span className="font-mono font-bold text-blue-900 text-base">
                        ${ownerDisbursed.toLocaleString()} USD
                      </span>
                      <span className="text-[10px] text-blue-700 block mt-0.5">
                        {isDirect ? '100% dispersado ACH' : `Saldo pendiente: $${Math.max(0, ownerTotalNet - ownerDisbursed).toLocaleString()} USD`}
                      </span>
                    </div>
                  </div>

                  {/* Explicación de la Regla de Depósito */}
                  <div className="p-3.5 rounded-xl bg-[#EEF5ED] border border-[#CADBC9] text-[11px] space-y-1.5">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1 font-bold text-[#1E3628]">
                      <span>
                        {isDirect ? '✓ Modalidad Venta Directa (Al Contado):' : '✓ Modalidad Venta a Plazos (Financiamiento Mensual):'}
                      </span>
                      <span className="font-mono text-emerald-900 text-xs">
                        {isDirect 
                          ? 'Se te liquidó el 100% de tu ganancia al confirmarse la compra' 
                          : 'Se va depositando tu 80% con cada cuota cobrada'}
                      </span>
                    </div>
                    <p className="text-gray-700 leading-relaxed">
                      {isDirect 
                        ? `Al confirmarse la compraventa directa del terreno por $${totalVal.toLocaleString()} USD, la tesorería de Terranova acreditó de forma íntegra e inmediata el total de tu ganancia neta ($${ownerTotalNet.toLocaleString()} USD) en tu cuenta bancaria (${ctr.receivingBankName || 'Banco Ficohsa'} N° ${ctr.receivingBankAccount || '2000-1122-3344-99'}).`
                        : `En esta modalidad de financiamiento a ${ctr.financingYears || 5} años (${ctr.installmentsCount || 60} cuotas), los fondos se van depositando conforme ingresan: De la prima inicial de $${(ctr.downPayment || 0).toLocaleString()} USD ya se te depositó el ${ownerRate}% ($${Math.round((ctr.downPayment || 0) * (ownerRate / 100)).toLocaleString()} USD). Cada cuota mensual que abona el adquirente ($${(ctr.monthlyInstallment || 0).toLocaleString()} USD/mes) te deposita automáticamente tu 80% neto ($${Math.round((ctr.monthlyInstallment || 0) * (ownerRate / 100)).toLocaleString()} USD/mes).`}
                    </p>
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      {/* Historial de Mantenimientos & Transacciones */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Mantenimientos */}
        <div className="bg-white rounded-3xl border border-[#D5E1D4] p-6 shadow-2xs space-y-4 text-xs">
          <div className="flex justify-between items-center">
            <h3 className="font-serif-brand text-lg font-bold text-gray-900">Mantenimiento de mis Propiedades</h3>
            <span className="text-gray-500">{myMaintenance.length} registrados</span>
          </div>

          <div className="space-y-3">
            {myMaintenance.map((m) => (
              <div key={m.id} className="p-3.5 rounded-xl bg-[#FAFBF9] border border-[#DEE6DC] space-y-1.5">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-gray-800">{m.propertyTitle}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    m.status === 'Reparado' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {m.status}
                  </span>
                </div>
                <p className="text-gray-600 text-[11px]">{m.description}</p>
                <div className="flex justify-between text-[10px] text-gray-400 pt-1 border-t border-gray-100">
                  <span>Solicitado por: {m.requestedBy}</span>
                  <span>Costo: ${m.actualCost || m.estimatedCost || 0} USD</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pagos e Ingresos */}
        <div className="bg-white rounded-3xl border border-[#D5E1D4] p-6 shadow-2xs space-y-4 text-xs">
          <div className="flex justify-between items-center">
            <h3 className="font-serif-brand text-lg font-bold text-gray-900">Historial de Cobros Recibidos</h3>
            <span className="text-emerald-700 font-bold font-mono">${totalCollectedThisMonth} USD</span>
          </div>

          <div className="divide-y divide-gray-100">
            {myPayments.map((p) => (
              <div key={p.id} className="py-3 flex justify-between items-center">
                <div>
                  <p className="font-semibold text-gray-800">{p.payerName} · {p.propertyTitle}</p>
                  <p className="text-[11px] text-gray-500">{p.date} · Recibo: {p.receiptNumber}</p>
                </div>
                <div className="text-right">
                  <span className="font-mono font-bold text-emerald-700 block">${p.amount} USD</span>
                  <button
                    onClick={() => openPrintModal({ type: 'receipt', data: p })}
                    className="text-[10px] text-gray-500 hover:text-gray-800 underline"
                  >
                    Ver Recibo
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal: Agregar Inmueble (Owner) */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white border border-[#CBD8CA] rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="bg-[#2D4539] text-white p-5 flex items-center justify-between">
              <h3 className="font-serif-brand text-lg font-bold">Registrar Nueva Propiedad</h3>
              <button onClick={() => setShowAddModal(false)} className="text-white/70 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddPropertySubmit} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Código Asignado Automáticamente</label>
                  <div className="w-full bg-[#EEF5ED] border border-[#CAD8C8] rounded-xl p-2.5 font-mono font-bold text-[#1E3628] flex items-center justify-between">
                    <span>{generatePropertyCode(newPropType)}</span>
                    <span className="text-[10px] bg-[#2D4539] text-white px-2 py-0.5 rounded font-sans">Automático</span>
                  </div>
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Tipo de Propiedad</label>
                  <select
                    value={newPropType}
                    onChange={(e) => setNewPropType(e.target.value as any)}
                    className="w-full bg-white border border-[#CAD8C8] rounded-xl p-2.5"
                  >
                    <option value="Casa">Casa</option>
                    <option value="Apartamento">Apartamento</option>
                    <option value="Villa">Villa Campestre</option>
                    <option value="Terreno">Terreno</option>
                    <option value="Local Comercial">Local Comercial</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Título de la Propiedad</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Residencia Familiar en Lomas del Mayab"
                  value={newPropTitle}
                  onChange={(e) => setNewPropTitle(e.target.value)}
                  className="w-full bg-white border border-[#CAD8C8] rounded-xl p-2.5"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Dirección Exacta</label>
                <input
                  type="text"
                  required
                  placeholder="Colonia, calle, número de casa"
                  value={newPropAddress}
                  onChange={(e) => setNewPropAddress(e.target.value)}
                  className="w-full bg-white border border-[#CAD8C8] rounded-xl p-2.5"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Operación</label>
                  <select
                    value={newPropTxn}
                    onChange={(e) => setNewPropTxn(e.target.value as any)}
                    className="w-full bg-white border border-[#CAD8C8] rounded-xl p-2.5"
                  >
                    <option value="Alquiler">Alquiler</option>
                    <option value="Venta">Venta</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Precio (USD)</label>
                  <input
                    type="number"
                    required
                    value={newPropPrice}
                    onChange={(e) => setNewPropPrice(Number(e.target.value))}
                    className="w-full bg-white border border-[#CAD8C8] rounded-xl p-2.5 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Área (m²)</label>
                  <input
                    type="number"
                    required
                    value={newPropSize}
                    onChange={(e) => setNewPropSize(Number(e.target.value))}
                    className="w-full bg-white border border-[#CAD8C8] rounded-xl p-2.5 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Habitaciones</label>
                  <input
                    type="number"
                    value={newPropBeds}
                    onChange={(e) => setNewPropBeds(Number(e.target.value))}
                    className="w-full bg-white border border-[#CAD8C8] rounded-xl p-2.5 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Baños</label>
                  <input
                    type="number"
                    value={newPropBaths}
                    onChange={(e) => setNewPropBaths(Number(e.target.value))}
                    className="w-full bg-white border border-[#CAD8C8] rounded-xl p-2.5 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Estacionamiento</label>
                  <input
                    type="number"
                    value={newPropParks}
                    onChange={(e) => setNewPropParks(Number(e.target.value))}
                    className="w-full bg-white border border-[#CAD8C8] rounded-xl p-2.5 font-mono"
                  />
                </div>
              </div>

              {/* Adjuntar Imágenes de la Casa / Propiedad */}
              <PropertyImageUploader
                images={newPropImages}
                onChange={setNewPropImages}
                maxImages={8}
              />

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Descripción</label>
                <textarea
                  rows={2}
                  value={newPropDesc}
                  onChange={(e) => setNewPropDesc(e.target.value)}
                  placeholder="Detalles sobre acabados, zonas verdes, cisterna..."
                  className="w-full bg-white border border-[#CAD8C8] rounded-xl p-2.5"
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
                  Guardar Propiedad
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Solicitar Mantenimiento (Owner) */}
      {showMntModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white border border-[#CBD8CA] rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="bg-[#2D4539] text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Wrench className="w-5 h-5 text-[#A3C7AD]" />
                <h3 className="font-serif-brand text-lg font-bold">Programar Mantenimiento de Inmueble</h3>
              </div>
              <button onClick={() => setShowMntModal(false)} className="text-white/70 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateOwnerMnt} className="p-6 space-y-4 text-xs">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="font-semibold text-gray-700">Seleccionar Inmueble / Propiedad</label>
                  <span className="text-[10px] text-gray-500 font-medium">({properties.length} propiedades en catálogo)</span>
                </div>
                <select
                  required
                  value={selectedPropId || properties[0]?.id}
                  onChange={(e) => setSelectedPropId(e.target.value)}
                  className="w-full bg-[#FAFBF9] border border-[#CBD8CA] rounded-xl p-2.5 font-medium text-gray-900 focus:outline-hidden focus:ring-2 focus:ring-[#2D4539]"
                >
                  {properties.map(p => (
                    <option key={p.id} value={p.id} className="py-1">
                      {p.code} - {p.title} ({p.neighborhood || p.city})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Tipo de Mantenimiento</label>
                  <select
                    value={mntType}
                    onChange={(e) => setMntType(e.target.value as any)}
                    className="w-full bg-[#FAFBF9] border border-[#CBD8CA] rounded-xl p-2.5 text-gray-800"
                  >
                    <option value="Preventivo">Preventivo (Pintura, impermeabilización, jardinería)</option>
                    <option value="Correctivo">Correctivo (Reparación puntual)</option>
                    <option value="Emergencia">Emergencia (Atención prioritaria 24h)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Prioridad</label>
                  <select
                    value={mntPriority}
                    onChange={(e) => setMntPriority(e.target.value as any)}
                    className="w-full bg-[#FAFBF9] border border-[#CBD8CA] rounded-xl p-2.5 text-gray-800"
                  >
                    <option value="Baja">Baja</option>
                    <option value="Media">Media</option>
                    <option value="Alta">Alta</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Contratista Sugerido</label>
                  <select
                    value={mntContractor}
                    onChange={(e) => setMntContractor(e.target.value)}
                    className="w-full bg-[#FAFBF9] border border-[#CBD8CA] rounded-xl p-2.5 text-gray-800"
                  >
                    <option value="Carlos Murillo (Servicios Pro)">Carlos Murillo (Servicios Pro)</option>
                    <option value="Técnicos Eléctricos & Climatización S.A.">Técnicos Eléctricos & Clima S.A.</option>
                    <option value="Fontanería & Albañilería Express">Fontanería & Albañilería Express</option>
                    <option value="Pinturas & Remodelaciones Rápidas">Pinturas & Remodelaciones Rápidas</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Presupuesto Estimado (USD)</label>
                  <input
                    type="number"
                    min={0}
                    value={mntEstimatedCost}
                    onChange={(e) => setMntEstimatedCost(Number(e.target.value))}
                    className="w-full bg-[#FAFBF9] border border-[#CBD8CA] rounded-xl p-2.5 font-mono text-gray-800"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Trabajos Requeridos & Observaciones</label>
                <textarea
                  required
                  rows={3}
                  value={mntDesc}
                  onChange={(e) => setMntDesc(e.target.value)}
                  placeholder="Describe las tareas de mantenimiento solicitadas, horarios disponibles para acceso..."
                  className="w-full bg-[#FAFBF9] border border-[#CBD8CA] rounded-xl p-2.5 text-gray-800"
                ></textarea>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowMntModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#2D4539] hover:bg-[#20342A] text-white font-semibold transition-colors flex items-center gap-1.5 shadow-2xs"
                >
                  <Wrench className="w-3.5 h-3.5" />
                  <span>Solicitar a Contratista</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
