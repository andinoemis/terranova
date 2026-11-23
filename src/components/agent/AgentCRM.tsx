import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ClientLead, PropertyVisit, Property, PaymentTransaction, LeaseContract } from '../../types';
import { WorkCalendarView } from '../calendar/WorkCalendarView';
import { MessagesInbox } from '../messages/MessagesInbox';
import { 
  Briefcase, 
  Users, 
  Calendar, 
  CheckCircle, 
  Clock, 
  Plus, 
  Search, 
  Filter, 
  Phone, 
  Mail, 
  DollarSign, 
  Building, 
  FileText,
  Calculator,
  ArrowRight,
  TrendingUp,
  X,
  MessageSquare,
  CreditCard,
  CheckCircle2,
  XCircle,
  Printer,
  ShieldCheck,
  FileCheck2,
  UploadCloud,
  FileX2,
  AlertTriangle,
  Receipt,
  Percent,
  Coins,
  Lock,
  Download,
  Eye,
  FileUp
} from 'lucide-react';

export const AgentCRM: React.FC = () => {
  const { 
    currentUser, 
    leads, 
    visits, 
    properties, 
    contracts, 
    payments,
    payrollRecords,
    confirmPayment,
    rejectPayment,
    openPrintModal,
    formatMoney,
    companySettings,
    addLead, 
    updateLeadStatus, 
    updateVisitStatus,
    createContract,
    uploadSignedContractDocument,
    requestContractInvalidation,
    showToast 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'leads' | 'visits' | 'contracts' | 'payments' | 'commissions' | 'calendar' | 'messages' | 'valuation'>('leads');
  const [paymentFilter, setPaymentFilter] = useState<'all' | 'En Proceso' | 'Completado' | 'Rechazado'>('all');
  const [paymentSearch, setPaymentSearch] = useState('');
  const [contractSearch, setContractSearch] = useState('');

  // New Lead Modal State with Character Sanitization
  const [showAddLeadModal, setShowAddLeadModal] = useState(false);
  const [leadName, setLeadName] = useState('');
  const [leadEmail, setLeadEmail] = useState('');
  const [leadPhone, setLeadPhone] = useState('+504 ');
  const [leadInterest, setLeadInterest] = useState<'Alquiler' | 'Compra'>('Alquiler');
  const [leadBudget, setLeadBudget] = useState(1200);
  const [leadZone, setLeadZone] = useState('Las Hadas / Las Lomas');
  const [leadNotes, setLeadNotes] = useState('');

  // Agent Contract Generator Modal State
  const [showContractModalAgent, setShowContractModalAgent] = useState(false);
  const [contractPropId, setContractPropId] = useState(properties[0]?.id || '');
  const [contractTenantName, setContractTenantName] = useState('');
  const [contractTenantEmail, setContractTenantEmail] = useState('');
  const [contractTenantPhone, setContractTenantPhone] = useState('+504 ');
  const [contractTenantNationalId, setContractTenantNationalId] = useState('');
  const [contractType, setContractType] = useState<'Arrendamiento' | 'Venta' | 'Venta a Plazos'>('Venta a Plazos');
  const [contractTotalValue, setContractTotalValue] = useState(properties[0]?.price || 2000000);
  const [contractDownPayment, setContractDownPayment] = useState(Math.round((properties[0]?.price || 2000000) * 0.2));
  const [contractYears, setContractYears] = useState(5);
  const [contractTotalCommPercent, setContractTotalCommPercent] = useState(20);
  const [contractAgentCommPercent, setContractAgentCommPercent] = useState(2);
  const [contractAgencyCommPercent, setContractAgencyCommPercent] = useState(18);
  const [contractSignatureMode, setContractSignatureMode] = useState<'digital' | 'fisica_presencial'>('fisica_presencial');
  const [contractStartDate, setContractStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [contractEndDate, setContractEndDate] = useState('2029-11-01');

  // Single-Upload Signed Document Modal State
  const [uploadDocContract, setUploadDocContract] = useState<LeaseContract | null>(null);
  const [uploadFileName, setUploadFileName] = useState('');
  const [uploadFileUrl, setUploadFileUrl] = useState<string | null>(null);
  const [uploadFileSize, setUploadFileSize] = useState<string>('');
  const [uploadFileType, setUploadFileType] = useState<string>('');
  const [isReadingFile, setIsReadingFile] = useState<boolean>(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Optional document upload during contract emission
  const [emissionDocUrl, setEmissionDocUrl] = useState<string | null>(null);
  const [emissionDocName, setEmissionDocName] = useState<string>('');
  const [emissionDocSize, setEmissionDocSize] = useState<string>('');
  const [emissionDocType, setEmissionDocType] = useState<string>('');

  // Request Invalidation Modal State
  const [invalidationContract, setInvalidationContract] = useState<LeaseContract | null>(null);
  const [invalidationReasonInput, setInvalidationReasonInput] = useState('');

  // Property Valuation Calculator State
  const [valArea, setValArea] = useState(250);
  const [valZone, setValZone] = useState('Alta Plus (Lomas / Hadas / Guijarro)');
  const [valAge, setValAge] = useState(3);
  const [valBedrooms, setValBedrooms] = useState(3);
  const [valFinishes, setValFinishes] = useState<'Lujo' | 'Estándar'>('Lujo');

  const basePricePerM2 = valZone.includes('Alta Plus') ? 950 : 650;
  const finishMultiplier = valFinishes === 'Lujo' ? 1.25 : 1.0;
  const estimatedMarketValue = Math.round(valArea * basePricePerM2 * finishMultiplier * Math.max(0.7, 1 - valAge * 0.015));
  const estimatedRentValue = Math.round(estimatedMarketValue * 0.0065);

  // Filtered lists
  const pendingPayments = payments.filter(p => p.status === 'En Proceso' || p.status === 'Pendiente');
  const filteredPayments = payments.filter(p => {
    if (paymentFilter !== 'all' && p.status !== paymentFilter) return false;
    if (paymentSearch.trim()) {
      const q = paymentSearch.toLowerCase();
      return (
        p.receiptNumber.toLowerCase().includes(q) ||
        p.propertyTitle.toLowerCase().includes(q) ||
        p.payerName.toLowerCase().includes(q) ||
        p.referenceCode.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const filteredContracts = contracts.filter(c => {
    if (contractSearch.trim()) {
      const q = contractSearch.toLowerCase();
      return (
        c.contractNumber.toLowerCase().includes(q) ||
        c.propertyTitle.toLowerCase().includes(q) ||
        c.tenantName.toLowerCase().includes(q) ||
        (c.contractType && c.contractType.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const handleAddLeadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadName.trim() || !leadEmail.trim()) {
      showToast('Por favor ingrese nombre y correo válidos');
      return;
    }

    addLead({
      name: leadName.trim(),
      email: leadEmail.trim(),
      phone: leadPhone.trim(),
      interestType: leadInterest,
      budgetMax: Number(leadBudget),
      preferredZone: leadZone,
      status: 'Nuevo',
      assignedAgent: currentUser.name,
      notes: leadNotes
    });

    setShowAddLeadModal(false);
    setLeadName('');
    setLeadEmail('');
    setLeadPhone('+504 ');
    setLeadNotes('');
  };

  const handleCreateContractAgent = (e: React.FormEvent) => {
    e.preventDefault();
    const prop = properties.find(p => p.id === contractPropId);
    if (!prop) {
      showToast('Seleccione un inmueble válido');
      return;
    }
    if (!contractTenantName.trim()) {
      showToast('Ingrese el nombre del cliente');
      return;
    }

    const isSale = contractType === 'Venta' || contractType === 'Venta a Plazos';
    const totalVal = isSale ? contractTotalValue : prop.price;
    const isDigital = contractSignatureMode === 'digital';
    const totalInstallments = contractYears * 12;
    const installmentVal = contractType === 'Venta a Plazos' && totalInstallments > 0
      ? Math.round((totalVal - contractDownPayment) / totalInstallments)
      : undefined;

    const receivingAcc = companySettings.bankAccounts.find(b => b.isDefaultReceiving)?.accountNumber || '2000-1122-3344-99';

    createContract({
      propertyId: prop.id,
      propertyTitle: prop.title,
      propertyCode: prop.code,
      tenantId: 'cli-buyer-1',
      tenantName: contractTenantName.trim(),
      tenantEmail: contractTenantEmail.trim() || 'cliente@terranova.hn',
      tenantNationalId: contractTenantNationalId.trim() || '0801-1990-12345',
      tenantPhone: contractTenantPhone.trim() || '+504 9900-1122',
      managerName: 'Lic. Kenneth Adonay Zúniga',
      managerEmail: 'kenneth.zuniga@unah.hn',
      managerPhone: '+504 9876-5432',
      ownerId: prop.ownerId || 'prop-1',
      ownerName: prop.ownerName || 'Keydi Reyes',
      receivingBankAccount: receivingAcc,
      receivingBankName: 'Banco Ficohsa Honduras',
      startDate: contractStartDate,
      endDate: contractEndDate,
      monthlyRent: isSale ? (installmentVal || totalVal) : prop.price,
      depositAmount: isSale ? 0 : prop.price,
      currency: 'USD',
      status: 'Vigente',
      contractType,
      totalValue: isSale ? totalVal : undefined,
      downPayment: contractType === 'Venta a Plazos' ? contractDownPayment : undefined,
      financingYears: contractType === 'Venta a Plazos' ? contractYears : undefined,
      installmentsCount: totalInstallments,
      monthlyInstallment: installmentVal,
      totalCommissionRate: 20,
      agentCommissionRate: contractAgentCommPercent,
      agencyCommissionRate: 18,
      ownerNetRate: 80,
      totalCommissionAmount: Math.round(totalVal * 0.2),
      agentCommissionAmount: Math.round(totalVal * (contractAgentCommPercent / 100)),
      agencyCommissionAmount: Math.round(totalVal * 0.18),
      ownerNetAmount: Math.round(totalVal * 0.8),
      commissionPayoutMode: contractType === 'Venta' ? 'directa_total' : 'plazos_proporcional',
      agentCommissionPaid: contractType === 'Venta' ? Math.round(totalVal * (contractAgentCommPercent / 100)) : Math.round(contractDownPayment * (contractAgentCommPercent / 100)),
      ownerNetPaid: contractType === 'Venta' ? Math.round(totalVal * 0.8) : Math.round(contractDownPayment * 0.8),
      agentName: currentUser.name || 'Anthony Rafael Alfaro',
      signatureMode: contractSignatureMode,
      isSignedDigitally: isDigital,
      signedDocumentUrl: emissionDocUrl || undefined,
      signedDocumentFileName: emissionDocName || undefined,
      signedDocumentFileSize: emissionDocSize || undefined,
      signedDocumentFileType: emissionDocType || undefined,
      isSignedPhysically: Boolean(emissionDocUrl),
      documentStatus: isDigital ? 'Firmado_Digital' : (emissionDocUrl ? 'Documento_Firmado_Cargado' : 'Pendiente_Subida'),
      signedDate: (isDigital || emissionDocUrl) ? new Date().toISOString().split('T')[0] : undefined,
      clauses: [
        'PRIMERA: Objeto de la transacción convenida conforme al código y ficha catastral.',
        `SEGUNDA: Monto oficial convenido de ${isSale ? `$${totalVal.toLocaleString()} USD` : `$${prop.price} USD/mes`}.`,
        'TERCERA: Jurisdicción y competencia de los juzgados de Tegucigalpa, Francisco Morazán.'
      ]
    });

    setShowContractModalAgent(false);
    setEmissionDocUrl(null);
    setEmissionDocName('');
    setEmissionDocSize('');
    setEmissionDocType('');
    showToast(`Contrato emitido exitosamente.${emissionDocUrl ? ' Documento PDF firmado resguardado.' : ' Recuerde que requiere firmas para su impresión oficial.'}`);
  };

  const handleUploadSignedDocument = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadDocContract) return;

    if (!uploadFileUrl) {
      setUploadError('Por favor seleccione o arrastre un archivo PDF (.pdf) o escaneo firmado.');
      showToast('Seleccione un archivo PDF antes de confirmar la subida');
      return;
    }

    const finalName = uploadFileName.trim() || `Contrato_${uploadDocContract.contractNumber}_Firmado.pdf`;

    uploadSignedContractDocument(uploadDocContract.id, {
      url: uploadFileUrl,
      fileName: finalName,
      fileSize: uploadFileSize || 'PDF Oficial',
      fileType: uploadFileType || 'application/pdf'
    });

    setUploadDocContract(null);
    setUploadFileName('');
    setUploadFileUrl(null);
    setUploadFileSize('');
    setUploadFileType('');
    setUploadError(null);
  };

  const handleRequestInvalidationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!invalidationContract) return;
    if (!invalidationReasonInput.trim()) {
      showToast('Por favor ingrese el motivo del error para que el Administrador pueda revisarlo');
      return;
    }

    requestContractInvalidation(invalidationContract.id, invalidationReasonInput.trim());
    setInvalidationContract(null);
    setInvalidationReasonInput('');
  };

  return (
    <div className="space-y-8">
      {/* Banner */}
      <div className="bg-[#263E32] rounded-3xl p-6 sm:p-8 text-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-md">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-[#3D5E4E] text-[#BDE2C8] text-xs font-bold uppercase tracking-wider">
              Panel de Agente Inmobiliario & CRM
            </span>
            <span className="text-white/60 text-xs">Asesor: {currentUser.name}</span>
          </div>
          <h1 className="font-serif-brand text-2xl sm:text-3xl font-bold">
            Gestión de Clientes, Contratos, Depósitos y Cierres
          </h1>
          <p className="text-xs sm:text-sm text-white/80 mt-1">
            Seguimiento de prospectos, emisión de contratos con financiamiento, verificación de depósitos y carga de documentos firmados.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            onClick={() => {
              const firstProp = properties[0];
              if (firstProp) {
                setContractPropId(firstProp.id);
                setContractTotalValue(firstProp.price);
                setContractDownPayment(Math.round(firstProp.price * 0.2));
              }
              setShowContractModalAgent(true);
            }}
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs sm:text-sm flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <FileText className="w-4 h-4" />
            <span>Emitir Contrato</span>
          </button>

          <button
            onClick={() => setShowAddLeadModal(true)}
            className="px-4 py-2.5 rounded-xl bg-[#C36449] hover:bg-[#B0573E] text-white font-semibold text-xs sm:text-sm flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Nuevo Prospecto (Lead)</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#D5E1D4] gap-2 pb-1 text-xs sm:text-sm overflow-x-auto">
        <button
          onClick={() => setActiveTab('leads')}
          className={`px-4 py-2 font-semibold rounded-t-xl transition-all whitespace-nowrap ${
            activeTab === 'leads'
              ? 'border-b-2 border-[#2D4539] text-[#1E3428] bg-white font-bold'
              : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          Pipeline de Leads ({leads.length})
        </button>

        <button
          onClick={() => setActiveTab('contracts')}
          className={`px-4 py-2 font-semibold rounded-t-xl transition-all flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'contracts'
              ? 'border-b-2 border-[#2D4539] text-[#1E3428] bg-white font-bold'
              : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          <FileText className="w-4 h-4 text-emerald-700" />
          <span>Contratos & Cierres ({contracts.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('payments')}
          className={`px-4 py-2 font-semibold rounded-t-xl transition-all flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'payments'
              ? 'border-b-2 border-[#2D4539] text-[#1E3428] bg-white font-bold'
              : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          <CreditCard className="w-4 h-4 text-amber-700" />
          <span>Depósitos & Recibos ({pendingPayments.length > 0 ? `${pendingPayments.length} pendientes` : payments.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('commissions')}
          className={`px-4 py-2 font-semibold rounded-t-xl transition-all flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'commissions'
              ? 'border-b-2 border-[#2D4539] text-[#1E3428] bg-white font-bold'
              : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          <Coins className="w-4 h-4 text-emerald-700" />
          <span>Mis Comisiones & Liquidaciones</span>
        </button>

        <button
          onClick={() => setActiveTab('visits')}
          className={`px-4 py-2 font-semibold rounded-t-xl transition-all whitespace-nowrap ${
            activeTab === 'visits'
              ? 'border-b-2 border-[#2D4539] text-[#1E3428] bg-white font-bold'
              : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          Citas y Visitas Guiadas ({visits.length})
        </button>

        <button
          onClick={() => setActiveTab('calendar')}
          className={`px-4 py-2 font-semibold rounded-t-xl transition-all flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'calendar'
              ? 'border-b-2 border-[#2D4539] text-[#1E3428] bg-white font-bold'
              : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          <Calendar className="w-4 h-4 text-[#C36449]" />
          <span>Calendario</span>
        </button>

        <button
          onClick={() => setActiveTab('messages')}
          className={`px-4 py-2 font-semibold rounded-t-xl transition-all flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'messages'
              ? 'border-b-2 border-[#2D4539] text-[#1E3428] bg-white font-bold'
              : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          <MessageSquare className="w-4 h-4 text-[#2D4539]" />
          <span>Mensajería</span>
        </button>

        <button
          onClick={() => setActiveTab('valuation')}
          className={`px-4 py-2 font-semibold rounded-t-xl transition-all whitespace-nowrap ${
            activeTab === 'valuation'
              ? 'border-b-2 border-[#2D4539] text-[#1E3428] bg-white font-bold'
              : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          Calculadora de Avalúo
        </button>
      </div>

      {/* Tab: Contracts */}
      {activeTab === 'contracts' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-[#D5E1D4] p-6 shadow-2xs space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div>
                <h3 className="font-serif-brand text-lg font-bold text-gray-900">
                  Contratos Formalizados & Expedientes Firmados
                </h3>
                <p className="text-gray-500 text-xs">
                  Generación con financiamiento y cuotas, resguardo único de escaneos y confirmación de firmas.
                </p>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-64">
                  <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Buscar contrato, cliente o tipo..."
                    value={contractSearch}
                    onChange={(e) => setContractSearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs"
                  />
                </div>

                <button
                  onClick={() => setShowContractModalAgent(true)}
                  className="px-3.5 py-2 rounded-xl bg-[#2D4539] hover:bg-[#20342A] text-white font-semibold text-xs flex items-center gap-1.5 shadow-2xs whitespace-nowrap"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Nuevo Contrato</span>
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-gray-200 text-gray-500 font-semibold bg-[#FAFBF9]">
                    <th className="p-3">Código</th>
                    <th className="p-3">Modalidad</th>
                    <th className="p-3">Inmueble</th>
                    <th className="p-3">Cliente / Adquiriente</th>
                    <th className="p-3">Condición Económica</th>
                    <th className="p-3">Estado de Firmas & Escaneo</th>
                    <th className="p-3 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredContracts.map((c) => {
                    const isSale = c.contractType === 'Venta' || c.contractType === 'Venta a Plazos';
                    const hasUploaded = Boolean(c.signedDocumentUrl);
                    const isSigned = Boolean(c.isSignedDigitally || c.signedDocumentUrl);

                    return (
                      <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                        <td className="p-3 font-mono font-bold text-gray-900">{c.contractNumber}</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            c.contractType === 'Venta' ? 'bg-purple-100 text-purple-800 border border-purple-200' :
                            c.contractType === 'Venta a Plazos' ? 'bg-blue-100 text-blue-800 border border-blue-200' :
                            'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          }`}>
                            {c.contractType || 'Arrendamiento'}
                          </span>
                        </td>
                        <td className="p-3 font-semibold text-gray-800">{c.propertyTitle}</td>
                        <td className="p-3">
                          <span className="font-bold text-gray-900 block">{c.tenantName}</span>
                          <span className="text-[10px] text-gray-500 font-mono">DNI: {c.tenantNationalId} · {c.tenantPhone}</span>
                        </td>
                        <td className="p-3">
                          {isSale ? (
                            <div>
                              <span className="font-mono font-bold text-emerald-800">
                                {formatMoney(c.totalValue || c.monthlyRent)}
                              </span>
                              {c.contractType === 'Venta a Plazos' && (
                                <span className="text-[10px] text-blue-700 block font-sans">
                                  Prima: {formatMoney(c.downPayment || 0)} · Cuota: {formatMoney(c.monthlyInstallment || 0)}/m ({c.financingYears || 5} años)
                                </span>
                              )}
                            </div>
                          ) : (
                            <span className="font-mono font-bold text-emerald-800">
                              {formatMoney(c.monthlyRent)}/mes
                            </span>
                          )}
                        </td>
                        <td className="p-3">
                          {c.invalidationRequested ? (
                            <div className="p-2 rounded-xl bg-rose-50 border border-rose-300 text-rose-900 space-y-0.5">
                              <span className="font-bold text-[10px] flex items-center gap-1 text-rose-800 animate-pulse">
                                <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                                Invalidación en Trámite
                              </span>
                              <span className="text-[10px] text-rose-700 block leading-tight">
                                Esperando revisión del Administrador
                              </span>
                            </div>
                          ) : hasUploaded ? (
                            <div className="space-y-1">
                              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold border border-emerald-300 flex items-center gap-1 w-fit">
                                <FileCheck2 className="w-3 h-3 text-emerald-600" />
                                Escaneo Físico Resguardado
                              </span>
                              {c.signedDocumentUrl ? (
                                <a
                                  href={c.signedDocumentUrl}
                                  download={c.signedDocumentFileName || 'documentos.pdf'}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-[10px] font-mono text-emerald-800 hover:text-emerald-950 hover:underline block truncate max-w-[180px] font-bold"
                                  title="Haga clic para descargar o abrir el archivo PDF"
                                >
                                  📄 {c.signedDocumentFileName || 'documentos.pdf'} {c.signedDocumentFileSize ? `(${c.signedDocumentFileSize})` : ''}
                                </a>
                              ) : (
                                <span className="text-[10px] text-gray-500 font-mono block truncate max-w-[180px]">
                                  {c.signedDocumentFileName || 'Contrato_Escaneado.pdf'}
                                </span>
                              )}
                            </div>
                          ) : c.isSignedDigitally ? (
                            <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-bold border border-blue-300 flex items-center gap-1 w-fit">
                              <CheckCircle2 className="w-3 h-3 text-blue-600" />
                              Firmado Digitalmente
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold border border-amber-300 flex items-center gap-1 w-fit">
                              <Clock className="w-3 h-3 text-amber-600" />
                              Sin Firmas (Bloqueado)
                            </span>
                          )}
                        </td>
                        <td className="p-3 text-right space-x-1.5 whitespace-nowrap">
                          {/* Vista Previa con Guardia de Firmas */}
                          <button
                            onClick={() => openPrintModal({ type: 'contract', data: c })}
                            className={`px-2.5 py-1.5 rounded-lg font-semibold text-xs inline-flex items-center gap-1 shadow-2xs ${
                              isSigned
                                ? 'bg-[#2D4539] hover:bg-[#20342A] text-white'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                            title={isSigned ? 'Ver e Imprimir Contrato' : 'Requiere firmas digitales o escaneo físico para habilitar impresión'}
                          >
                            <Printer className="w-3.5 h-3.5" />
                            <span>{isSigned ? 'Ver / Imprimir' : 'Vista Previa'}</span>
                          </button>

                          {/* Descargar PDF Subido si existe */}
                          {c.signedDocumentUrl && (
                            <a
                              href={c.signedDocumentUrl}
                              download={c.signedDocumentFileName || 'documentos.pdf'}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-2.5 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs inline-flex items-center gap-1 shadow-2xs transition-colors"
                              title="Descargar o abrir el documento PDF físico/escaneado resguardado"
                            >
                              <Download className="w-3.5 h-3.5" />
                              <span>Descargar PDF</span>
                            </a>
                          )}

                          {/* Carga única de documento firmado por escaneo o PDF */}
                          {!hasUploaded ? (
                            <button
                              onClick={() => {
                                setUploadDocContract(c);
                                setUploadFileName(c.signedDocumentFileName || `Contrato_${c.contractNumber}_Firmado_${c.tenantName.replace(/\s+/g, '_')}.pdf`);
                                setUploadFileUrl(null);
                                setUploadFileSize('');
                                setUploadFileType('');
                                setUploadError(null);
                              }}
                              className="px-2.5 py-1.5 rounded-lg bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs inline-flex items-center gap-1 shadow-2xs transition-colors"
                              title="Subir archivo documentos.pdf o escaneo firmado en físico por el cliente (Carga única)"
                            >
                              <UploadCloud className="w-3.5 h-3.5" />
                              <span>Subir Firmado</span>
                            </button>
                          ) : (
                            /* Si ya fue subido, la carga se bloquea; solo puede solicitar invalidación al admin */
                            !c.invalidationRequested && (
                              <button
                                onClick={() => {
                                  setInvalidationContract(c);
                                  setInvalidationReasonInput('');
                                }}
                                className="px-2.5 py-1.5 rounded-lg bg-rose-50 border border-rose-300 hover:bg-rose-100 text-rose-800 font-bold text-xs inline-flex items-center gap-1 shadow-2xs transition-colors"
                                title="Si cometió un error en el archivo, solicite la invalidación al Administrador"
                              >
                                <FileX2 className="w-3.5 h-3.5 text-rose-600" />
                                <span>Solicitar Invalidación</span>
                              </button>
                            )
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Payments & Deposits */}
      {activeTab === 'payments' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-[#D5E1D4] p-6 shadow-2xs space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h3 className="font-serif-brand text-lg font-bold text-gray-900">
                  Depósitos y Pagos de Clientes
                </h3>
                <p className="text-gray-500 text-xs">
                  Verifica si el depósito de tus clientes está acreditado para confirmar y emitir el recibo oficial con sello.
                </p>
              </div>

              <div className="flex items-center gap-2">
                {(['all', 'En Proceso', 'Completado', 'Rechazado'] as const).map(f => (
                  <button
                    key={f}
                    onClick={() => setPaymentFilter(f)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                      paymentFilter === f
                        ? 'bg-[#2D4539] text-white shadow-2xs'
                        : 'bg-white border border-[#CAD8C8] text-gray-700 hover:bg-[#EEF5ED]'
                    }`}
                  >
                    {f === 'all' ? `Todos (${payments.length})` : f}
                  </button>
                ))}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-gray-200 text-gray-500 font-semibold bg-[#FAFBF9]">
                    <th className="p-3">Recibo Nº</th>
                    <th className="p-3">Inmueble</th>
                    <th className="p-3">Cliente / Pagador</th>
                    <th className="p-3">Concepto</th>
                    <th className="p-3">Monto Acreditado</th>
                    <th className="p-3">Vía & Referencia</th>
                    <th className="p-3">Estado</th>
                    <th className="p-3 text-right">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredPayments.map(p => {
                    const isPending = p.status === 'En Proceso' || p.status === 'Pendiente';
                    return (
                      <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                        <td className="p-3 font-mono font-bold text-gray-900">{p.receiptNumber}</td>
                        <td className="p-3 font-semibold text-gray-800">{p.propertyTitle}</td>
                        <td className="p-3">
                          <span className="font-bold text-gray-900 block">{p.payerName}</span>
                          <span className="text-[10px] text-gray-500">{p.payerEmail}</span>
                        </td>
                        <td className="p-3">{p.type}</td>
                        <td className="p-3 font-mono font-bold text-emerald-800 text-sm">
                          {formatMoney(p.amount)}
                        </td>
                        <td className="p-3 font-mono text-[11px]">
                          <span className="block font-semibold text-gray-700">{p.paymentMethod}</span>
                          <span className="text-gray-500">{p.referenceCode}</span>
                        </td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            p.status === 'Completado' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' :
                            p.status === 'En Proceso' ? 'bg-amber-100 text-amber-800 border border-amber-300' :
                            'bg-rose-100 text-rose-800 border border-rose-300'
                          }`}>
                            {p.status}
                          </span>
                        </td>
                        <td className="p-3 text-right space-x-1.5 whitespace-nowrap">
                          {isPending ? (
                            <button
                              onClick={() => {
                                confirmPayment(p.id);
                                openPrintModal({ type: 'receipt', data: { ...p, status: 'Completado' } });
                              }}
                              className="px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs inline-flex items-center gap-1 shadow-2xs transition-colors"
                              title="Confirmar que el depósito está en banco y emitir recibo oficial"
                            >
                              <CheckCircle className="w-3.5 h-3.5" />
                              <span>Confirmar & Emitir Recibo</span>
                            </button>
                          ) : (
                            <button
                              onClick={() => openPrintModal({ type: 'receipt', data: p })}
                              className="px-2.5 py-1.5 rounded-lg bg-[#2D4539] hover:bg-[#20342A] text-white font-semibold text-xs inline-flex items-center gap-1 shadow-2xs"
                              title="Ver Recibo Oficial"
                            >
                              <Printer className="w-3.5 h-3.5" />
                              <span>Ver Recibo</span>
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Agent Commissions & Disbursements */}
      {activeTab === 'commissions' && (
        <div className="space-y-6 text-xs">
          {/* Header Banner */}
          <div className="bg-white rounded-3xl border border-[#D5E1D4] p-6 shadow-2xs space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-gray-100 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <Coins className="w-5 h-5 text-emerald-700" />
                  <h3 className="font-serif-brand text-lg font-bold text-gray-900">
                    Mis Comisiones por Ventas Inmobiliarias & Liquidaciones
                  </h3>
                </div>
                <p className="text-gray-500 text-xs mt-0.5">
                  Regla de liquidación: En <strong>Ventas Directas</strong> se te acredita el total de tu ganancia (100%) al confirmarse la compra. En <strong>Ventas a Plazos</strong> se va depositando tu porcentaje proporcionalmente con cada cuota mensual cobrada.
                </p>
              </div>

              <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs border border-emerald-300 flex items-center gap-1.5 shrink-0">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                Asesor: {currentUser.name}
              </span>
            </div>

            {/* Aviso de Confidencialidad */}
            <div className="p-3 bg-amber-50/80 rounded-2xl border border-amber-200 text-amber-900 flex items-start gap-2.5">
              <Lock className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <div className="text-[11px] leading-relaxed">
                <strong>Cláusula de Confidencialidad de Tasa de Ganancia:</strong> La tasa de ganancia global acordada para los terrenos y el margen institucional de Terranova son información confidencial reservada exclusivamente para el <strong>Dueño del Terreno</strong> y la <strong>Administración</strong>. En tu panel únicamente visualizas tu comisión asignada como asesor y el estado de tus depósitos.
              </div>
            </div>

            {/* Resumen de KPIs de Comisiones */}
            {(() => {
              const saleContracts = contracts.filter(c => (c.contractType === 'Venta' || c.contractType === 'Venta a Plazos') && (c.agentName === currentUser.name || currentUser.role === 'admin' || currentUser.role === 'agent'));
              const totalAgentComms = saleContracts.reduce((sum, c) => sum + (c.agentCommissionAmount || Math.round((c.totalValue || 0) * ((c.agentCommissionRate || 2) / 100))), 0);
              const totalDisbursed = saleContracts.reduce((sum, c) => sum + (c.agentCommissionPaid || 0), 0);
              const totalPending = Math.max(0, totalAgentComms - totalDisbursed);

              return (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
                  <div className="p-4 rounded-2xl bg-[#FAFBF9] border border-[#DEE7DD]">
                    <span className="text-gray-500 text-[11px] block">Total Comisiones Ganadas / Contratadas</span>
                    <span className="text-xl font-bold font-mono text-gray-900 mt-1 block">
                      ${totalAgentComms.toLocaleString()} USD
                    </span>
                    <span className="text-[10px] text-gray-500 font-sans">
                      {saleContracts.length} contratos formalizados
                    </span>
                  </div>

                  <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200">
                    <span className="text-emerald-900 font-semibold text-[11px] block">Total Ya Depositado en tu Cuenta</span>
                    <span className="text-xl font-bold font-mono text-emerald-950 mt-1 block">
                      ${totalDisbursed.toLocaleString()} USD
                    </span>
                    <span className="text-[10px] text-emerald-800 font-sans">
                      Acreditado vía ACH / Banco
                    </span>
                  </div>

                  <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200">
                    <span className="text-blue-900 font-semibold text-[11px] block">Por Depositar en Cuotas a Plazos</span>
                    <span className="text-xl font-bold font-mono text-blue-950 mt-1 block">
                      ${totalPending.toLocaleString()} USD
                    </span>
                    <span className="text-[10px] text-blue-800 font-sans">
                      Se deposita automáticamente con cada pago
                    </span>
                  </div>
                </div>
              );
            })()}
          </div>

          {/* Listado de Contratos y Estado de Liquidación */}
          <div className="bg-white rounded-3xl border border-[#D5E1D4] p-6 shadow-2xs space-y-4">
            <h4 className="font-serif-brand text-base font-bold text-gray-900">
              Desglose de Ventas & Mecanismo de Depósito
            </h4>

            <div className="space-y-4">
              {contracts
                .filter(c => c.contractType === 'Venta' || c.contractType === 'Venta a Plazos')
                .map(ctr => {
                  const isDirect = ctr.contractType === 'Venta';
                  const agentRate = ctr.agentCommissionRate || 2;
                  const totalAgentVal = ctr.agentCommissionAmount || Math.round((ctr.totalValue || 0) * (agentRate / 100));
                  const paidSoFar = ctr.agentCommissionPaid || (isDirect ? totalAgentVal : 0);
                  const isFullyPaid = paidSoFar >= totalAgentVal;

                  return (
                    <div key={ctr.id} className="p-4 rounded-2xl border border-gray-200 bg-[#FAFBF9] space-y-3">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-gray-200 pb-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-sm text-gray-900">{ctr.contractNumber}</span>
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              isDirect ? 'bg-purple-100 text-purple-900 border border-purple-300' : 'bg-blue-100 text-blue-900 border border-blue-300'
                            }`}>
                              {isDirect ? 'Venta Directa' : 'Venta a Plazos (Financiamiento)'}
                            </span>
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              isFullyPaid ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-amber-100 text-amber-800 border border-amber-300'
                            }`}>
                              {isFullyPaid ? '✓ Totalmente Depositado' : 'Abonos en Curso'}
                            </span>
                          </div>
                          <p className="font-semibold text-gray-800 mt-1">{ctr.propertyTitle} ({ctr.propertyCode})</p>
                          <p className="text-[11px] text-gray-500">Comprador: {ctr.tenantName} · Propietario: {ctr.ownerName}</p>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => openPrintModal({ type: 'contract', data: ctr })}
                            className="px-3 py-1.5 rounded-xl bg-white border border-[#CBD8CA] hover:bg-[#EEF5ED] text-gray-800 font-semibold text-xs flex items-center gap-1 shadow-2xs"
                          >
                            <FileText className="w-3.5 h-3.5 text-gray-600" />
                            <span>Ver Contrato</span>
                          </button>
                        </div>
                      </div>

                      {/* Desglose de ganancia para el asesor */}
                      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 bg-white p-3 rounded-xl border border-gray-200">
                        <div>
                          <span className="text-gray-500 text-[10px] block">Precio Total de Venta</span>
                          <span className="font-mono font-bold text-gray-900 text-sm">
                            ${(ctr.totalValue || ctr.monthlyRent).toLocaleString()} USD
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500 text-[10px] block">% Mi Comisión Asignada</span>
                          <span className="font-mono font-bold text-emerald-800 text-sm">
                            {agentRate}%
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500 text-[10px] block">Total Ganancia Estimada</span>
                          <span className="font-mono font-bold text-emerald-900 text-sm">
                            ${totalAgentVal.toLocaleString()} USD
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500 text-[10px] block">Total Depositado a la Fecha</span>
                          <span className="font-mono font-bold text-blue-900 text-sm">
                            ${paidSoFar.toLocaleString()} USD
                          </span>
                        </div>
                      </div>

                      {/* Regla y explicación de cómo se liquida */}
                      <div className="p-3 rounded-xl bg-emerald-50/50 border border-emerald-200 text-[11px] space-y-1">
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-emerald-950">
                            {isDirect ? '✓ Mecanismo: Venta Directa (Al Contado)' : '✓ Mecanismo: Venta a Plazos (Por Cuotas)'}
                          </span>
                          <span className="font-mono font-semibold text-emerald-800">
                            {isDirect 
                              ? '100% de la ganancia transferida de inmediato' 
                              : `Se deposita tu ${agentRate}% proporcionalmente con cada cuota`}
                          </span>
                        </div>
                        <p className="text-gray-600">
                          {isDirect 
                            ? `Al ejecutarse la compraventa directa, se te acreditó el total íntegro de tus honorarios ($${totalAgentVal.toLocaleString()} USD) en tu cuenta bancaria registrada.`
                            : `De la prima cobrada de $${(ctr.downPayment || 0).toLocaleString()} USD se te acreditó el ${agentRate}% ($${Math.round((ctr.downPayment || 0) * (agentRate / 100)).toLocaleString()} USD). Cada cuota mensual amortizada ($${(ctr.monthlyInstallment || 0).toLocaleString()} USD/mes) te acredita automáticamente $${Math.round((ctr.monthlyInstallment || 0) * (agentRate / 100)).toLocaleString()} USD.`}
                        </p>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      )}

      {/* Tab: Leads */}
      {activeTab === 'leads' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {(['Nuevo', 'En Seguimiento', 'Visita Agendada', 'En Negociación'] as const).map((colStatus) => {
              const colLeads = leads.filter(l => l.status === colStatus);
              return (
                <div key={colStatus} className="bg-[#FAFBF9] rounded-2xl border border-[#D5E1D4] p-4 flex flex-col">
                  <div className="flex justify-between items-center mb-3">
                    <span className="font-bold text-xs text-gray-800">{colStatus}</span>
                    <span className="bg-white border border-[#CBD8CA] text-xs font-mono font-bold px-2 py-0.5 rounded-full">
                      {colLeads.length}
                    </span>
                  </div>

                  <div className="space-y-3 flex-1">
                    {colLeads.map((lead) => (
                      <div key={lead.id} className="bg-white p-3.5 rounded-xl border border-[#DCE5DB] shadow-2xs text-xs space-y-2">
                        <div className="flex justify-between items-start">
                          <p className="font-bold text-gray-900">{lead.name}</p>
                          <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                            lead.interestType === 'Alquiler' ? 'bg-[#EEF5ED] text-[#203D2E]' : 'bg-orange-50 text-orange-800'
                          }`}>
                            {lead.interestType}
                          </span>
                        </div>

                        <p className="text-[11px] text-gray-500">Zona: {lead.preferredZone}</p>
                        <p className="text-[11px] text-gray-700 font-mono">
                          Presupuesto: {formatMoney(lead.budgetMax)}
                        </p>

                        <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-500">
                          <span className="flex items-center gap-1"><Phone className="w-3 h-3 text-emerald-600" /> {lead.phone}</span>
                          <select
                            value={lead.status}
                            onChange={(e) => updateLeadStatus(lead.id, e.target.value as any)}
                            className="bg-gray-50 border border-gray-200 rounded text-[10px] py-0.5 px-1 font-semibold text-gray-700"
                          >
                            <option value="Nuevo">Nuevo</option>
                            <option value="En Seguimiento">En Seguimiento</option>
                            <option value="Visita Agendada">Visita Agendada</option>
                            <option value="En Negociación">En Negociación</option>
                            <option value="Cerrado">Cerrado / Firmado</option>
                          </select>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab: Visits */}
      {activeTab === 'visits' && (
        <div className="bg-white rounded-3xl border border-[#D5E1D4] p-6 shadow-2xs space-y-4 text-xs">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-serif-brand text-lg font-bold text-gray-900">Agenda de Citas y Visitas a Propiedades</h3>
              <p className="text-gray-500">Coordina visitas presenciales y tours virtuales con clientes interesados</p>
            </div>
          </div>

          <div className="divide-y divide-gray-100">
            {visits.map((vis) => (
              <div key={vis.id} className="py-4 flex flex-wrap items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-gray-900">{vis.propertyTitle}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      vis.type === 'Presencial' ? 'bg-[#EEF5ED] text-[#203D2E]' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {vis.type}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      vis.status === 'Confirmada' ? 'bg-emerald-100 text-emerald-800' :
                      vis.status === 'Pendiente' ? 'bg-amber-100 text-amber-800' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {vis.status}
                    </span>
                  </div>

                  <p className="text-gray-600">
                    Cliente: <strong>{vis.visitorName}</strong> · Tel: {vis.visitorPhone} · Email: {vis.visitorEmail}
                  </p>

                  <div className="flex items-center gap-3 text-gray-500 text-[11px]">
                    <span className="flex items-center gap-1 font-semibold text-gray-700">
                      <Calendar className="w-3.5 h-3.5 text-[#537260]" /> {vis.date} a las {vis.time}
                    </span>
                    <span>· Agente responsable: {vis.agentName}</span>
                    {vis.notes && <span className="italic">"{vis.notes}"</span>}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {vis.status === 'Pendiente' && (
                    <button
                      onClick={() => updateVisitStatus(vis.id, 'Confirmada')}
                      className="px-3 py-1.5 bg-[#2D4539] hover:bg-[#20342A] text-white rounded-xl text-xs font-semibold"
                    >
                      Confirmar Cita
                    </button>
                  )}
                  {vis.status === 'Confirmada' && (
                    <button
                      onClick={() => updateVisitStatus(vis.id, 'Realizada')}
                      className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-semibold"
                    >
                      Marcar Realizada
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Calendar */}
      {activeTab === 'calendar' && (
        <WorkCalendarView forcedAssignee={currentUser.name || 'Anthony Rafael Alfaro'} />
      )}

      {/* Tab: Messages */}
      {activeTab === 'messages' && (
        <MessagesInbox />
      )}

      {/* Tab: Property Valuation Tool */}
      {activeTab === 'valuation' && (
        <div className="bg-white rounded-3xl border border-[#D5E1D4] p-6 shadow-2xs grid grid-cols-1 lg:grid-cols-3 gap-6 text-xs">
          <div className="lg:col-span-2 space-y-4">
            <h3 className="font-serif-brand text-xl font-bold text-gray-900 flex items-center gap-2">
              <Calculator className="w-5 h-5 text-[#C36449]" /> Motor de Valoración Inmobiliaria Automatizada
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Calcula el valor comercial estimado y canon de arrendamiento sugerido de acuerdo al metraje, zona de alta plusvalía en Tegucigalpa / Valle de Ángeles y estado físico del inmueble.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Zona Geográfica</label>
                <select
                  value={valZone}
                  onChange={(e) => setValZone(e.target.value)}
                  className="w-full bg-[#FAFBF9] border border-[#CBD8CA] rounded-xl p-2.5"
                >
                  <option value="Alta Plus (Lomas / Hadas / Guijarro)">Alta Plusvalía (Lomas del Guijarro, Las Hadas, El Trapiche)</option>
                  <option value="Media Residencial (Miraflores, Loarque)">Residencial Media (Miraflores, Kennedy, Loarque)</option>
                  <option value="Campestre (Valle de Ángeles, Santa Lucía)">Campestre / Turística (Valle de Ángeles, Santa Lucía)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Área Construida (m²)</label>
                <input
                  type="number"
                  value={valArea}
                  onChange={(e) => setValArea(Number(e.target.value))}
                  className="w-full bg-[#FAFBF9] border border-[#CBD8CA] rounded-xl p-2.5 font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Antigüedad de la Construcción</label>
                <select
                  value={valAge}
                  onChange={(e) => setValAge(Number(e.target.value))}
                  className="w-full bg-[#FAFBF9] border border-[#CBD8CA] rounded-xl p-2.5"
                >
                  <option value={0}>A estrenar (0 años)</option>
                  <option value={3}>1 a 5 años</option>
                  <option value={8}>6 a 10 años</option>
                  <option value={15}>Más de 10 años</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Nivel de Acabados</label>
                <select
                  value={valFinishes}
                  onChange={(e) => setValFinishes(e.target.value as any)}
                  className="w-full bg-[#FAFBF9] border border-[#CBD8CA] rounded-xl p-2.5"
                >
                  <option value="Lujo">Lujo (Madera preciosa, granito, porcelanato)</option>
                  <option value="Estándar">Estándar (Cerámica comercial, aglomerado)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Valuation Result Card */}
          <div className="bg-[#2D4539] text-white p-6 rounded-2xl flex flex-col justify-between space-y-4">
            <div>
              <span className="text-xs uppercase tracking-wider text-[#A5CDB0] font-bold block">
                Dictamen Técnico Sugerido
              </span>
              <div className="mt-4 space-y-3">
                <div>
                  <span className="text-[11px] text-white/70 block">Valor de Mercado para Venta:</span>
                  <span className="text-2xl font-bold font-mono text-white">
                    {formatMoney(estimatedMarketValue)}
                  </span>
                </div>
                <div>
                  <span className="text-[11px] text-white/70 block">Renta Mensual Estimada:</span>
                  <span className="text-xl font-bold font-mono text-[#D8EADB]">
                    {formatMoney(estimatedRentValue)} / mes
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-white/20">
              <button
                onClick={() => showToast('Certificado de avalúo generado y listo para presentar al propietario')}
                className="w-full py-2.5 bg-[#C36449] hover:bg-[#B1573D] text-white rounded-xl font-semibold text-center transition-colors shadow-2xs"
              >
                Emitir Dictamen de Avalúo
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: New Lead with Character Sanitization */}
      {showAddLeadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white border border-[#CBD8CA] rounded-3xl max-w-md w-full shadow-2xl">
            <div className="bg-[#2D4539] text-white p-5 flex items-center justify-between">
              <h3 className="font-serif-brand text-lg font-bold">Registrar Nuevo Prospecto (Lead)</h3>
              <button onClick={() => setShowAddLeadModal(false)} className="text-white/70 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddLeadSubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Nombre Completo (Solo letras y espacios)</label>
                <input
                  type="text"
                  required
                  value={leadName}
                  onChange={(e) => {
                    const clean = e.target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]/g, '');
                    setLeadName(clean);
                  }}
                  placeholder="Ej: Keydi Reyes"
                  className="w-full bg-white border border-[#CAD8C8] rounded-xl p-2.5 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Correo Electrónico</label>
                  <input
                    type="email"
                    required
                    value={leadEmail}
                    onChange={(e) => setLeadEmail(e.target.value)}
                    placeholder="cliente@correo.com"
                    className="w-full bg-white border border-[#CAD8C8] rounded-xl p-2.5"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Teléfono (Solo números y formato)</label>
                  <input
                    type="tel"
                    required
                    value={leadPhone}
                    onChange={(e) => {
                      const clean = e.target.value.replace(/[^\d+()-\s]/g, '');
                      setLeadPhone(clean);
                    }}
                    placeholder="+504 9988-7766"
                    className="w-full bg-white border border-[#CAD8C8] rounded-xl p-2.5 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Interés</label>
                  <select
                    value={leadInterest}
                    onChange={(e) => setLeadInterest(e.target.value as any)}
                    className="w-full bg-white border border-[#CAD8C8] rounded-xl p-2.5"
                  >
                    <option value="Alquiler">Alquiler</option>
                    <option value="Compra">Compra</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Presupuesto Máximo (USD)</label>
                  <input
                    type="number"
                    required
                    value={leadBudget}
                    onChange={(e) => setLeadBudget(Number(e.target.value))}
                    className="w-full bg-white border border-[#CAD8C8] rounded-xl p-2.5 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Zona Preferida</label>
                <input
                  type="text"
                  value={leadZone}
                  onChange={(e) => setLeadZone(e.target.value)}
                  className="w-full bg-white border border-[#CAD8C8] rounded-xl p-2.5"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Notas del Asesor</label>
                <textarea
                  rows={2}
                  value={leadNotes}
                  onChange={(e) => setLeadNotes(e.target.value)}
                  placeholder="Detalles sobre urgencia, preferencias de espacio..."
                  className="w-full bg-white border border-[#CAD8C8] rounded-xl p-2.5"
                ></textarea>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddLeadModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#2D4539] hover:bg-[#20342A] text-white font-semibold transition-colors"
                >
                  Guardar Prospecto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Agent Contract Generator (Con cálculo automático de valor, prima, años y cuotas) */}
      {showContractModalAgent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white border border-[#CBD8CA] rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="bg-[#2D4539] text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#A3C7AD]" />
                <h3 className="font-serif-brand text-lg font-bold">Generador de Contratos & Financiamiento</h3>
              </div>
              <button onClick={() => setShowContractModalAgent(false)} className="text-white/70 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateContractAgent} className="p-6 space-y-4 text-xs">
              {/* Modalidad de Contrato */}
              <div>
                <label className="block font-bold text-gray-800 mb-1">Modalidad de Negociación</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'Venta a Plazos', label: 'Venta a Plazos (Financiamiento)' },
                    { id: 'Venta', label: 'Venta Directa de Contado' },
                    { id: 'Arrendamiento', label: 'Arrendamiento / Alquiler' }
                  ].map(t => (
                    <button
                      type="button"
                      key={t.id}
                      onClick={() => setContractType(t.id as any)}
                      className={`p-2.5 rounded-xl border text-center font-bold transition-all ${
                        contractType === t.id
                          ? 'border-[#2D4539] bg-[#EEF5ED] text-[#1E3628] shadow-2xs'
                          : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Inmueble con auto-relleno automático de valor */}
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Propiedad Seleccionada del Catálogo</label>
                <select
                  value={contractPropId}
                  onChange={(e) => {
                    setContractPropId(e.target.value);
                    const p = properties.find(prop => prop.id === e.target.value);
                    if (p) {
                      setContractTotalValue(p.price);
                      setContractDownPayment(Math.round(p.price * 0.2));
                    }
                  }}
                  className="w-full bg-white border border-[#CBD8CA] rounded-xl p-2.5 font-medium text-gray-800"
                >
                  {properties.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.code} - {p.title} (${p.price.toLocaleString()} USD)
                    </option>
                  ))}
                </select>
                <span className="text-[10px] text-gray-500 mt-1 block">
                  * El valor del inmueble se asigna automáticamente al seleccionarlo del catálogo.
                </span>
              </div>

              {/* Datos del Cliente con Validación de Caracteres */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Nombre Completo del Cliente (Solo letras)</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Keydi Reyes"
                    value={contractTenantName}
                    onChange={(e) => {
                      const clean = e.target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]/g, '');
                      setContractTenantName(clean);
                    }}
                    className="w-full bg-white border border-[#CAD8C8] rounded-xl p-2.5 font-medium"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Correo Electrónico</label>
                  <input
                    type="email"
                    required
                    placeholder="keydi.reyes@gmail.com"
                    value={contractTenantEmail}
                    onChange={(e) => setContractTenantEmail(e.target.value)}
                    className="w-full bg-white border border-[#CAD8C8] rounded-xl p-2.5"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">DNI / Identidad (13 dígitos)</label>
                  <input
                    type="text"
                    required
                    placeholder="0801-1992-05432"
                    value={contractTenantNationalId}
                    onChange={(e) => {
                      const clean = e.target.value.replace(/[^\d-]/g, '');
                      setContractTenantNationalId(clean);
                    }}
                    className="w-full bg-white border border-[#CAD8C8] rounded-xl p-2.5 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Teléfono (Solo números y formato)</label>
                  <input
                    type="tel"
                    required
                    placeholder="+504 9876-5432"
                    value={contractTenantPhone}
                    onChange={(e) => {
                      const clean = e.target.value.replace(/[^\d+()-\s]/g, '');
                      setContractTenantPhone(clean);
                    }}
                    className="w-full bg-white border border-[#CAD8C8] rounded-xl p-2.5 font-mono"
                  />
                </div>
              </div>

              {/* Si es Venta o Venta a Plazos: Prima inicial, Años y Cálculo de Cuotas */}
              {(contractType === 'Venta' || contractType === 'Venta a Plazos') && (
                <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200 space-y-3">
                  <span className="font-bold text-xs text-blue-950 uppercase tracking-wider block">
                    Condiciones Económicas de Compraventa
                  </span>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-gray-700 mb-1">Valor Total del Inmueble (USD)</label>
                      <input
                        type="number"
                        required
                        value={contractTotalValue}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          setContractTotalValue(val);
                          setContractDownPayment(Math.round(val * 0.2));
                        }}
                        className="w-full bg-white border border-blue-300 rounded-xl p-2.5 font-mono font-bold text-gray-900"
                      />
                    </div>

                    {contractType === 'Venta a Plazos' && (
                      <div>
                        <label className="block font-semibold text-gray-700 mb-1">Prima Inicial (Down Payment USD)</label>
                        <input
                          type="number"
                          required
                          value={contractDownPayment}
                          onChange={(e) => setContractDownPayment(Number(e.target.value))}
                          className="w-full bg-white border border-blue-300 rounded-xl p-2.5 font-mono font-bold text-blue-900"
                        />
                      </div>
                    )}
                  </div>

                  {contractType === 'Venta a Plazos' && (
                    <div className="space-y-2 pt-1 border-t border-blue-200">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block font-semibold text-gray-700 mb-1">Plazo de Financiamiento (Años)</label>
                          <input
                            type="number"
                            min={1}
                            max={30}
                            required
                            value={contractYears}
                            onChange={(e) => setContractYears(Number(e.target.value))}
                            className="w-full bg-white border border-blue-300 rounded-xl p-2.5 font-mono"
                          />
                        </div>
                        <div>
                          <label className="block font-semibold text-gray-700 mb-1">Total de Cuotas Mensuales</label>
                          <div className="p-2.5 bg-white rounded-xl border border-blue-200 font-mono font-bold text-gray-800">
                            {contractYears * 12} Cuotas Mensuales
                          </div>
                        </div>
                      </div>

                      {/* Resumen de Cuota Calculada */}
                      <div className="p-3 bg-white rounded-xl border border-blue-300 flex justify-between items-center">
                        <div>
                          <span className="text-[10px] text-gray-500 block uppercase font-bold">Valor de Cuota Mensual Estimada:</span>
                          <span className="text-[11px] text-blue-950 font-medium">
                            Saldo: ${(contractTotalValue - contractDownPayment).toLocaleString()} / {contractYears * 12} meses
                          </span>
                        </div>
                        <span className="font-mono text-base font-bold text-blue-900 font-serif-brand">
                          ${(contractYears > 0 ? Math.round((contractTotalValue - contractDownPayment) / (contractYears * 12)) : 0).toLocaleString()} USD/mes
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Comisión del Asesor / Agente (Confidencialidad: el agente no puede ver la tasa de ganancia global ni Terranova) */}
                  <div className="pt-2 border-t border-blue-200 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-[11px] text-blue-950 block">
                        Honorarios de Éxito / Comisión del Asesor (Agente)
                      </span>
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full border border-emerald-300">
                        {contractType === 'Venta' ? 'Liquidación Total al Contado' : 'Depósito Proporcional por Cuotas'}
                      </span>
                    </div>

                    <div className="p-3 bg-white rounded-xl border border-emerald-200 grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                      <div>
                        <label className="block text-[10px] text-emerald-900 font-bold mb-1">% Mi Comisión de Asesor</label>
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            min={0.5}
                            max={10}
                            step={0.5}
                            value={contractAgentCommPercent}
                            onChange={(e) => setContractAgentCommPercent(Number(e.target.value))}
                            className="w-24 bg-emerald-50/50 border border-emerald-300 rounded-lg p-2 font-mono font-bold text-emerald-900 text-sm"
                          />
                          <span className="font-bold text-xs text-emerald-800">%</span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-[10px] text-gray-500 block uppercase font-bold">
                          {contractType === 'Venta' ? 'Ganancia Total a Liquidar:' : 'Ganancia Total Distribuible:'}
                        </span>
                        <span className="font-mono text-base font-bold text-emerald-800 font-serif-brand">
                          ${Math.round(contractTotalValue * (contractAgentCommPercent / 100)).toLocaleString()} USD
                        </span>
                        {contractType === 'Venta a Plazos' && (
                          <span className="text-[10px] text-blue-700 block mt-0.5 font-medium">
                            Prima: ${Math.round(contractDownPayment * (contractAgentCommPercent / 100)).toLocaleString()} USD · Cuota: ${Math.round((contractYears > 0 ? (contractTotalValue - contractDownPayment) / (contractYears * 12) : 0) * (contractAgentCommPercent / 100)).toLocaleString()} USD/mes
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Aviso de Confidencialidad Exclusiva */}
                    <div className="p-2.5 rounded-xl bg-amber-50/80 border border-amber-200 text-amber-900 text-[11px] space-y-0.5">
                      <p className="font-bold flex items-center gap-1">
                        🔒 Cláusula de Confidencialidad Financiera:
                      </p>
                      <p className="text-[10px] text-amber-800">
                        La tasa de ganancia global pactada para el terreno y el margen institucional de Terranova son información confidencial exclusiva del <strong>Dueño del Terreno</strong> y el <strong>Administrador</strong>.
                      </p>
                      <p className="text-[10px] text-gray-600 pt-1 border-t border-amber-200/60">
                        {contractType === 'Venta' 
                          ? '✓ Venta Directa: Se te otorgará el 100% de tu ganancia al confirmarse el pago de la compra.' 
                          : '✓ Venta a Plazos: Se te irá depositando tu porcentaje proporcionalmente con cada cuota mensual o abono cobrado.'}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Modalidad de Firma */}
              <div>
                <label className="block font-bold text-gray-800 mb-1">Modalidad de Firma del Contrato</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setContractSignatureMode('fisica_presencial')}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      contractSignatureMode === 'fisica_presencial'
                        ? 'border-blue-600 bg-blue-50 text-blue-950 font-bold shadow-2xs'
                        : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <span className="block text-xs font-bold">Firma Física Presencial</span>
                    <span className="text-[10px] font-normal text-gray-500">
                      Se firma en papel y luego se sube el escaneo o PDF a la plataforma (Carga única).
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setContractSignatureMode('digital')}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      contractSignatureMode === 'digital'
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-bold shadow-2xs'
                        : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <span className="block text-xs font-bold">Firma Digital Inmediata</span>
                    <span className="text-[10px] font-normal text-gray-500">
                      Estampa criptográfica con sello temporal y validez legal.
                    </span>
                  </button>
                </div>

                {contractSignatureMode === 'fisica_presencial' && (
                  <div className="mt-3 p-3.5 bg-blue-50/80 rounded-2xl border border-blue-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-blue-950 flex items-center gap-1.5">
                        <FileText className="w-4 h-4 text-blue-700" />
                        ¿Ya tiene el documento o escaneo firmado? Adjúntelo (opcional):
                      </span>
                      {emissionDocUrl && (
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full border border-emerald-300">
                          ✓ Archivo Adjunto
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-gray-600">
                      Puede adjuntar <strong>documentos.pdf</strong> o escaneos ahora mismo, o bien emitir el contrato y cargarlo posteriormente desde el botón "Subir Firmado".
                    </p>
                    <div className="flex items-center gap-2">
                      <input
                        type="file"
                        accept=".pdf,application/pdf,image/png,image/jpeg"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const sizeStr = file.size > 1024 * 1024 
                              ? `${(file.size / (1024 * 1024)).toFixed(2)} MB`
                              : `${Math.round(file.size / 1024)} KB`;
                            setEmissionDocName(file.name);
                            setEmissionDocSize(sizeStr);
                            setEmissionDocType(file.type || 'application/pdf');
                            const reader = new FileReader();
                            reader.onload = (loadEvt) => {
                              setEmissionDocUrl(loadEvt.target?.result as string);
                              showToast(`Archivo "${file.name}" (${sizeStr}) adjuntado al contrato.`);
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                        className="text-xs file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-blue-700 file:text-white hover:file:bg-blue-800 cursor-pointer"
                      />
                    </div>
                    {emissionDocName && (
                      <div className="flex items-center justify-between text-[11px] bg-white p-2 rounded-xl border border-blue-200">
                        <span className="font-mono text-blue-900 font-bold">📄 {emissionDocName} ({emissionDocSize})</span>
                        <button
                          type="button"
                          onClick={() => {
                            setEmissionDocUrl(null);
                            setEmissionDocName('');
                            setEmissionDocSize('');
                            setEmissionDocType('');
                          }}
                          className="text-rose-600 hover:text-rose-800 font-bold text-[10px]"
                        >
                          Quitar
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 text-[11px]">
                ⚠️ <strong>Aviso Legal & Guardas de Impresión:</strong> Ningún contrato podrá ser impreso o descargado en formato oficial sin contar con las firmas completas (digitales o escaneo físico resguardado).
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowContractModalAgent(false)}
                  className="px-4 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#2D4539] hover:bg-[#20342A] text-white font-semibold transition-colors"
                >
                  Emitir y Generar Contrato
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Subir Contrato Firmado por Escaneo o PDF (Carga única bloqueada) */}
      {uploadDocContract && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white border border-[#CBD8CA] rounded-3xl max-w-md w-full shadow-2xl">
            <div className="bg-[#2D4539] text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <UploadCloud className="w-5 h-5 text-[#A3C7AD]" />
                <h3 className="font-serif-brand text-lg font-bold">Cargar Escaneo o PDF Firmado</h3>
              </div>
              <button onClick={() => setUploadDocContract(null)} className="text-white/70 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUploadSignedDocument} className="p-6 space-y-4 text-xs">
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                <span className="text-[10px] text-gray-500 block uppercase font-bold">Contrato Asociado:</span>
                <span className="font-bold text-gray-900 text-sm">{uploadDocContract.contractNumber}</span>
                <span className="text-gray-600 block">{uploadDocContract.propertyTitle}</span>
                <span className="text-emerald-800 font-semibold block">Cliente: {uploadDocContract.tenantName}</span>
              </div>

              {/* Selector de Archivo PDF Real */}
              <div className="space-y-2">
                <label className="block font-bold text-gray-800">
                  Seleccionar Documento PDF o Escaneo Firmado (ej: <span className="font-mono text-blue-700">documentos.pdf</span>):
                </label>
                
                <div 
                  className={`p-5 rounded-2xl border-2 border-dashed transition-all text-center ${
                    uploadFileUrl 
                      ? 'border-emerald-500 bg-emerald-50/70 shadow-xs' 
                      : 'border-blue-300 hover:border-blue-500 bg-blue-50/40 hover:bg-blue-50/70'
                  }`}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    const file = e.dataTransfer.files?.[0];
                    if (file) {
                      const sizeStr = file.size > 1024 * 1024 
                        ? `${(file.size / (1024 * 1024)).toFixed(2)} MB`
                        : `${Math.round(file.size / 1024)} KB`;
                      setUploadFileName(file.name);
                      setUploadFileSize(sizeStr);
                      setUploadFileType(file.type || 'application/pdf');
                      setIsReadingFile(true);
                      const reader = new FileReader();
                      reader.onload = (loadEvt) => {
                        setUploadFileUrl(loadEvt.target?.result as string);
                        setIsReadingFile(false);
                        setUploadError(null);
                        showToast(`Archivo "${file.name}" (${sizeStr}) cargado correctamente.`);
                      };
                      reader.onerror = () => {
                        setIsReadingFile(false);
                        setUploadError('Error al leer el archivo. Intente nuevamente.');
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                >
                  {uploadFileUrl ? (
                    <div className="space-y-2.5">
                      <div className="w-12 h-12 bg-emerald-700 text-white rounded-2xl flex items-center justify-center mx-auto shadow-sm">
                        <FileText className="w-6 h-6" />
                      </div>
                      <div>
                        <span className="font-bold text-sm text-emerald-950 block">{uploadFileName || 'documentos.pdf'}</span>
                        <div className="flex items-center justify-center gap-2 mt-1">
                          <span className="px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-900 font-mono text-[10px] font-bold">
                            {uploadFileType.includes('pdf') || uploadFileName.toLowerCase().endsWith('.pdf') ? 'PDF' : 'IMAGEN'}
                          </span>
                          <span className="text-[11px] text-emerald-800 font-semibold">{uploadFileSize}</span>
                          <span className="text-[10px] text-emerald-700 font-bold">✓ Archivo listo</span>
                        </div>
                      </div>
                      <div className="pt-1 flex justify-center gap-2">
                        <label
                          htmlFor="replaceSignedFileInput"
                          className="px-3 py-1.5 rounded-xl bg-white border border-emerald-300 hover:bg-emerald-50 text-emerald-800 text-[11px] font-bold cursor-pointer transition-colors shadow-2xs"
                        >
                          Cambiar archivo
                        </label>
                        <input
                          id="replaceSignedFileInput"
                          type="file"
                          accept=".pdf,application/pdf,image/png,image/jpeg"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const sizeStr = file.size > 1024 * 1024 
                                ? `${(file.size / (1024 * 1024)).toFixed(2)} MB`
                                : `${Math.round(file.size / 1024)} KB`;
                              setUploadFileName(file.name);
                              setUploadFileSize(sizeStr);
                              setUploadFileType(file.type || 'application/pdf');
                              setIsReadingFile(true);
                              const reader = new FileReader();
                              reader.onload = (loadEvt) => {
                                setUploadFileUrl(loadEvt.target?.result as string);
                                setIsReadingFile(false);
                                setUploadError(null);
                                showToast(`Archivo "${file.name}" cargado.`);
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                          className="hidden"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2.5">
                      <div className="w-12 h-12 bg-blue-100 text-blue-800 rounded-2xl flex items-center justify-center mx-auto">
                        <FileUp className="w-6 h-6 text-blue-700" />
                      </div>
                      <div>
                        <span className="font-bold text-sm text-gray-900 block">
                          Haga clic para seleccionar o arrastre aquí su archivo
                        </span>
                        <p className="text-[11px] text-gray-500 mt-0.5">
                          Admite <strong>documentos.pdf</strong>, archivos PDF y escaneos de alta resolución (.png, .jpg)
                        </p>
                      </div>
                      <div className="pt-1">
                        <label
                          htmlFor="signedFileInput"
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs cursor-pointer shadow-2xs transition-colors"
                        >
                          <FileText className="w-4 h-4" />
                          <span>Examinar Archivo PDF / Escaneo</span>
                        </label>
                        <input
                          id="signedFileInput"
                          type="file"
                          accept=".pdf,application/pdf,image/png,image/jpeg"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const sizeStr = file.size > 1024 * 1024 
                                ? `${(file.size / (1024 * 1024)).toFixed(2)} MB`
                                : `${Math.round(file.size / 1024)} KB`;
                              setUploadFileName(file.name);
                              setUploadFileSize(sizeStr);
                              setUploadFileType(file.type || 'application/pdf');
                              setIsReadingFile(true);
                              const reader = new FileReader();
                              reader.onload = (loadEvt) => {
                                setUploadFileUrl(loadEvt.target?.result as string);
                                setIsReadingFile(false);
                                setUploadError(null);
                                showToast(`Archivo "${file.name}" (${sizeStr}) cargado.`);
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                          className="hidden"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {uploadError && (
                  <p className="text-[11px] font-bold text-rose-600 bg-rose-50 p-2.5 rounded-xl border border-rose-200">
                    ⚠️ {uploadError}
                  </p>
                )}
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Nombre oficial de registro del documento:
                </label>
                <input
                  type="text"
                  required
                  value={uploadFileName}
                  onChange={(e) => setUploadFileName(e.target.value)}
                  placeholder="documentos.pdf o Contrato_Firmado.pdf"
                  className="w-full bg-white border border-[#CAD8C8] rounded-xl p-2.5 font-mono text-xs font-semibold text-gray-800"
                />
                <span className="text-[10px] text-gray-500 mt-0.5 block">
                  Se asigna automáticamente del archivo seleccionado; puede personalizar la descripción si lo prefiere.
                </span>
              </div>

              <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-xl text-blue-950 text-[11px] space-y-1">
                <p className="font-bold">🔒 Regla de Integridad & Carga Única:</p>
                <p>
                  El documento firmado se resguarda en el expediente oficial. Por seguridad, la plataforma admite <strong>una sola carga oficial</strong>. Si comete un error, el Administrador puede invalidarlo previa solicitud.
                </p>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setUploadDocContract(null)}
                  className="px-4 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isReadingFile || !uploadFileUrl}
                  className={`px-5 py-2.5 rounded-xl font-bold transition-colors flex items-center gap-1.5 shadow-2xs ${
                    isReadingFile || !uploadFileUrl
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-blue-700 hover:bg-blue-800 text-white'
                  }`}
                >
                  <UploadCloud className="w-4 h-4" />
                  <span>{isReadingFile ? 'Procesando archivo...' : 'Subir y Resguardar Documento PDF'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Solicitar Invalidación al Administrador */}
      {invalidationContract && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white border border-rose-300 rounded-3xl max-w-md w-full shadow-2xl">
            <div className="bg-rose-900 text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileX2 className="w-5 h-5 text-rose-300" />
                <h3 className="font-serif-brand text-lg font-bold">Solicitar Invalidación al Administrador</h3>
              </div>
              <button onClick={() => setInvalidationContract(null)} className="text-white/70 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRequestInvalidationSubmit} className="p-6 space-y-4 text-xs">
              <div className="p-3 bg-rose-50 rounded-xl border border-rose-200 text-rose-950">
                <span className="text-[10px] uppercase font-bold block text-rose-800">Contrato:</span>
                <span className="font-bold text-sm block">{invalidationContract.contractNumber} — {invalidationContract.propertyTitle}</span>
                <span className="font-mono text-[10px] text-gray-600 block mt-1">
                  Archivo cargado actualmente: {invalidationContract.signedDocumentFileName || 'Contrato_Escaneado.pdf'}
                </span>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Motivo del Error o Razón de Sustitución
                </label>
                <textarea
                  rows={3}
                  required
                  value={invalidationReasonInput}
                  onChange={(e) => setInvalidationReasonInput(e.target.value)}
                  placeholder="Ej. El escaneo omitió la página 3 de cláusulas financieras; requiero subir el PDF completo corregido."
                  className="w-full bg-white border border-[#CAD8C8] rounded-xl p-2.5"
                ></textarea>
              </div>

              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 text-[11px]">
                ℹ️ Esta solicitud notificará inmediatamente al <strong>Administrador</strong> en su panel. Una vez autorizada e invalidada por él, se habilitará nuevamente el botón para cargar el archivo correcto.
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setInvalidationContract(null)}
                  className="px-4 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-rose-700 hover:bg-rose-800 text-white font-bold transition-colors flex items-center gap-1.5 shadow-2xs"
                >
                  <FileX2 className="w-4 h-4" />
                  <span>Enviar Solicitud al Administrador</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
