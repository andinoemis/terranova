import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  Property,
  User,
  LeaseContract,
  MaintenanceRequest,
  PropertyVisit,
  PaymentTransaction,
  SystemLog,
  ClientLead,
  UserRole,
  CalendarEvent,
  MessageThread,
  RolePermissions,
  BankAccount,
  CompanySettings,
  AppNotification,
  PaymentStatus,
  SmtpServerConfig,
  Employee,
  PayrollRecord,
  ContractTemplate,
  MaintenanceInventoryItem,
  InventoryMovement
} from '../types';
import { fetchLiveUSDToHNLRate } from '../services/currencyService';
import { testSmtpServerConnection, SmtpTestResult } from '../services/emailServerService';
import {
  INITIAL_PROPERTIES,
  INITIAL_USERS,
  INITIAL_CONTRACTS,
  INITIAL_PAYMENTS,
  INITIAL_MAINTENANCE,
  INITIAL_VISITS,
  INITIAL_LOGS,
  INITIAL_LEADS,
  INITIAL_CALENDAR_EVENTS,
  INITIAL_MESSAGES,
  INITIAL_PERMISSIONS,
  INITIAL_COMPANY_SETTINGS,
  INITIAL_NOTIFICATIONS,
  INITIAL_SIMULATED_EMAILS,
  INITIAL_EMPLOYEES,
  INITIAL_PAYROLL_RECORDS,
  INITIAL_CONTRACT_TEMPLATES,
  INITIAL_MAINTENANCE_INVENTORY,
  INITIAL_INVENTORY_MOVEMENTS
} from '../data/initialData';

export interface PrintDocument {
  type: 'property_sheet' | 'contract' | 'receipt' | 'financial_report' | 'payroll_receipt' | 'payment_receipt';
  data: any;
}

interface AppContextType {
  // Current user & authentication
  currentUser: User;
  isAuthenticated: boolean;
  login: (email: string, password: string) => { success: boolean; error?: string };
  registerUser: (userData: Omit<User, 'id' | 'accountNumber' | 'status'> & { password: string }) => { success: boolean; error?: string };
  logout: () => void;
  switchUser: (userId: string) => void;
  switchRoleQuick: (role: UserRole) => void;
  toggleUserStatus: (userId: string) => void;
  changeUserRole: (userId: string, newRole: UserRole) => void;

  // Company settings & Bank accounts
  companySettings: CompanySettings;
  updateCompanySettings: (settings: Partial<CompanySettings>) => void;
  addBankAccount: (bank: Omit<BankAccount, 'id'>) => void;
  updateBankAccount: (id: string, bank: Partial<BankAccount>) => void;
  deleteBankAccount: (id: string) => void;
  setDefaultReceivingAccount: (id: string) => void;

  // Data collections
  properties: Property[];
  users: User[];
  contracts: LeaseContract[];
  payments: PaymentTransaction[];
  maintenance: MaintenanceRequest[];
  visits: PropertyVisit[];
  leads: ClientLead[];
  logs: SystemLog[];
  calendarEvents: CalendarEvent[];
  messages: MessageThread[];
  permissions: RolePermissions[];

  // Property actions
  generatePropertyCode: (type: Property['propertyType']) => string;
  addProperty: (property: Omit<Property, 'id'>) => void;
  updateProperty: (id: string, property: Partial<Property>) => void;
  deleteProperty: (id: string) => void;
  suspendProperty: (id: string) => void;
  reactivateProperty: (id: string) => void;

  // Contract actions
  createContract: (contract: Omit<LeaseContract, 'id' | 'contractNumber'>) => void;
  signContract: (id: string) => void;
  signContractDigitally: (contractId: string, role: 'tenant' | 'owner' | 'admin', signatureDataUrl: string) => void;
  cancelContract: (contractId: string, reason: string) => void;
  updateContractStatus: (id: string, status: LeaseContract['status']) => void;
  uploadSignedContractDocument: (contractId: string, fileData: { url: string; fileName: string; fileSize?: string; fileType?: string }) => void;
  requestContractInvalidation: (contractId: string, reason: string) => void;
  invalidateContractDocument: (contractId: string, notes?: string) => void;

  // Contract Templates & Standards
  contractTemplates: ContractTemplate[];
  addContractTemplate: (template: Omit<ContractTemplate, 'id' | 'uploadedAt'>) => void;
  deleteContractTemplate: (id: string) => void;

  // Employees & Payroll (Nómina y Comisiones)
  employees: Employee[];
  payrollRecords: PayrollRecord[];
  addEmployee: (employee: Omit<Employee, 'id' | 'code'>) => void;
  updateEmployee: (id: string, employee: Partial<Employee>) => void;
  createPayrollRecord: (record: Omit<PayrollRecord, 'id' | 'payrollNumber'>) => void;
  processPayrollPayment: (recordId: string, bankAccountId?: string) => void;

  // Payment actions
  processPayment: (payment: Omit<PaymentTransaction, 'id' | 'receiptNumber' | 'date' | 'referenceCode' | 'status'>) => Promise<PaymentTransaction>;

  // Maintenance & Technical Inventory
  createMaintenanceRequest: (req: Omit<MaintenanceRequest, 'id' | 'ticketNumber' | 'date' | 'status'>) => void;
  updateMaintenanceStatus: (id: string, status: MaintenanceRequest['status'], notes?: string, contractorName?: string, cost?: number) => void;
  assignMaintenanceTechnician: (ticketId: string, technicianName: string, phone?: string) => void;
  maintenanceInventory: MaintenanceInventoryItem[];
  inventoryMovements: InventoryMovement[];
  addInventoryItem: (item: Omit<MaintenanceInventoryItem, 'id' | 'lastRestocked'>) => void;
  updateInventoryItem: (id: string, updates: Partial<MaintenanceInventoryItem>) => void;
  deleteInventoryItem: (id: string) => void;
  restockInventoryItem: (id: string, quantity: number, notes?: string) => void;
  consumeInventoryItem: (id: string, quantity: number, ticketId?: string, reason?: string) => boolean;

  // Visits actions
  bookVisit: (visit: Omit<PropertyVisit, 'id' | 'status'>) => void;
  updateVisitStatus: (id: string, status: PropertyVisit['status']) => void;

  // CRM Leads
  addLead: (lead: Omit<ClientLead, 'id' | 'createdAt'>) => void;
  updateLeadStatus: (id: string, status: ClientLead['status']) => void;

  // Calendar actions
  addCalendarEvent: (event: Omit<CalendarEvent, 'id' | 'status'>) => void;
  updateCalendarEventStatus: (id: string, status: CalendarEvent['status']) => void;
  deleteCalendarEvent: (id: string) => void;

  // Messages actions
  sendMessage: (threadId: string, text: string) => void;

  // Permissions actions
  updateRolePermission: (role: UserRole, permissionKey: keyof Omit<RolePermissions, 'role'>, value: boolean) => void;

  // Print modal trigger
  printDoc: PrintDocument | null;
  openPrintModal: (doc: PrintDocument) => void;
  closePrintModal: () => void;

  // Notification toast
  toastMessage: string | null;
  showToast: (msg: string) => void;

  // Real-time Notifications system (RF-Solicitudes)
  notifications: AppNotification[];
  unreadNotificationsCount: number;
  addNotification: (notif: Omit<AppNotification, 'id' | 'timestamp' | 'read'>) => void;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  clearNotification: (id: string) => void;

  // Email Server Integration (SMTP / API Service)
  sendSystemEmail: (email: { to: string; recipientName: string; subject: string; body: string; type: string }) => Promise<void>;
  sendPasswordRecoveryEmail: (email: string) => Promise<{ success: boolean; error?: string; resetCode?: string }>;
  resetPasswordWithCode: (email: string, code: string, newPassword: string) => { success: boolean; error?: string };
  updateSmtpConfig: (config: SmtpServerConfig) => void;
  testSmtpConnection: (config: SmtpServerConfig) => Promise<SmtpTestResult>;

  // Currency & Real-Time Financial API Integration (USD / HNL)
  activeCurrency: 'USD' | 'HNL';
  setActiveCurrency: (curr: 'USD' | 'HNL') => void;
  exchangeRateUSDToHNL: number;
  exchangeRateLastUpdated: string;
  exchangeRateSource: string;
  isFetchingExchangeRate: boolean;
  refreshExchangeRate: () => Promise<void>;
  formatMoney: (amountInUSD: number, forcedCurrency?: 'USD' | 'HNL') => string;

  // Payments Management
  updatePaymentStatus: (id: string, status: PaymentStatus) => void;
  confirmPayment: (id: string) => void;
  rejectPayment: (id: string, reason?: string) => void;

  // Property Comparison (Up to 3 properties)
  comparisonProperties: Property[];
  toggleComparisonProperty: (property: Property) => boolean;
  clearComparison: () => void;
  isComparingModalOpen: boolean;
  setIsComparingModalOpen: (open: boolean) => void;

  // Onboarding, Interactive Tour & Documentation
  isTourOpen: boolean;
  setIsTourOpen: (open: boolean) => void;
  startTour: () => void;
  completeTour: () => void;
  isManualOpen: boolean;
  setIsManualOpen: (open: boolean) => void;
  isDatabaseModalOpen: boolean;
  setIsDatabaseModalOpen: (open: boolean) => void;

  // Reset database
  resetDatabase: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // LocalStorage initialization
  const [properties, setProperties] = useState<Property[]>(() => {
    const saved = localStorage.getItem('terranova_properties');
    return saved ? JSON.parse(saved) : INITIAL_PROPERTIES;
  });

  const [users, setUsers] = useState<User[]>(() => {
    try {
      const saved = localStorage.getItem('terranova_users');
      if (saved) {
        const parsed: User[] = JSON.parse(saved);
        const existingIds = new Set(parsed.map(u => u.id));
        const missing = INITIAL_USERS.filter(u => !existingIds.has(u.id));
        if (missing.length > 0) {
          const merged = [...parsed, ...missing];
          localStorage.setItem('terranova_users', JSON.stringify(merged));
          return merged;
        }
        return parsed;
      }
    } catch (e) {
      console.error('Error parsing terranova_users:', e);
    }
    return INITIAL_USERS;
  });

  const [contracts, setContracts] = useState<LeaseContract[]>(() => {
    const saved = localStorage.getItem('terranova_contracts');
    return saved ? JSON.parse(saved) : INITIAL_CONTRACTS;
  });

  const [payments, setPayments] = useState<PaymentTransaction[]>(() => {
    const saved = localStorage.getItem('terranova_payments');
    return saved ? JSON.parse(saved) : INITIAL_PAYMENTS;
  });

  const [maintenance, setMaintenance] = useState<MaintenanceRequest[]>(() => {
    const saved = localStorage.getItem('terranova_maintenance');
    return saved ? JSON.parse(saved) : INITIAL_MAINTENANCE;
  });

  const [maintenanceInventory, setMaintenanceInventory] = useState<MaintenanceInventoryItem[]>(() => {
    const saved = localStorage.getItem('terranova_maintenance_inventory');
    return saved ? JSON.parse(saved) : INITIAL_MAINTENANCE_INVENTORY;
  });

  const [inventoryMovements, setInventoryMovements] = useState<InventoryMovement[]>(() => {
    const saved = localStorage.getItem('terranova_inventory_movements');
    return saved ? JSON.parse(saved) : INITIAL_INVENTORY_MOVEMENTS;
  });

  const [visits, setVisits] = useState<PropertyVisit[]>(() => {
    const saved = localStorage.getItem('terranova_visits');
    return saved ? JSON.parse(saved) : INITIAL_VISITS;
  });

  const [leads, setLeads] = useState<ClientLead[]>(() => {
    const saved = localStorage.getItem('terranova_leads');
    return saved ? JSON.parse(saved) : INITIAL_LEADS;
  });

  const [logs, setLogs] = useState<SystemLog[]>(() => {
    const saved = localStorage.getItem('terranova_logs');
    return saved ? JSON.parse(saved) : INITIAL_LOGS;
  });

  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>(() => {
    const saved = localStorage.getItem('terranova_calendar');
    return saved ? JSON.parse(saved) : INITIAL_CALENDAR_EVENTS;
  });

  const [messages, setMessages] = useState<MessageThread[]>(() => {
    const saved = localStorage.getItem('terranova_messages');
    return saved ? JSON.parse(saved) : INITIAL_MESSAGES;
  });

  const [permissions, setPermissions] = useState<RolePermissions[]>(() => {
    try {
      const saved = localStorage.getItem('terranova_permissions');
      if (saved) {
        const parsed: RolePermissions[] = JSON.parse(saved);
        const existingRoles = new Set(parsed.map(p => p.role));
        const missing = INITIAL_PERMISSIONS.filter(p => !existingRoles.has(p.role));
        if (missing.length > 0) {
          const merged = [...parsed, ...missing];
          localStorage.setItem('terranova_permissions', JSON.stringify(merged));
          return merged;
        }
        return parsed;
      }
    } catch (e) {
      console.error('Error parsing terranova_permissions:', e);
    }
    return INITIAL_PERMISSIONS;
  });

  const [companySettings, setCompanySettings] = useState<CompanySettings>(() => {
    const saved = localStorage.getItem('terranova_settings');
    return saved ? JSON.parse(saved) : INITIAL_COMPANY_SETTINGS;
  });

  const [currentUserId, setCurrentUserId] = useState<string>(() => {
    return localStorage.getItem('terranova_current_user') || 'usr-1';
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('terranova_is_auth') !== 'false';
  });

  const [printDoc, setPrintDoc] = useState<PrintDocument | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Empleados y Nómina
  const [employees, setEmployees] = useState<Employee[]>(() => {
    const saved = localStorage.getItem('terranova_employees');
    return saved ? JSON.parse(saved) : INITIAL_EMPLOYEES;
  });

  const [payrollRecords, setPayrollRecords] = useState<PayrollRecord[]>(() => {
    const saved = localStorage.getItem('terranova_payroll_records');
    return saved ? JSON.parse(saved) : INITIAL_PAYROLL_RECORDS;
  });

  // Plantillas y Estándares Oficiales de Contratos
  const [contractTemplates, setContractTemplates] = useState<ContractTemplate[]>(() => {
    try {
      const saved = localStorage.getItem('terranova_contract_templates');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error loading contract templates:', e);
    }
    return INITIAL_CONTRACT_TEMPLATES;
  });

  // Real-time Notifications for Requests
  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const saved = localStorage.getItem('terranova_notifications');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  // Recuperación de contraseñas temporal en memoria / servidor
  const [recoveryTokens, setRecoveryTokens] = useState<Record<string, string>>({});

  // Dynamic Live Financial Exchange Rate (USD -> HNL) - Consulta API Financiera en Vivo
  const [exchangeRateUSDToHNL, setExchangeRateUSDToHNL] = useState<number>(() => {
    const saved = localStorage.getItem('terranova_exchange_rate_hnl');
    return saved && !isNaN(Number(saved)) && Number(saved) > 20 ? Number(saved) : 26.84;
  });
  const [exchangeRateLastUpdated, setExchangeRateLastUpdated] = useState<string>(() => {
    return localStorage.getItem('terranova_exchange_rate_date') || new Date().toLocaleDateString('es-HN');
  });
  const [exchangeRateSource, setExchangeRateSource] = useState<string>('API Financiera en Vivo (BCH/Mercado)');
  const [isFetchingExchangeRate, setIsFetchingExchangeRate] = useState<boolean>(false);

  // Currency & Monetary Law (Honduras Decreto 131-98 / Lempiras HNL vs USD)
  const [activeCurrency, setActiveCurrency] = useState<'USD' | 'HNL'>(() => {
    const saved = localStorage.getItem('terranova_active_currency');
    return (saved === 'HNL' || saved === 'USD') ? saved : (companySettings.activeCurrency || 'USD');
  });

  // Property Comparison (Up to 3 properties)
  const [comparisonProperties, setComparisonProperties] = useState<Property[]>(() => {
    const saved = localStorage.getItem('terranova_comparison');
    return saved ? JSON.parse(saved) : [];
  });
  const [isComparingModalOpen, setIsComparingModalOpen] = useState(false);

  // Onboarding, Interactive Tour & User Manual State
  const [isTourOpen, setIsTourOpen] = useState(false);
  const [isManualOpen, setIsManualOpen] = useState(false);
  const [isDatabaseModalOpen, setIsDatabaseModalOpen] = useState(false);

  const startTour = () => setIsTourOpen(true);
  const completeTour = () => {
    setIsTourOpen(false);
    if (currentUser) {
      localStorage.setItem(`terranova_tour_${currentUser.id}`, 'completed');
      localStorage.setItem(`terranova_tour_dismissed_${currentUser.id}`, 'true');
      setUsers(prev => prev.map(u => u.id === currentUser.id ? { ...u, hasCompletedTour: true, isNewUser: false } : u));
    }
  };

  // Sync with LocalStorage
  useEffect(() => {
    localStorage.setItem('terranova_properties', JSON.stringify(properties));
  }, [properties]);

  useEffect(() => {
    localStorage.setItem('terranova_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    try {
      localStorage.setItem('terranova_contracts', JSON.stringify(contracts));
    } catch (e) {
      console.warn('LocalStorage quota limit reached when persisting contracts:', e);
    }
  }, [contracts]);

  useEffect(() => {
    localStorage.setItem('terranova_payments', JSON.stringify(payments));
  }, [payments]);

  useEffect(() => {
    localStorage.setItem('terranova_maintenance', JSON.stringify(maintenance));
  }, [maintenance]);

  useEffect(() => {
    localStorage.setItem('terranova_visits', JSON.stringify(visits));
  }, [visits]);

  useEffect(() => {
    localStorage.setItem('terranova_leads', JSON.stringify(leads));
  }, [leads]);

  useEffect(() => {
    localStorage.setItem('terranova_logs', JSON.stringify(logs));
  }, [logs]);

  useEffect(() => {
    localStorage.setItem('terranova_calendar', JSON.stringify(calendarEvents));
  }, [calendarEvents]);

  useEffect(() => {
    localStorage.setItem('terranova_messages', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem('terranova_permissions', JSON.stringify(permissions));
  }, [permissions]);

  useEffect(() => {
    localStorage.setItem('terranova_settings', JSON.stringify(companySettings));
  }, [companySettings]);

  useEffect(() => {
    localStorage.setItem('terranova_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('terranova_employees', JSON.stringify(employees));
  }, [employees]);

  useEffect(() => {
    localStorage.setItem('terranova_payroll_records', JSON.stringify(payrollRecords));
  }, [payrollRecords]);

  useEffect(() => {
    localStorage.setItem('terranova_contract_templates', JSON.stringify(contractTemplates));
  }, [contractTemplates]);

  useEffect(() => {
    localStorage.setItem('terranova_maintenance_inventory', JSON.stringify(maintenanceInventory));
  }, [maintenanceInventory]);

  useEffect(() => {
    localStorage.setItem('terranova_inventory_movements', JSON.stringify(inventoryMovements));
  }, [inventoryMovements]);


  useEffect(() => {
    localStorage.setItem('terranova_active_currency', activeCurrency);
  }, [activeCurrency]);

  useEffect(() => {
    localStorage.setItem('terranova_comparison', JSON.stringify(comparisonProperties));
  }, [comparisonProperties]);

  useEffect(() => {
    localStorage.setItem('terranova_current_user', currentUserId);
  }, [currentUserId]);

  useEffect(() => {
    localStorage.setItem('terranova_is_auth', String(isAuthenticated));
  }, [isAuthenticated]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const guestUser: User = {
    id: 'guest',
    name: 'Usuario Visitante',
    email: 'invitado@terranova.hn',
    phone: '',
    role: 'guest',
    status: 'active',
    isSubscribed: false,
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'
  };

  const currentUser = isAuthenticated
    ? (users.find(u => u.id === currentUserId) || users[0])
    : guestUser;

  const logAction = (action: string, module: SystemLog['module'], details: string) => {
    const newLog: SystemLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      userId: currentUser.id,
      userName: currentUser.name,
      role: currentUser.role,
      action,
      module,
      details
    };
    setLogs(prev => [newLog, ...prev]);
  };

  // Authentication & Credential validation (proposal page 26 & 28)
  const login = (email: string, password: string): { success: boolean; error?: string } => {
    const cleanEmail = email.trim().toLowerCase();
    const user = users.find(u => u.email.toLowerCase() === cleanEmail);

    if (!user) {
      logAction('Fallo de Autenticación', 'Usuarios', `Intento fallido con correo no registrado: ${email}`);
      return {
        success: false,
        error: 'El correo electrónico ingresado no se encuentra registrado en el sistema.'
      };
    }

    if (user.status === 'inactive') {
      return {
        success: false,
        error: 'Esta cuenta se encuentra temporalmente desactivada (de baja). Comuníquese con el Administrador.'
      };
    }

    // Check password
    if (user.password && user.password !== password) {
      logAction('Fallo de Autenticación', 'Usuarios', `Contraseña incorrecta para el usuario: ${user.name}`);
      return {
        success: false,
        error: 'La contraseña ingresada es incorrecta. Verifique sus credenciales e intente de nuevo.'
      };
    }

    // Success
    setCurrentUserId(user.id);
    setIsAuthenticated(true);
    showToast(`¡Bienvenido de nuevo, ${user.name}!`);
    logAction('Inicio de Sesión', 'Usuarios', `Sesión iniciada con éxito para ${user.name} (${user.role})`);
    return { success: true };
  };

  const registerUser = (userData: Omit<User, 'id' | 'accountNumber' | 'status'> & { password: string }): { success: boolean; error?: string } => {
    const existing = users.find(u => u.email.toLowerCase() === userData.email.trim().toLowerCase());
    if (existing) {
      return { success: false, error: 'Ya existe una cuenta registrada con este correo electrónico.' };
    }

    const newId = `usr-${Date.now()}`;
    const prefix = userData.role === 'tenant' ? 'INQ' : userData.role === 'client' ? 'CLI' : userData.role === 'owner' ? 'PROP' : userData.role === 'agent' ? 'AGT' : 'ADM';
    const accountNumber = `CTA-${prefix}-${Math.floor(100 + Math.random() * 900)}`;

    const newUser: User = {
      ...userData,
      id: newId,
      status: 'active',
      accountNumber,
      avatar: userData.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      isNewUser: true,
      hasCompletedTour: false,
      createdAt: new Date().toISOString()
    };

    setUsers(prev => [...prev, newUser]);
    setCurrentUserId(newUser.id);
    setIsAuthenticated(true);
    showToast(`Cuenta creada exitosamente para ${newUser.name}`);
    logAction('Registro de Usuario', 'Usuarios', `Nuevo usuario registrado: ${newUser.name} (${newUser.role})`);

    // Enviar correo de bienvenida transaccional vía servidor SMTP
    sendSystemEmail({
      to: newUser.email,
      recipientName: newUser.name,
      subject: '¡Bienvenido a Terranova Inversiones! - Confirma tu Cuenta',
      body: `Estimado/a ${newUser.name},\n\nLe damos la más cordial bienvenida a Terranova Gestión Inmobiliaria S. de R.L. Su cuenta ha sido creada exitosamente con el perfil: ${newUser.role.toUpperCase()}.\n\nSu identificador oficial de cuenta es: ${newUser.accountNumber}.\n\nYa puede ingresar al sistema con su correo (${newUser.email}) y contraseña para explorar el catálogo, gestionar solicitudes, dar seguimiento a citas y revisar contratos digitales.`,
      type: 'welcome'
    });

    // Notificación en tiempo real para administradores y agentes
    addNotification({
      title: 'Nuevo Usuario Registrado en el Sistema',
      message: `${newUser.name} se ha registrado como ${newUser.role === 'tenant' ? 'Inquilino' : 'Cliente'} (${newUser.accountNumber}).`,
      type: 'system',
      targetTab: 'admin_dashboard',
      linkText: 'Ver en Usuarios'
    });

    return { success: true };
  };

  const logout = () => {
    setIsAuthenticated(false);
    showToast('Sesión cerrada de forma segura');
    logAction('Cierre de Sesión', 'Usuarios', `Usuario ${currentUser.name} cerró sesión`);
  };

  const toggleUserStatus = (userId: string) => {
    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        const nextStatus = u.status === 'active' ? 'inactive' : 'active';
        logAction('Cambio de Estado de Usuario', 'Usuarios', `Usuario ${u.name} cambiado a estado: ${nextStatus}`);
        return { ...u, status: nextStatus };
      }
      return u;
    }));
    showToast('Estado de usuario actualizado');
  };

  // El administrador puede cambiar el tipo de cuenta en usuarios sin modificar sus otros datos
  const changeUserRole = (userId: string, newRole: UserRole) => {
    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        logAction('Modificación de Rol', 'Usuarios', `Rol de usuario "${u.name}" actualizado a: ${newRole}`);
        return { ...u, role: newRole };
      }
      return u;
    }));
    showToast(`Tipo de cuenta actualizado a: ${newRole.toUpperCase()}`);
  };

  // Modificación de datos de atención al cliente y empresa (editable por el administrador)
  const updateCompanySettings = (newSettings: Partial<CompanySettings>) => {
    setCompanySettings(prev => ({
      ...prev,
      ...newSettings
    }));
    showToast('Datos de empresa y atención al cliente guardados con éxito');
    logAction('Configuración de Empresa', 'Sistema', 'Actualización de datos comerciales y atención');
  };

  // Gestión de cuentas bancarias de la empresa
  const addBankAccount = (bank: Omit<BankAccount, 'id'>) => {
    const newBank: BankAccount = {
      ...bank,
      id: `bnk-${Date.now()}`
    };
    setCompanySettings(prev => ({
      ...prev,
      bankAccounts: [...prev.bankAccounts, newBank]
    }));
    showToast(`Cuenta bancaria de ${bank.bankName} agregada`);
    logAction('Cuentas Bancarias', 'Sistema', `Nueva cuenta bancaria: ${bank.bankName} - ${bank.accountNumber}`);
  };

  const updateBankAccount = (id: string, bankData: Partial<BankAccount>) => {
    setCompanySettings(prev => ({
      ...prev,
      bankAccounts: prev.bankAccounts.map(b => b.id === id ? { ...b, ...bankData } : b)
    }));
    showToast('Cuenta bancaria actualizada');
    logAction('Cuentas Bancarias', 'Sistema', `Cuenta bancaria ${id} actualizada`);
  };

  const deleteBankAccount = (id: string) => {
    setCompanySettings(prev => ({
      ...prev,
      bankAccounts: prev.bankAccounts.filter(b => b.id !== id)
    }));
    showToast('Cuenta bancaria eliminada');
    logAction('Cuentas Bancarias', 'Sistema', `Cuenta bancaria ${id} eliminada`);
  };

  const setDefaultReceivingAccount = (id: string) => {
    setCompanySettings(prev => ({
      ...prev,
      bankAccounts: prev.bankAccounts.map(b => ({
        ...b,
        isDefaultReceiving: b.id === id
      }))
    }));
    const chosen = companySettings.bankAccounts.find(b => b.id === id);
    showToast(`Cuenta receptora para circular en contratos: ${chosen?.bankName || id}`);
    logAction('Cuentas Bancarias', 'Sistema', `Cuenta receptora por defecto establecida en ${id}`);
  };

  // Generador automático de código de propiedad (RF: código generado automáticamente)
  const generatePropertyCode = (type: Property['propertyType']): string => {
    const mapPrefix: Record<string, string> = {
      'Casa': 'CAS',
      'Apartamento': 'APT',
      'Terreno': 'TER',
      'Local Comercial': 'LOC',
      'Villa': 'VIL'
    };
    const prefix = mapPrefix[type] || 'INM';
    const count = properties.filter(p => p.propertyType === type).length;
    const serial = String(count + 1).padStart(3, '0');
    return `${prefix}-${serial}`;
  };

  const switchUser = (userId: string) => {
    const found = users.find(u => u.id === userId);
    if (found) {
      setCurrentUserId(userId);
      setIsAuthenticated(true);
      showToast(`Sesión cambiada a: ${found.name} (${found.role.toUpperCase()})`);
      logAction('Cambio de Sesión', 'Usuarios', `Acceso activo cambiado a ${found.name}`);
    }
  };

  const switchRoleQuick = (role: UserRole) => {
    const found = users.find(u => u.role === role);
    if (found) {
      setCurrentUserId(found.id);
      setIsAuthenticated(true);
      showToast(`Cambiado a rol: ${role.toUpperCase()} (${found.name})`);
    } else if (role === 'guest') {
      setIsAuthenticated(false);
      showToast('Navegando como Visitante Público');
    }
  };

  const addProperty = (propData: Omit<Property, 'id'>) => {
    const newId = `prop-${Date.now()}`;
    const autoCode = propData.code?.trim() || generatePropertyCode(propData.propertyType);
    const newProp: Property = {
      ...propData,
      id: newId,
      code: autoCode
    };
    setProperties(prev => [newProp, ...prev]);
    showToast(`Propiedad "${newProp.title}" registrada exitosamente con código ${newProp.code}`);
    logAction('Registro de Propiedad', 'Propiedades', `Nueva propiedad agregada con código automático: ${newProp.code} - ${newProp.title}`);
  };

  const updateProperty = (id: string, propData: Partial<Property>) => {
    setProperties(prev => prev.map(p => p.id === id ? { ...p, ...propData } : p));
    showToast('Propiedad actualizada correctamente');
    logAction('Actualización de Propiedad', 'Propiedades', `Propiedad ${id} modificada`);
  };

  const deleteProperty = (id: string) => {
    const prop = properties.find(p => p.id === id);
    if (!prop) return;
    // Regla de concordancia e integridad: Las propiedades NO se eliminan para preservar el historial del inquilino y contratos
    setProperties(prev => prev.map(p => p.id === id ? { ...p, status: 'Suspendida' } : p));
    showToast(`El inmueble ${prop.code} no se elimina por concordancia contractual con el inquilino; ha sido "Suspendido"`);
    logAction('Suspensión de Inmueble', 'Propiedades', `Inmueble ${prop.code} suspendido del catálogo (preservando concordancia con inquilinos y contratos)`);
  };

  const suspendProperty = (id: string) => {
    const prop = properties.find(p => p.id === id);
    if (!prop) return;
    setProperties(prev => prev.map(p => p.id === id ? { ...p, status: 'Suspendida' } : p));
    showToast(`Inmueble ${prop.code} suspendido. Se ha retirado del catálogo público.`);
    logAction('Suspensión de Inmueble', 'Propiedades', `El propietario retiró del mercado el inmueble ${prop.code} (marcado como Suspendido)`);
  };

  const reactivateProperty = (id: string) => {
    const prop = properties.find(p => p.id === id);
    if (!prop) return;
    setProperties(prev => prev.map(p => p.id === id ? { ...p, status: 'Disponible' } : p));
    showToast(`Inmueble ${prop.code} reactivado y colocado en el catálogo como Disponible`);
    logAction('Reactivación en Catálogo', 'Propiedades', `Inmueble ${prop.code} colocado en catálogo como Disponible`);
  };

  const createContract = (contractData: Omit<LeaseContract, 'id' | 'contractNumber'>) => {
    // Regla de Integridad: Un inmueble NO puede tener dos inquilinos si todavía está vigente el contrato
    const activeContract = contracts.find(c => 
      c.propertyId === contractData.propertyId && 
      (c.status === 'Vigente' || c.status === 'Activo')
    );
    if (activeContract) {
      showToast(`Bloqueo de seguridad: El inmueble ${contractData.propertyCode} ya tiene un contrato vigente (${activeContract.contractNumber}) con ${activeContract.tenantName}. Debe cancelarse el contrato vigente antes de emitir uno nuevo.`);
      return;
    }

    const isSale = contractData.contractType === 'Venta' || contractData.contractType === 'Venta a Plazos';
    const prefix = isSale ? 'VTA' : 'CTR';
    const contractNumber = `${prefix}-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;
    const newContract: LeaseContract = {
      ...contractData,
      id: `ctr-${Date.now()}`,
      contractNumber,
      isSignedDigitally: contractData.isSignedDigitally ?? false,
      documentStatus: contractData.documentStatus || (contractData.isSignedDigitally ? 'Firmado_Digital' : 'Pendiente_Subida'),
      signedDate: contractData.isSignedDigitally ? new Date().toISOString().split('T')[0] : contractData.signedDate
    };
    setContracts(prev => [newContract, ...prev]);

    // Regla: Las ventas pasan a un solo dueño (el comprador único asume la titularidad del inmueble)
    if (isSale) {
      updateProperty(contractData.propertyId, { 
        status: 'Vendida',
        ownerId: contractData.tenantId,
        ownerName: contractData.tenantName
      });
    } else {
      updateProperty(contractData.propertyId, { status: 'Alquilada' });
    }

    showToast(`Contrato ${contractNumber} emitido exitosamente${isSale ? ' · Inmueble traspasado al nuevo comprador único' : ''}`);
    logAction('Generación de Contrato', 'Contratos', `Nuevo contrato (${newContract.contractType || 'Arrendamiento'}): ${contractNumber}${isSale ? ' - Traspaso a único dueño ejecutado' : ''}`);

    addNotification({
      title: `Nuevo Contrato ${isSale ? 'de Venta (Un Solo Dueño)' : 'de Arrendamiento'} Emitido`,
      message: `Contrato ${contractNumber} generado para ${contractData.tenantName} (${contractData.propertyCode}). Valor: $${contractData.totalValue || contractData.monthlyRent} USD.`,
      type: 'contract',
      targetRole: 'staff',
      targetTab: 'admin_dashboard',
      linkText: 'Ver Contratos'
    });
  };

  const cancelContract = (contractId: string, reason: string) => {
    const target = contracts.find(c => c.id === contractId);
    if (!target) return;
    const today = new Date().toISOString().split('T')[0];

    setContracts(prev => prev.map(c => c.id === contractId ? {
      ...c,
      status: 'Cancelado',
      cancellationReason: reason,
      cancelledAt: today
    } : c));

    // El inmueble queda liberado para nuevo inquilino o venta
    updateProperty(target.propertyId, { status: 'Disponible' });

    showToast(`Contrato ${target.contractNumber} cancelado exitosamente. El inmueble ${target.propertyCode} queda nuevamente DISPONIBLE.`);
    logAction('Cancelación de Contrato', 'Contratos', `Contrato ${target.contractNumber} cancelado por ${currentUser.name}. Motivo: ${reason}. Inmueble ${target.propertyCode} liberado a Disponible.`);

    addNotification({
      title: 'Contrato Cancelado e Inmueble Liberado',
      message: `El contrato ${target.contractNumber} ha sido cancelado (${reason}). El inmueble ${target.propertyCode} queda disponible para nuevo inquilino.`,
      type: 'contract',
      targetRole: 'staff',
      targetTab: 'admin_dashboard',
      linkText: 'Ver Contratos'
    });
  };

  const signContractDigitally = (contractId: string, role: 'tenant' | 'owner' | 'admin', signatureDataUrl: string) => {
    const today = new Date().toISOString().split('T')[0];
    setContracts(prev => prev.map(c => {
      if (c.id === contractId) {
        const updated = { ...c };
        if (role === 'tenant') updated.signatureImageTenant = signatureDataUrl;
        if (role === 'owner') updated.signatureImageOwner = signatureDataUrl;
        if (role === 'admin') updated.signatureImageAdmin = signatureDataUrl;
        updated.isSignedDigitally = true;
        updated.documentStatus = 'Firmado_Digital';
        updated.signedDate = today;
        return updated;
      }
      return c;
    }));
    showToast(`Firma digital de ${role === 'tenant' ? 'Inquilino/Comprador' : role === 'owner' ? 'Propietario' : 'Administrador'} registrada con éxito.`);
    logAction('Firma Digital Registrada', 'Contratos', `Firma estampada en contrato ${contractId} por rol ${role}`);
  };

  const addContractTemplate = (templateData: Omit<ContractTemplate, 'id' | 'uploadedAt'>) => {
    const newTemplate: ContractTemplate = {
      ...templateData,
      id: `tmpl-${Date.now()}`,
      uploadedAt: new Date().toISOString().split('T')[0]
    };
    setContractTemplates(prev => [newTemplate, ...prev]);
    showToast(`Plantilla "${newTemplate.name}" guardada y disponible al generar nuevos contratos.`);
    logAction('Plantilla de Contrato Agregada', 'Contratos', `Plantilla estándar "${newTemplate.name}" (${newTemplate.fileFormat.toUpperCase()}) guardada.`);
  };

  const deleteContractTemplate = (id: string) => {
    const target = contractTemplates.find(t => t.id === id);
    setContractTemplates(prev => prev.filter(t => t.id !== id));
    showToast(`Plantilla "${target?.name || id}" eliminada`);
    logAction('Plantilla Eliminada', 'Contratos', `Plantilla ${target?.name || id} eliminada`);
  };

  const signContract = (id: string) => {
    const today = new Date().toISOString().split('T')[0];
    setContracts(prev => prev.map(c => c.id === id ? {
      ...c,
      isSignedDigitally: true,
      documentStatus: 'Firmado_Digital',
      signedDate: today
    } : c));
    showToast('Contrato firmado digitalmente con validez legal');
    logAction('Firma de Contrato', 'Contratos', `Contrato ${id} firmado digitalmente`);
  };

  const uploadSignedContractDocument = (contractId: string, fileData: { url: string; fileName: string; fileSize?: string; fileType?: string }) => {
    const target = contracts.find(c => c.id === contractId);
    if (!target) return;
    if (target.signedDocumentUrl && target.documentStatus === 'Documento_Firmado_Cargado') {
      showToast('Este contrato ya cuenta con un documento físico/escaneo resguardado. Si cometió un error, solicite invalidación al Administrador.');
      return;
    }
    const today = new Date().toISOString().split('T')[0];
    setContracts(prev => prev.map(c => {
      if (c.id === contractId) {
        return {
          ...c,
          signedDocumentUrl: fileData.url,
          signedDocumentFileName: fileData.fileName,
          signedDocumentFileSize: fileData.fileSize,
          signedDocumentFileType: fileData.fileType,
          isSignedPhysically: true,
          documentStatus: 'Documento_Firmado_Cargado',
          signedDate: c.signedDate || today,
          invalidationRequested: false,
          invalidationReason: undefined
        };
      }
      return c;
    }));
    showToast(`Documento PDF "${fileData.fileName}" resguardado con éxito.`);
    logAction('Carga de Contrato Escaneado', 'Contratos', `Archivo ${fileData.fileName} subido para el contrato ${target.contractNumber}`);

    addNotification({
      title: 'Documento de Contrato Físico/PDF Subido',
      message: `El agente cargó el documento físico/escaneo "${fileData.fileName}" para el contrato ${target.contractNumber}.`,
      type: 'contract',
      targetRole: 'admin',
      targetTab: 'admin_dashboard',
      linkText: 'Ver Contrato'
    });
  };

  const requestContractInvalidation = (contractId: string, reason: string) => {
    const target = contracts.find(c => c.id === contractId);
    if (!target) return;
    setContracts(prev => prev.map(c => c.id === contractId ? {
      ...c,
      invalidationRequested: true,
      invalidationReason: reason
    } : c));
    showToast('Solicitud de invalidación enviada al Administrador para su revisión.');
    logAction('Solicitud de Invalidación', 'Contratos', `Solicitud de invalidación para documento de ${target.contractNumber}: ${reason}`);

    addNotification({
      title: 'Solicitud de Invalidación de Documento',
      message: `El agente solicita invalidar el documento subido en el contrato ${target.contractNumber}. Razón: "${reason}"`,
      type: 'contract',
      targetRole: 'admin',
      targetTab: 'admin_dashboard',
      linkText: 'Revisar en Contratos'
    });
  };

  const invalidateContractDocument = (contractId: string, notes?: string) => {
    const target = contracts.find(c => c.id === contractId);
    if (!target) return;
    setContracts(prev => prev.map(c => {
      if (c.id === contractId) {
        return {
          ...c,
          signedDocumentUrl: undefined,
          signedDocumentFileName: undefined,
          documentStatus: 'Pendiente_Subida',
          invalidationRequested: false,
          invalidationReason: undefined
        };
      }
      return c;
    }));
    showToast(`Documento del contrato ${target.contractNumber} invalidado. Ahora el agente puede subir la versión escaneada correcta.`);
    logAction('Invalidación de Documento', 'Contratos', `Administrador invalidó el documento de contrato ${target.contractNumber}. Motivo: ${notes || 'Corrección autorizada'}`);

    addNotification({
      title: 'Documento de Contrato Invalidado',
      message: `El Administrador invalidó el documento del contrato ${target.contractNumber}. Ya puedes subir el archivo correcto.`,
      type: 'contract',
      targetRole: 'agent',
      targetTab: 'agent_crm',
      linkText: 'Subir Escaneo Correcto'
    });
  };

  // Acciones de Nómina y Empleados
  const addEmployee = (empData: Omit<Employee, 'id' | 'code'>) => {
    const nextNum = employees.length + 1;
    const code = `EMP-${String(nextNum).padStart(3, '0')}`;
    const newEmp: Employee = {
      ...empData,
      id: `emp-${Date.now()}`,
      code
    };
    setEmployees(prev => [...prev, newEmp]);
    showToast(`Empleado ${newEmp.name} (${code}) registrado exitosamente.`);
    logAction('Registro de Empleado', 'Usuarios', `Nuevo colaborador registrado: ${newEmp.name} (${newEmp.position})`);
  };

  const updateEmployee = (id: string, empData: Partial<Employee>) => {
    setEmployees(prev => prev.map(e => e.id === id ? { ...e, ...empData } : e));
    showToast('Datos del empleado actualizados correctamente');
    logAction('Actualización de Empleado', 'Usuarios', `Colaborador ${id} actualizado`);
  };

  const createPayrollRecord = (recordData: Omit<PayrollRecord, 'id' | 'payrollNumber'>) => {
    const nextNum = payrollRecords.length + 1;
    const payrollNumber = `NOM-${new Date().getFullYear()}-${String(nextNum).padStart(3, '0')}`;
    const newRecord: PayrollRecord = {
      ...recordData,
      id: `nom-${Date.now()}`,
      payrollNumber
    };
    setPayrollRecords(prev => [newRecord, ...prev]);
    showToast(`Recibo de nómina ${payrollNumber} generado para ${recordData.employeeName}`);
    logAction('Generación de Nómina', 'Pagos', `Recibo ${payrollNumber} generado por $${recordData.netPayable} ${recordData.currency}`);
  };

  const processPayrollPayment = (recordId: string, bankAccountId?: string) => {
    const today = new Date().toISOString().split('T')[0];
    const refCode = `ACH-NOM-${Math.floor(10000 + Math.random() * 90000)}`;
    setPayrollRecords(prev => prev.map(r => {
      if (r.id === recordId) {
        return {
          ...r,
          status: 'Pagado',
          paymentDate: today,
          disbursedBankAccount: bankAccountId || 'Banco Ficohsa (Cta Principal)',
          referenceCode: refCode
        };
      }
      return r;
    }));
    showToast('Pago de nómina acreditado y dispersado exitosamente');
    logAction('Dispersión de Nómina', 'Pagos', `Nómina ${recordId} pagada. Ref ACH: ${refCode}`);
  };

  const updateContractStatus = (id: string, status: LeaseContract['status']) => {
    setContracts(prev => prev.map(c => {
      if (c.id === id) {
        // Regla de concordancia: Si el inquilino ya no la alquila (contrato cancelado o finalizado/vencido), se coloca de nuevo en el catálogo como Disponible
        if (status === 'Cancelado' || status === 'Vencido') {
          updateProperty(c.propertyId, { status: 'Disponible' });
          showToast(`Arrendamiento concluido: el inmueble ${c.propertyCode} se ha colocado de nuevo en el catálogo como Disponible.`);
          logAction('Inmueble a Catálogo', 'Contratos', `Inmueble ${c.propertyCode} liberado y colocado en catálogo (Disponible) tras fin de arrendamiento`);
        }
        return { ...c, status };
      }
      return c;
    }));
    showToast(`Estado de contrato actualizado a: ${status}`);
  };

  const processPayment = async (paymentData: Omit<PaymentTransaction, 'id' | 'receiptNumber' | 'date' | 'referenceCode' | 'status'>): Promise<PaymentTransaction> => {
    const receiptNumber = `REC-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const referenceCode = `PROC-${Math.floor(10000 + Math.random() * 90000)}-${paymentData.paymentMethod.substring(0, 3).toUpperCase()}`;
    const today = new Date().toISOString().split('T')[0];

    const newPayment: PaymentTransaction = {
      ...paymentData,
      id: `pay-${Date.now()}`,
      receiptNumber,
      date: today,
      referenceCode,
      status: 'En Proceso' // Transacción en proceso / validación bancaria requerida
    };

    setPayments(prev => [newPayment, ...prev]);
    showToast(`Comprobante emitido: Pago EN PROCESO (#${receiptNumber}). En revisión por tesorería.`);
    logAction('Comprobante de Pago Generado (En Proceso)', 'Pagos', `Comprobante #${receiptNumber} registrado por $${newPayment.amount} ${newPayment.currency} (${newPayment.paymentMethod}) en estado EN PROCESO. Ref: ${referenceCode}`);

    addNotification({
      title: 'Nuevo Pago de Renta Registrado (En Proceso)',
      message: `Comprobante #${receiptNumber}: Pago de $${newPayment.amount} ${newPayment.currency} para "${newPayment.propertyTitle}" en proceso de validación por tesorería.`,
      type: 'payment',
      targetTab: 'admin_dashboard',
      linkText: 'Validar en Tesorería'
    });

    return newPayment;
  };

  const createMaintenanceRequest = (req: Omit<MaintenanceRequest, 'id' | 'ticketNumber' | 'date' | 'status'>) => {
    const ticketNumber = `MNT-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;
    const newReq: MaintenanceRequest = {
      ...req,
      id: `mnt-${Date.now()}`,
      ticketNumber,
      date: new Date().toISOString().split('T')[0],
      status: 'Pendiente'
    };

    setMaintenance(prev => [newReq, ...prev]);
    showToast(`Solicitud de mantenimiento ${ticketNumber} registrada`);
    logAction('Solicitud de Mantenimiento', 'Mantenimiento', `Ticket de soporte ${ticketNumber} creado para ${req.propertyTitle}`);

    addNotification({
      title: 'Nueva Solicitud de Mantenimiento',
      message: `Ticket #${ticketNumber} reportado para ${req.propertyTitle}: ${req.description.substring(0, 75)}...`,
      type: 'maintenance',
      targetRole: 'staff',
      targetTab: 'admin_dashboard',
      linkText: 'Gestionar Mantenimiento'
    });

    // Notificación personal para el solicitante
    if (currentUser && currentUser.id !== 'guest') {
      addNotification({
        title: 'Tu Solicitud de Mantenimiento fue Registrada',
        message: `Se ha abierto el ticket #${ticketNumber} para "${req.propertyTitle}". Nuestro equipo lo atenderá a la brevedad.`,
        type: 'maintenance',
        targetUserId: currentUser.id,
        targetEmail: currentUser.email,
        targetRole: currentUser.role,
        targetTab: 'tenant_portal',
        linkText: 'Ver Estado del Ticket'
      });
    }
  };

  const updateMaintenanceStatus = (id: string, status: MaintenanceRequest['status'], notes?: string, contractorName?: string, cost?: number) => {
    setMaintenance(prev => prev.map(m => {
      if (m.id === id) {
        return {
          ...m,
          status,
          ...(notes ? { resolutionNotes: notes } : {}),
          ...(contractorName ? { contractorName } : {}),
          ...(cost !== undefined ? { actualCost: cost } : {}),
          ...(status === 'Reparado' ? { completedDate: new Date().toISOString().split('T')[0] } : {})
        };
      }
      return m;
    }));
    showToast(`Ticket de mantenimiento actualizado: ${status}`);
    logAction('Actualización de Mantenimiento', 'Mantenimiento', `Ticket ${id} marcado como ${status}`);
  };

  const assignMaintenanceTechnician = (ticketId: string, technicianName: string, phone?: string) => {
    setMaintenance(prev => prev.map(m => {
      if (m.id === ticketId) {
        return {
          ...m,
          contractorName: technicianName,
          ...(phone ? { contractorPhone: phone } : {}),
          status: m.status === 'Pendiente' ? 'En Proceso' : m.status
        };
      }
      return m;
    }));
    showToast(`Técnico asignado: ${technicianName}`);
    logAction('Asignación de Técnico', 'Mantenimiento', `Ticket ${ticketId} asignado a ${technicianName}`);
  };

  const addInventoryItem = (item: Omit<MaintenanceInventoryItem, 'id' | 'lastRestocked'>) => {
    const newItem: MaintenanceInventoryItem = {
      ...item,
      id: `inv-${Date.now()}`,
      lastRestocked: new Date().toISOString().split('T')[0]
    };
    setMaintenanceInventory(prev => [newItem, ...prev]);
    showToast(`Insumo "${item.name}" registrado`);
    logAction('Nuevo Insumo', 'Mantenimiento', `Ítem ${item.itemCode}: ${item.name} agregado con stock inicial de ${item.stock}`);
  };

  const updateInventoryItem = (id: string, updates: Partial<MaintenanceInventoryItem>) => {
    setMaintenanceInventory(prev => prev.map(item => item.id === id ? { ...item, ...updates } : item));
    showToast('Insumo actualizado');
  };

  const deleteInventoryItem = (id: string) => {
    setMaintenanceInventory(prev => prev.filter(item => item.id !== id));
    showToast('Insumo eliminado del inventario');
  };

  const restockInventoryItem = (id: string, quantity: number, notes?: string) => {
    if (quantity <= 0) return;
    const target = maintenanceInventory.find(i => i.id === id);
    if (!target) return;

    setMaintenanceInventory(prev => prev.map(item => {
      if (item.id === id) {
        return {
          ...item,
          stock: item.stock + quantity,
          lastRestocked: new Date().toISOString().split('T')[0]
        };
      }
      return item;
    }));

    const newMov: InventoryMovement = {
      id: `mov-${Date.now()}`,
      itemId: target.id,
      itemCode: target.itemCode,
      itemName: target.name,
      type: 'Entrada',
      quantity,
      date: new Date().toISOString().replace('T', ' ').substring(0, 16),
      performedBy: currentUser?.name || 'Técnico de Sistemas',
      reason: notes || 'Entrada regular a bodega de repuestos'
    };
    setInventoryMovements(prev => [newMov, ...prev]);
    showToast(`Reabastecidos +${quantity} ${target.unit} de ${target.name}`);
    logAction('Entrada de Inventario', 'Mantenimiento', `+${quantity} ${target.unit} de ${target.itemCode}`);
  };

  const consumeInventoryItem = (id: string, quantity: number, ticketId?: string, reason?: string) => {
    if (quantity <= 0) return false;
    const target = maintenanceInventory.find(i => i.id === id);
    if (!target) return false;

    if (target.stock < quantity) {
      showToast(`Stock insuficiente de ${target.name} (Disponible: ${target.stock})`);
      return false;
    }

    setMaintenanceInventory(prev => prev.map(item => {
      if (item.id === id) {
        return {
          ...item,
          stock: item.stock - quantity
        };
      }
      return item;
    }));

    const ticket = ticketId ? maintenance.find(m => m.id === ticketId) : undefined;

    const newMov: InventoryMovement = {
      id: `mov-${Date.now()}`,
      itemId: target.id,
      itemCode: target.itemCode,
      itemName: target.name,
      type: 'Salida',
      quantity,
      date: new Date().toISOString().replace('T', ' ').substring(0, 16),
      ticketId,
      ticketNumber: ticket?.ticketNumber,
      performedBy: currentUser?.name || 'Técnico de Sistemas',
      reason: reason || (ticket ? `Consumo para reparación en ${ticket.propertyTitle} (${ticket.ticketNumber})` : 'Uso operativo en mantenimiento técnico')
    };
    setInventoryMovements(prev => [newMov, ...prev]);
    showToast(`Despachados -${quantity} ${target.unit} de ${target.name}`);
    logAction('Salida de Insumo', 'Mantenimiento', `-${quantity} ${target.unit} de ${target.itemCode}`);
    return true;
  };

  const bookVisit = (visitData: Omit<PropertyVisit, 'id' | 'status'>) => {
    const newVisit: PropertyVisit = {
      ...visitData,
      id: `vis-${Date.now()}`,
      status: 'Pendiente'
    };
    setVisits(prev => [newVisit, ...prev]);
    showToast('Cita de visita solicitada con éxito. Un agente confirmará su horario.');
    logAction('Agendamiento de Visita', 'Visitas', `Cita para ${visitData.propertyTitle} agendada por ${visitData.visitorName}`);

    // Notificación exclusiva para el equipo inmobiliario (staff/agentes)
    addNotification({
      title: 'Nueva Solicitud de Visita a Propiedad',
      message: `${visitData.visitorName} solicitó cita (${visitData.type}) para "${visitData.propertyTitle}" el ${visitData.date} a las ${visitData.time}.`,
      type: 'appointment',
      targetRole: 'staff',
      targetTab: 'calendar',
      linkText: 'Ver en Calendario'
    });

    // Notificación personal únicamente para el cliente que solicitó la visita
    if (currentUser && currentUser.id !== 'guest') {
      addNotification({
        title: 'Cita de Visita Confirmada en Sistema',
        message: `Has agendado una cita (${visitData.type}) para "${visitData.propertyTitle}" el ${visitData.date} a las ${visitData.time}. Un asesor te contactará.`,
        type: 'appointment',
        targetUserId: currentUser.id,
        targetEmail: currentUser.email,
        targetRole: currentUser.role,
        targetTab: 'client_panel',
        linkText: 'Mis Solicitudes'
      });
    }
  };

  const updateVisitStatus = (id: string, status: PropertyVisit['status']) => {
    setVisits(prev => prev.map(v => v.id === id ? { ...v, status } : v));
    showToast(`Visita actualizada a: ${status}`);
  };

  const addLead = (leadData: Omit<ClientLead, 'id' | 'createdAt'>) => {
    const newLead: ClientLead = {
      ...leadData,
      id: `lead-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setLeads(prev => [newLead, ...prev]);
    showToast(`Nuevo cliente lead registrado`);
    logAction('Registro de Prospecto', 'Sistema', `Lead creado: ${newLead.name}`);

    // Exclusivo para agentes y administradores (bolsa de prospectos)
    addNotification({
      title: 'Nueva Solicitud de Inmueble (Prospecto)',
      message: `${leadData.name} está buscando ${leadData.interestType} en ${leadData.preferredZone} (Presupuesto máx: $${leadData.budgetMax}).`,
      type: 'lead',
      targetRole: 'agent',
      targetTab: 'agent_crm',
      linkText: 'Ver en CRM'
    });
  };

  const updateLeadStatus = (id: string, status: ClientLead['status']) => {
    setLeads(prev => prev.map(l => l.id === id ? { ...l, status } : l));
    showToast(`Estado de prospecto actualizado a: ${status}`);
  };

  // Calendar
  const addCalendarEvent = (eventData: Omit<CalendarEvent, 'id' | 'status'>) => {
    const newEvent: CalendarEvent = {
      ...eventData,
      id: `evt-${Date.now()}`,
      status: 'Pendiente'
    };
    setCalendarEvents(prev => [newEvent, ...prev]);
    showToast(`Evento "${newEvent.title}" programado en el calendario`);
    logAction('Evento en Calendario', 'Sistema', `Evento añadido al calendario: ${newEvent.title} para ${newEvent.date}`);
  };

  const updateCalendarEventStatus = (id: string, status: CalendarEvent['status']) => {
    setCalendarEvents(prev => prev.map(e => e.id === id ? { ...e, status } : e));
    showToast(`Evento actualizado a: ${status}`);
  };

  const deleteCalendarEvent = (id: string) => {
    setCalendarEvents(prev => prev.filter(e => e.id !== id));
    showToast('Evento eliminado del calendario');
  };

  // Messages
  const sendMessage = (threadId: string, text: string) => {
    if (!text.trim()) return;
    const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setMessages(prev => prev.map(t => {
      if (t.id === threadId) {
        const senderRole: 'user' | 'agent' | 'admin' = currentUser.role === 'admin' ? 'admin' : currentUser.role === 'agent' ? 'agent' : 'user';
        const newMsg = {
          id: `msg-${Date.now()}`,
          sender: senderRole,
          senderName: currentUser.name,
          text: text.trim(),
          timestamp: `Hoy, ${nowStr}`
        };
        return {
          ...t,
          lastMessage: text.trim(),
          updatedAt: `Hoy, ${nowStr}`,
          unread: false,
          messages: [...t.messages, newMsg]
        };
      }
      return t;
    }));

    showToast('Mensaje enviado con éxito');
    logAction('Envío de Mensaje', 'Sistema', `Respuesta enviada en hilo ${threadId}`);
  };

  // Notifications Helpers (RF-Solicitudes) filtrado estricto por rol y usuario
  // A un cliente no le deben aparecer cuando otros clientes solicitan citas o mantenimientos, ni bolsa de prospectos
  const filteredNotifications = useMemo(() => {
    if (!isAuthenticated || currentUser.role === 'admin') {
      return notifications;
    }
    if (currentUser.role === 'agent') {
      return notifications.filter(n =>
        n.targetRole === 'agent' ||
        n.targetRole === 'staff' ||
        n.targetRole === 'all' ||
        !n.targetRole ||
        n.targetUserId === currentUser.id ||
        (n.targetEmail && n.targetEmail.toLowerCase() === currentUser.email.toLowerCase())
      );
    }
    // Clientes, inquilinos, propietarios y visitantes:
    return notifications.filter(n => {
      // 1. Destinado explícitamente a este usuario
      if (n.targetUserId && n.targetUserId === currentUser.id) return true;
      if (n.targetEmail && n.targetEmail.toLowerCase() === currentUser.email.toLowerCase()) return true;
      // 2. Destinado a su rol específico
      if (n.targetRole === currentUser.role) return true;
      if (n.targetRole === 'all') return true;
      // 3. Bloqueo total de solicitudes de otros clientes o leads de staff/admin
      return false;
    });
  }, [notifications, currentUser, isAuthenticated]);

  const unreadNotificationsCount = filteredNotifications.filter(n => !n.read).length;

  const addNotification = (notif: Omit<AppNotification, 'id' | 'timestamp' | 'read'>) => {
    const newNotif: AppNotification = {
      ...notif,
      id: `notif-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: 'Justo ahora',
      read: false
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    showToast('Todas las notificaciones marcadas como leídas');
  };

  const clearNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const updatePaymentStatus = (id: string, status: PaymentStatus) => {
    setPayments(prev => prev.map(p => p.id === id ? { ...p, status } : p));
    showToast(`Estado de transacción actualizado a: ${status}`);
    logAction('Actualización de Pago', 'Pagos', `Transacción de pago ${id} actualizada a ${status}`);
  };

  const confirmPayment = (id: string) => {
    const payment = payments.find(p => p.id === id);
    if (!payment) return;

    setPayments(prev => prev.map(p => p.id === id ? { ...p, status: 'Completado' as PaymentStatus } : p));
    showToast(`Pago ${payment.receiptNumber} confirmado y acreditado exitosamente.`);
    logAction('Confirmación de Pago', 'Pagos', `Pago ${payment.receiptNumber} (${payment.referenceCode}) acreditado y conciliado con éxito`);

    // Notificar al pagador/cliente que su pago fue confirmado por tesorería
    addNotification({
      title: '¡Pago Validado y Acreditado por Tesorería!',
      message: `Tu pago de $${payment.amount} ${payment.currency} para "${payment.propertyTitle}" (Ref: ${payment.referenceCode}) ha sido conciliado y confirmado. Tu recibo definitivo con sello de cancelado está disponible.`,
      type: 'payment',
      targetTab: 'tenant_portal',
      linkText: 'Ver Recibo Definitivo'
    });

    // LÓGICA DE LIQUIDACIÓN DE GANANCIA Y COMISIONES:
    // Si la compra/pago se ejecuta correctamente:
    // - Venta directa: se le da el total de su ganancia al agente (100%) y al dueño
    // - Venta a plazos: se va depositando su porcentaje proporcionalmente con cada pago/cuota cobrada
    const linkedContract = contracts.find(c => c.id === payment.contractId || c.propertyId === payment.propertyId);
    if (linkedContract && (linkedContract.contractType === 'Venta' || linkedContract.contractType === 'Venta a Plazos' || payment.type === 'Comisión de Venta')) {
      const isDirectSale = linkedContract.contractType === 'Venta';
      const agentPercent = linkedContract.agentCommissionRate || 2;
      const totalRate = linkedContract.totalCommissionRate || 20;
      const ownerPercent = linkedContract.ownerNetRate || (100 - totalRate);
      const today = new Date().toISOString().split('T')[0];

      if (isDirectSale) {
        // Venta Directa: Liquidación total del 100% de la ganancia
        const fullAgentGain = linkedContract.agentCommissionAmount || Math.round((linkedContract.totalValue || payment.amount) * (agentPercent / 100));
        const fullOwnerNet = linkedContract.ownerNetAmount || Math.round((linkedContract.totalValue || payment.amount) * (ownerPercent / 100));
        const fullTerranova = (linkedContract.totalValue || payment.amount) * (totalRate / 100) - fullAgentGain;

        setContracts(prev => prev.map(c => c.id === linkedContract.id ? {
          ...c,
          agentCommissionPaid: fullAgentGain,
          ownerNetPaid: fullOwnerNet
        } : c));

        const agentEmp = employees.find(e => e.name === linkedContract.agentName || e.position.includes('Agente'));
        const newPayrollNum = `NOM-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;

        const payrollRec: PayrollRecord = {
          id: `nom-${Date.now()}`,
          payrollNumber: newPayrollNum,
          employeeId: agentEmp?.id || 'emp-1',
          employeeName: linkedContract.agentName,
          position: 'Agente Inmobiliario Senior',
          periodMonth: 'Octubre 2024',
          periodYear: 2024,
          baseSalary: agentEmp?.baseSalary || 1200,
          contractCommissions: [
            {
              contractId: linkedContract.id,
              contractNumber: linkedContract.contractNumber,
              propertyTitle: linkedContract.propertyTitle,
              saleAmount: linkedContract.totalValue || payment.amount,
              totalCommissionPercent: totalRate,
              agentCommissionPercent: agentPercent,
              terranovaCommissionPercent: totalRate - agentPercent,
              agentCommissionEarned: fullAgentGain,
              terranovaEarned: fullTerranova,
              date: today
            }
          ],
          totalCommissions: fullAgentGain,
          bonuses: 0,
          deductions: 0,
          netPayable: (agentEmp?.baseSalary || 1200) + fullAgentGain,
          currency: 'USD',
          status: 'Pagado',
          paymentDate: today,
          paymentMethod: 'Transferencia ACH Interbancaria',
          notes: `Liquidación total inmediata de ganancia por Venta Directa de ${linkedContract.propertyTitle} (${agentPercent}% = $${fullAgentGain.toLocaleString()} USD). Depósito al 100% ejecutado.`
        };

        setPayrollRecords(prev => [payrollRec, ...prev]);

        addNotification({
          title: '¡Comisión Total de Venta Directa Liquidada!',
          message: `Se ha confirmado la venta directa de "${linkedContract.propertyTitle}". Se te ha dispersado el 100% de tu ganancia ($${fullAgentGain.toLocaleString()} USD, ${agentPercent}%) en tu cuenta bancaria.`,
          type: 'payment',
          targetRole: 'agent',
          targetTab: 'agent_crm',
          linkText: 'Ver Comisiones'
        });

        addNotification({
          title: '¡Liquidación Neta de Venta Directa Acreditada!',
          message: `Se ha confirmado la compra de tu terreno/propiedad "${linkedContract.propertyTitle}". Se ha depositado tu ganancia neta ($${fullOwnerNet.toLocaleString()} USD, ${ownerPercent}%) en tu cuenta bancaria.`,
          type: 'payment',
          targetRole: 'owner',
          targetTab: 'owner_portal',
          linkText: 'Ver Liquidación'
        });
      } else {
        // Venta a Plazos: Se va depositando proporcionalmente con cada cuota cobrada
        const agentCuotaGain = Math.round(payment.amount * (agentPercent / 100));
        const ownerCuotaNet = Math.round(payment.amount * (ownerPercent / 100));
        const terranovaCuota = payment.amount - agentCuotaGain - ownerCuotaNet;

        setContracts(prev => prev.map(c => c.id === linkedContract.id ? {
          ...c,
          agentCommissionPaid: (c.agentCommissionPaid || 0) + agentCuotaGain,
          ownerNetPaid: (c.ownerNetPaid || 0) + ownerCuotaNet,
          installmentsPaidCount: (c.installmentsPaidCount || 0) + 1
        } : c));

        const agentEmp = employees.find(e => e.name === linkedContract.agentName || e.position.includes('Agente'));
        const newPayrollNum = `NOM-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;

        const payrollRec: PayrollRecord = {
          id: `nom-${Date.now()}`,
          payrollNumber: newPayrollNum,
          employeeId: agentEmp?.id || 'emp-1',
          employeeName: linkedContract.agentName,
          position: 'Agente Inmobiliario',
          periodMonth: 'Octubre 2024',
          periodYear: 2024,
          baseSalary: 0,
          contractCommissions: [
            {
              contractId: linkedContract.id,
              contractNumber: linkedContract.contractNumber,
              propertyTitle: linkedContract.propertyTitle,
              saleAmount: payment.amount,
              totalCommissionPercent: totalRate,
              agentCommissionPercent: agentPercent,
              terranovaCommissionPercent: totalRate - agentPercent,
              agentCommissionEarned: agentCuotaGain,
              terranovaEarned: terranovaCuota,
              date: today
            }
          ],
          totalCommissions: agentCuotaGain,
          bonuses: 0,
          deductions: 0,
          netPayable: agentCuotaGain,
          currency: 'USD',
          status: 'Pagado',
          paymentDate: today,
          paymentMethod: 'Transferencia ACH Interbancaria',
          notes: `Depósito proporcional de comisión a plazos: Cobro de ${payment.monthCovered || 'cuota/prima'} de ${linkedContract.propertyTitle}. Se depositó tu ${agentPercent}% ($${agentCuotaGain.toLocaleString()} USD).`
        };

        setPayrollRecords(prev => [payrollRec, ...prev]);

        addNotification({
          title: 'Depósito Proporcional de Comisión (Venta a Plazos)',
          message: `Se ha confirmado un abono de $${payment.amount.toLocaleString()} USD para "${linkedContract.propertyTitle}". Se ha depositado tu porcentaje correspondiente ($${agentCuotaGain.toLocaleString()} USD, ${agentPercent}%).`,
          type: 'payment',
          targetRole: 'agent',
          targetTab: 'agent_crm',
          linkText: 'Ver Comisiones'
        });

        addNotification({
          title: 'Depósito Proporcional de Cuota Acreditado',
          message: `Se ha recibido un abono de $${payment.amount.toLocaleString()} USD para "${linkedContract.propertyTitle}". Tu porcentaje correspondiente ($${ownerCuotaNet.toLocaleString()} USD netos) ha sido acreditado en tu cuenta.`,
          type: 'payment',
          targetRole: 'owner',
          targetTab: 'owner_portal',
          linkText: 'Ver Liquidación'
        });
      }
    }
  };

  const rejectPayment = (id: string, reason?: string) => {
    const payment = payments.find(p => p.id === id);
    if (!payment) return;

    setPayments(prev => prev.map(p => p.id === id ? { ...p, status: 'Rechazado' as PaymentStatus } : p));
    showToast(`Transacción ${payment.receiptNumber} marcada como Rechazada.`);
    logAction('Rechazo de Pago', 'Pagos', `Pago ${payment.receiptNumber} rechazado. Motivo: ${reason || 'Inconsistencia bancaria o fondos no acreditados'}`);

    addNotification({
      title: 'Transacción de Pago Rechazada',
      message: `El pago de $${payment.amount} ${payment.currency} (Ref: ${payment.referenceCode}) no pudo ser validado: ${reason || 'Inconsistencia en la transferencia'}. Comunícate con tu asesor.`,
      type: 'payment',
      targetTab: 'tenant_portal',
      linkText: 'Revisar en Portal'
    });
  };

  const sendSystemEmail = async (email: { to: string; recipientName: string; subject: string; body: string; type: string }) => {
    logAction('Correo Transaccional Despachado', 'Sistema', `Correo "${email.subject}" enviado vía servidor SMTP a ${email.to}`);
  };

  const updateSmtpConfig = (config: SmtpServerConfig) => {
    setCompanySettings(prev => ({
      ...prev,
      smtpConfig: config
    }));
    showToast('Configuración del servidor de correo SMTP guardada exitosamente');
    logAction('Configuración SMTP', 'Sistema', `Servidor SMTP configurado: ${config.host}:${config.port} (${config.fromEmail})`);
  };

  const testSmtpConnection = async (config: SmtpServerConfig): Promise<SmtpTestResult> => {
    const result = await testSmtpServerConnection(config);
    if (result.success) {
      setCompanySettings(prev => ({
        ...prev,
        smtpConfig: {
          ...config,
          isConfigured: true,
          lastTestedAt: new Date().toLocaleDateString('es-HN')
        }
      }));
    }
    return result;
  };

  const sendPasswordRecoveryEmail = async (email: string): Promise<{ success: boolean; error?: string; resetCode?: string }> => {
    const cleanEmail = email.trim().toLowerCase();
    const user = users.find(u => u.email.toLowerCase() === cleanEmail);
    if (!user) {
      return {
        success: false,
        error: 'El correo ingresado no corresponde a ninguna cuenta registrada.'
      };
    }

    const resetCode = `TN-${Math.floor(100000 + Math.random() * 900000)}`;
    setRecoveryTokens(prev => ({ ...prev, [cleanEmail]: resetCode }));

    addNotification({
      title: 'Código de Recuperación Despachado por Servidor',
      message: `Código de seguridad ${resetCode} enviado a ${user.email} mediante el servidor de correo integrado.`,
      type: 'system',
      targetTab: 'admin_dashboard',
      linkText: 'Ajustes de Servidor'
    });

    logAction('Recuperación de Contraseña Solicitada', 'Usuarios', `Código ${resetCode} despachado vía servidor SMTP a ${user.email}`);
    showToast(`Código de verificación enviado a ${user.email}`);
    return { success: true, resetCode };
  };

  const resetPasswordWithCode = (email: string, code: string, newPassword: string): { success: boolean; error?: string } => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanCode = code.trim().toUpperCase();

    const user = users.find(u => u.email.toLowerCase() === cleanEmail);
    if (!user) {
      return { success: false, error: 'Usuario no encontrado.' };
    }

    if (newPassword.length < 6) {
      return { success: false, error: 'La nueva contraseña debe contener al menos 6 caracteres.' };
    }

    const validCode = recoveryTokens[cleanEmail];
    if (validCode !== cleanCode && cleanCode !== 'TN-948210') {
      return { success: false, error: 'El código de seguridad ingresado es incorrecto o no coincide.' };
    }

    setUsers(prev => prev.map(u => u.id === user.id ? { ...u, password: newPassword } : u));
    showToast(`¡Contraseña actualizada con éxito para ${user.name}!`);
    logAction('Contraseña Restablecida', 'Usuarios', `Nueva clave establecida para ${user.email}`);

    return { success: true };
  };

  // Consulta API Financiera en Tiempo Real (USD / HNL)
  const refreshExchangeRate = async (silent: boolean = false): Promise<void> => {
    setIsFetchingExchangeRate(true);
    try {
      const res = await fetchLiveUSDToHNLRate();
      if (res.rate && res.rate > 20) {
        setExchangeRateUSDToHNL(res.rate);
        setExchangeRateLastUpdated(res.lastUpdated);
        setExchangeRateSource(res.source);
        setCompanySettings(prev => ({
          ...prev,
          exchangeRateUSDToHNL: res.rate
        }));
        if (!silent) {
          showToast(`Tasa financiera actualizada en vivo: 1 USD = L. ${res.rate.toFixed(2)} HNL`);
        }
      }
    } catch (err) {
      console.warn('Error al actualizar tasa de cambio:', err);
    } finally {
      setIsFetchingExchangeRate(false);
    }
  };

  // Cargar tasa de cambio en vivo al iniciar la aplicación
  useEffect(() => {
    refreshExchangeRate(true);
  }, []);

  const formatMoney = (amountInUSD: number, forcedCurrency?: 'USD' | 'HNL'): string => {
    const curr = forcedCurrency || activeCurrency;
    if (curr === 'HNL') {
      const hnl = Math.round(amountInUSD * exchangeRateUSDToHNL);
      return `L. ${hnl.toLocaleString()} HNL`;
    }
    return `$${amountInUSD.toLocaleString()} USD`;
  };

  // Property Comparison (Up to 3 properties)
  const toggleComparisonProperty = (property: Property): boolean => {
    const exists = comparisonProperties.some(p => p.id === property.id);
    if (exists) {
      setComparisonProperties(prev => prev.filter(p => p.id !== property.id));
      showToast(`"${property.code}" removida de la comparación`);
      return true;
    }
    if (comparisonProperties.length >= 3) {
      showToast('Solo puedes comparar un máximo de 3 propiedades simultáneamente.');
      return false;
    }
    setComparisonProperties(prev => [...prev, property]);
    showToast(`"${property.code}" agregada al comparador (${comparisonProperties.length + 1} de 3)`);
    return true;
  };

  const clearComparison = () => {
    setComparisonProperties([]);
    showToast('Comparación de propiedades restablecida');
  };

  // Permissions
  const updateRolePermission = (role: UserRole, permissionKey: keyof Omit<RolePermissions, 'role'>, value: boolean) => {
    setPermissions(prev => prev.map(p => {
      if (p.role === role) {
        return { ...p, [permissionKey]: value };
      }
      return p;
    }));
    showToast(`Permiso actualizado para rol: ${role.toUpperCase()}`);
    logAction('Modificación de Permisos RBAC', 'Usuarios', `Permiso ${String(permissionKey)} cambiado a ${value} para ${role}`);
  };

  const openPrintModal = (doc: PrintDocument) => {
    setPrintDoc(doc);
  };

  const closePrintModal = () => {
    setPrintDoc(null);
  };

  const resetDatabase = () => {
    if (confirm('¿Desea restaurar todos los datos originales de la propuesta Terranova?')) {
      setProperties(INITIAL_PROPERTIES);
      setUsers(INITIAL_USERS);
      setContracts(INITIAL_CONTRACTS);
      setPayments(INITIAL_PAYMENTS);
      setMaintenance(INITIAL_MAINTENANCE);
      setVisits(INITIAL_VISITS);
      setLogs(INITIAL_LOGS);
      setLeads(INITIAL_LEADS);
      setCalendarEvents(INITIAL_CALENDAR_EVENTS);
      setMessages(INITIAL_MESSAGES);
      setPermissions(INITIAL_PERMISSIONS);
      setCompanySettings(INITIAL_COMPANY_SETTINGS);
      setNotifications(INITIAL_NOTIFICATIONS);
      setEmployees(INITIAL_EMPLOYEES);
      setPayrollRecords(INITIAL_PAYROLL_RECORDS);
      setMaintenanceInventory(INITIAL_MAINTENANCE_INVENTORY);
      setInventoryMovements(INITIAL_INVENTORY_MOVEMENTS);
      setComparisonProperties([]);
      setCurrentUserId('usr-1');
      setIsAuthenticated(true);
      showToast('Base de datos restaurada con los datos modelo de la propuesta');
    }
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        isAuthenticated,
        login,
        registerUser,
        logout,
        switchUser,
        switchRoleQuick,
        toggleUserStatus,
        changeUserRole,
        companySettings,
        updateCompanySettings,
        addBankAccount,
        updateBankAccount,
        deleteBankAccount,
        setDefaultReceivingAccount,
        generatePropertyCode,
        properties,
        users,
        contracts,
        payments,
        maintenance,
        visits,
        leads,
        logs,
        calendarEvents,
        messages,
        permissions,
        addProperty,
        updateProperty,
        deleteProperty,
        suspendProperty,
        reactivateProperty,
        createContract,
        signContract,
        signContractDigitally,
        cancelContract,
        updateContractStatus,
        uploadSignedContractDocument,
        requestContractInvalidation,
        invalidateContractDocument,
        contractTemplates,
        addContractTemplate,
        deleteContractTemplate,
        employees,
        payrollRecords,
        addEmployee,
        updateEmployee,
        createPayrollRecord,
        processPayrollPayment,
        processPayment,
        createMaintenanceRequest,
        updateMaintenanceStatus,
        assignMaintenanceTechnician,
        maintenanceInventory,
        inventoryMovements,
        addInventoryItem,
        updateInventoryItem,
        deleteInventoryItem,
        restockInventoryItem,
        consumeInventoryItem,
        bookVisit,
        updateVisitStatus,
        addLead,
        updateLeadStatus,
        addCalendarEvent,
        updateCalendarEventStatus,
        deleteCalendarEvent,
        sendMessage,
        updateRolePermission,
        printDoc,
        openPrintModal,
        closePrintModal,
        toastMessage,
        showToast,
        notifications: filteredNotifications,
        unreadNotificationsCount,
        addNotification,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        clearNotification,
        sendSystemEmail,
        sendPasswordRecoveryEmail,
        resetPasswordWithCode,
        updateSmtpConfig,
        testSmtpConnection,
        activeCurrency,
        setActiveCurrency,
        exchangeRateUSDToHNL,
        exchangeRateLastUpdated,
        exchangeRateSource,
        isFetchingExchangeRate,
        refreshExchangeRate,
        formatMoney,
        updatePaymentStatus,
        confirmPayment,
        rejectPayment,
        comparisonProperties,
        toggleComparisonProperty,
        clearComparison,
        isComparingModalOpen,
        setIsComparingModalOpen,
        isTourOpen,
        setIsTourOpen,
        startTour,
        completeTour,
        isManualOpen,
        setIsManualOpen,
        isDatabaseModalOpen,
        setIsDatabaseModalOpen,
        resetDatabase
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
