export type UserRole = 'admin' | 'agent' | 'owner' | 'tenant' | 'client' | 'contractor' | 'technician' | 'guest';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  nationalId?: string; // DNI Honduras (13 dígitos numéricos)
  role: UserRole;
  avatar?: string;
  isSubscribed?: boolean; // Cliente con suscripción (como se describe en la propuesta)
  status: 'active' | 'inactive';
  accountNumber?: string;
  password?: string;
  isNewUser?: boolean;
  hasCompletedTour?: boolean;
  createdAt?: string;
}

export type PropertyType = 'Casa' | 'Apartamento' | 'Terreno' | 'Local Comercial' | 'Villa';
export type PropertyStatus = 'Disponible' | 'Alquilada' | 'Vendida' | 'En Mantenimiento' | 'Suspendida';
export type TransactionType = 'Alquiler' | 'Venta';

export interface Property {
  id: string;
  title: string;
  code: string; // ej: 'CAS-001' (Casa Prince)
  address: string;
  city: string;
  neighborhood: string; // Colonia o zona
  size: number; // m² (tamano)
  propertyType: PropertyType;
  transactionType: TransactionType;
  price: number; // en USD o HNL
  currency: 'USD' | 'HNL';
  status: PropertyStatus;
  bedrooms: number;
  bathrooms: number;
  parkingSpots: number;
  description: string;
  features: string[]; // ['Piscina', 'Seguridad 24/7', 'Jardín', 'Amueblada', etc.]
  images: string[];
  ownerId: string;
  ownerName: string;
  assignedAgentId: string;
  assignedAgentName: string;
  yearBuilt?: number;
  monthlyMaintenanceFee?: number;
  documents?: { title: string; url: string; type: string }[];
}

export interface BankAccount {
  id: string;
  bankName: string; // ej: 'Banco Ficohsa Honduras', 'BAC Credomatic', 'Banco Atlántida'
  accountNumber: string; // ej: '2000-1122-3344-99'
  accountType: 'Ahorro' | 'Cheques' | 'Moneda Extranjera (USD)' | string;
  currency: 'USD' | 'HNL';
  beneficiaryName: string; // ej: 'TERRANOVA INVERSIONES S. DE R.L.'
  accountHolder?: string;
  rtn?: string; // ej: '08019995123456'
  isDefaultReceiving?: boolean; // Marcada para circular en contratos
}

export interface SmtpServerConfig {
  host: string;
  port: number;
  secure: boolean;
  username: string;
  password?: string;
  auth?: {
    user: string;
    pass: string;
  };
  fromEmail: string;
  fromName: string;
  provider?: 'smtp' | 'sendgrid' | 'resend';
  apiKey?: string;
  isConfigured: boolean;
  lastTestedAt?: string;
}

export interface CompanySettings {
  companyName: string;
  slogan: string;
  rtn: string;
  address: string;
  phone: string;
  whatsapp: string;
  email: string;
  customerServiceHours: string;
  legalRepresentative: string;
  legalRepresentativeId: string;
  policiesSummary: string;
  termsSummary: string;
  bankAccounts: BankAccount[];
  activeCurrency: 'USD' | 'HNL';
  exchangeRateUSDToHNL: number; // Tasa dinámica en tiempo real (BCH / Mercado Financiero ~26.85)
  enforceHondurasMonetaryLaw: boolean; // Cumplimiento Ley Monetaria (artículo de canon en moneda nacional Lempiras)
  smtpConfig?: SmtpServerConfig; // Configuración para integrar servidor de correo real
  includeTaxRtn: boolean; // Control del Administrador: habilitar/deshabilitar RTN para declaración de impuestos en facturas/recibos
  city?: string;
}

export type ContractTransactionType = 'Arrendamiento' | 'Venta' | 'Venta a Plazos';
export type ContractDocumentStatus = 
  | 'Pendiente Firma' 
  | 'Firmado Digitalmente' 
  | 'Firmado Presencial (Subido)' 
  | 'Invalidado por Administrador'
  | 'Firmado_Digital'
  | 'Pendiente_Subida'
  | 'Documento_Firmado_Cargado';

export interface LeaseContract {
  id: string;
  contractNumber: string;
  contractType?: ContractTransactionType;
  propertyId: string;
  propertyTitle: string;
  propertyCode: string;
  tenantId: string;
  tenantName: string;
  tenantEmail: string;
  tenantPhone?: string;
  tenantNationalId?: string; // ID / Cédula del arrendatario o comprador
  managerName?: string; // Nombre del encargado / asesor
  managerEmail?: string; // Correo del encargado
  managerPhone?: string; // Teléfono del encargado
  ownerId: string;
  ownerName: string;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  monthlyRent: number;
  depositAmount: number;
  currency: 'USD' | 'HNL';
  status: 'Vigente' | 'Por Vencer' | 'Vencido' | 'Cancelado' | 'Activo';
  clauses: string[];
  isSignedDigitally: boolean;
  signedDate?: string;
  agentName: string;
  receivingBankAccount?: string; // Cuenta que recibió el dinero (para circular en contrato)
  receivingBankName?: string;
  paymentMethodUsed?: string;

  // Financiamiento y Venta a Plazos
  totalValue?: number;
  downPayment?: number; // Cuánto de prima
  financingYears?: number; // A cuántos años de plazo
  installmentsCount?: number; // Número total de cuotas (años * 12)
  monthlyInstallment?: number; // Valor de sus cuotas mensuales

  // Auditoría y Subida Única de Documento Firmado (PDF / Escaneo)
  signatureMode?: 'Digital' | 'Presencial' | 'digital' | 'fisica_presencial';
  isSignedPhysically?: boolean;
  signedDocumentUrl?: string; // Archivo PDF o imagen escaneada subida por el agente
  signedDocumentFileName?: string;
  signedDocumentFileSize?: string;
  signedDocumentFileType?: string;
  uploadedAt?: string;
  uploadedByAgent?: string;
  documentStatus?: ContractDocumentStatus;
  invalidationRequested?: boolean;
  invalidationReason?: string;
  invalidatedByAdmin?: string;

  // Vinculación de Comisiones con Nómina y Modalidad de Liquidación
  totalCommissionRate?: number; // ej. 20% acordado con el dueño (CONFIDENCIAL: solo dueño y admin)
  agentCommissionRate?: number; // ej. 2% para el agente
  agencyCommissionRate?: number; // ej. 18% para Terranova (CONFIDENCIAL: solo dueño y admin)
  ownerNetRate?: number; // ej. 80% neto para el dueño del terreno
  totalCommissionAmount?: number;
  agentCommissionAmount?: number;
  agencyCommissionAmount?: number;
  ownerNetAmount?: number; // Monto neto que le corresponde al dueño
  commissionPayoutMode?: 'directa_total' | 'plazos_proporcional';
  agentCommissionPaid?: number; // Total acumulado depositado al agente
  ownerNetPaid?: number; // Total acumulado depositado al dueño
  installmentsPaidCount?: number;

  // Firmas Digitales Graficadas (Canvas dibujado o imagen cargada)
  signatureImageTenant?: string;
  signatureImageOwner?: string;
  signatureImageAdmin?: string;

  // Plantilla estándar asociada
  templateId?: string;
  templateName?: string;

  // Cancelación de contratos
  cancellationReason?: string;
  cancelledAt?: string;
  buyerNewOwnerId?: string;
}

export interface ContractTemplate {
  id: string;
  name: string;
  type: ContractTransactionType;
  fileName?: string;
  fileFormat: 'pdf' | 'docx' | 'doc' | 'system';
  fileUrl?: string;
  uploadedAt: string;
  uploadedBy: string;
  description: string;
  clauses: string[];
  isDefault?: boolean;
}

export type MaintenanceType = 'Preventivo' | 'Correctivo' | 'Emergencia';
export type MaintenanceStatus = 'Pendiente' | 'En Proceso' | 'Reparado' | 'Cancelado';

export interface MaintenanceRequest {
  id: string;
  ticketNumber: string;
  propertyId: string;
  propertyTitle: string;
  propertyAddress: string;
  requestedBy: string; // Nombre del inquilino, propietario o admin
  requesterRole: 'tenant' | 'owner' | 'admin';
  date: string;
  type: MaintenanceType;
  priority: 'Alta' | 'Media' | 'Baja';
  description: string;
  status: MaintenanceStatus;
  contractorName?: string;
  contractorPhone?: string;
  estimatedCost?: number;
  actualCost?: number;
  completedDate?: string;
  resolutionNotes?: string;
  usedSupplies?: {
    itemId: string;
    itemCode: string;
    itemName: string;
    quantity: number;
    unitCostUSD: number;
  }[];
}

export type InventoryCategory = 'Plomería' | 'Electricidad' | 'Cerrajería' | 'Climatización' | 'Pintura' | 'Herramientas' | 'General';

export interface MaintenanceInventoryItem {
  id: string;
  itemCode: string;
  name: string;
  category: InventoryCategory;
  stock: number;
  minStock: number;
  unit: string;
  unitCostUSD: number;
  location: string;
  lastRestocked: string;
  notes?: string;
}

export interface InventoryMovement {
  id: string;
  itemId: string;
  itemName: string;
  itemCode: string;
  type: 'Entrada' | 'Salida';
  quantity: number;
  date: string;
  ticketId?: string;
  ticketNumber?: string;
  performedBy: string;
  reason: string;
}

export interface PropertyVisit {
  id: string;
  propertyId: string;
  propertyTitle: string;
  visitorName: string;
  visitorEmail: string;
  visitorPhone: string;
  date: string;
  time: string;
  type: 'Presencial' | 'Virtual';
  status: 'Pendiente' | 'Confirmada' | 'Realizada' | 'Cancelada';
  agentName: string;
  notes?: string;
}

export type PaymentMethod = 'Tarjeta de Crédito' | 'Tarjeta de Débito' | 'Transferencia Bancaria' | 'Efectivo';
export type PaymentStatus = 'Completado' | 'En Proceso' | 'Pendiente' | 'Rechazado';

export interface PaymentTransaction {
  id: string;
  receiptNumber: string;
  propertyId: string;
  propertyTitle: string;
  contractId?: string;
  payerName: string;
  payerEmail: string;
  amount: number;
  currency: 'USD' | 'HNL';
  type: 'Pago Renta' | 'Depósito de Garantía' | 'Comisión de Venta' | 'Mantenimiento' | 'Servicios';
  paymentMethod: PaymentMethod;
  date: string;
  status: PaymentStatus;
  monthCovered?: string;
  referenceCode: string;
}

export interface FinancialMetric {
  totalRevenue: number;
  totalExpenses: number;
  netIncome: number;
  occupancyRate: number;
  pendingReceivables: number;
  projectedIncome: number;
}

export interface SystemLog {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  role: string;
  action: string;
  module: 'Propiedades' | 'Contratos' | 'Pagos' | 'Mantenimiento' | 'Usuarios' | 'Visitas' | 'Sistema';
  details: string;
}

export interface ClientLead {
  id: string;
  name: string;
  email: string;
  phone: string;
  interestType: 'Alquiler' | 'Compra';
  budgetMax: number;
  preferredZone: string;
  status: 'Nuevo' | 'En Seguimiento' | 'Visita Agendada' | 'En Negociación' | 'Cerrado';
  assignedAgent: string;
  createdAt: string;
  notes: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  type: 'Visita' | 'Cobro' | 'Mantenimiento' | 'Firma Contrato' | 'Reunión' | string;
  priority: 'Alta' | 'Media' | 'Baja';
  status: 'Pendiente' | 'Completado' | 'Cancelado';
  assignedTo: string; // Nombre del agente o admin
  propertyTitle?: string;
  clientName?: string;
  clientEmail?: string;
  notes?: string;
}

export interface MessageThread {
  id: string;
  contactName: string;
  contactEmail: string;
  contactRole: UserRole;
  propertyTitle?: string;
  lastMessage: string;
  updatedAt: string;
  unread: boolean;
  messages: {
    id: string;
    sender: 'user' | 'agent' | 'admin';
    senderName: string;
    text: string;
    timestamp: string;
  }[];
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'lead' | 'maintenance' | 'appointment' | 'payment' | 'contract' | 'system' | 'email';
  read: boolean;
  targetTab?: string;
  linkText?: string;
  targetRole?: UserRole | 'all' | 'staff';
  targetUserId?: string;
  targetEmail?: string;
}

export interface Employee {
  id: string;
  code: string; // EMP-001
  name: string;
  email: string;
  phone: string;
  nationalId: string; // DNI de Honduras (13 dígitos)
  position: 'Agente Inmobiliario Senior' | 'Agente Inmobiliario Junior' | 'Asistente Administrativo' | 'Coordinador Legal' | 'Asesor Comercial' | 'Contratista de Obras';
  baseSalary: number; // Salario base en USD
  bankName: string;
  bankAccountNumber: string;
  status: 'Activo' | 'Inactivo';
  startDate: string;
  defaultCommissionPercent: number; // Porcentaje estándar de comisión
}

export interface PayrollRecord {
  id: string;
  payrollNumber: string; // NOM-2024-001
  employeeId: string;
  employeeName: string;
  position: string;
  periodMonth: string; // "Octubre 2024"
  periodYear: number;
  baseSalary: number;
  contractCommissions: {
    contractId: string;
    contractNumber: string;
    propertyTitle: string;
    saleAmount: number;
    totalCommissionPercent: number; // ej. 20%
    agentCommissionPercent: number; // ej. 2%
    terranovaCommissionPercent: number; // ej. 18%
    agentCommissionEarned: number; // ej. $40,000
    terranovaEarned: number; // ej. $360,000
    date: string;
  }[];
  totalCommissions: number;
  bonuses: number;
  deductions: number;
  netPayable: number;
  currency: 'USD' | 'HNL';
  status: 'Borrador' | 'Procesado' | 'Pagado';
  paymentDate?: string;
  paymentMethod: string;
  disbursedBankAccount?: string;
  referenceCode?: string;
  notes?: string;
}

export interface SimulatedEmail {
  id: string;
  to: string;
  recipientName: string;
  subject: string;
  body: string;
  sentAt: string;
  type: 'welcome' | 'password_reset' | 'appointment' | 'contract';
  resetCode?: string;
  read?: boolean;
}

export interface RolePermissions {
  role: UserRole;
  canManageProperties: boolean;
  canDeleteProperties: boolean;
  canGenerateContracts: boolean;
  canProcessPayments: boolean;
  canDispatchMaintenance: boolean;
  canManageUsers: boolean;
  canChangeUserStatus: boolean;
  canViewAuditLogs: boolean;
  canConfigurePolicies: boolean;
}

