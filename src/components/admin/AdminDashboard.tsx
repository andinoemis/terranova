import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Property, 
  User, 
  LeaseContract, 
  SystemLog, 
  RolePermissions, 
  UserRole, 
  PaymentTransaction, 
  Employee, 
  PayrollRecord,
  ContractTemplate,
  ContractTransactionType
} from '../../types';
import { PropertyImageUploader } from '../common/PropertyImageUploader';
import { WorkCalendarView } from '../calendar/WorkCalendarView';
import { MessagesInbox } from '../messages/MessagesInbox';
import { PrintFormatsView } from '../print/PrintFormatsView';
import { 
  ShieldCheck, 
  Users, 
  Building2, 
  FileText, 
  CreditCard, 
  Settings, 
  Activity, 
  Plus, 
  Trash2, 
  Edit3, 
  CheckCircle, 
  AlertTriangle, 
  Printer, 
  Search,
  DollarSign,
  TrendingUp,
  Percent,
  X,
  Calendar,
  MessageSquare,
  Wrench,
  Lock,
  Unlock,
  KeyRound,
  Check,
  CheckCircle2,
  XCircle,
  Clock,
  Mail,
  Server,
  RefreshCw,
  PauseCircle,
  PlayCircle,
  ArrowRight,
  Filter,
  Coins,
  Briefcase,
  FileCheck2,
  UploadCloud,
  FileX2,
  ShieldAlert,
  Upload,
  Eye,
  Download,
  Database,
  BookOpen,
  HelpCircle
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { 
    currentUser, 
    properties, 
    users, 
    contracts, 
    contractTemplates,
    addContractTemplate,
    deleteContractTemplate,
    cancelContract,
    signContractDigitally,
    payments, 
    maintenance, 
    logs, 
    permissions,
    companySettings,
    employees,
    payrollRecords,
    addEmployee,
    updateEmployee,
    createPayrollRecord,
    processPayrollPayment,
    uploadSignedContractDocument,
    requestContractInvalidation,
    invalidateContractDocument,
    updateCompanySettings,
    updateSmtpConfig,
    testSmtpConnection,
    changeUserRole,
    generatePropertyCode,
    addProperty,
    updateProperty,
    deleteProperty,
    suspendProperty,
    reactivateProperty,
    confirmPayment,
    rejectPayment,
    formatMoney,
    updateRolePermission,
    toggleUserStatus,
    createMaintenanceRequest,
    createContract,
    openPrintModal,
    showToast,
    setIsManualOpen,
    startTour
  } = useApp();

  const [adminTab, setAdminTab] = useState<'overview' | 'properties' | 'contracts' | 'contract_templates' | 'payments' | 'users' | 'permissions' | 'calendar' | 'messages' | 'print_formats' | 'audit' | 'settings' | 'payroll'>('overview');
  const [navDisplayMode, setNavDisplayMode] = useState<'horizontal' | 'icons' | 'lateral'>(() => {
    return (localStorage.getItem('terranova_admin_nav_mode') as any) || 'horizontal';
  });
  const [cancelModalContract, setCancelModalContract] = useState<LeaseContract | null>(null);
  const [cancellationReasonInput, setCancellationReasonInput] = useState('Cancelación por mutuo acuerdo entre partes');

  // Plantillas de Contratos
  const [showAddTemplateModal, setShowAddTemplateModal] = useState(false);
  const [templateName, setTemplateName] = useState('');
  const [templateType, setTemplateType] = useState<ContractTransactionType>('Arrendamiento');
  const [templateFormat, setTemplateFormat] = useState<'docx' | 'pdf'>('docx');
  const [templateFileName, setTemplateFileName] = useState('');
  const [templateDescription, setTemplateDescription] = useState('');
  const [templateClausesText, setTemplateClausesText] = useState('');
  const [selectedTemplateId, setSelectedTemplateId] = useState('');
  const [previewTemplate, setPreviewTemplate] = useState<ContractTemplate | null>(null);
  const [paymentFilter, setPaymentFilter] = useState<'all' | 'En Proceso' | 'Completado' | 'Rechazado'>('all');
  const [rejectModalPayment, setRejectModalPayment] = useState<PaymentTransaction | null>(null);
  const [rejectReasonInput, setRejectReasonInput] = useState('');

  // Search filter inside admin tables
  const [filterQuery, setFilterQuery] = useState('');

  // SMTP Configuration State
  const [smtpHost, setSmtpHost] = useState(companySettings.smtpConfig?.host || 'smtp.terranova.hn');
  const [smtpPort, setSmtpPort] = useState(companySettings.smtpConfig?.port || 587);
  const [smtpSecure, setSmtpSecure] = useState(companySettings.smtpConfig?.secure || false);
  const [smtpUser, setSmtpUser] = useState(companySettings.smtpConfig?.username || 'servidor@terranova.hn');
  const [smtpPass, setSmtpPass] = useState(companySettings.smtpConfig?.password || '••••••••••••');
  const [smtpFromEmail, setSmtpFromEmail] = useState(companySettings.smtpConfig?.fromEmail || 'notificaciones@terranova.hn');
  const [smtpFromName, setSmtpFromName] = useState(companySettings.smtpConfig?.fromName || 'Terranova Inmobiliaria');
  const [isTestingSmtp, setIsTestingSmtp] = useState(false);
  const [smtpTestResult, setSmtpTestResult] = useState<{ success: boolean; message: string } | null>(null);

  // New Contract Generator Modal State with tenant ID, phone, manager info and bank account
  const [showContractModal, setShowContractModal] = useState(false);
  const [contractPropId, setContractPropId] = useState(properties[0]?.id || '');
  const [contractTenantEmail, setContractTenantEmail] = useState('andinoemis@gmail.com');
  const [contractTenantName, setContractTenantName] = useState('Emis Alejandra Torres');
  const [contractTenantNationalId, setContractTenantNationalId] = useState('0801-1996-04812');
  const [contractTenantPhone, setContractTenantPhone] = useState('+504 9623-4567');
  const [contractManagerName, setContractManagerName] = useState('Lic. Kenneth Adonay Zúniga');
  const [contractManagerEmail, setContractManagerEmail] = useState('kenneth.zuniga@unah.hn');
  const [contractManagerPhone, setContractManagerPhone] = useState('+504 9876-5432');
  const [contractReceivingAccount, setContractReceivingAccount] = useState('2000-1122-3344-99');
  const [contractStartDate, setContractStartDate] = useState('2024-11-01');
  const [contractEndDate, setContractEndDate] = useState('2025-11-01');
  const [contractRent, setContractRent] = useState(1250);
  const [contractDeposit, setContractDeposit] = useState(1250);

  // Enhanced Contract Generator State (Arrendamiento, Venta, Venta a Plazos con Prima y Plazo)
  const [contractType, setContractType] = useState<'Arrendamiento' | 'Venta' | 'Venta a Plazos'>('Arrendamiento');
  const [contractTotalValue, setContractTotalValue] = useState(1250);
  const [contractDownPayment, setContractDownPayment] = useState(250);
  const [contractYears, setContractYears] = useState(5);
  const [contractTotalCommPercent, setContractTotalCommPercent] = useState(20);
  const [contractAgentCommPercent, setContractAgentCommPercent] = useState(2);
  const [contractAgencyCommPercent, setContractAgencyCommPercent] = useState(18);
  const [contractSignatureMode, setContractSignatureMode] = useState<'digital' | 'fisica_presencial'>('digital');
  const [contractAgentAssigned, setContractAgentAssigned] = useState('Anthony Rafael Alfaro');

  // Employee Management Modal State
  const [showAddEmpModal, setShowAddEmpModal] = useState(false);
  const [newEmpName, setNewEmpName] = useState('');
  const [newEmpEmail, setNewEmpEmail] = useState('');
  const [newEmpPhone, setNewEmpPhone] = useState('+504 ');
  const [newEmpDni, setNewEmpDni] = useState('');
  const [newEmpPosition, setNewEmpPosition] = useState<Employee['position']>('Agente Inmobiliario Junior');
  const [newEmpBaseSalary, setNewEmpBaseSalary] = useState(900);
  const [newEmpBank, setNewEmpBank] = useState('Banco Atlántida');
  const [newEmpAccount, setNewEmpAccount] = useState('');
  const [newEmpCommPercent, setNewEmpCommPercent] = useState(2);

  // Contract Invalidation Modal for Admin
  const [invalidationModalContract, setInvalidationModalContract] = useState<LeaseContract | null>(null);
  const [invalidationNotes, setInvalidationNotes] = useState('');

  // Admin New Property Registration Modal (RF: Código generado automáticamente)
  const [showAddPropAdminModal, setShowAddPropAdminModal] = useState(false);
  const [adminPropType, setAdminPropType] = useState<Property['propertyType']>('Casa');
  const [adminPropTitle, setAdminPropTitle] = useState('');
  const [adminPropAddress, setAdminPropAddress] = useState('');
  const [adminPropCity, setAdminPropCity] = useState('Tegucigalpa, M.D.C.');
  const [adminPropTxn, setAdminPropTxn] = useState<Property['transactionType']>('Alquiler');
  const [adminPropPrice, setAdminPropPrice] = useState(1200);
  const [adminPropSize, setAdminPropSize] = useState(200);
  const [adminPropBeds, setAdminPropBeds] = useState(3);
  const [adminPropBaths, setAdminPropBaths] = useState(2.5);
  const [adminPropParks, setAdminPropParks] = useState(2);
  const [adminPropDesc, setAdminPropDesc] = useState('');
  const [adminPropImages, setAdminPropImages] = useState<string[]>([
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=900&auto=format&fit=crop&q=80'
  ]);

  // Admin Maintenance Scheduling Modal State
  const [showMntModalAdmin, setShowMntModalAdmin] = useState(false);
  const [mntPropId, setMntPropId] = useState(properties[0]?.id || '');
  const [mntType, setMntType] = useState<'Preventivo' | 'Correctivo' | 'Emergencia'>('Preventivo');
  const [mntPriority, setMntPriority] = useState<'Baja' | 'Media' | 'Alta'>('Media');
  const [mntContractor, setMntContractor] = useState('Carlos Murillo (Servicios Pro)');
  const [mntEstimatedCost, setMntEstimatedCost] = useState(180);
  const [mntDesc, setMntDesc] = useState('');

  // Financial Calculations
  const pendingPayments = payments.filter(p => p.status === 'En Proceso' || p.status === 'Pendiente');
  const pendingPaymentsCount = pendingPayments.length;
  const pendingPaymentsSum = pendingPayments.reduce((sum, p) => sum + p.amount, 0);

  const totalGrossIncome = payments
    .filter(p => p.status === 'Completado')
    .reduce((sum, p) => sum + p.amount, 0);

  const totalMaintenanceExpenses = maintenance
    .filter(m => m.status === 'Reparado')
    .reduce((sum, m) => sum + (m.actualCost || 0), 0);

  const netOperatingIncome = totalGrossIncome - totalMaintenanceExpenses;
  const occupiedProperties = properties.filter(p => p.status === 'Alquilada').length;
  const globalOccupancyRate = properties.length > 0 ? Math.round((occupiedProperties / properties.length) * 100) : 0;

  const handleAddPropAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminPropTitle.trim() || !adminPropAddress.trim()) return;

    const autoCode = generatePropertyCode(adminPropType);

    addProperty({
      code: autoCode,
      title: adminPropTitle.trim(),
      address: adminPropAddress.trim(),
      city: adminPropCity.trim(),
      neighborhood: 'Sector Residencial Tegucigalpa',
      size: Number(adminPropSize),
      propertyType: adminPropType,
      transactionType: adminPropTxn,
      price: Number(adminPropPrice),
      currency: 'USD',
      status: 'Disponible',
      bedrooms: Number(adminPropBeds),
      bathrooms: Number(adminPropBaths),
      parkingSpots: Number(adminPropParks),
      description: adminPropDesc.trim() || 'Inmueble residencial verificado por la administración de Terranova.',
      features: ['Circuito Cerrado', 'Vigilancia 24 Horas', 'Documentación Legal al Día'],
      images: adminPropImages.length > 0 ? adminPropImages : ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=900&auto=format&fit=crop&q=80'],
      ownerId: currentUser.id,
      ownerName: currentUser.name,
      assignedAgentId: 'usr-2',
      assignedAgentName: 'Anthony Rafael Alfaro',
      yearBuilt: 2024
    });

    setShowAddPropAdminModal(false);
    setAdminPropTitle('');
    setAdminPropAddress('');
    setAdminPropDesc('');
  };

  const handleGenerateContract = (e: React.FormEvent) => {
    e.preventDefault();
    const prop = properties.find(p => p.id === contractPropId);
    if (!prop) return;

    const bnk = companySettings.bankAccounts.find(b => b.accountNumber === contractReceivingAccount) || companySettings.bankAccounts[0];
    const matchingTenant = users.find(u => 
      u.email.toLowerCase() === contractTenantEmail.trim().toLowerCase() ||
      u.name.toLowerCase() === contractTenantName.trim().toLowerCase()
    );
    const resolvedTenantId = matchingTenant ? matchingTenant.id : `usr-inq-${Date.now()}`;

    const isSale = contractType === 'Venta' || contractType === 'Venta a Plazos';
    const isPlazos = contractType === 'Venta a Plazos';
    const installmentsCount = isPlazos ? contractYears * 12 : undefined;
    const balanceToFinance = isPlazos ? Math.max(0, contractTotalValue - contractDownPayment) : 0;
    const monthlyInstallment = isPlazos && installmentsCount ? Math.round(balanceToFinance / installmentsCount) : undefined;
    const isSignedDigitally = contractSignatureMode === 'digital';

    const totalCommAmount = isSale ? Math.round(contractTotalValue * (contractTotalCommPercent / 100)) : undefined;
    const agentCommAmount = isSale ? Math.round(contractTotalValue * (contractAgentCommPercent / 100)) : undefined;
    const agencyCommAmount = isSale ? Math.round(contractTotalValue * (contractAgencyCommPercent / 100)) : undefined;

    createContract({
      propertyId: prop.id,
      propertyTitle: prop.title,
      propertyCode: prop.code,
      contractType,
      totalValue: isSale ? contractTotalValue : undefined,
      downPayment: isPlazos ? contractDownPayment : undefined,
      financingYears: isPlazos ? contractYears : undefined,
      installmentsCount,
      monthlyInstallment,
      totalCommissionRate: isSale ? contractTotalCommPercent : undefined,
      agentCommissionRate: isSale ? contractAgentCommPercent : undefined,
      agencyCommissionRate: isSale ? contractAgencyCommPercent : undefined,
      ownerNetRate: isSale ? (100 - contractTotalCommPercent) : undefined,
      totalCommissionAmount: totalCommAmount,
      agentCommissionAmount: agentCommAmount,
      agencyCommissionAmount: agencyCommAmount,
      ownerNetAmount: isSale ? Math.round(contractTotalValue * ((100 - contractTotalCommPercent) / 100)) : undefined,
      commissionPayoutMode: isSale ? (contractType === 'Venta' ? 'directa_total' : 'plazos_proporcional') : undefined,
      agentCommissionPaid: isSale ? (contractType === 'Venta' ? agentCommAmount : Math.round(contractDownPayment * (contractAgentCommPercent / 100))) : undefined,
      ownerNetPaid: isSale ? (contractType === 'Venta' ? Math.round(contractTotalValue * ((100 - contractTotalCommPercent) / 100)) : Math.round(contractDownPayment * ((100 - contractTotalCommPercent) / 100))) : undefined,
      signatureMode: contractSignatureMode,
      documentStatus: isSignedDigitally ? 'Firmado_Digital' : 'Pendiente_Subida',
      tenantId: resolvedTenantId,
      tenantName: contractTenantName,
      tenantEmail: contractTenantEmail,
      tenantPhone: contractTenantPhone,
      tenantNationalId: contractTenantNationalId,
      managerName: contractManagerName,
      managerEmail: contractManagerEmail,
      managerPhone: contractManagerPhone,
      receivingBankAccount: bnk ? bnk.accountNumber : contractReceivingAccount,
      receivingBankName: bnk ? bnk.bankName : 'Banco Ficohsa Honduras',
      paymentMethodUsed: 'Transferencia Bancaria',
      ownerId: prop.ownerId,
      ownerName: prop.ownerName,
      startDate: contractStartDate,
      endDate: contractEndDate,
      monthlyRent: isPlazos ? (monthlyInstallment || 0) : (isSale ? contractTotalValue : Number(contractRent)),
      depositAmount: contractType === 'Arrendamiento' ? Number(contractDeposit) : 0,
      currency: prop.currency,
      status: 'Vigente',
      agentName: contractAgentAssigned || currentUser.name,
      isSignedDigitally,
      signedDate: isSignedDigitally ? new Date().toISOString().split('T')[0] : undefined,
      clauses: isSale ? [
        'PRIMERA: Objeto. El vendedor transfiere la propiedad del inmueble libre de gravámenes.',
        `SEGUNDA: Precio convenido en $${contractTotalValue.toLocaleString()} USD.${isPlazos ? ` Prima inicial de $${contractDownPayment.toLocaleString()} USD y financiamiento a ${contractYears} años (${installmentsCount} cuotas de $${monthlyInstallment?.toLocaleString()} USD/mes).` : ''}`,
        `TERCERA: Comisión pactada del ${contractTotalCommPercent}% ($${totalCommAmount?.toLocaleString()} USD) distribuida en ${contractAgentCommPercent}% para el asesor comercial y ${contractAgencyCommPercent}% para Terranova Inversiones.`,
        'CUARTA: Gastos registrales e impuestos de tradición conforme a ley.',
        'QUINTA: Validez legal condicionada a la suscripción con firmas autógrafas o digitales verificadas.'
      ] : [
        'PRIMERA: Objeto del contrato. El Arrendador cede el uso temporal del inmueble.',
        'SEGUNDA: Canon de arrendamiento pactado pagadero los primeros 5 días de cada mes.',
        'TERCERA: Servicios públicos y mantenimiento residencial a cargo del inquilino.',
        'CUARTA: Prohibición expresa de subarrendar sin autorización escrita.',
        'QUINTA: Depósito en garantía restituible tras finiquito de entrega física.'
      ]
    });

    setShowContractModal(false);
  };

  const handleCreateEmployeeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmpName.trim() || !newEmpDni.trim()) return;

    addEmployee({
      name: newEmpName.trim(),
      email: newEmpEmail.trim(),
      phone: newEmpPhone.trim(),
      nationalId: newEmpDni.trim(),
      position: newEmpPosition,
      baseSalary: Number(newEmpBaseSalary),
      bankName: newEmpBank,
      bankAccountNumber: newEmpAccount.trim(),
      status: 'Activo',
      startDate: new Date().toISOString().split('T')[0],
      defaultCommissionPercent: Number(newEmpCommPercent)
    });

    setShowAddEmpModal(false);
    setNewEmpName('');
    setNewEmpEmail('');
    setNewEmpDni('');
    setNewEmpAccount('');
  };

  const handleAdminAddProperty = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminPropTitle || !adminPropAddress) return;

    const autoCode = generatePropertyCode(adminPropType);
    addProperty({
      code: autoCode,
      title: adminPropTitle,
      address: adminPropAddress,
      city: adminPropCity,
      neighborhood: 'Zona Metropolitana',
      size: Number(adminPropSize),
      propertyType: adminPropType,
      transactionType: adminPropTxn,
      price: Number(adminPropPrice),
      currency: 'USD',
      status: 'Disponible',
      bedrooms: Number(adminPropBeds),
      bathrooms: Number(adminPropBaths),
      parkingSpots: Number(adminPropParks),
      description: adminPropDesc || 'Propiedad registrada en el sistema de gestión Terranova.',
      features: ['Seguridad Privada', 'Excelente Ubicación', 'Documentación Legal al Día'],
      images: adminPropImages.length > 0 ? adminPropImages : ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=900&auto=format&fit=crop&q=80'],
      ownerId: currentUser.id,
      ownerName: currentUser.name,
      assignedAgentId: 'usr-2',
      assignedAgentName: 'Anthony Rafael Alfaro',
      yearBuilt: new Date().getFullYear()
    });

    setShowAddPropAdminModal(false);
    setAdminPropTitle('');
    setAdminPropAddress('');
    setAdminPropDesc('');
    showToast(`Propiedad registrada con código automático: ${autoCode}`);
  };

  const handleAdminMaintenanceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const targetId = mntPropId || properties[0]?.id;
    const prop = properties.find(p => p.id === targetId);
    if (!prop || !mntDesc.trim()) return;

    createMaintenanceRequest({
      propertyId: prop.id,
      propertyTitle: prop.title,
      propertyAddress: prop.address,
      requestedBy: currentUser.name,
      requesterRole: 'admin',
      type: mntType,
      priority: mntPriority,
      description: mntDesc.trim(),
      contractorName: mntContractor,
      estimatedCost: Number(mntEstimatedCost)
    });

    setShowMntModalAdmin(false);
    setMntDesc('');
    showToast(`Mantenimiento programado para ${prop.code} y asignado a ${mntContractor}`);
  };

  return (
    <div className="space-y-8">
      {/* Banner */}
      <div className="bg-[#263E32] rounded-3xl p-6 sm:p-8 text-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-md">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-[#3D5E4E] text-[#BDE2C8] text-xs font-bold uppercase tracking-wider">
              Control General del Sistema
            </span>
            <span className="text-white/60 text-xs">Administrador: {currentUser.name}</span>
          </div>
          <h1 className="font-serif-brand text-2xl sm:text-3xl font-bold">
            Panel de Control Administrativo & Auditoría
          </h1>
          <p className="text-xs sm:text-sm text-white/80 mt-1">
            Supervisión integral de inventario, contratos de arrendamiento, conciliación financiera, permisos y usuarios.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0 flex-wrap">
          <button
            onClick={() => setShowContractModal(true)}
            className="px-4 py-2.5 rounded-xl bg-[#C36449] hover:bg-[#B0573E] text-white font-semibold text-xs sm:text-sm flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Generar Contrato</span>
          </button>
          <button
            onClick={() => setShowMntModalAdmin(true)}
            className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs sm:text-sm flex items-center gap-1.5 transition-colors border border-white/20"
          >
            <Wrench className="w-4 h-4 text-[#A3C7AD]" />
            <span>Programar Mantenimiento</span>
          </button>
          <button
            onClick={() => openPrintModal({
              type: 'financial_report',
              data: {
                totalGrossIncome,
                totalMaintenanceExpenses,
                netOperatingIncome,
                occupiedProperties,
                totalProperties: properties.length,
                globalOccupancyRate,
                date: new Date().toLocaleDateString()
              }
            })}
            className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs sm:text-sm flex items-center gap-1.5 transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>Reporte Ejecutivo</span>
          </button>
        </div>
      </div>

      {/* Selector de Modo de Navegación (Horizontal, Solo Iconos con Tooltip, o Lateral) */}
      <div className="flex items-center justify-between pb-1 flex-wrap gap-2 text-xs">
        <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
          <span>Modo de Navegación del Panel:</span>
        </span>
        <div className="inline-flex bg-[#EEF4EF] p-1 rounded-2xl border border-[#D5E1D4] shadow-2xs">
          <button
            type="button"
            onClick={() => { setNavDisplayMode('horizontal'); localStorage.setItem('terranova_admin_nav_mode', 'horizontal'); }}
            className={`px-3 py-1.5 rounded-xl font-semibold text-xs transition-all flex items-center gap-1.5 ${
              navDisplayMode === 'horizontal' ? 'bg-white text-[#1E3328] shadow-2xs font-bold' : 'text-gray-600 hover:text-gray-900'
            }`}
            title="Pestañas horizontales completas con nombre y métricas"
          >
            <span>↔️ Horizontal</span>
          </button>
          <button
            type="button"
            onClick={() => { setNavDisplayMode('icons'); localStorage.setItem('terranova_admin_nav_mode', 'icons'); }}
            className={`px-3 py-1.5 rounded-xl font-semibold text-xs transition-all flex items-center gap-1.5 ${
              navDisplayMode === 'icons' ? 'bg-white text-[#1E3328] shadow-2xs font-bold' : 'text-gray-600 hover:text-gray-900'
            }`}
            title="Mostrar solo iconos: al pasar el cursor aparece el nombre de la pestaña"
          >
            <span>🔘 Solo Iconos (Tooltip)</span>
          </button>
          <button
            type="button"
            onClick={() => { setNavDisplayMode('lateral'); localStorage.setItem('terranova_admin_nav_mode', 'lateral'); }}
            className={`px-3 py-1.5 rounded-xl font-semibold text-xs transition-all flex items-center gap-1.5 ${
              navDisplayMode === 'lateral' ? 'bg-white text-[#1E3328] shadow-2xs font-bold' : 'text-gray-600 hover:text-gray-900'
            }`}
            title="Mostrar navegación como barra lateral (sidebar)"
          >
            <span>◨ Barra Lateral</span>
          </button>
        </div>
      </div>

      {/* Admin Tabs Container (Selector: div#root > div > main > div > div:nth-of-type(2)) */}
      <div className={`transition-all ${
        navDisplayMode === 'icons'
          ? 'flex border-b border-[#D5E1D4] gap-2 overflow-x-auto pb-2 text-xs bg-[#FAFBF9] p-2 rounded-2xl border items-center'
          : navDisplayMode === 'lateral'
            ? 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 bg-[#FAFBF9] p-3 rounded-3xl border border-[#D5E1D4] shadow-2xs'
            : 'flex border-b border-[#D5E1D4] gap-2 overflow-x-auto pb-1 text-xs sm:text-sm'
      }`}>
        {[
          { id: 'overview', label: 'Resumen Ejecutivo & KPIs', icon: TrendingUp },
          { id: 'properties', label: `Inventario Inmobiliario (${properties.length})`, icon: Building2 },
          { id: 'contracts', label: `Contratos (${contracts.length})`, icon: FileText },
          { id: 'contract_templates', label: `Plantillas de Contratos (${contractTemplates.length})`, icon: FileCheck2 },
          { id: 'payroll', label: `Nómina & Comisiones (${employees.length})`, icon: Coins, badge: `${payrollRecords.length} Liquidaciones` },
          { 
            id: 'payments', 
            label: `Validación de Pagos`, 
            icon: CreditCard,
            badge: pendingPaymentsCount > 0 ? `${pendingPaymentsCount} En Proceso` : `${payments.length}`
          },
          { id: 'users', label: `Usuarios & Cuentas (${users.length})`, icon: Users },
          { id: 'permissions', label: 'Matriz de Permisos (RBAC)', icon: ShieldCheck },
          { id: 'calendar', label: 'Calendario & Citas', icon: Calendar },
          { id: 'messages', label: 'Mensajes & Respuestas', icon: MessageSquare },
          { id: 'print_formats', label: 'Formatos de Impresión', icon: Printer },
          { id: 'audit', label: `Auditoría Logs (${logs.length})`, icon: Activity },
          { id: 'settings', label: 'Políticas & Tarifas', icon: Settings }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = adminTab === tab.id;

          // Modo 1: Solo Iconos con Tooltip en hover
          if (navDisplayMode === 'icons') {
            return (
              <div key={tab.id} className="relative group shrink-0">
                <button
                  type="button"
                  onClick={() => setAdminTab(tab.id as any)}
                  title={tab.label}
                  className={`p-3 rounded-xl transition-all relative flex items-center justify-center ${
                    isActive
                      ? 'bg-[#2D4539] text-white shadow-xs scale-105'
                      : 'bg-white border border-[#D5E1D4] text-gray-600 hover:text-[#1E3428] hover:bg-[#EEF5ED]'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {tab.badge && (
                    <span className={`absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full ${
                      tab.id === 'payments' && pendingPaymentsCount > 0 ? 'bg-amber-500 animate-pulse' : 'bg-emerald-600'
                    }`} />
                  )}
                </button>

                {/* Tooltip visible al pasar el cursor (hover) */}
                <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 hidden group-hover:flex flex-col items-center z-50 pointer-events-none animate-in fade-in zoom-in-95 duration-150">
                  <div className="bg-[#1E3328] text-white text-[11px] font-bold px-3 py-1.5 rounded-xl shadow-xl whitespace-nowrap border border-white/10">
                    {tab.label}
                  </div>
                  <div className="w-2 h-1 bg-[#1E3328] [clip-path:polygon(0_0,100%_0,50%_100%)]"></div>
                </div>
              </div>
            );
          }

          // Modo 2: Barra Lateral / Rejilla
          if (navDisplayMode === 'lateral') {
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setAdminTab(tab.id as any)}
                title={tab.label}
                className={`p-3 rounded-2xl font-semibold text-xs transition-all flex flex-col justify-between gap-2 text-left border ${
                  isActive
                    ? 'bg-[#2D4539] text-white border-[#2D4539] shadow-xs'
                    : 'bg-white border-[#D5E1D4] text-gray-700 hover:bg-[#EEF5ED]'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#A3C7AD]' : 'text-gray-500'}`} />
                  {tab.badge && (
                    <span className={`px-1.5 py-0.5 text-[9px] font-bold rounded-full ${
                      isActive ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {tab.badge}
                    </span>
                  )}
                </div>
                <span className="font-bold text-[11px] line-clamp-1">{tab.label}</span>
              </button>
            );
          }

          // Modo 3: Horizontal Estándar
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setAdminTab(tab.id as any)}
              title={tab.label}
              className={`px-4 py-2 font-semibold rounded-t-xl transition-all flex items-center gap-2 whitespace-nowrap ${
                isActive
                  ? 'border-b-2 border-[#2D4539] text-[#1E3428] bg-white shadow-2xs'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.badge && (
                <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                  tab.id === 'payments' && pendingPaymentsCount > 0 
                    ? 'bg-amber-100 text-amber-900 border border-amber-300 animate-pulse' 
                    : 'bg-gray-100 text-gray-700'
                }`}>
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* TAB: OVERVIEW */}
      {adminTab === 'overview' && (
        <div className="space-y-6">
          {/* Top KPI row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-[#D5E1D4] shadow-2xs">
              <span className="text-xs text-gray-500 font-medium block">Ingresos Recaudados</span>
              <div className="flex items-baseline justify-between mt-2">
                <span className="text-2xl font-bold font-mono text-[#1E3328]">${totalGrossIncome.toLocaleString()}</span>
                <span className="text-xs text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md font-bold">USD</span>
              </div>
              <span className="text-[11px] text-gray-400 mt-1 block">Rentas y comisiones procesadas</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-[#D5E1D4] shadow-2xs">
              <span className="text-xs text-gray-500 font-medium block">Gastos por Mantenimiento</span>
              <div className="flex items-baseline justify-between mt-2">
                <span className="text-2xl font-bold font-mono text-rose-700">${totalMaintenanceExpenses.toLocaleString()}</span>
                <span className="text-xs text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md font-bold">USD</span>
              </div>
              <span className="text-[11px] text-gray-400 mt-1 block">Costos de reparaciones completadas</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-[#D5E1D4] shadow-2xs">
              <span className="text-xs text-gray-500 font-medium block">Utilidad Neta Operativa</span>
              <div className="flex items-baseline justify-between mt-2">
                <span className="text-2xl font-bold font-mono text-emerald-700">${netOperatingIncome.toLocaleString()}</span>
                <span className="text-xs text-emerald-600 font-bold">+92% Margen</span>
              </div>
              <span className="text-[11px] text-gray-400 mt-1 block">Flujo de caja positivo neto</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-[#D5E1D4] shadow-2xs">
              <span className="text-xs text-gray-500 font-medium block">Tasa de Ocupación Global</span>
              <div className="flex items-baseline justify-between mt-2">
                <span className="text-2xl font-bold font-mono text-[#1E3328]">{globalOccupancyRate}%</span>
                <span className="text-xs text-gray-500">{occupiedProperties} de {properties.length}</span>
              </div>
              <span className="text-[11px] text-gray-400 mt-1 block">Inmuebles en arrendamiento activo</span>
            </div>
          </div>

          {/* Quick stats and recent events */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Contratos Recientes */}
            <div className="bg-white p-6 rounded-3xl border border-[#D5E1D4] shadow-2xs space-y-4 text-xs">
              <div className="flex justify-between items-center">
                <h3 className="font-serif-brand text-lg font-bold text-gray-900">Contratos de Arrendamiento Activos</h3>
                <span className="text-[#2D4539] font-bold">{contracts.length} Vigentes</span>
              </div>

              <div className="divide-y divide-gray-100">
                {contracts.map(c => (
                  <div key={c.id} className="py-3 flex justify-between items-center">
                    <div>
                      <p className="font-bold text-gray-800">{c.contractNumber} · {c.propertyCode}</p>
                      <p className="text-[11px] text-gray-500">Inquilino: {c.tenantName} · Propietario: {c.ownerName}</p>
                    </div>
                    <div className="text-right">
                      <span className="font-mono font-bold text-gray-900 block">${c.monthlyRent} USD</span>
                      <button
                        onClick={() => openPrintModal({ type: 'contract', data: c })}
                        className="text-[11px] text-[#2D4539] hover:underline"
                      >
                        Ver Documento
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Conciliación y Validación de Pagos Recientes */}
            <div className="bg-white p-6 rounded-3xl border border-[#D5E1D4] shadow-2xs space-y-4 text-xs">
              <div className="flex flex-wrap justify-between items-center gap-2">
                <div>
                  <h3 className="font-serif-brand text-lg font-bold text-gray-900">Últimos Pagos Registrados</h3>
                  <p className="text-[11px] text-gray-500">
                    {pendingPaymentsCount > 0 
                      ? `⚠️ ${pendingPaymentsCount} transacciones en proceso de validación bancaria externa` 
                      : 'Todas las transacciones conciliadas'}
                  </p>
                </div>
                <button
                  onClick={() => setAdminTab('payments')}
                  className="px-3 py-1.5 rounded-xl bg-[#2D4539] hover:bg-[#20342A] text-white font-semibold text-xs flex items-center gap-1 transition-colors"
                >
                  <span>Validar Pagos ({pendingPaymentsCount})</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="divide-y divide-gray-100">
                {payments.slice(0, 5).map(p => (
                  <div key={p.id} className="py-3 flex flex-wrap justify-between items-center gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-gray-900">{p.receiptNumber}</span>
                        {p.status === 'En Proceso' ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300 flex items-center gap-1 animate-pulse">
                            <Clock className="w-3 h-3 text-amber-600" /> EN PROCESO
                          </span>
                        ) : p.status === 'Completado' ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                            <Check className="w-3 h-3 text-emerald-600" /> ACREDITADO
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-300">
                            {p.status}
                          </span>
                        )}
                      </div>
                      <p className="font-medium text-gray-800 mt-0.5">{p.payerName} · <span className="text-gray-500">{p.propertyTitle}</span></p>
                      <p className="text-[10px] text-gray-400 font-mono">Ref: {p.referenceCode} · {p.date} · {p.paymentMethod}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="text-right">
                        <span className="font-mono font-bold text-emerald-800 text-sm block">
                          ${p.amount.toLocaleString()} {p.currency}
                        </span>
                        <span className="text-[10px] text-gray-500 font-mono">
                          {formatMoney(p.amount, 'HNL')}
                        </span>
                      </div>

                      {p.status === 'En Proceso' && (
                        <button
                          onClick={() => confirmPayment(p.id)}
                          className="px-2.5 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-[11px] flex items-center gap-1 transition-colors shadow-2xs"
                          title="Confirmar y acreditar pago en tesorería"
                        >
                          <Check className="w-3 h-3" />
                          <span>Confirmar</span>
                        </button>
                      )}

                      <button
                        onClick={() => openPrintModal({ type: 'receipt', data: p })}
                        className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-600 border border-gray-200"
                        title="Ver / Imprimir Comprobante"
                      >
                        <Printer className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB: PROPERTIES MANAGEMENT */}
      {adminTab === 'properties' && (
        <div className="bg-white rounded-3xl border border-[#D5E1D4] p-6 shadow-2xs space-y-4 text-xs">
          <div className="flex flex-wrap justify-between items-center gap-3">
            <div>
              <h3 className="font-serif-brand text-xl font-bold text-gray-900">Control de Inventario de Propiedades</h3>
              <p className="text-gray-500">Administra disponibilidad, códigos automáticos y asignación de agentes</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowAddPropAdminModal(true)}
                className="px-3.5 py-2 rounded-xl bg-[#2D4539] hover:bg-[#20342A] text-white font-semibold text-xs flex items-center gap-1.5 transition-colors shadow-2xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Registrar Inmueble</span>
              </button>
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Filtrar por código o nombre..."
                  value={filterQuery}
                  onChange={(e) => setFilterQuery(e.target.value)}
                  className="pl-9 pr-3 py-2 bg-[#FAFBF9] border border-[#CBD8CA] rounded-xl text-xs"
                />
              </div>
            </div>
          </div>

          {/* Regla de integridad y concordancia con el inquilino */}
          <div className="p-4 bg-[#EEF5ED] rounded-2xl border border-[#CCE0CD] text-xs flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-[#2D4539] shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold text-gray-900 block text-xs">
                Regla de Concordancia e Integridad Inmobiliaria:
              </span>
              <p className="text-gray-700 leading-relaxed">
                Las propiedades <strong>no pueden eliminarse físicamente del sistema</strong> para salvaguardar la concordancia legal con el contrato e historial del inquilino.
                Si el inquilino concluye su arriendo, el inmueble vuelve a colocarse en el catálogo como <strong>Disponible</strong>; y si el propietario ya no lo va a alquilar, debe <strong>suspenderse</strong> (quedando fuera de catálogo pero con su historial y depósitos resguardados).
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200 text-gray-500 font-semibold bg-[#FAFBF9]">
                  <th className="p-3">Código</th>
                  <th className="p-3">Propiedad</th>
                  <th className="p-3">Tipo</th>
                  <th className="p-3">Operación</th>
                  <th className="p-3">Precio</th>
                  <th className="p-3">Estado</th>
                  <th className="p-3">Propietario</th>
                  <th className="p-3 text-right">Acciones de Gestión</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {properties
                  .filter(p => p.title.toLowerCase().includes(filterQuery.toLowerCase()) || p.code.toLowerCase().includes(filterQuery.toLowerCase()))
                  .map(prop => (
                    <tr key={prop.id} className={`hover:bg-gray-50/80 transition-colors ${prop.status === 'Suspendida' ? 'bg-amber-50/30 opacity-85' : ''}`}>
                      <td className="p-3 font-mono font-bold text-gray-900">
                        <span className="flex items-center gap-1.5">
                          {prop.code}
                          {prop.status === 'Suspendida' && (
                            <span className="w-2 h-2 rounded-full bg-amber-500" title="Suspendida fuera de catálogo" />
                          )}
                        </span>
                      </td>
                      <td className="p-3 font-semibold text-gray-800">{prop.title}</td>
                      <td className="p-3 text-gray-600">{prop.propertyType}</td>
                      <td className="p-3 text-gray-600">{prop.transactionType}</td>
                      <td className="p-3 font-mono font-bold text-gray-900">${prop.price.toLocaleString()}</td>
                      <td className="p-3">
                        <select
                          value={prop.status}
                          onChange={(e) => updateProperty(prop.id, { status: e.target.value as any })}
                          className={`border rounded-lg px-2.5 py-1.5 font-bold text-[11px] transition-colors ${
                            prop.status === 'Disponible' 
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-300' 
                              : prop.status === 'Alquilada' 
                              ? 'bg-blue-50 text-blue-800 border-blue-300' 
                              : prop.status === 'Suspendida' 
                              ? 'bg-amber-50 text-amber-900 border-amber-300' 
                              : 'bg-gray-50 text-gray-800 border-gray-300'
                          }`}
                        >
                          <option value="Disponible">Disponible (En Catálogo)</option>
                          <option value="Alquilada">Alquilada (Con Inquilino)</option>
                          <option value="Suspendida">Suspendida (Retirada por Propietario)</option>
                          <option value="En Mantenimiento">En Mantenimiento</option>
                          <option value="Vendida">Vendida</option>
                        </select>
                      </td>
                      <td className="p-3 text-gray-600">{prop.ownerName}</td>
                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => openPrintModal({ type: 'property_sheet', data: prop })}
                            className="p-2 rounded-xl hover:bg-gray-100 text-gray-600 border border-gray-200 transition-colors"
                            title="Imprimir Ficha Técnica"
                          >
                            <Printer className="w-3.5 h-3.5" />
                          </button>

                          {prop.status === 'Suspendida' ? (
                            <button
                              onClick={() => reactivateProperty(prop.id)}
                              className="px-2.5 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-[11px] flex items-center gap-1 transition-colors shadow-2xs"
                              title="Reactivar inmueble y colocarlo de nuevo en el catálogo público"
                            >
                              <PlayCircle className="w-3.5 h-3.5" />
                              <span>Reactivar en Catálogo</span>
                            </button>
                          ) : (
                            <button
                              onClick={() => suspendProperty(prop.id)}
                              className="px-2.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold text-[11px] flex items-center gap-1 transition-colors shadow-2xs"
                              title="Suspender: El propietario ya no alquilará (Retirar de catálogo)"
                            >
                              <PauseCircle className="w-3.5 h-3.5" />
                              <span>Suspender</span>
                            </button>
                          )}

                          <button
                            onClick={() => deleteProperty(prop.id)}
                            className="p-2 rounded-xl hover:bg-red-50 text-gray-400 hover:text-red-600 border border-transparent hover:border-red-200 transition-colors"
                            title="Protegido: no se elimina para preservar la concordancia contractual con el inquilino; se suspende"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB: CONTRACTS MANAGEMENT */}
      {adminTab === 'contracts' && (
        <div className="bg-white rounded-3xl border border-[#D5E1D4] p-6 shadow-2xs space-y-4 text-xs">
          <div className="flex flex-wrap justify-between items-center gap-3">
            <div>
              <h3 className="font-serif-brand text-xl font-bold text-gray-900">Control de Contratos de Arrendamiento</h3>
              <p className="text-gray-500">Expedición, vista previa legal, descarga y conciliación bancaria de cuentas receptoras</p>
            </div>
            <button
              onClick={() => setShowContractModal(true)}
              className="px-4 py-2 rounded-xl bg-[#2D4539] hover:bg-[#20342A] text-white font-semibold text-xs flex items-center gap-1.5 shadow-2xs transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Emitir Nuevo Contrato</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200 text-gray-500 font-semibold bg-[#FAFBF9]">
                  <th className="p-3">N° Contrato</th>
                  <th className="p-3">Tipo</th>
                  <th className="p-3">Inmueble</th>
                  <th className="p-3">Inquilino / Adquiriente</th>
                  <th className="p-3">Encargado / Asesor</th>
                  <th className="p-3">Monto / Renta</th>
                  <th className="p-3">Estado Documental & Firmas</th>
                  <th className="p-3">Cuenta Circulada</th>
                  <th className="p-3">Vigencia</th>
                  <th className="p-3 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {contracts.map(c => {
                  const isSale = c.contractType === 'Venta' || c.contractType === 'Venta a Plazos';
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
                        <span className="font-bold text-gray-800 block">{c.tenantName}</span>
                        <span className="text-[11px] text-gray-500 font-mono">ID: {c.tenantNationalId || '0801-1996-04812'} · {c.tenantPhone || '+504 9623-4567'}</span>
                      </td>
                      <td className="p-3">
                        <span className="font-semibold text-gray-800 block">{c.managerName || c.agentName}</span>
                        <span className="text-[10px] text-gray-500">{c.managerEmail || 'administracion@terranova.hn'}</span>
                      </td>
                      <td className="p-3 font-mono font-bold text-emerald-800">
                        {isSale ? (
                          <div>
                            <span>${(c.totalValue || c.monthlyRent).toLocaleString()} {c.currency}</span>
                            {c.contractType === 'Venta a Plazos' ? (
                              <span className="text-[10px] text-blue-700 block font-sans">
                                Prima: ${c.downPayment?.toLocaleString()} · Cuota: ${c.monthlyInstallment?.toLocaleString()}/m (A plazos)
                              </span>
                            ) : (
                              <span className="text-[10px] text-purple-700 block font-sans">
                                Venta Directa (Liquidación 100%)
                              </span>
                            )}
                            {c.totalCommissionRate && (
                              <span className="text-[9px] text-gray-500 block font-mono font-normal">
                                Corretaje {c.totalCommissionRate}% (${c.totalCommissionAmount?.toLocaleString()}) · Dueño {c.ownerNetRate || 80}%
                              </span>
                            )}
                          </div>
                        ) : (
                          <span>${c.monthlyRent} {c.currency}/mes</span>
                        )}
                      </td>
                      <td className="p-3">
                        {c.invalidationRequested ? (
                          <div className="p-2 rounded-xl bg-rose-50 border border-rose-300 text-rose-900 space-y-1">
                            <span className="font-bold text-[11px] flex items-center gap-1 text-rose-800 animate-pulse">
                              <ShieldAlert className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                              Invalidación Solicitada
                            </span>
                            <span className="text-[10px] text-rose-700 block leading-tight">
                              Motivo agente: "{c.invalidationReason}"
                            </span>
                          </div>
                        ) : c.signedDocumentUrl ? (
                          <div className="space-y-1">
                            <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-bold border border-blue-300 flex items-center gap-1 w-fit">
                              <FileCheck2 className="w-3 h-3 text-blue-600" />
                              Escaneo Físico Resguardado
                            </span>
                            <a
                              href={c.signedDocumentUrl}
                              download={c.signedDocumentFileName || 'documentos.pdf'}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[10px] font-mono text-blue-800 hover:text-blue-950 hover:underline block truncate max-w-[180px] font-bold"
                              title="Descargar o abrir documento PDF"
                            >
                              📄 {c.signedDocumentFileName || 'documentos.pdf'} {c.signedDocumentFileSize ? `(${c.signedDocumentFileSize})` : ''}
                            </a>
                          </div>
                        ) : c.isSignedDigitally ? (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold border border-emerald-300 flex items-center gap-1 w-fit">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            Firmado Digitalmente
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold border border-amber-300 flex items-center gap-1 w-fit">
                            <Clock className="w-3 h-3 text-amber-600" />
                            Sin Firmas (Bloqueado)
                          </span>
                        )}
                      </td>
                      <td className="p-3">
                        <span className="px-2 py-1 rounded-md bg-amber-50 border border-amber-300 text-amber-900 font-mono text-[11px] font-bold inline-block">
                          {c.receivingBankAccount || '2000-1122-3344-99'}
                        </span>
                      </td>
                      <td className="p-3 text-[11px] text-gray-600">
                        {c.startDate} al {c.endDate}
                      </td>
                      <td className="p-3 text-right space-x-1.5 whitespace-nowrap">
                        <button
                          onClick={() => openPrintModal({ type: 'contract', data: c })}
                          className="px-2.5 py-1.5 rounded-lg bg-[#2D4539] hover:bg-[#20342A] text-white font-semibold text-xs inline-flex items-center gap-1 shadow-2xs"
                          title="Ver Vista Previa y Descargar Contrato"
                        >
                          <Printer className="w-3.5 h-3.5" />
                          <span>Vista Previa</span>
                        </button>

                        {/* Descargar PDF Subido si existe */}
                        {c.signedDocumentUrl && (
                          <a
                            href={c.signedDocumentUrl}
                            download={c.signedDocumentFileName || 'documentos.pdf'}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-2.5 py-1.5 rounded-lg bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs inline-flex items-center gap-1 shadow-2xs transition-colors"
                            title="Descargar o abrir el documento PDF físico/escaneado resguardado"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>Descargar PDF</span>
                          </a>
                        )}

                        {(c.status === 'Vigente' || c.status === 'Activo') && (
                          <button
                            onClick={() => {
                              setCancelModalContract(c);
                              setCancellationReasonInput('Rescisión de común acuerdo / Desocupación de inmueble');
                            }}
                            className="px-2.5 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs inline-flex items-center gap-1 shadow-2xs transition-colors"
                            title="Cancelar contrato vigente y liberar el inmueble a Disponible"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            <span>Cancelar</span>
                          </button>
                        )}

                        {c.status === 'Cancelado' && (
                          <span className="px-2 py-1 rounded-md bg-rose-50 text-rose-800 text-[10px] font-bold border border-rose-300 inline-flex items-center gap-1" title={c.cancellationReason || 'Contrato cancelado'}>
                            <XCircle className="w-3 h-3 text-rose-600" />
                            <span>Cancelado (Liberado)</span>
                          </span>
                        )}

                        {(c.signedDocumentUrl || c.invalidationRequested) && (
                          <button
                            onClick={() => {
                              setInvalidationModalContract(c);
                              setInvalidationNotes(c.invalidationReason || 'Error en documento escaneado.');
                            }}
                            className="px-2.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs inline-flex items-center gap-1 shadow-2xs transition-colors"
                            title="Invalidar documento cargado para que el agente pueda subir la versión correcta"
                          >
                            <FileX2 className="w-3.5 h-3.5" />
                            <span>Invalidar</span>
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
      )}

      {/* TAB: GESTIÓN DE PLANTILLAS DE CONTRATOS (PDF / WORD) */}
      {adminTab === 'contract_templates' && (
        <div className="space-y-6 animate-in fade-in">
          {/* Header */}
          <div className="bg-white rounded-3xl border border-[#D5E1D4] p-6 shadow-2xs space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <FileCheck2 className="w-6 h-6 text-[#2D4539]" />
                  <h3 className="font-serif-brand text-xl font-bold text-gray-900">
                    Gestión de Plantillas y Estándares de Contratos (PDF / Word)
                  </h3>
                </div>
                <p className="text-gray-600 text-xs mt-1">
                  Repositorio oficial de estándares jurídicos corporativos en formatos Word (.docx/.doc) y PDF (.pdf). Las plantillas aquí resguardadas se guardan en el almacenamiento local y son seleccionables dinámicamente al generar nuevos contratos de arrendamiento o compraventa.
                </p>
              </div>

              <button
                onClick={() => {
                  setTemplateName('');
                  setTemplateType('Arrendamiento');
                  setTemplateFormat('docx');
                  setTemplateFileName('');
                  setTemplateDescription('');
                  setTemplateClausesText('');
                  setShowAddTemplateModal(true);
                }}
                className="px-4 py-2.5 rounded-xl bg-[#2D4539] hover:bg-[#1E3328] text-white font-semibold text-xs flex items-center gap-1.5 transition-colors shadow-2xs shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Subir Estándar / Plantilla</span>
              </button>
            </div>

            {/* Quick stats banner */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-3 bg-[#FAFBF9] rounded-2xl border border-gray-200">
                <span className="text-[10px] text-gray-500 block font-semibold">Total de Plantillas Oficiales:</span>
                <span className="text-xl font-bold text-[#1E3328] font-mono">{contractTemplates.length} Estándares</span>
              </div>
              <div className="p-3 bg-blue-50/60 rounded-2xl border border-blue-200">
                <span className="text-[10px] text-blue-800 block font-semibold">Estándares en Formato Word:</span>
                <span className="text-xl font-bold text-blue-900 font-mono">
                  {contractTemplates.filter(t => t.fileFormat === 'docx' || t.fileFormat === 'doc').length} (.docx/.doc)
                </span>
              </div>
              <div className="p-3 bg-rose-50/60 rounded-2xl border border-rose-200">
                <span className="text-[10px] text-rose-800 block font-semibold">Estándares en Formato PDF:</span>
                <span className="text-xl font-bold text-rose-900 font-mono">
                  {contractTemplates.filter(t => t.fileFormat === 'pdf').length} (.pdf)
                </span>
              </div>
            </div>
          </div>

          {/* Grid de Plantillas */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {contractTemplates.map((tmpl) => {
              const isWord = tmpl.fileFormat === 'docx' || tmpl.fileFormat === 'doc';
              return (
                <div key={tmpl.id} className="bg-white rounded-3xl border border-[#D5E1D4] p-5 shadow-2xs flex flex-col justify-between space-y-4 hover:shadow-md transition-shadow">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className={`px-2.5 py-1 rounded-lg text-xs font-bold font-mono uppercase flex items-center gap-1 ${
                          isWord ? 'bg-blue-100 text-blue-800 border border-blue-300' : 'bg-rose-100 text-rose-800 border border-rose-300'
                        }`}>
                          <FileText className="w-3.5 h-3.5" />
                          <span>{tmpl.fileFormat.toUpperCase()}</span>
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#EEF5ED] text-[#1E3628] border border-[#CBD8CA]">
                          {tmpl.type}
                        </span>
                      </div>
                      {tmpl.isDefault && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                          Estándar Oficial
                        </span>
                      )}
                    </div>

                    <div>
                      <h4 className="font-bold text-sm text-gray-900 leading-snug">{tmpl.name}</h4>
                      <p className="text-gray-500 text-xs mt-1 leading-relaxed">{tmpl.description}</p>
                    </div>

                    <div className="bg-[#FAFBF9] p-3 rounded-xl border border-gray-100 text-[11px] space-y-1">
                      <div className="flex justify-between text-gray-500">
                        <span>Archivo estándar:</span>
                        <span className="font-mono font-bold text-gray-700 truncate max-w-[160px]">{tmpl.fileName || 'estandar.docx'}</span>
                      </div>
                      <div className="flex justify-between text-gray-500">
                        <span>Subido por:</span>
                        <span className="text-gray-700">{tmpl.uploadedBy}</span>
                      </div>
                      <div className="flex justify-between text-gray-500">
                        <span>Fecha:</span>
                        <span className="text-gray-700 font-mono">{tmpl.uploadedAt}</span>
                      </div>
                      <div className="flex justify-between text-gray-500">
                        <span>Cláusulas estandarizadas:</span>
                        <span className="font-bold text-[#1E3328]">{tmpl.clauses.length} cláusulas</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-1 flex-wrap">
                    <button
                      type="button"
                      onClick={() => setPreviewTemplate(tmpl)}
                      className="px-2.5 py-1.5 rounded-xl border border-gray-300 hover:bg-gray-50 text-gray-700 text-xs font-semibold flex items-center gap-1"
                      title="Ver cláusulas jurídicas del estándar"
                    >
                      <Eye className="w-3.5 h-3.5 text-gray-500" />
                      <span>Cláusulas</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        const blob = new Blob([
                          `PLANTILLA ESTÁNDAR OFICIAL: ${tmpl.name}\nTipo: ${tmpl.type}\nFormato: ${tmpl.fileFormat}\n\nCLÁUSULAS:\n` +
                          tmpl.clauses.map((c, i) => `${i + 1}. ${c}`).join('\n\n')
                        ], { type: 'text/plain;charset=utf-8' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = tmpl.fileName || `${tmpl.id}.${tmpl.fileFormat}`;
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                        URL.revokeObjectURL(url);
                        showToast(`Archivo "${tmpl.fileName || tmpl.id}" descargado.`);
                      }}
                      className="px-2.5 py-1.5 rounded-xl border border-gray-300 hover:bg-gray-50 text-gray-700 text-xs font-semibold flex items-center gap-1"
                      title="Descargar archivo modelo"
                    >
                      <Download className="w-3.5 h-3.5 text-gray-500" />
                      <span>Descargar</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setSelectedTemplateId(tmpl.id);
                        setContractType(tmpl.type);
                        setShowContractModal(true);
                      }}
                      className="px-2.5 py-1.5 rounded-xl bg-[#2D4539] hover:bg-[#1E3328] text-white text-xs font-semibold flex items-center gap-1 shadow-2xs"
                      title="Usar esta plantilla para emitir un contrato"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Emitir Contrato</span>
                    </button>

                    {!tmpl.isDefault && (
                      <button
                        type="button"
                        onClick={() => deleteContractTemplate(tmpl.id)}
                        className="p-1.5 rounded-xl hover:bg-rose-50 text-rose-600"
                        title="Eliminar plantilla"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB: PAYMENTS VALIDATION & CONCILIATION */}
      {adminTab === 'payments' && (
        <div className="space-y-6">
          {/* Header & Explanatory Banner */}
          <div className="bg-white rounded-3xl border border-[#D5E1D4] p-6 shadow-2xs space-y-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-[#2D4539]" />
                  <h3 className="font-serif-brand text-xl font-bold text-gray-900">
                    Centro de Cobros, Conciliación y Validación de Pagos
                  </h3>
                </div>
                <p className="text-gray-500 text-xs mt-1">
                  Módulo oficial para Administradores y Agentes: supervisa pagos ingresados por inquilinos, coteja referencias bancarias y acredita transacciones.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => openPrintModal({
                    type: 'financial_report',
                    data: {
                      totalGrossIncome,
                      totalMaintenanceExpenses,
                      netOperatingIncome,
                      occupiedProperties,
                      totalProperties: properties.length,
                      globalOccupancyRate,
                      date: new Date().toLocaleDateString()
                    }
                  })}
                  className="px-4 py-2 rounded-xl bg-white border border-[#CBD8CA] hover:bg-[#EEF5ED] text-gray-800 font-semibold text-xs flex items-center gap-1.5 transition-colors shadow-2xs"
                >
                  <Printer className="w-3.5 h-3.5 text-gray-600" />
                  <span>Imprimir Libro de Caja</span>
                </button>
              </div>
            </div>

            {/* Workflow Guidance Card */}
            <div className="p-4 rounded-2xl bg-[#F4F8F4] border border-[#CBD8CA] text-xs space-y-2">
              <div className="flex items-center gap-2 font-bold text-[#1E3628]">
                <Clock className="w-4 h-4 text-amber-600" />
                <span>¿Dónde y cómo se confirman los pagos si soy agente o administrador?</span>
              </div>
              <p className="text-gray-700 leading-relaxed text-[11px]">
                Cuando un inquilino envía su pago, el sistema lo registra inmediatamente en estado <span className="font-bold text-amber-800 bg-amber-100 px-1.5 py-0.5 rounded">En Proceso</span> con su <strong>código de referencia bancaria</strong> (ej. <code className="font-mono bg-white px-1 border border-gray-200 rounded">PROC-...</code>). Tanto el <strong>Administrador</strong> (en esta pestaña) como el <strong>Agente Inmobiliario</strong> (en la pestaña de <em>Cobros & Pagos</em> del CRM) tienen la facultad de verificar el depósito contra la cuenta bancaria de la empresa y hacer clic en <strong>Confirmar y Acreditar</strong>. Al confirmar, el sistema lo pasa a <span className="font-bold text-emerald-800 bg-emerald-100 px-1.5 py-0.5 rounded">Completado</span>, timbra el comprobante con sello digital y emite una notificación instantánea al inquilino.
              </p>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200">
                <div className="flex justify-between items-start">
                  <span className="text-[11px] font-semibold text-amber-900">Por Validar / En Proceso</span>
                  <Clock className="w-4 h-4 text-amber-600" />
                </div>
                <div className="mt-2">
                  <div className="text-xl font-bold font-serif-brand text-amber-950 font-mono">
                    {formatMoney(pendingPaymentsSum)}
                  </div>
                  <span className="text-[10px] text-amber-800 font-medium">
                    {pendingPaymentsCount} transacciones en espera de conciliación
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200">
                <div className="flex justify-between items-start">
                  <span className="text-[11px] font-semibold text-emerald-900">Acreditados / Completados</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="mt-2">
                  <div className="text-xl font-bold font-serif-brand text-emerald-950 font-mono">
                    {formatMoney(totalGrossIncome)}
                  </div>
                  <span className="text-[10px] text-emerald-800 font-medium">
                    {payments.filter(p => p.status === 'Completado').length} cobros validados y conciliados
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#FAFBF9] border border-[#DEE6DD]">
                <div className="flex justify-between items-start">
                  <span className="text-[11px] font-semibold text-gray-700">Total Transacciones</span>
                  <FileText className="w-4 h-4 text-gray-500" />
                </div>
                <div className="mt-2">
                  <div className="text-xl font-bold font-serif-brand text-gray-900 font-mono">
                    {payments.length}
                  </div>
                  <span className="text-[10px] text-gray-500">Histórico de cobros emitidos</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#FAFBF9] border border-[#DEE6DD]">
                <div className="flex justify-between items-start">
                  <span className="text-[11px] font-semibold text-gray-700">Régimen Fiscal RTN</span>
                  <ShieldCheck className="w-4 h-4 text-[#2D4539]" />
                </div>
                <div className="mt-2">
                  {companySettings.includeTaxRtn !== false ? (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                      <Check className="w-3 h-3 text-emerald-700" /> RTN Declarado
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
                      Régimen Exento
                    </span>
                  )}
                  <p className="text-[10px] text-gray-500 mt-1">Control exclusivo del Administrador</p>
                </div>
              </div>
            </div>
          </div>

          {/* Filter Pills and Search */}
          <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
              <button
                type="button"
                onClick={() => setPaymentFilter('all')}
                className={`px-3 py-1.5 rounded-xl font-semibold transition-all whitespace-nowrap ${
                  paymentFilter === 'all'
                    ? 'bg-[#2D4539] text-white shadow-2xs'
                    : 'bg-white border border-[#CAD8C8] text-gray-700 hover:bg-[#EEF5ED]'
                }`}
              >
                Todos ({payments.length})
              </button>

              <button
                type="button"
                onClick={() => setPaymentFilter('En Proceso')}
                className={`px-3 py-1.5 rounded-xl font-semibold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                  paymentFilter === 'En Proceso'
                    ? 'bg-amber-600 text-white shadow-2xs'
                    : 'bg-white border border-amber-300 text-amber-900 hover:bg-amber-50'
                }`}
              >
                {pendingPaymentsCount > 0 && (
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
                )}
                <span>Por Confirmar ({pendingPaymentsCount})</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentFilter('Completado')}
                className={`px-3 py-1.5 rounded-xl font-semibold transition-all whitespace-nowrap ${
                  paymentFilter === 'Completado'
                    ? 'bg-emerald-700 text-white shadow-2xs'
                    : 'bg-white border border-[#CAD8C8] text-gray-700 hover:bg-[#EEF5ED]'
                }`}
              >
                Acreditados ({payments.filter(p => p.status === 'Completado').length})
              </button>

              <button
                type="button"
                onClick={() => setPaymentFilter('Rechazado')}
                className={`px-3 py-1.5 rounded-xl font-semibold transition-all whitespace-nowrap ${
                  paymentFilter === 'Rechazado'
                    ? 'bg-rose-700 text-white shadow-2xs'
                    : 'bg-white border border-[#CAD8C8] text-gray-700 hover:bg-[#EEF5ED]'
                }`}
              >
                Rechazados ({payments.filter(p => p.status === 'Rechazado').length})
              </button>
            </div>

            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por inquilino, folio o ref..."
                value={filterQuery}
                onChange={(e) => setFilterQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-xs bg-white border border-[#CAD8C8] rounded-xl focus:outline-hidden focus:ring-1 focus:ring-[#2D4539] w-full sm:w-64"
              />
            </div>
          </div>

          {/* Table of Payments */}
          <div className="bg-white rounded-3xl border border-[#D5E1D4] shadow-2xs overflow-hidden text-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#FAFBF9] border-b border-gray-200 text-gray-600 font-semibold">
                    <th className="p-3.5">Folio & Código Ref.</th>
                    <th className="p-3.5">Inquilino / Arrendatario</th>
                    <th className="p-3.5">Inmueble</th>
                    <th className="p-3.5">Concepto</th>
                    <th className="p-3.5">Monto Total</th>
                    <th className="p-3.5">Método de Pago</th>
                    <th className="p-3.5">Fecha</th>
                    <th className="p-3.5">Estado</th>
                    <th className="p-3.5 text-right">Acción de Validación</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {payments
                    .filter(p => {
                      if (paymentFilter === 'En Proceso') return p.status === 'En Proceso' || p.status === 'Pendiente';
                      if (paymentFilter === 'Completado') return p.status === 'Completado';
                      if (paymentFilter === 'Rechazado') return p.status === 'Rechazado';
                      return true;
                    })
                    .filter(p => {
                      if (!filterQuery.trim()) return true;
                      const q = filterQuery.toLowerCase();
                      return (
                        p.payerName.toLowerCase().includes(q) ||
                        p.payerEmail.toLowerCase().includes(q) ||
                        p.receiptNumber.toLowerCase().includes(q) ||
                        p.referenceCode.toLowerCase().includes(q) ||
                        p.propertyTitle.toLowerCase().includes(q)
                      );
                    })
                    .map(p => {
                      const isPending = p.status === 'En Proceso' || p.status === 'Pendiente';
                      return (
                        <tr key={p.id} className="hover:bg-gray-50/80 transition-colors">
                          <td className="p-3.5">
                            <span className="font-mono font-bold text-gray-900 block">{p.receiptNumber}</span>
                            <span className="font-mono text-[10px] text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded border border-gray-200 inline-block mt-0.5">
                              Ref: {p.referenceCode}
                            </span>
                          </td>
                          <td className="p-3.5">
                            <span className="font-bold text-gray-900 block">{p.payerName}</span>
                            <span className="text-[11px] text-gray-500">{p.payerEmail}</span>
                          </td>
                          <td className="p-3.5">
                            <span className="font-medium text-gray-800 line-clamp-1">{p.propertyTitle}</span>
                            {p.monthCovered && (
                              <span className="text-[10px] text-gray-400 block">Mes: {p.monthCovered}</span>
                            )}
                          </td>
                          <td className="p-3.5">
                            <span className="px-2 py-0.5 rounded-md bg-gray-100 text-gray-700 font-medium text-[11px]">
                              {p.type}
                            </span>
                          </td>
                          <td className="p-3.5 font-mono">
                            <span className="font-bold text-emerald-800 block text-sm">
                              {formatMoney(p.amount)}
                            </span>
                            <span className="text-[10px] text-gray-400">
                              L. {(p.amount * companySettings.exchangeRateUSDToHNL).toLocaleString('es-HN', { minimumFractionDigits: 2 })} HNL
                            </span>
                          </td>
                          <td className="p-3.5">
                            <span className="font-medium text-gray-700 block">{p.paymentMethod}</span>
                          </td>
                          <td className="p-3.5 text-gray-600 font-mono text-[11px]">
                            {p.date}
                          </td>
                          <td className="p-3.5">
                            {p.status === 'Completado' ? (
                              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 inline-flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                                ACREDITADO
                              </span>
                            ) : isPending ? (
                              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300 inline-flex items-center gap-1 animate-pulse">
                                <Clock className="w-3 h-3 text-amber-700" />
                                EN PROCESO
                              </span>
                            ) : (
                              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-300 inline-flex items-center gap-1">
                                <XCircle className="w-3 h-3 text-rose-700" />
                                RECHAZADO
                              </span>
                            )}
                          </td>
                          <td className="p-3.5 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {isPending ? (
                                <>
                                  <button
                                    type="button"
                                    onClick={() => confirmPayment(p.id)}
                                    className="px-3 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs flex items-center gap-1 shadow-2xs transition-colors"
                                    title="Confirmar recepción bancaria y acreditar pago"
                                  >
                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                    <span>Confirmar y Acreditar</span>
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setRejectModalPayment(p);
                                      setRejectReasonInput('');
                                    }}
                                    className="px-2.5 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-semibold text-xs transition-colors"
                                    title="Rechazar transacción"
                                  >
                                    <XCircle className="w-3.5 h-3.5" />
                                  </button>
                                </>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => openPrintModal({ type: 'payment_receipt', data: p })}
                                  className="px-3 py-1.5 rounded-xl bg-[#2D4539] hover:bg-[#20342A] text-white font-semibold text-xs flex items-center gap-1 shadow-2xs transition-colors"
                                  title="Ver recibo oficial timbrado"
                                >
                                  <Printer className="w-3.5 h-3.5" />
                                  <span>Ver Comprobante</span>
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>

            {payments.length === 0 && (
              <div className="p-8 text-center text-gray-500">
                No hay pagos registrados en el sistema.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal: Rechazar Pago */}
      {rejectModalPayment && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex justify-between items-center pb-2 border-b border-gray-100">
              <div className="flex items-center gap-2 text-rose-700">
                <XCircle className="w-5 h-5" />
                <h3 className="font-bold text-base text-gray-900">Rechazar Transacción de Pago</h3>
              </div>
              <button
                onClick={() => setRejectModalPayment(null)}
                className="p-1 rounded-lg hover:bg-gray-100 text-gray-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-xs text-gray-600 space-y-2">
              <p>
                Estás a punto de rechazar el pago con folio <strong className="font-mono text-gray-900">{rejectModalPayment.receiptNumber}</strong> por valor de <strong className="font-mono text-emerald-800">{formatMoney(rejectModalPayment.amount)}</strong> de <strong>{rejectModalPayment.payerName}</strong>.
              </p>
              <p className="text-[11px] text-gray-500">
                Se notificará al inquilino para que pueda reenviar o subsanar el comprobante bancario.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Motivo del Rechazo
              </label>
              <textarea
                rows={3}
                value={rejectReasonInput}
                onChange={(e) => setRejectReasonInput(e.target.value)}
                placeholder="Ejemplo: La referencia no coincide con el extracto bancario de la fecha..."
                className="w-full text-xs bg-white border border-[#CAD8C8] rounded-xl p-2.5 focus:outline-hidden focus:ring-1 focus:ring-rose-500"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setRejectModalPayment(null)}
                className="px-4 py-2 rounded-xl border border-gray-300 text-gray-700 text-xs font-semibold"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => {
                  rejectPayment(rejectModalPayment.id, rejectReasonInput || 'Referencia bancaria no conciliada');
                  setRejectModalPayment(null);
                }}
                className="px-4 py-2 rounded-xl bg-rose-700 hover:bg-rose-800 text-white text-xs font-semibold shadow-2xs"
              >
                Confirmar Rechazo
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB: USERS & ROLES */}
      {adminTab === 'users' && (
        <div className="bg-white rounded-3xl border border-[#D5E1D4] p-6 shadow-2xs space-y-4 text-xs">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-serif-brand text-xl font-bold text-gray-900">Catálogo y Administración de Usuarios</h3>
              <p className="text-gray-500">
                Modificación de tipo de cuenta y activación/desactivación de cuentas (datos personales ingresados no editables)
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200 text-gray-500 font-semibold bg-[#FAFBF9]">
                  <th className="p-3">Usuario Registrado</th>
                  <th className="p-3">Correo</th>
                  <th className="p-3">Teléfono</th>
                  <th className="p-3">Tipo de Cuenta (Rol)</th>
                  <th className="p-3">Estado de Cuenta</th>
                  <th className="p-3 text-right">Acción de Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {users.map(u => (
                  <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-3 flex items-center gap-2">
                      <img src={u.avatar} alt={u.name} className="w-7 h-7 rounded-full object-cover" />
                      <div>
                        <span className="font-bold text-gray-900 block">{u.name}</span>
                        <span className="text-[10px] text-gray-400 font-mono">{u.accountNumber || 'CTA-USR'}</span>
                      </div>
                    </td>
                    <td className="p-3 text-gray-600 font-medium">{u.email}</td>
                    <td className="p-3 text-gray-600 font-mono">{u.phone}</td>
                    <td className="p-3">
                      {/* El administrador puede cambiar el tipo de cuenta sin modificar sus otros datos */}
                      <select
                        value={u.role}
                        onChange={(e) => changeUserRole(u.id, e.target.value as UserRole)}
                        className="bg-white border border-[#CBD8CA] rounded-xl px-2.5 py-1 text-xs font-bold text-[#1E3628] focus:outline-hidden focus:ring-1 focus:ring-[#2D4539]"
                      >
                        <option value="client">Cliente (Buscador)</option>
                        <option value="tenant">Inquilino (Arrendatario)</option>
                        <option value="owner">Propietario</option>
                        <option value="agent">Agente Inmobiliario</option>
                        <option value="admin">Administrador</option>
                        <option value="contractor">Contratista</option>
                        <option value="technician">Técnico de Sistemas / DBA (Exclusivo SQL)</option>
                      </select>
                    </td>
                    <td className="p-3">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        u.status === 'active' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' : 'bg-rose-100 text-rose-800 border border-rose-200'
                      }`}>
                        {u.status === 'active' ? 'Activa' : 'Desactivada (De Baja)'}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      {u.id !== currentUser.id ? (
                        <button
                          onClick={() => toggleUserStatus(u.id)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                            u.status === 'active'
                              ? 'bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200'
                              : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200'
                          }`}
                        >
                          {u.status === 'active' ? 'Desactivar Cuenta' : 'Activar Cuenta'}
                        </button>
                      ) : (
                        <span className="text-[10px] text-gray-400 italic">Sesión Actual</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB: PERMISSIONS & ROLE-BASED ACCESS CONTROL (RBAC) */}
      {adminTab === 'permissions' && (
        <div className="bg-white rounded-3xl border border-[#D5E1D4] p-6 shadow-2xs space-y-6 text-xs">
          {/* Header & Security Notice */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-100 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#2D4539]" />
                <h3 className="font-serif-brand text-xl font-bold text-gray-900">
                  Panel de Administrador: Matriz de Permisos & Control Total (RBAC)
                </h3>
              </div>
              <p className="text-gray-500 mt-1">
                Configuración granular de privilegios por rol. Solo el Administrador ({currentUser.name}) posee control total para modificar estas directivas.
              </p>
            </div>

            <div className="flex items-center gap-2">
              {currentUser.role === 'admin' ? (
                <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-100 text-emerald-800 font-bold border border-emerald-300">
                  <CheckCircle className="w-4 h-4 text-emerald-600" /> Control Total Activo
                </span>
              ) : (
                <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-100 text-amber-800 font-bold border border-amber-300">
                  <Lock className="w-4 h-4 text-amber-600" /> Modo Solo Lectura
                </span>
              )}
            </div>
          </div>

          {/* Warning Banner if non-admin */}
          {currentUser.role !== 'admin' && (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-3 text-amber-900 animate-in fade-in">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-xs">Restricción de Seguridad</p>
                <p className="text-[11px] text-amber-800 mt-0.5">
                  Solo el usuario con rol de Administrador tiene autorización para conceder o revocar permisos. Actualmente estás visualizando esta matriz en modo auditoría.
                </p>
              </div>
            </div>
          )}

          {/* Permissions Matrix Table */}
          <div className="overflow-x-auto border border-[#DEE6DD] rounded-2xl">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#FAFBF9] border-b border-gray-200 text-gray-600 font-bold">
                  <th className="p-3.5">Módulo / Privilegio Operativo</th>
                  <th className="p-3.5 text-center bg-amber-50/50 text-amber-900">Administrador</th>
                  <th className="p-3.5 text-center">Agente</th>
                  <th className="p-3.5 text-center">Propietario</th>
                  <th className="p-3.5 text-center">Inquilino</th>
                  <th className="p-3.5 text-center">Contratista</th>
                  <th className="p-3.5 text-center bg-indigo-50/50 text-indigo-900">Técnico (DBA)</th>
                  <th className="p-3.5 text-center">Visitante</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {[
                  { key: 'canManageProperties', label: 'Gestión y Registro de Inmuebles', desc: 'Crear, editar fichas técnicas y fotos de propiedades' },
                  { key: 'canDeleteProperties', label: 'Eliminar Propiedades del Inventario', desc: 'Remover inmuebles definitivamente del sistema' },
                  { key: 'canGenerateContracts', label: 'Emisión de Contratos de Arrendamiento', desc: 'Redactar y formalizar contratos con inquilinos' },
                  { key: 'canProcessPayments', label: 'Pasarela de Pagos & Conciliación', desc: 'Procesar cobros y registrar recibos financieros' },
                  { key: 'canDispatchMaintenance', label: 'Programar & Asignar Mantenimiento', desc: 'Asignar órdenes de reparación a contratistas' },
                  { key: 'canManageUsers', label: 'Gestión de Cuentas de Usuario', desc: 'Registrar y editar perfiles de actores del sistema' },
                  { key: 'canChangeUserStatus', label: 'Alta y Baja de Usuarios (Activo/Inactivo)', desc: 'Suspender o reactivar cuentas del sistema' },
                  { key: 'canViewAuditLogs', label: 'Auditoría e Historial de Acciones', desc: 'Consultar logs inmutables de operaciones' },
                  { key: 'canConfigurePolicies', label: 'Configuración de Políticas & Tarifas', desc: 'Modificar comisiones y plazos de gracia' },
                ].map((perm) => (
                  <tr key={perm.key} className="hover:bg-gray-50/80 transition-colors">
                    <td className="p-3.5">
                      <span className="font-bold text-gray-900 block">{perm.label}</span>
                      <span className="text-[11px] text-gray-500">{perm.desc}</span>
                    </td>
                    {(['admin', 'agent', 'owner', 'tenant', 'contractor', 'technician', 'guest'] as UserRole[]).map((r) => {
                      const rolePerm = permissions.find(p => p.role === r);
                      const isAllowed = rolePerm ? Boolean(rolePerm[perm.key as keyof Omit<RolePermissions, 'role'>]) : false;
                      const isAdminRole = r === 'admin';

                      return (
                        <td key={r} className={`p-3.5 text-center ${isAdminRole ? 'bg-amber-50/30' : ''}`}>
                          {isAdminRole ? (
                            <span 
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#2D4539] text-white shadow-2xs"
                              title="El Administrador siempre mantiene control total"
                            >
                              <Check className="w-3 h-3 text-[#A3C7AD]" /> Total
                            </span>
                          ) : (
                            <button
                              type="button"
                              disabled={currentUser.role !== 'admin'}
                              onClick={() => {
                                updateRolePermission(r, perm.key as any, !isAllowed);
                                showToast(`Permiso "${perm.label}" ${!isAllowed ? 'concedido a' : 'revocado para'} ${r.toUpperCase()}`);
                              }}
                              className={`p-1.5 rounded-xl border transition-all ${
                                isAllowed
                                  ? 'bg-emerald-50 border-emerald-300 text-emerald-700 hover:bg-emerald-100'
                                  : 'bg-gray-50 border-gray-200 text-gray-400 hover:bg-gray-100'
                              } ${currentUser.role !== 'admin' ? 'cursor-not-allowed opacity-80' : 'cursor-pointer'}`}
                              title={
                                currentUser.role === 'admin'
                                  ? (isAllowed ? 'Clic para revocar permiso' : 'Clic para conceder permiso')
                                  : 'Solo el administrador puede modificar este permiso'
                              }
                            >
                              {isAllowed ? (
                                <Check className="w-4 h-4 text-emerald-600 mx-auto" />
                              ) : (
                                <XCircle className="w-4 h-4 text-gray-400 mx-auto" />
                              )}
                            </button>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Quick Account Activation & Status Matrix */}
          <div className="pt-4 border-t border-gray-100 space-y-3">
            <h4 className="font-serif-brand text-lg font-bold text-gray-900 flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-[#C36449]" /> Control Directo de Cuentas y Estado de Acceso
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {users.map(u => (
                <div key={u.id} className="p-3 rounded-xl border border-[#DEE6DD] bg-[#FAFBF9] flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <img src={u.avatar} alt={u.name} className="w-8 h-8 rounded-full object-cover shrink-0" />
                    <div className="min-w-0">
                      <p className="font-bold text-gray-900 truncate">{u.name}</p>
                      <p className="text-[10px] text-gray-500 uppercase font-semibold">{u.role} · {u.accountNumber}</p>
                    </div>
                  </div>

                  {currentUser.role === 'admin' && u.id !== currentUser.id ? (
                    <button
                      onClick={() => toggleUserStatus(u.id)}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-colors ${
                        u.status === 'active'
                          ? 'bg-emerald-100 hover:bg-rose-100 text-emerald-800 hover:text-rose-800 border border-emerald-300'
                          : 'bg-rose-100 hover:bg-emerald-100 text-rose-800 hover:text-emerald-800 border border-rose-300'
                      }`}
                      title="Alternar estado activo/inactivo"
                    >
                      {u.status === 'active' ? 'Activo' : 'De baja'}
                    </button>
                  ) : (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      {u.status === 'active' ? 'Activo' : 'Inactivo'}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB: CALENDAR & WORK AGENDA */}
      {adminTab === 'calendar' && (
        <WorkCalendarView />
      )}

      {/* TAB: MESSAGES & SUPPORT */}
      {adminTab === 'messages' && (
        <MessagesInbox />
      )}

      {/* TAB: PRINT FORMATS */}
      {adminTab === 'print_formats' && (
        <PrintFormatsView />
      )}

      {/* TAB: AUDIT LOGS (RF-0801) */}
      {adminTab === 'audit' && (
        <div className="bg-white rounded-3xl border border-[#D5E1D4] p-6 shadow-2xs space-y-4 text-xs">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-serif-brand text-xl font-bold text-gray-900">Módulo de Historial y Auditoría de Acciones (RF-0801)</h3>
              <p className="text-gray-500">Registro inmutable de todas las operaciones realizadas por usuarios en la plataforma</p>
            </div>
            <button
              onClick={() => showToast('Historial de logs exportado')}
              className="px-3 py-1.5 border border-[#CAD8C8] rounded-xl text-gray-700 hover:bg-[#EEF5ED] font-semibold"
            >
              Exportar CSV
            </button>
          </div>

          <div className="space-y-2">
            {logs.map(log => (
              <div key={log.id} className="p-3 rounded-xl bg-[#FAFBF9] border border-[#DEE6DD] flex flex-wrap items-center justify-between gap-2">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-gray-900">{log.action}</span>
                    <span className="px-2 py-0.5 rounded bg-gray-200 text-gray-800 font-bold text-[10px]">{log.module}</span>
                    <span className="text-gray-400">·</span>
                    <span className="text-gray-600 font-medium">Por: {log.userName} ({log.role})</span>
                  </div>
                  <p className="text-gray-500 text-[11px]">{log.details}</p>
                </div>
                <span className="font-mono text-gray-400 text-[11px]">{log.timestamp}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB: SETTINGS & POLICIES */}
      {adminTab === 'settings' && (
        <div className="space-y-6 text-xs max-w-3xl">
          {/* Header Card */}
          <div className="bg-white rounded-3xl border border-[#D5E1D4] p-6 shadow-2xs space-y-1">
            <h3 className="font-serif-brand text-xl font-bold text-gray-900">Configuración del Sistema Inmobiliario</h3>
            <p className="text-gray-500">Parámetros tributarios, servidor transaccional de correo y políticas de comisiones</p>
          </div>

          {/* CARD 1: CONTROL FISCAL DE RTN (EXCLUSIVO ADMINISTRADOR) */}
          <div className="bg-white rounded-3xl border border-[#D5E1D4] p-6 shadow-2xs space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
                  companySettings.includeTaxRtn !== false ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                }`}>
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-gray-900">Declaración Fiscal de RTN en Facturas y Recibos</h4>
                  <p className="text-[11px] text-gray-500">Parámetro reservado: Control exclusivo del Administrador</p>
                </div>
              </div>

              {/* Status Badge */}
              {companySettings.includeTaxRtn !== false ? (
                <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-700" />
                  RTN Habilitado en Facturación
                </span>
              ) : (
                <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-300 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-700" />
                  Régimen Exento (RTN Deshabilitado)
                </span>
              )}
            </div>

            <div className="p-4 rounded-2xl bg-[#FAFBF9] border border-[#DEE6DD] space-y-3">
              <div className="flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-[#2D4539] shrink-0 mt-0.5" />
                <p className="text-gray-700 leading-relaxed text-xs">
                  El RTN de la empresa (<strong className="font-mono text-gray-900">{companySettings.rtn}</strong>) se utiliza estrictamente para <strong>declarar impuestos en facturas y comprobantes oficiales</strong>. Esta directriz fiscal solo puede ser activada o desactivada por el usuario con rol de Administrador.
                </p>
              </div>

              {currentUser.role !== 'admin' ? (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 flex items-center gap-2">
                  <Lock className="w-4 h-4 text-rose-600 shrink-0" />
                  <span className="font-medium text-[11px]">
                    Acceso Restringido: Tu rol actual ({currentUser.role}) no tiene autorización para modificar el parámetro fiscal de RTN.
                  </span>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2 border-t border-gray-200">
                  <span className="text-gray-600 font-medium text-[11px]">
                    {companySettings.includeTaxRtn !== false 
                      ? 'Las facturas y recibos emitidos incluirán el RTN fiscal y desglose impositivo.' 
                      : 'Las facturas y recibos se emitirán con leyenda de Régimen Exento / Sin RTN Declarado.'}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      const next = !companySettings.includeTaxRtn;
                      updateCompanySettings({ includeTaxRtn: next });
                      showToast(next 
                        ? 'RTN habilitado para declaración en facturas y recibos' 
                        : 'RTN deshabilitado (Régimen de facturación exento)');
                    }}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 shadow-2xs ${
                      companySettings.includeTaxRtn !== false
                        ? 'bg-amber-700 hover:bg-amber-800 text-white'
                        : 'bg-emerald-700 hover:bg-emerald-800 text-white'
                    }`}
                  >
                    {companySettings.includeTaxRtn !== false ? (
                      <>
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Deshabilitar RTN en Facturas</span>
                      </>
                    ) : (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Habilitar RTN para Declaración</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* CARD 2: CONFIGURACIÓN DEL SERVIDOR DE CORREO SMTP (REAL) */}
          <div className="bg-white rounded-3xl border border-[#D5E1D4] p-6 shadow-2xs space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
              <div className="w-10 h-10 rounded-2xl bg-[#EEF5ED] text-[#2D4539] flex items-center justify-center">
                <Server className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-gray-900">Servidor de Correo Transaccional (SMTP)</h4>
                <p className="text-[11px] text-gray-500">Parámetros de conexión para envío de comprobantes y notificaciones</p>
              </div>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault();
              updateSmtpConfig({
                host: smtpHost,
                port: Number(smtpPort),
                secure: smtpSecure,
                username: smtpUser,
                password: smtpPass,
                fromEmail: smtpFromEmail,
                fromName: smtpFromName,
                isConfigured: true
              });
              showToast('Configuración SMTP guardada exitosamente en el sistema.');
            }} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="font-semibold text-gray-700 block mb-1">Host / Servidor SMTP</label>
                  <input
                    type="text"
                    required
                    value={smtpHost}
                    onChange={(e) => setSmtpHost(e.target.value)}
                    placeholder="smtp.terranova.hn o smtp.gmail.com"
                    className="w-full bg-[#FAFBF9] border border-[#CAD8C8] rounded-xl p-2.5 font-mono"
                  />
                </div>
                <div>
                  <label className="font-semibold text-gray-700 block mb-1">Puerto</label>
                  <input
                    type="number"
                    required
                    value={smtpPort}
                    onChange={(e) => setSmtpPort(Number(e.target.value))}
                    placeholder="587"
                    className="w-full bg-[#FAFBF9] border border-[#CAD8C8] rounded-xl p-2.5 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-gray-700 block mb-1">Usuario / Cuenta SMTP</label>
                  <input
                    type="text"
                    required
                    value={smtpUser}
                    onChange={(e) => setSmtpUser(e.target.value)}
                    placeholder="servidor@terranova.hn"
                    className="w-full bg-[#FAFBF9] border border-[#CAD8C8] rounded-xl p-2.5 font-mono"
                  />
                </div>
                <div>
                  <label className="font-semibold text-gray-700 block mb-1">Contraseña / Token de Aplicación</label>
                  <input
                    type="password"
                    required
                    value={smtpPass}
                    onChange={(e) => setSmtpPass(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full bg-[#FAFBF9] border border-[#CAD8C8] rounded-xl p-2.5 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-gray-700 block mb-1">Correo Remitente (From)</label>
                  <input
                    type="email"
                    required
                    value={smtpFromEmail}
                    onChange={(e) => setSmtpFromEmail(e.target.value)}
                    placeholder="notificaciones@terranova.hn"
                    className="w-full bg-[#FAFBF9] border border-[#CAD8C8] rounded-xl p-2.5"
                  />
                </div>
                <div>
                  <label className="font-semibold text-gray-700 block mb-1">Nombre Mostrado de Emisor</label>
                  <input
                    type="text"
                    required
                    value={smtpFromName}
                    onChange={(e) => setSmtpFromName(e.target.value)}
                    placeholder="Terranova Inmobiliaria Oficial"
                    className="w-full bg-[#FAFBF9] border border-[#CAD8C8] rounded-xl p-2.5"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="smtpSecureToggle"
                  checked={smtpSecure}
                  onChange={(e) => setSmtpSecure(e.target.checked)}
                  className="rounded text-[#2D4539] focus:ring-[#2D4539] h-4 w-4"
                />
                <label htmlFor="smtpSecureToggle" className="text-gray-700 font-medium cursor-pointer">
                  Habilitar Cifrado Estricto SSL/TLS (Puerto 465 / 587)
                </label>
              </div>

              {smtpTestResult && (
                <div className={`p-3 rounded-xl border flex items-center gap-2 text-xs ${
                  smtpTestResult.success ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-rose-50 border-rose-200 text-rose-900'
                }`}>
                  {smtpTestResult.success ? (
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                  )}
                  <span>{smtpTestResult.message}</span>
                </div>
              )}

              <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-100">
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-[#2D4539] hover:bg-[#20342A] text-white rounded-xl font-semibold transition-colors flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Guardar Configuración SMTP</span>
                </button>
                <button
                  type="button"
                  disabled={isTestingSmtp}
                  onClick={async () => {
                    setIsTestingSmtp(true);
                    setSmtpTestResult(null);
                    try {
                      const res = await testSmtpConnection({
                        host: smtpHost,
                        port: Number(smtpPort),
                        secure: smtpSecure,
                        username: smtpUser,
                        password: smtpPass,
                        fromEmail: smtpFromEmail,
                        fromName: smtpFromName,
                        isConfigured: true
                      });
                      setSmtpTestResult(res);
                      showToast(res.message);
                    } catch {
                      setSmtpTestResult({ success: false, message: 'Fallo al contactar el servidor SMTP.' });
                    } finally {
                      setIsTestingSmtp(false);
                    }
                  }}
                  className="px-4 py-2.5 border border-[#CAD8C8] hover:bg-[#EEF5ED] text-gray-800 rounded-xl font-semibold transition-colors flex items-center gap-1.5"
                >
                  {isTestingSmtp ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-gray-600 border-t-transparent rounded-full animate-spin" />
                      <span>Probando Conexión...</span>
                    </>
                  ) : (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 text-[#2D4539]" />
                      <span>Probar Conexión con Servidor</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* CARD 3: PARÁMETROS OPERATIVOS */}
          <div className="bg-white rounded-3xl border border-[#D5E1D4] p-6 shadow-2xs space-y-4">
            <h4 className="font-bold text-sm text-gray-900 border-b border-gray-100 pb-2">Políticas Comerciales y Plazos</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-3.5 rounded-xl bg-[#FAFBF9] border border-[#DEE6DD] space-y-1">
                <label className="font-bold text-gray-800 block">Comisión Cierre Venta (%)</label>
                <input type="number" defaultValue={4.5} step={0.5} className="w-full bg-white border border-[#CAD8C8] rounded-lg p-2 font-mono" />
                <p className="text-[10px] text-gray-500">Deducible del precio final de venta.</p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#FAFBF9] border border-[#DEE6DD] space-y-1">
                <label className="font-bold text-gray-800 block">Días de Gracia Renta</label>
                <input type="number" defaultValue={5} className="w-full bg-white border border-[#CAD8C8] rounded-lg p-2 font-mono" />
                <p className="text-[10px] text-gray-500">Días calendario antes de aplicar mora.</p>
              </div>
            </div>

            <button
              onClick={() => showToast('Políticas comerciales guardadas')}
              className="px-4 py-2 bg-[#2D4539] text-white rounded-xl font-semibold hover:bg-[#20342A] transition-colors"
            >
              Guardar Políticas Comerciales
            </button>
          </div>
        </div>
      )}

      {/* TAB: PAYROLL & EMPLOYEE COMMISSIONS */}
      {adminTab === 'payroll' && (
        <div className="space-y-6 text-xs">
          {/* Header & Explanatory Banner */}
          <div className="bg-white rounded-3xl border border-[#D5E1D4] p-6 shadow-2xs space-y-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <Coins className="w-5 h-5 text-[#2D4539]" />
                  <h3 className="font-serif-brand text-xl font-bold text-gray-900">
                    Nómina de Empleados & Comisiones por Ventas Inmobiliarias
                  </h3>
                </div>
                <p className="text-gray-500 mt-1">
                  Módulo de dispersión salarial y cálculo automático de comisiones por contratos de venta cerrados.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowAddEmpModal(true)}
                  className="px-4 py-2.5 rounded-xl bg-[#2D4539] hover:bg-[#20342A] text-white font-semibold text-xs flex items-center gap-1.5 shadow-2xs transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Nuevo Colaborador</span>
                </button>
              </div>
            </div>

            {/* Banner de Vinculación de Contratos y Comisiones */}
            <div className="p-4 rounded-2xl bg-[#F4F8F4] border border-[#CBD8CA] space-y-2">
              <div className="flex items-center gap-2 font-bold text-[#1E3628]">
                <TrendingUp className="w-4 h-4 text-emerald-700" />
                <span>Vinculación de Nómina con el Área de Contratos y Comisiones Escalonadas</span>
              </div>
              <p className="text-gray-700 leading-relaxed text-[11px]">
                En Terranova, cada asesor inmobiliario cuenta con un <strong>salario base mensual</strong> más <strong>comisiones directas vinculadas al valor de los contratos cerrados</strong>: entre más grande sea la venta, mayor es el incentivo económico. Por ejemplo, en el contrato del <strong>Terreno Panorámico Residencial El Hatillo vendido en $2,000,000 USD</strong>, la comisión total otorgada es del <strong>20% ($400,000 USD)</strong>: el agente que gestiona y cierra el contrato se acredita un <strong>2% ($40,000 USD)</strong> y Terranova retiene el <strong>18% ($360,000 USD)</strong>, sumado a su sueldo base ordinario ($1,200 USD).
              </p>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
              <div className="p-4 rounded-2xl bg-[#FAFBF9] border border-[#D5E1D4]">
                <div className="flex justify-between items-start">
                  <span className="text-[11px] font-semibold text-gray-600">Colaboradores Activos</span>
                  <Users className="w-4 h-4 text-[#2D4539]" />
                </div>
                <div className="mt-2">
                  <div className="text-xl font-bold font-serif-brand text-gray-900">
                    {employees.filter(e => e.status === 'Activo').length} Empleados
                  </div>
                  <span className="text-[10px] text-gray-500 font-medium">En plantilla activa oficial</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#FAFBF9] border border-[#D5E1D4]">
                <div className="flex justify-between items-start">
                  <span className="text-[11px] font-semibold text-gray-600">Salarios Base Mensual</span>
                  <DollarSign className="w-4 h-4 text-[#2D4539]" />
                </div>
                <div className="mt-2">
                  <div className="text-xl font-bold font-serif-brand text-gray-900 font-mono">
                    {formatMoney(employees.reduce((sum, e) => sum + e.baseSalary, 0))}
                  </div>
                  <span className="text-[10px] text-gray-500 font-medium">Compromiso ordinario fijo</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200">
                <div className="flex justify-between items-start">
                  <span className="text-[11px] font-semibold text-emerald-900">Comisiones de Venta Liquidadas</span>
                  <Coins className="w-4 h-4 text-emerald-700" />
                </div>
                <div className="mt-2">
                  <div className="text-xl font-bold font-serif-brand text-emerald-950 font-mono">
                    {formatMoney(payrollRecords.reduce((sum, r) => sum + r.totalCommissions, 0))}
                  </div>
                  <span className="text-[10px] text-emerald-800 font-medium">Incluye $40,000 USD de El Hatillo (2%)</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-200">
                <div className="flex justify-between items-start">
                  <span className="text-[11px] font-semibold text-purple-900">Total Nómina Dispersada</span>
                  <CreditCard className="w-4 h-4 text-purple-700" />
                </div>
                <div className="mt-2">
                  <div className="text-xl font-bold font-serif-brand text-purple-950 font-mono">
                    {formatMoney(payrollRecords.reduce((sum, r) => sum + r.netPayable, 0))}
                  </div>
                  <span className="text-[10px] text-purple-800 font-medium">Base + Comisiones acumuladas</span>
                </div>
              </div>
            </div>
          </div>

          {/* Tabla de Empleados */}
          <div className="bg-white rounded-3xl border border-[#D5E1D4] p-6 shadow-2xs space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div>
                <h4 className="font-serif-brand text-base font-bold text-gray-900">Plantilla de Empleados</h4>
                <p className="text-gray-500 text-[11px]">Registro de salarios base, cargos y cuentas bancarias de acreditación</p>
              </div>
              <button
                type="button"
                onClick={() => setShowAddEmpModal(true)}
                className="px-4 py-2 rounded-xl bg-[#2D4539] hover:bg-[#20342A] text-white font-semibold text-xs flex items-center gap-1.5 shadow-2xs transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Registrar Colaborador</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-200 text-gray-500 font-semibold bg-[#FAFBF9]">
                    <th className="p-3">Código</th>
                    <th className="p-3">Colaborador</th>
                    <th className="p-3">DNI / Identidad</th>
                    <th className="p-3">Cargo / Posición</th>
                    <th className="p-3">Salario Base</th>
                    <th className="p-3">% Comisión Estándar</th>
                    <th className="p-3">Cuenta de Acreditación</th>
                    <th className="p-3">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {employees.map(emp => (
                    <tr key={emp.id} className="hover:bg-gray-50 transition-colors">
                      <td className="p-3 font-mono font-bold text-gray-900">{emp.code}</td>
                      <td className="p-3">
                        <span className="font-bold text-gray-900 block">{emp.name}</span>
                        <span className="text-[10px] text-gray-500">{emp.email} · {emp.phone}</span>
                      </td>
                      <td className="p-3 font-mono text-gray-700">{emp.nationalId}</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-800 text-[10px] font-semibold border border-gray-200">
                          {emp.position}
                        </span>
                      </td>
                      <td className="p-3 font-mono font-bold text-gray-900">${emp.baseSalary.toLocaleString()} USD</td>
                      <td className="p-3 font-bold text-emerald-800">{emp.defaultCommissionPercent}%</td>
                      <td className="p-3 font-mono text-[11px]">
                        <span className="font-semibold text-gray-800 block">{emp.bankName}</span>
                        <span className="text-gray-500">{emp.bankAccountNumber}</span>
                      </td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold border border-emerald-300">
                          {emp.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Historial de Liquidaciones de Nómina con Comisiones Vinculadas */}
          <div className="bg-white rounded-3xl border border-[#D5E1D4] p-6 shadow-2xs space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="font-serif-brand text-base font-bold text-gray-900">
                  Liquidaciones de Nómina & Comisiones por Ventas Formalizadas
                </h4>
                <p className="text-gray-500 text-[11px]">
                  Recibos procesados con desglose de sueldo fijo e incentivo de ventas cerrado
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {payrollRecords.map(rec => (
                <div key={rec.id} className="p-5 rounded-2xl border border-gray-200 bg-[#FAFBF9] space-y-3">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-gray-200 pb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-[#2D4539] text-white flex items-center justify-center font-bold">
                        <Coins className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-sm text-gray-900">{rec.payrollNumber}</span>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            rec.status === 'Pagado' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {rec.status}
                          </span>
                        </div>
                        <p className="text-gray-600 font-semibold">{rec.employeeName} · <span className="text-gray-500 font-normal">{rec.position} ({rec.periodMonth} {rec.periodYear})</span></p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openPrintModal({ type: 'payroll_receipt', data: rec })}
                        className="px-3 py-1.5 rounded-xl bg-white border border-[#CBD8CA] hover:bg-[#EEF5ED] text-gray-800 font-semibold text-xs flex items-center gap-1.5 shadow-2xs transition-colors"
                      >
                        <Printer className="w-3.5 h-3.5 text-gray-600" />
                        <span>Ver Recibo de Liquidación</span>
                      </button>

                      {rec.status !== 'Pagado' && (
                        <button
                          onClick={() => processPayrollPayment(rec.id)}
                          className="px-3 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-2xs transition-colors"
                        >
                          <CreditCard className="w-3.5 h-3.5" />
                          <span>Dispersar Pago ACH</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Detalle económico y comisiones */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3 bg-white p-3.5 rounded-xl border border-gray-200">
                    <div>
                      <span className="text-gray-500 text-[10px] block">Salario Base Mensual</span>
                      <span className="font-mono font-bold text-gray-900 text-sm">${rec.baseSalary.toLocaleString()} USD</span>
                    </div>
                    <div>
                      <span className="text-gray-500 text-[10px] block">Comisiones por Ventas Cerradas</span>
                      <span className="font-mono font-bold text-emerald-800 text-sm">${rec.totalCommissions.toLocaleString()} USD</span>
                    </div>
                    <div>
                      <span className="text-gray-500 text-[10px] block">Vía de Dispersión / Banco</span>
                      <span className="text-gray-800 font-medium block truncate">{rec.paymentMethod}</span>
                      <span className="text-gray-500 text-[10px] font-mono">{rec.referenceCode || 'ACH-NOM-88492'}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 text-[10px] block">Neto Liquidado a Pagar</span>
                      <span className="font-mono font-bold text-emerald-900 text-base block font-serif-brand">
                        ${rec.netPayable.toLocaleString()} USD
                      </span>
                    </div>
                  </div>

                  {/* Listado de Contratos Vinculados a esta Liquidación */}
                  {rec.contractCommissions.length > 0 && (
                    <div className="bg-emerald-50/60 p-3 rounded-xl border border-emerald-200 space-y-1.5">
                      <span className="text-[10px] font-bold text-emerald-950 uppercase tracking-wider block">
                        Contratos Vinculados a la Liquidación:
                      </span>
                      {rec.contractCommissions.map((comm, idx) => (
                        <div key={idx} className="flex flex-col sm:flex-row justify-between items-start sm:items-center text-[11px] gap-2 pt-1 border-t border-emerald-200/60">
                          <div>
                            <span className="font-bold text-[#1E3628]">{comm.contractNumber}: {comm.propertyTitle}</span>
                            <span className="text-gray-600 block text-[10px]">
                              Monto de Venta: ${comm.saleAmount.toLocaleString()} USD · Comisión Total Acordada: {comm.totalCommissionPercent}% (${(comm.saleAmount * (comm.totalCommissionPercent / 100)).toLocaleString()} USD)
                            </span>
                          </div>
                          <div className="text-right shrink-0">
                            <span className="font-mono font-bold text-emerald-900 bg-emerald-200/70 px-2 py-0.5 rounded">
                              Agente {comm.agentCommissionPercent}%: +${comm.agentCommissionEarned.toLocaleString()} USD
                            </span>
                            <span className="text-[10px] text-gray-500 block">
                              Terranova {comm.terranovaCommissionPercent}%: ${comm.terranovaEarned.toLocaleString()} USD
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {rec.notes && (
                    <p className="text-[10px] text-gray-500 italic">
                      <strong>Nota de Auditoría:</strong> {rec.notes}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Modal: Generar Contrato (Admin) */}
      {showContractModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white border border-[#CBD8CA] rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="bg-[#2D4539] text-white p-5 flex items-center justify-between">
              <h3 className="font-serif-brand text-lg font-bold">Generador Automatizado de Contrato</h3>
              <button onClick={() => setShowContractModal(false)} className="text-white/70 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleGenerateContract} className="p-6 space-y-4 text-xs">
              {/* Tipo de Contrato */}
              <div>
                <label className="block font-bold text-gray-800 mb-1">Modalidad de Contrato</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'Arrendamiento', label: 'Arrendamiento' },
                    { id: 'Venta', label: 'Venta Directa' },
                    { id: 'Venta a Plazos', label: 'Venta a Plazos (Financiamiento)' }
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

              {/* Selector de Plantilla Estándar Oficial (PDF / Word) */}
              <div className="p-3.5 bg-[#F4F8F4] rounded-2xl border border-[#CBD8CA] space-y-1">
                <label className="block font-bold text-gray-800 text-xs">
                  Estándar / Plantilla Oficial de Contrato (PDF / Word)
                </label>
                <select
                  value={selectedTemplateId}
                  onChange={(e) => {
                    const id = e.target.value;
                    setSelectedTemplateId(id);
                    const tmpl = contractTemplates.find(t => t.id === id);
                    if (tmpl) {
                      setContractType(tmpl.type);
                    }
                  }}
                  className="w-full bg-white border border-[#CAD8C8] rounded-xl p-2 font-medium text-gray-800 text-xs"
                >
                  <option value="">-- Estándar General del Sistema --</option>
                  {contractTemplates.map(tmpl => (
                    <option key={tmpl.id} value={tmpl.id}>
                      [{tmpl.fileFormat.toUpperCase()}] {tmpl.name} ({tmpl.type})
                    </option>
                  ))}
                </select>
                <span className="text-[10px] text-gray-500 block">
                  * Al seleccionar una plantilla estándar, se aplican las cláusulas corporativas resguardadas en el almacenamiento.
                </span>
              </div>

              {/* Selector de Inmueble con Auto-relleno de Valores */}
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Inmueble Seleccionado</label>
                <select
                  value={contractPropId}
                  onChange={(e) => {
                    setContractPropId(e.target.value);
                    const p = properties.find(prop => prop.id === e.target.value);
                    if (p) {
                      setContractRent(p.price);
                      setContractDeposit(p.price);
                      setContractTotalValue(p.price);
                      setContractDownPayment(Math.round(p.price * 0.2));
                    }
                  }}
                  className="w-full bg-white border border-[#CBD8CA] rounded-xl p-2.5 font-medium text-gray-800"
                >
                  {properties.map(p => (
                    <option key={p.id} value={p.id}>{p.code} - {p.title} (${p.price.toLocaleString()} USD) [{p.status}]</option>
                  ))}
                </select>
                <span className="text-[10px] text-gray-500 mt-1 block">
                  * El valor del inmueble se asigna automáticamente al seleccionarlo del catálogo.
                </span>

                {/* ALERTA DE INTEGRIDAD: Si el inmueble ya tiene un contrato vigente */}
                {contracts.some(c => c.propertyId === contractPropId && (c.status === 'Vigente' || c.status === 'Activo')) && (
                  <div className="mt-2 p-3 rounded-xl bg-rose-50 border-2 border-rose-300 text-rose-900 space-y-1">
                    <div className="flex items-center gap-1.5 font-bold text-xs text-rose-800">
                      <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                      <span>Inmueble Ocupado con Contrato Vigente</span>
                    </div>
                    <p className="text-[11px] text-rose-800 leading-snug">
                      Un inmueble <strong>no puede tener dos inquilinos concurrentes</strong>. Actualmente este inmueble tiene un contrato activo/vigente. Cancele el contrato vigente primero para liberarlo a "Disponible".
                    </p>
                  </div>
                )}
              </div>

              {/* Aviso especial de Venta Directa: Traspaso a un solo dueño */}
              {contractType === 'Venta' && (
                <div className="p-3 bg-purple-50 rounded-xl border border-purple-200 text-purple-950 text-[11px] space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-purple-900">
                    <CheckCircle2 className="w-4 h-4 text-purple-700 shrink-0" />
                    <span>Traspaso Exclusivo de Dominio a Un Solo Dueño:</span>
                  </div>
                  <p className="text-purple-800 leading-snug">
                    Por disposición legal e inmobiliaria, al formalizarse la venta directa, la titularidad del inmueble pasará inmediatamente al adquirente único (<strong>{contractTenantName || 'comprador'}</strong>), quedando registrado como su propietario exclusivo.
                  </p>
                </div>
              )}

              {/* Campos especiales si es Venta a Plazos o Venta Directa */}
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
                        className="w-full bg-white border border-blue-300 rounded-xl p-2.5 font-mono font-bold"
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
                        <span className="font-mono text-lg font-bold text-blue-900 font-serif-brand">
                          ${(contractYears > 0 ? Math.round((contractTotalValue - contractDownPayment) / (contractYears * 12)) : 0).toLocaleString()} USD/mes
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Comisiones de Venta Pactadas */}
                  <div className="pt-2 border-t border-blue-200 space-y-2">
                    <span className="font-bold text-[11px] text-blue-950 block">
                      Comisiones Vinculadas a la Venta (Ej. Terreno El Hatillo)
                    </span>
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="block text-[10px] text-gray-600 mb-0.5">% Total Pactado</label>
                        <input
                          type="number"
                          value={contractTotalCommPercent}
                          onChange={(e) => setContractTotalCommPercent(Number(e.target.value))}
                          className="w-full bg-white border border-gray-300 rounded-lg p-2 font-mono font-bold"
                        />
                        <span className="text-[10px] text-gray-500 font-mono block mt-0.5">
                          ${Math.round(contractTotalValue * (contractTotalCommPercent / 100)).toLocaleString()} USD
                        </span>
                      </div>
                      <div>
                        <label className="block text-[10px] text-emerald-800 font-bold mb-0.5">% Asesor / Agente</label>
                        <input
                          type="number"
                          value={contractAgentCommPercent}
                          onChange={(e) => setContractAgentCommPercent(Number(e.target.value))}
                          className="w-full bg-emerald-50 border border-emerald-300 rounded-lg p-2 font-mono font-bold text-emerald-900"
                        />
                        <span className="text-[10px] text-emerald-800 font-mono font-bold block mt-0.5">
                          ${Math.round(contractTotalValue * (contractAgentCommPercent / 100)).toLocaleString()} USD
                        </span>
                      </div>
                      <div>
                        <label className="block text-[10px] text-gray-700 font-bold mb-0.5">% Terranova</label>
                        <input
                          type="number"
                          value={contractAgencyCommPercent}
                          onChange={(e) => setContractAgencyCommPercent(Number(e.target.value))}
                          className="w-full bg-white border border-gray-300 rounded-lg p-2 font-mono font-bold text-gray-800"
                        />
                        <span className="text-[10px] text-gray-600 font-mono block mt-0.5">
                          ${Math.round(contractTotalValue * (contractAgencyCommPercent / 100)).toLocaleString()} USD
                        </span>
                      </div>
                    </div>

                    <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950 flex justify-between items-center text-[11px]">
                      <div>
                        <span className="font-bold block">Neto para el Dueño del Terreno:</span>
                        <span className="text-gray-600">
                          {contractType === 'Venta' ? 'Venta Directa: Liquidación total inmediata' : 'Venta a Plazos: Se va depositando proporcionalmente con cada cuota'}
                        </span>
                      </div>
                      <span className="font-mono font-bold text-sm text-emerald-900 font-serif-brand">
                        {100 - contractTotalCommPercent}% (${Math.round(contractTotalValue * ((100 - contractTotalCommPercent) / 100)).toLocaleString()} USD)
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Selector de Inquilino / Cliente */}
              <div className="p-3 bg-[#FAFBF9] rounded-xl border border-gray-200">
                <label className="block font-semibold text-gray-700 mb-1">
                  Cargar Datos de Cliente / Inquilino Registrado (Autocompletar)
                </label>
                <select
                  onChange={(e) => {
                    const u = users.find(usr => usr.id === e.target.value);
                    if (u) {
                      setContractTenantName(u.name);
                      setContractTenantEmail(u.email);
                      setContractTenantPhone(u.phone);
                    }
                  }}
                  className="w-full bg-white border border-[#CAD8C8] rounded-xl p-2 text-xs"
                >
                  <option value="">-- Seleccionar usuario para rellenar campos --</option>
                  {users.filter(u => u.role === 'tenant' || u.role === 'client').map(u => (
                    <option key={u.id} value={u.id}>
                      {u.name} ({u.role === 'tenant' ? 'Inquilino' : 'Cliente'}) · {u.email}
                    </option>
                  ))}
                </select>
              </div>

              {/* Datos del Cliente: Nombre, ID, Teléfono, Correo */}
              <div className="space-y-3 pt-1">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">Nombre Completo</label>
                    <input
                      type="text"
                      required
                      value={contractTenantName}
                      onChange={(e) => {
                        const cleaned = e.target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '');
                        setContractTenantName(cleaned);
                      }}
                      className="w-full bg-white border border-[#CAD8C8] rounded-xl p-2.5 font-medium"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">DNI / Tarjeta de Identidad</label>
                    <input
                      type="text"
                      required
                      placeholder="0801-1996-04812"
                      value={contractTenantNationalId}
                      onChange={(e) => setContractTenantNationalId(e.target.value)}
                      className="w-full bg-white border border-[#CAD8C8] rounded-xl p-2.5 font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">Teléfono de Contacto</label>
                    <input
                      type="tel"
                      required
                      placeholder="+504 9623-4567"
                      value={contractTenantPhone}
                      onChange={(e) => {
                        const cleaned = e.target.value.replace(/[^0-9+\s-]/g, '');
                        setContractTenantPhone(cleaned);
                      }}
                      className="w-full bg-white border border-[#CAD8C8] rounded-xl p-2.5 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">Correo Electrónico</label>
                    <input
                      type="email"
                      required
                      value={contractTenantEmail}
                      onChange={(e) => setContractTenantEmail(e.target.value)}
                      className="w-full bg-white border border-[#CAD8C8] rounded-xl p-2.5"
                    />
                  </div>
                </div>
              </div>

              {/* Asesor Asignado y Modalidad de Firma */}
              <div className="p-3 bg-[#FAFBF9] rounded-xl border border-gray-200 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-gray-800 text-[11px] mb-1">Asesor Responsable</label>
                    <select
                      value={contractAgentAssigned}
                      onChange={(e) => setContractAgentAssigned(e.target.value)}
                      className="w-full bg-white border border-gray-300 rounded-lg p-2 text-xs font-semibold"
                    >
                      {employees.map(emp => (
                        <option key={emp.id} value={emp.name}>{emp.name} ({emp.position})</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-gray-800 text-[11px] mb-1">Modalidad de Firma</label>
                    <select
                      value={contractSignatureMode}
                      onChange={(e) => setContractSignatureMode(e.target.value as any)}
                      className="w-full bg-white border border-gray-300 rounded-lg p-2 text-xs font-semibold"
                    >
                      <option value="digital">Firma Digital Inmediata en Pantalla</option>
                      <option value="fisica_presencial">Firma Física Presencial (Carga de PDF/Escaneo)</option>
                    </select>
                  </div>
                </div>
                <p className="text-[10px] text-gray-500">
                  * Si selecciona Firma Física, el contrato quedará en estado "Pendiente de Subida" y el agente deberá subir el escaneo firmado. No se podrá imprimir sin firmas.
                </p>
              </div>

              {/* Cuenta Bancaria que Recibirá el Dinero */}
              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Cuenta Bancaria Receptora Oficial (Circulada en el Contrato)
                </label>
                <select
                  value={contractReceivingAccount}
                  onChange={(e) => setContractReceivingAccount(e.target.value)}
                  className="w-full bg-emerald-50/50 border border-emerald-300 rounded-xl p-2.5 font-bold text-[#1E3628]"
                >
                  {companySettings.bankAccounts.map((b) => (
                    <option key={b.id} value={b.accountNumber}>
                      {b.bankName} - Cuenta {b.accountNumber} ({b.accountType}) {b.isDefaultReceiving ? '★ Receptora Principal' : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Fecha de Inicio</label>
                  <input
                    type="date"
                    required
                    value={contractStartDate}
                    onChange={(e) => setContractStartDate(e.target.value)}
                    className="w-full bg-white border border-[#CAD8C8] rounded-xl p-2.5"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Fecha de Vencimiento</label>
                  <input
                    type="date"
                    required
                    value={contractEndDate}
                    onChange={(e) => setContractEndDate(e.target.value)}
                    className="w-full bg-white border border-[#CAD8C8] rounded-xl p-2.5"
                  />
                </div>
              </div>

              {contractType === 'Arrendamiento' && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">Canon Mensual (USD)</label>
                    <input
                      type="number"
                      required
                      value={contractRent}
                      onChange={(e) => setContractRent(Number(e.target.value))}
                      className="w-full bg-white border border-[#CAD8C8] rounded-xl p-2.5 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">Depósito en Garantía (USD)</label>
                    <input
                      type="number"
                      required
                      value={contractDeposit}
                      onChange={(e) => setContractDeposit(Number(e.target.value))}
                      className="w-full bg-white border border-[#CAD8C8] rounded-xl p-2.5 font-mono"
                    />
                  </div>
                </div>
              )}

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowContractModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={contracts.some(c => c.propertyId === contractPropId && (c.status === 'Vigente' || c.status === 'Activo'))}
                  className={`px-5 py-2.5 rounded-xl font-semibold transition-colors flex items-center gap-1.5 shadow-2xs ${
                    contracts.some(c => c.propertyId === contractPropId && (c.status === 'Vigente' || c.status === 'Activo'))
                      ? 'bg-gray-400 text-gray-200 cursor-not-allowed opacity-60'
                      : 'bg-[#2D4539] hover:bg-[#20342A] text-white'
                  }`}
                  title={contracts.some(c => c.propertyId === contractPropId && (c.status === 'Vigente' || c.status === 'Activo')) ? 'Inmueble con contrato vigente: debe cancelarse antes' : 'Emitir y Generar Contrato'}
                >
                  <Plus className="w-4 h-4" />
                  <span>Emitir y Generar Contrato</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Programar Mantenimiento (Admin) */}
      {showMntModalAdmin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white border border-[#CBD8CA] rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="bg-[#2D4539] text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Wrench className="w-5 h-5 text-[#A3C7AD]" />
                <h3 className="font-serif-brand text-lg font-bold">Programar Orden de Mantenimiento & Reparación</h3>
              </div>
              <button onClick={() => setShowMntModalAdmin(false)} className="text-white/70 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAdminMaintenanceSubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Inmueble / Propiedad</label>
                <select
                  value={mntPropId || properties[0]?.id}
                  onChange={(e) => setMntPropId(e.target.value)}
                  className="w-full bg-white border border-[#CBD8CA] rounded-xl p-2.5 font-medium text-gray-800"
                >
                  {properties.map(p => (
                    <option key={p.id} value={p.id}>
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
                    className="w-full bg-white border border-[#CBD8CA] rounded-xl p-2.5 text-gray-800"
                  >
                    <option value="Preventivo">Preventivo (Pintura, tejado, fontanería)</option>
                    <option value="Correctivo">Correctivo (Reparación puntual)</option>
                    <option value="Emergencia">Emergencia (Urgente 24h)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Nivel de Prioridad</label>
                  <select
                    value={mntPriority}
                    onChange={(e) => setMntPriority(e.target.value as any)}
                    className="w-full bg-white border border-[#CBD8CA] rounded-xl p-2.5 text-gray-800"
                  >
                    <option value="Baja">Baja (Programada a 15 días)</option>
                    <option value="Media">Media (Esta semana)</option>
                    <option value="Alta">Alta (Inmediata / Crítica)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Contratista / Técnico Asignado</label>
                  <select
                    value={mntContractor}
                    onChange={(e) => setMntContractor(e.target.value)}
                    className="w-full bg-white border border-[#CBD8CA] rounded-xl p-2.5 text-gray-800 font-medium"
                  >
                    <option value="Carlos Murillo (Servicios Pro)">Carlos Murillo (Servicios Pro)</option>
                    <option value="Técnicos Eléctricos & Climatización S.A.">Técnicos Eléctricos & Climatización S.A.</option>
                    <option value="Fontanería & Albañilería Express">Fontanería & Albañilería Express</option>
                    <option value="Pinturas & Remodelaciones Rápidas">Pinturas & Remodelaciones Rápidas</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Presupuesto Estimado (USD)</label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={mntEstimatedCost}
                    onChange={(e) => setMntEstimatedCost(Number(e.target.value))}
                    className="w-full bg-white border border-[#CBD8CA] rounded-xl p-2.5 font-mono text-gray-800"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Descripción Detallada de los Trabajos</label>
                <textarea
                  required
                  rows={3}
                  value={mntDesc}
                  onChange={(e) => setMntDesc(e.target.value)}
                  placeholder="Detalla las reparaciones requeridas, materiales necesarios o acceso requerido..."
                  className="w-full bg-white border border-[#CBD8CA] rounded-xl p-2.5 text-gray-800"
                ></textarea>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowMntModalAdmin(false)}
                  className="px-4 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#2D4539] hover:bg-[#20342A] text-white font-semibold transition-colors flex items-center gap-1.5 shadow-2xs"
                >
                  <Wrench className="w-3.5 h-3.5" />
                  <span>Crear y Despachar Orden</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Registrar Inmueble con Código Automático (Admin) */}
      {showAddPropAdminModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white border border-[#CBD8CA] rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="bg-[#2D4539] text-white p-5 flex items-center justify-between">
              <div>
                <h3 className="font-serif-brand text-lg font-bold">Registrar Nueva Propiedad en Catálogo</h3>
                <p className="text-xs text-white/70">Código identificador generado automáticamente según norma del sistema</p>
              </div>
              <button onClick={() => setShowAddPropAdminModal(false)} className="text-white/70 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddPropAdminSubmit} className="p-6 space-y-4 text-xs">
              {/* Código Automático */}
              <div className="p-3 bg-[#EEF5ED] rounded-xl border border-[#CAD8C8] flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-gray-600 block">Código Identificador Oficial:</span>
                  <span className="font-mono text-base font-bold text-[#1E3628]">
                    {generatePropertyCode(adminPropType)}
                  </span>
                </div>
                <span className="px-2.5 py-1 bg-[#2D4539] text-white text-[10px] font-bold rounded-lg">
                  ✓ Generado Automáticamente
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Tipo de Inmueble</label>
                  <select
                    value={adminPropType}
                    onChange={(e) => setAdminPropType(e.target.value as any)}
                    className="w-full bg-white border border-[#CAD8C8] rounded-xl p-2.5"
                  >
                    <option value="Casa">Casa Unifamiliar</option>
                    <option value="Apartamento">Apartamento Residencial</option>
                    <option value="Terreno">Terreno / Lote</option>
                    <option value="Local Comercial">Local Comercial</option>
                    <option value="Villa">Villa Campestre</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Operación</label>
                  <select
                    value={adminPropTxn}
                    onChange={(e) => setAdminPropTxn(e.target.value as any)}
                    className="w-full bg-white border border-[#CAD8C8] rounded-xl p-2.5"
                  >
                    <option value="Alquiler">Alquiler Mensual</option>
                    <option value="Venta">Venta Directa</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Título de la Propiedad</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Residencia Las Cumbres - Nivel Ejecutivo"
                  value={adminPropTitle}
                  onChange={(e) => setAdminPropTitle(e.target.value)}
                  className="w-full bg-white border border-[#CAD8C8] rounded-xl p-2.5"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Dirección Exacta</label>
                  <input
                    type="text"
                    required
                    placeholder="Col. Palmira, Calle Principal"
                    value={adminPropAddress}
                    onChange={(e) => setAdminPropAddress(e.target.value)}
                    className="w-full bg-white border border-[#CAD8C8] rounded-xl p-2.5"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Ciudad / Municipio</label>
                  <input
                    type="text"
                    required
                    value={adminPropCity}
                    onChange={(e) => setAdminPropCity(e.target.value)}
                    className="w-full bg-white border border-[#CAD8C8] rounded-xl p-2.5"
                  />
                </div>
              </div>

              <div className="grid grid-cols-4 gap-2">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Precio (USD)</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={adminPropPrice}
                    onChange={(e) => setAdminPropPrice(Number(e.target.value))}
                    className="w-full bg-white border border-[#CAD8C8] rounded-xl p-2 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Área (m²)</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={adminPropSize}
                    onChange={(e) => setAdminPropSize(Number(e.target.value))}
                    className="w-full bg-white border border-[#CAD8C8] rounded-xl p-2 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Habitaciones</label>
                  <input
                    type="number"
                    min={0}
                    value={adminPropBeds}
                    onChange={(e) => setAdminPropBeds(Number(e.target.value))}
                    className="w-full bg-white border border-[#CAD8C8] rounded-xl p-2 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Baños</label>
                  <input
                    type="number"
                    min={0}
                    step={0.5}
                    value={adminPropBaths}
                    onChange={(e) => setAdminPropBaths(Number(e.target.value))}
                    className="w-full bg-white border border-[#CAD8C8] rounded-xl p-2 font-mono"
                  />
                </div>
              </div>

              {/* Adjuntar Imágenes de la Propiedad */}
              <PropertyImageUploader
                images={adminPropImages}
                onChange={setAdminPropImages}
                maxImages={8}
              />

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Descripción de la Propiedad</label>
                <textarea
                  rows={3}
                  value={adminPropDesc}
                  onChange={(e) => setAdminPropDesc(e.target.value)}
                  placeholder="Detalles sobre amenidades, acabados, seguridad y servicios incluidos..."
                  className="w-full bg-white border border-[#CAD8C8] rounded-xl p-2.5"
                ></textarea>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddPropAdminModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#2D4539] hover:bg-[#20342A] text-white font-semibold transition-colors flex items-center gap-1.5 shadow-2xs"
                >
                  <Plus className="w-4 h-4" />
                  <span>Guardar y Publicar en Catálogo</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Registrar Nuevo Colaborador / Empleado */}
      {showAddEmpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white border border-[#CBD8CA] rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="bg-[#2D4539] text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-[#A3C7AD]" />
                <h3 className="font-serif-brand text-lg font-bold">Registrar Nuevo Colaborador</h3>
              </div>
              <button onClick={() => setShowAddEmpModal(false)} className="text-white/70 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!newEmpName.trim()) {
                  showToast('Por favor ingrese el nombre del colaborador');
                  return;
                }
                addEmployee({
                  name: newEmpName.trim(),
                  email: newEmpEmail.trim(),
                  phone: newEmpPhone.trim(),
                  nationalId: newEmpDni.trim() || '0801-1990-12345',
                  position: newEmpPosition,
                  baseSalary: Number(newEmpBaseSalary) || 900,
                  bankName: newEmpBank,
                  bankAccountNumber: newEmpAccount.trim() || '1100-2200-3300-44',
                  status: 'Activo',
                  startDate: new Date().toISOString().split('T')[0],
                  defaultCommissionPercent: Number(newEmpCommPercent) || 2
                });
                setShowAddEmpModal(false);
                setNewEmpName('');
                setNewEmpEmail('');
                setNewEmpPhone('+504 ');
                setNewEmpDni('');
                setNewEmpAccount('');
              }}
              className="p-6 space-y-4 text-xs"
            >
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Nombre Completo (Solo letras y espacios)</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Anthony Rafael Alfaro"
                  value={newEmpName}
                  onChange={(e) => {
                    const clean = e.target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]/g, '');
                    setNewEmpName(clean);
                  }}
                  className="w-full bg-white border border-[#CAD8C8] rounded-xl p-2.5 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Correo Electrónico</label>
                  <input
                    type="email"
                    required
                    placeholder="colaborador@terranova.hn"
                    value={newEmpEmail}
                    onChange={(e) => setNewEmpEmail(e.target.value)}
                    className="w-full bg-white border border-[#CAD8C8] rounded-xl p-2.5"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Teléfono (Solo números y formato)</label>
                  <input
                    type="tel"
                    required
                    placeholder="+504 9988-7766"
                    value={newEmpPhone}
                    onChange={(e) => {
                      const clean = e.target.value.replace(/[^\d+()-\s]/g, '');
                      setNewEmpPhone(clean);
                    }}
                    className="w-full bg-white border border-[#CAD8C8] rounded-xl p-2.5 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">DNI / Identidad (13 dígitos)</label>
                  <input
                    type="text"
                    required
                    placeholder="0801-1995-12345"
                    value={newEmpDni}
                    onChange={(e) => {
                      const clean = e.target.value.replace(/[^\d-]/g, '');
                      setNewEmpDni(clean);
                    }}
                    className="w-full bg-white border border-[#CAD8C8] rounded-xl p-2.5 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Cargo / Posición</label>
                  <select
                    value={newEmpPosition}
                    onChange={(e) => setNewEmpPosition(e.target.value as any)}
                    className="w-full bg-white border border-[#CAD8C8] rounded-xl p-2.5"
                  >
                    <option value="Agente Inmobiliario Senior">Agente Inmobiliario Senior</option>
                    <option value="Agente Inmobiliario Junior">Agente Inmobiliario Junior</option>
                    <option value="Asistente Administrativo">Asistente Administrativo</option>
                    <option value="Coordinador Legal">Coordinador Legal</option>
                    <option value="Asesor Comercial">Asesor Comercial</option>
                    <option value="Contratista de Obras">Contratista de Obras</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Salario Base Mensual (USD)</label>
                  <input
                    type="number"
                    min={0}
                    step={50}
                    required
                    value={newEmpBaseSalary}
                    onChange={(e) => setNewEmpBaseSalary(Number(e.target.value))}
                    className="w-full bg-white border border-[#CAD8C8] rounded-xl p-2.5 font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">% Comisión Estándar de Ventas</label>
                  <input
                    type="number"
                    min={0}
                    max={50}
                    step={0.5}
                    required
                    value={newEmpCommPercent}
                    onChange={(e) => setNewEmpCommPercent(Number(e.target.value))}
                    className="w-full bg-white border border-[#CAD8C8] rounded-xl p-2.5 font-mono font-bold text-emerald-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Banco de Acreditación ACH</label>
                  <select
                    value={newEmpBank}
                    onChange={(e) => setNewEmpBank(e.target.value)}
                    className="w-full bg-white border border-[#CAD8C8] rounded-xl p-2.5"
                  >
                    <option value="Banco Atlántida">Banco Atlántida</option>
                    <option value="BAC Credomatic">BAC Credomatic</option>
                    <option value="Banco Ficohsa">Banco Ficohsa</option>
                    <option value="Banpaís">Banpaís</option>
                    <option value="Banco de Occidente">Banco de Occidente</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Número de Cuenta Bancaria</label>
                  <input
                    type="text"
                    required
                    placeholder="1100-2200-3300-44"
                    value={newEmpAccount}
                    onChange={(e) => {
                      const clean = e.target.value.replace(/[^\d-]/g, '');
                      setNewEmpAccount(clean);
                    }}
                    className="w-full bg-white border border-[#CAD8C8] rounded-xl p-2.5 font-mono"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddEmpModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#2D4539] hover:bg-[#20342A] text-white font-semibold transition-colors flex items-center gap-1.5 shadow-2xs"
                >
                  <Plus className="w-4 h-4" />
                  <span>Guardar Colaborador</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Invalidar Documento de Contrato (Exclusivo Administrador) */}
      {invalidationModalContract && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white border border-rose-300 rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="bg-rose-900 text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-rose-300" />
                <h3 className="font-serif-brand text-lg font-bold">Invalidar Documento Escaneado</h3>
              </div>
              <button onClick={() => setInvalidationModalContract(null)} className="text-white/70 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-950 space-y-2">
                <p className="font-bold text-sm">
                  Contrato {invalidationModalContract.contractNumber} — {invalidationModalContract.propertyTitle}
                </p>
                <p className="text-[11px] text-rose-800">
                  Inquilino / Comprador: <span className="font-semibold">{invalidationModalContract.tenantName}</span>
                </p>
                {invalidationModalContract.signedDocumentFileName && (
                  <p className="font-mono text-[11px] text-gray-700 bg-white p-2 rounded-lg border border-rose-200">
                    Archivo actual: <strong>{invalidationModalContract.signedDocumentFileName}</strong>
                  </p>
                )}
                {invalidationModalContract.invalidationReason && (
                  <div className="bg-white p-2.5 rounded-lg border border-rose-200 text-gray-800">
                    <span className="font-bold block text-rose-900 mb-0.5">Motivo reportado por el agente:</span>
                    <span>"{invalidationModalContract.invalidationReason}"</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Notas de Autorización Administrativa
                </label>
                <textarea
                  rows={3}
                  value={invalidationNotes}
                  onChange={(e) => setInvalidationNotes(e.target.value)}
                  placeholder="Explique el motivo por el cual se invalida el archivo cargado para habilitar la resubida..."
                  className="w-full bg-white border border-gray-300 rounded-xl p-2.5"
                />
              </div>

              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 text-[11px]">
                ⚠️ <strong>Aviso de Seguridad:</strong> Al invalidar este documento, se desvinculará el archivo previo y el agente podrá cargar un único nuevo escaneo/PDF firmado con las correcciones necesarias.
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setInvalidationModalContract(null)}
                  className="px-4 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={() => {
                    invalidateContractDocument(invalidationModalContract.id, invalidationNotes);
                    setInvalidationModalContract(null);
                    setInvalidationNotes('');
                  }}
                  className="px-5 py-2.5 rounded-xl bg-rose-700 hover:bg-rose-800 text-white font-bold transition-colors flex items-center gap-1.5 shadow-2xs"
                >
                  <FileX2 className="w-4 h-4" />
                  <span>Confirmar Invalidación de Documento</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Confirmación de Cancelación de Contrato (Liberación de Inmueble) */}
      {cancelModalContract && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white border border-[#CBD8CA] rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2 text-rose-700">
                <AlertTriangle className="w-5 h-5 shrink-0" />
                <h3 className="font-serif-brand text-base font-bold text-gray-900">
                  Cancelar Contrato & Liberar Inmueble
                </h3>
              </div>
              <button onClick={() => setCancelModalContract(null)} className="text-gray-400 hover:text-gray-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-amber-950 space-y-1">
              <span className="font-bold text-xs block">Expediente N°: {cancelModalContract.contractNumber}</span>
              <p className="text-[11px] text-amber-900">
                Inmueble: <strong>{cancelModalContract.propertyCode}</strong> - {cancelModalContract.propertyTitle}<br />
                Inquilino Actual: <strong>{cancelModalContract.tenantName}</strong>
              </p>
            </div>

            <p className="text-gray-600 text-[11px] leading-relaxed">
              Al confirmar la cancelación, este contrato pasará al estado <strong>"Cancelado"</strong> y el inmueble <strong>{cancelModalContract.propertyCode}</strong> quedará automáticamente liberado a estado <strong>"Disponible"</strong> en el catálogo para ser asignado a un nuevo cliente o venta.
            </p>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">
                Motivo de la Cancelación / Rescisión:
              </label>
              <input
                type="text"
                required
                value={cancellationReasonInput}
                onChange={(e) => setCancellationReasonInput(e.target.value)}
                placeholder="Ej. Desocupación anticipada de mutuo acuerdo, rescisión legal..."
                className="w-full bg-white border border-gray-300 rounded-xl p-2.5 text-xs font-medium"
              />
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setCancelModalContract(null)}
                className="px-4 py-2 rounded-xl border border-gray-300 text-gray-700 font-semibold text-xs"
              >
                Volver
              </button>
              <button
                type="button"
                onClick={() => {
                  cancelContract(cancelModalContract.id, cancellationReasonInput || 'Cancelación de común acuerdo');
                  setCancelModalContract(null);
                }}
                className="px-4 py-2 rounded-xl bg-rose-700 hover:bg-rose-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-2xs"
              >
                <XCircle className="w-4 h-4" />
                <span>Confirmar Cancelación y Liberar</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Subir Nueva Plantilla de Contrato (PDF / Word) */}
      {showAddTemplateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white border border-[#CBD8CA] rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="bg-[#2D4539] text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileCheck2 className="w-5 h-5 text-[#A3C7AD]" />
                <h3 className="font-serif-brand text-lg font-bold">Subir Estándar Oficial de Contrato</h3>
              </div>
              <button onClick={() => setShowAddTemplateModal(false)} className="text-white/70 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!templateName.trim()) {
                  showToast('Por favor ingrese el nombre del estándar');
                  return;
                }
                const defaultClauses = [
                  'PRIMERA: OBJETO DEL CONTRATO. El titular dispone el bien inmueble identificado en la ficha técnica conforme a derecho.',
                  'SEGUNDA: CONDICIONES ECONÓMICAS Y FORMA DE PAGO. Se pacta el precio de la transacción pagadero en la cuenta oficial acreditada.',
                  'TERCERA: OBLIGACIONES DE LAS PARTES. Las partes asumen el fiel cumplimiento de los términos y causales de rescisión pactadas.',
                  'CUARTA: DOMINIO Y VALIDEZ LEGAL. El contrato surte plenos efectos con las firmas autógrafas o digitales verificadas.'
                ];
                const parsedClauses = templateClausesText.trim()
                  ? templateClausesText.split('\n').map(l => l.trim()).filter(Boolean)
                  : defaultClauses;

                addContractTemplate({
                  name: templateName.trim(),
                  type: templateType,
                  fileFormat: templateFormat,
                  fileName: templateFileName.trim() || `Estandar_${templateType.replace(/\s+/g, '_')}_2024.${templateFormat}`,
                  description: templateDescription.trim() || `Estándar oficial de ${templateType} para la cartera de Terranova Inversiones.`,
                  clauses: parsedClauses,
                  uploadedBy: `${currentUser.name} (Admin)`,
                  isDefault: false
                });

                setShowAddTemplateModal(false);
              }}
              className="p-6 space-y-4 text-xs"
            >
              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Nombre del Estándar / Modelo de Contrato
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Estándar Oficial de Compraventa Inmobiliaria 2024"
                  value={templateName}
                  onChange={(e) => setTemplateName(e.target.value)}
                  className="w-full bg-white border border-[#CAD8C8] rounded-xl p-2.5 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Modalidad de Contrato</label>
                  <select
                    value={templateType}
                    onChange={(e) => setTemplateType(e.target.value as any)}
                    className="w-full bg-white border border-[#CAD8C8] rounded-xl p-2.5"
                  >
                    <option value="Arrendamiento">Arrendamiento Residencial</option>
                    <option value="Venta">Venta Directa (Un Solo Dueño)</option>
                    <option value="Venta a Plazos">Venta a Plazos (Con Prima y Cuotas)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Formato de Archivo</label>
                  <select
                    value={templateFormat}
                    onChange={(e) => setTemplateFormat(e.target.value as any)}
                    className="w-full bg-white border border-[#CAD8C8] rounded-xl p-2.5"
                  >
                    <option value="docx">Microsoft Word (.docx / .doc)</option>
                    <option value="pdf">Documento PDF (.pdf)</option>
                  </select>
                </div>
              </div>

              {/* Subir archivo Word o PDF */}
              <div className="p-4 bg-[#FAFBF9] rounded-2xl border-2 border-dashed border-[#CAD8C8] space-y-2 text-center">
                <UploadCloud className="w-8 h-8 text-[#2D4539] mx-auto" />
                <span className="block font-bold text-gray-800 text-xs">
                  Cargar Archivo Estándar (.docx o .pdf)
                </span>
                <input
                  type="file"
                  accept=".docx, .doc, .pdf"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) {
                      setTemplateFileName(f.name);
                      if (f.name.endsWith('.pdf')) setTemplateFormat('pdf');
                      if (f.name.endsWith('.docx') || f.name.endsWith('.doc')) setTemplateFormat('docx');
                      showToast(`Archivo "${f.name}" seleccionado.`);
                    }
                  }}
                  className="text-xs file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-[#2D4539] file:text-white hover:file:bg-[#1E3328] cursor-pointer"
                />
                {templateFileName && (
                  <p className="text-[11px] font-mono text-emerald-800 font-bold">
                    ✓ Archivo: {templateFileName}
                  </p>
                )}
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Descripción y Finalidad Legal</label>
                <textarea
                  rows={2}
                  value={templateDescription}
                  onChange={(e) => setTemplateDescription(e.target.value)}
                  placeholder="Explique el alcance y requerimientos de esta plantilla..."
                  className="w-full bg-white border border-[#CAD8C8] rounded-xl p-2.5 text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Cláusulas Institucionales (Una por renglón)
                </label>
                <textarea
                  rows={4}
                  value={templateClausesText}
                  onChange={(e) => setTemplateClausesText(e.target.value)}
                  placeholder="PRIMERA: Objeto del contrato...\nSEGUNDA: Canon o valor convenido...\nTERCERA: Depósito o forma de pago..."
                  className="w-full bg-white border border-[#CAD8C8] rounded-xl p-2.5 font-mono text-[11px]"
                />
                <span className="text-[10px] text-gray-400 block mt-0.5">
                  * Si deja este campo vacío, se cargarán las cláusulas estándar recomendadas de Terranova.
                </span>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddTemplateModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#2D4539] hover:bg-[#1E3328] text-white font-bold transition-colors flex items-center gap-1.5 shadow-2xs"
                >
                  <Plus className="w-4 h-4" />
                  <span>Guardar Plantilla en Almacenamiento</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Vista Previa de Cláusulas de Plantilla */}
      {previewTemplate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white border border-[#CBD8CA] rounded-3xl max-w-xl w-full max-h-[85vh] overflow-y-auto shadow-2xl p-6 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  Estándar {previewTemplate.fileFormat.toUpperCase()} · {previewTemplate.type}
                </span>
                <h3 className="font-serif-brand text-base font-bold text-gray-900 mt-1">
                  {previewTemplate.name}
                </h3>
              </div>
              <button onClick={() => setPreviewTemplate(null)} className="text-gray-400 hover:text-gray-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-gray-600 text-xs leading-relaxed">{previewTemplate.description}</p>

            <div className="space-y-2 bg-[#FAFBF9] p-4 rounded-2xl border border-gray-200">
              <span className="font-bold text-gray-800 block text-xs uppercase tracking-wide border-b pb-1">
                Cláusulas Oficiales Registradas ({previewTemplate.clauses.length}):
              </span>
              <div className="space-y-2.5 pt-1 text-gray-700 leading-relaxed text-justify">
                {previewTemplate.clauses.map((clause, idx) => (
                  <p key={idx} className="border-l-2 border-[#2D4539] pl-3 py-0.5">
                    {clause}
                  </p>
                ))}
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setPreviewTemplate(null)}
                className="px-4 py-2 rounded-xl bg-[#2D4539] text-white font-semibold text-xs"
              >
                Cerrar Vista Previa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
