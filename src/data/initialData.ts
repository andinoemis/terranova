import { 
  Property, 
  User, 
  LeaseContract, 
  MaintenanceRequest, 
  PropertyVisit, 
  PaymentTransaction, 
  SystemLog, 
  ClientLead, 
  CalendarEvent, 
  MessageThread, 
  RolePermissions, 
  AppNotification, 
  SimulatedEmail,
  Employee,
  PayrollRecord,
  ContractTemplate,
  MaintenanceInventoryItem,
  InventoryMovement
} from '../types';
import { DEFAULT_SMTP_CONFIG } from '../services/emailServerService';

export const INITIAL_USERS: User[] = [
  {
    id: 'usr-1',
    name: 'Kenneth Adonay Zúniga',
    email: 'kenneth.zuniga@unah.hn',
    phone: '+504-9876-5432',
    nationalId: '0801199512345',
    role: 'admin',
    status: 'active',
    isSubscribed: true,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    accountNumber: 'CTA-ADM-001',
    password: 'Admin123!'
  },
  {
    id: 'usr-2',
    name: 'Anthony Rafael Alfaro',
    email: 'anthony.alfaro@unah.hn',
    phone: '+504-9912-3456',
    nationalId: '0801199323456',
    role: 'agent',
    status: 'active',
    isSubscribed: true,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    accountNumber: 'CTA-AGT-104',
    password: 'Agente123!'
  },
  {
    id: 'usr-3',
    name: 'Keidy Melina Reyes',
    email: 'keidy.reyes@unah.hn',
    phone: '+504-9456-7890',
    nationalId: '0801199434567',
    role: 'owner',
    status: 'active',
    isSubscribed: true,
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    accountNumber: 'CTA-PROP-202',
    password: 'Propietario123!'
  },
  {
    id: 'usr-4',
    name: 'Emis Alejandra Torres',
    email: 'andinoemis@gmail.com',
    phone: '+504-9623-4567',
    nationalId: '0801199645678',
    role: 'tenant',
    status: 'active',
    isSubscribed: true, // Usuario registrado con suscripción activa
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    accountNumber: 'CTA-INQ-305',
    password: 'Inquilino123!'
  },
  {
    id: 'usr-5',
    name: 'Carlos Murillo (Servicios Pro)',
    email: 'mantenimiento.murillo@gmail.com',
    phone: '+504-9511-2233',
    nationalId: '0801198956789',
    role: 'contractor',
    status: 'active',
    isSubscribed: false,
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    accountNumber: 'CTA-CTR-401',
    password: 'Contratista123!'
  },
  {
    id: 'usr-6',
    name: 'Ing. David Orellana (Soporte Técnico / DBA)',
    email: 'tecnico.sistemas@terranova.hn',
    phone: '+504-9877-6655',
    nationalId: '0801198901234',
    role: 'technician',
    status: 'active',
    isSubscribed: true,
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    accountNumber: 'CTA-TEC-001',
    password: 'Tecnico123!'
  }
];

export const INITIAL_PROPERTIES: Property[] = [
  {
    id: 'prop-1',
    code: 'CASA PRINCE',
    title: 'Casa Prince - Modelo Clásico de Dos Niveles',
    address: 'Residencial Las Hadas, Circuito Cerrado Calle 4',
    city: 'Tegucigalpa, M.D.C.',
    neighborhood: 'Las Hadas',
    size: 280, // m²
    propertyType: 'Casa',
    transactionType: 'Alquiler',
    price: 1250,
    currency: 'USD',
    status: 'Alquilada', // En arriendo con Emis Torres
    bedrooms: 4,
    bathrooms: 3.5,
    parkingSpots: 2,
    description: 'Hermosa residencia colonial moderna con acabados en madera de caoba, amplio jardín posterior, sala principal con doble altura, cocina integral con desayunador de granito y garaje techado. Ubicada en uno de los circuitos cerrados más cotizados y seguros de Tegucigalpa.',
    features: ['Seguridad Privada 24/7', 'Cisterna 5,000 gal', 'Jardín con Terraza', 'Calentador Solar', 'Habitación de Servicio', 'Cuarto de Lavandería'],
    images: [
      'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=900&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=900&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?w=900&auto=format&fit=crop&q=80'
    ],
    ownerId: 'usr-3',
    ownerName: 'Keidy Melina Reyes',
    assignedAgentId: 'usr-2',
    assignedAgentName: 'Anthony Rafael Alfaro',
    yearBuilt: 2021,
    monthlyMaintenanceFee: 65,
    documents: [
      { title: 'Plano Arquitectónico Oficial', url: '#', type: 'PDF' },
      { title: 'Escritura Pública y Tradición de Dominio', url: '#', type: 'PDF' }
    ]
  },
  {
    id: 'prop-2',
    code: 'SKY-204',
    title: 'Apartamento de Lujo en Torre Sky Penthouse',
    address: 'Calle República de Chile, Lomas del Guijarro',
    city: 'Tegucigalpa, M.D.C.',
    neighborhood: 'Lomas del Guijarro',
    size: 165,
    propertyType: 'Apartamento',
    transactionType: 'Alquiler',
    price: 1400,
    currency: 'USD',
    status: 'Disponible',
    bedrooms: 3,
    bathrooms: 2,
    parkingSpots: 2,
    description: 'Exclusivo apartamento en nivel 14 con vista panorámica de 180° a toda la capital. Balcón perimetral, línea blanca completa incluida, amenidades del edificio: piscina infinity, gimnasio equipado, salón social y control de acceso biométrico.',
    features: ['Vista Panorámica', 'Piscina Infinity', 'Gimnasio', 'Línea Blanca', 'Generador Eléctrico 100%', 'Área Social BBQ'],
    images: [
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=900&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=900&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=900&auto=format&fit=crop&q=80'
    ],
    ownerId: 'usr-3',
    ownerName: 'Keidy Melina Reyes',
    assignedAgentId: 'usr-2',
    assignedAgentName: 'Anthony Rafael Alfaro',
    yearBuilt: 2023,
    monthlyMaintenanceFee: 120
  },
  {
    id: 'prop-3',
    code: 'VIL-SANT',
    title: 'Villa Campestre Los Pinos',
    address: 'Carretera a Valle de Ángeles Km 12.5',
    city: 'Valle de Ángeles',
    neighborhood: 'El Liquidámbar',
    size: 420,
    propertyType: 'Villa',
    transactionType: 'Venta',
    price: 245000,
    currency: 'USD',
    status: 'Disponible',
    bedrooms: 5,
    bathrooms: 4.5,
    parkingSpots: 4,
    description: 'Impresionante propiedad de descanso en zona de clima fresco rodeada de pinares. Estilo rústico moderno con chimenea funcional de piedra volcánica, terrazas techadas con horno de leña, pozo séptico ecológico y terreno perimetralmente cercado.',
    features: ['Clima de Montaña', 'Chimenea', 'Horno de Leña', 'Cercado Perimetral', 'Árboles Frutales', 'Bodega Amplia'],
    images: [
      'https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=900&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=900&auto=format&fit=crop&q=80'
    ],
    ownerId: 'usr-3',
    ownerName: 'Keidy Melina Reyes',
    assignedAgentId: 'usr-2',
    assignedAgentName: 'Anthony Rafael Alfaro',
    yearBuilt: 2020,
    monthlyMaintenanceFee: 40
  },
  {
    id: 'prop-4',
    code: 'TER-HAT',
    title: 'Terreno Panorámico Residencial El Hatillo',
    address: 'Sector Los Limones, El Hatillo',
    city: 'Tegucigalpa, M.D.C.',
    neighborhood: 'El Hatillo',
    size: 1250, // m²
    propertyType: 'Terreno',
    transactionType: 'Venta',
    price: 95000,
    currency: 'USD',
    status: 'Disponible',
    bedrooms: 0,
    bathrooms: 0,
    parkingSpots: 0,
    description: 'Lote residencial con topografía semicircular suave, apto para desarrollo de vivienda unifamiliar de lujo. Disponibilidad inmediata de servicios de agua potable, electricidad trifásica y fibra óptica. Impresionante vista hacia la reserva de La Tigra.',
    features: ['Topografía Aprovechable', 'Servicios Públicos Disponibles', 'Acceso Pavimentado', 'Reserva Natural Cercana', 'Escritura Registrada'],
    images: [
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=900&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1448375240586-882707db888b?w=900&auto=format&fit=crop&q=80'
    ],
    ownerId: 'usr-3',
    ownerName: 'Keidy Melina Reyes',
    assignedAgentId: 'usr-2',
    assignedAgentName: 'Anthony Rafael Alfaro',
    monthlyMaintenanceFee: 0
  },
  {
    id: 'prop-5',
    code: 'ROB-108',
    title: 'Residencia Moderna Los Robles',
    address: 'Colonia Los Robles, Bloque F Casa 12',
    city: 'Tegucigalpa, M.D.C.',
    neighborhood: 'Los Robles',
    size: 240,
    propertyType: 'Casa',
    transactionType: 'Venta',
    price: 185000,
    currency: 'USD',
    status: 'Disponible',
    bedrooms: 3,
    bathrooms: 3,
    parkingSpots: 2,
    description: 'Residencia unifamiliar de un solo nivel con diseño bioclimático, iluminación natural, patio interior tipo zen, paneles solares preinstalados y acabados minimalistas. Cerca de colegios, centros comerciales y vías de acceso principales.',
    features: ['Un Solo Nivel', 'Patio Interior Zen', 'Preinstalación Solar', 'Seguridad en el Bloque', 'Portón Eléctrico'],
    images: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=900&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=900&auto=format&fit=crop&q=80'
    ],
    ownerId: 'usr-3',
    ownerName: 'Keidy Melina Reyes',
    assignedAgentId: 'usr-2',
    assignedAgentName: 'Anthony Rafael Alfaro',
    yearBuilt: 2022
  },
  {
    id: 'prop-6',
    code: 'LOC-MOR',
    title: 'Local Comercial Estratégico Boulevard Morazán',
    address: 'Plaza Corporativa Morazán, Local 2B',
    city: 'Tegucigalpa, M.D.C.',
    neighborhood: 'Bulevar Morazán',
    size: 110,
    propertyType: 'Local Comercial',
    transactionType: 'Alquiler',
    price: 1800,
    currency: 'USD',
    status: 'Disponible',
    bedrooms: 0,
    bathrooms: 2,
    parkingSpots: 4,
    description: 'Local en planta baja de alto tráfico peatonal y vehicular. Fachada de vidrio templado, piso de porcelanato de alto impacto, ductos para aire acondicionado central y más de 80 estacionamientos para clientes.',
    features: ['Planta Baja', 'Alto Tráfico', 'Seguridad Bancaria', 'Estacionamiento de Clientes', 'Vidrio Templado'],
    images: [
      'https://images.unsplash.com/photo-1497366216548-37526070297c?w=900&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=900&auto=format&fit=crop&q=80'
    ],
    ownerId: 'usr-3',
    ownerName: 'Keidy Melina Reyes',
    assignedAgentId: 'usr-2',
    assignedAgentName: 'Anthony Rafael Alfaro',
    yearBuilt: 2019
  }
];

export const INITIAL_COMPANY_SETTINGS: import('../types').CompanySettings = {
  companyName: 'TERRANOVA GESTIÓN INMOBILIARIA S. DE R.L.',
  slogan: 'TU SUEÑO, AL ALCANCE',
  rtn: '08019995123456',
  address: 'Torre Corporativa Morazán, Nivel 7, Bulevar Morazán, Tegucigalpa M.D.C., Honduras',
  phone: '+504-2235-8000',
  whatsapp: '+504-9876-5432',
  email: 'contacto@terranova.hn',
  customerServiceHours: 'Lunes a Sábado: 8:00 AM - 6:00 PM',
  legalRepresentative: 'Kenneth Adonay Zúniga',
  legalRepresentativeId: '0801-1994-11029',
  policiesSummary: 'Protección integral de datos personales, confidencialidad en operaciones de arrendamiento y cumplimiento estricto de la legislación mercantil y civil de la República de Honduras.',
  termsSummary: 'Términos y condiciones para la intermediación, suscripción de contratos digitales, consignación de inmuebles y procesamiento seguro de canones de arrendamiento.',
  bankAccounts: [
    {
      id: 'bnk-1',
      bankName: 'Banco Ficohsa Honduras',
      accountNumber: '2000-1122-3344-99',
      accountType: 'Cheques',
      currency: 'HNL',
      beneficiaryName: 'TERRANOVA INVERSIONES S. DE R.L.',
      rtn: '08019995123456',
      isDefaultReceiving: true
    },
    {
      id: 'bnk-2',
      bankName: 'BAC Credomatic Honduras',
      accountNumber: '7401-8899-2211-00',
      accountType: 'Moneda Extranjera (USD)',
      currency: 'USD',
      beneficiaryName: 'TERRANOVA INVERSIONES S. DE R.L.',
      rtn: '08019995123456',
      isDefaultReceiving: false
    },
    {
      id: 'bnk-3',
      bankName: 'Banco Atlántida',
      accountNumber: '1100-3344-5566-77',
      accountType: 'Ahorro',
      currency: 'HNL',
      beneficiaryName: 'TERRANOVA INVERSIONES S. DE R.L.',
      rtn: '08019995123456',
      isDefaultReceiving: false
    }
  ],
  activeCurrency: 'USD',
  exchangeRateUSDToHNL: 26.84, // Tasa dinámica en tiempo real (BCH / Mercado Financiero ~26.85)
  enforceHondurasMonetaryLaw: true,
  smtpConfig: DEFAULT_SMTP_CONFIG,
  includeTaxRtn: true
};

export const INITIAL_CONTRACTS: LeaseContract[] = [
  {
    id: 'ctr-001',
    contractNumber: 'CTR-2024-089',
    contractType: 'Arrendamiento',
    propertyId: 'prop-1',
    propertyTitle: 'Casa Prince - Modelo Clásico de Dos Niveles',
    propertyCode: 'CASA PRINCE',
    tenantId: 'usr-4',
    tenantName: 'Emis Alejandra Torres',
    tenantEmail: 'andinoemis@gmail.com',
    tenantPhone: '+504 9623-4567',
    tenantNationalId: '0801-1996-04812',
    managerName: 'Lic. Kenneth Adonay Zúniga',
    managerEmail: 'kenneth.zuniga@unah.hn',
    managerPhone: '+504 9876-5432',
    ownerId: 'usr-3',
    ownerName: 'Keidy Melina Reyes',
    startDate: '2024-01-15',
    endDate: '2025-01-15',
    monthlyRent: 1250,
    depositAmount: 1250,
    currency: 'USD',
    status: 'Vigente',
    isSignedDigitally: true,
    signedDate: '2024-01-10',
    signatureMode: 'Digital',
    documentStatus: 'Firmado Digitalmente',
    agentName: 'Anthony Rafael Alfaro',
    receivingBankAccount: '2000-1122-3344-99',
    receivingBankName: 'Banco Ficohsa Honduras',
    paymentMethodUsed: 'Transferencia Bancaria',
    clauses: [
      'PRIMERA: El arrendatario se compromete a destinar el inmueble exclusivamente para uso residencial familiar.',
      'SEGUNDA: La renta mensual se cancelará dentro de los primeros 5 días hábiles de cada mes.',
      'TERCERA: Los servicios de energía eléctrica, internet y agua potable corren por cuenta del arrendatario.',
      'CUARTA: Cualquier modificación estructural o estética requiere aprobación previa por escrito del arrendador.',
      'QUINTA: El depósito en garantía será reembolsado al finalizar el contrato previa inspección del estado físico del inmueble.'
    ]
  },
  {
    id: 'ctr-hatillo-sale',
    contractNumber: 'VTA-2024-001',
    contractType: 'Venta',
    propertyId: 'prop-4',
    propertyTitle: 'Terreno Panorámico Residencial El Hatillo (Lote Maestro)',
    propertyCode: 'TER-HAT',
    tenantId: 'usr-buyer-hatillo',
    tenantName: 'Ing. Roberto Mendoza Alvarado',
    tenantEmail: 'roberto.mendoza@inversiones.hn',
    tenantPhone: '+504 9788-4422',
    tenantNationalId: '0801-1985-01234',
    managerName: 'Lic. Kenneth Adonay Zúniga',
    managerEmail: 'kenneth.zuniga@unah.hn',
    managerPhone: '+504 9876-5432',
    ownerId: 'usr-3',
    ownerName: 'Keidy Melina Reyes',
    startDate: '2024-10-01',
    endDate: '2024-10-31',
    totalValue: 2000000,
    monthlyRent: 0,
    depositAmount: 0,
    currency: 'USD',
    status: 'Vigente',
    isSignedDigitally: true,
    signedDate: '2024-10-05',
    signatureMode: 'Digital',
    documentStatus: 'Firmado Digitalmente',
    agentName: 'Anthony Rafael Alfaro',
    receivingBankAccount: '2000-1122-3344-99',
    receivingBankName: 'Banco Ficohsa Honduras',
    paymentMethodUsed: 'Transferencia ACH Internacional',
    // Caso de negocio pactado con Keydi Reyes: Venta por $2,000,000 USD
    // Tasa de ganancia 20% ($400,000 USD): Agente Anthony 2% ($40,000 USD), Terranova 18% ($360,000 USD), Dueño neto 80% ($1,600,000 USD)
    // CONFIDENCIAL: Tasa de ganancia visible únicamente para el Dueño del Terreno y el Administrador
    totalCommissionRate: 20,
    agentCommissionRate: 2,
    agencyCommissionRate: 18,
    ownerNetRate: 80,
    totalCommissionAmount: 400000,
    agentCommissionAmount: 40000,
    agencyCommissionAmount: 360000,
    ownerNetAmount: 1600000,
    commissionPayoutMode: 'directa_total',
    agentCommissionPaid: 40000,
    ownerNetPaid: 1600000,
    clauses: [
      'PRIMERA: VENTA Y TRASPASO DE DOMINIO. La parte vendedora transfiere en venta real y efectiva el inmueble ubicado en El Hatillo libre de todo gravamen.',
      'SEGUNDA: PRECIO DE VENTA Y PAGO. El valor total de la transacción convenido es de DOS MILLONES DE DÓLARES ($2,000,000.00 USD), cancelados íntegramente a satisfacción.',
      'TERCERA: SANEAMIENTO Y TRADICIÓN. La parte vendedora se obliga al saneamiento conforme a derecho.',
      'CUARTA: REGISTRO Y ESCRITURACIÓN. Ambas partes convienen formalizar la escritura pública matriz ante notario legal debidamente colegiado en Tegucigalpa.'
    ]
  },
  {
    id: 'ctr-plazos-002',
    contractNumber: 'VTA-2024-002',
    contractType: 'Venta a Plazos',
    propertyId: 'prop-3',
    propertyTitle: 'Villa Campestre Los Pinos (Lote y Residencia)',
    propertyCode: 'VIL-SANT',
    tenantId: 'usr-buyer-plazos',
    tenantName: 'Lic. Fernando Barahona',
    tenantEmail: 'fernando.barahona@consultores.hn',
    tenantPhone: '+504 9811-2244',
    tenantNationalId: '0801-1982-09876',
    managerName: 'Lic. Kenneth Adonay Zúniga',
    managerEmail: 'kenneth.zuniga@unah.hn',
    managerPhone: '+504 9876-5432',
    ownerId: 'usr-3',
    ownerName: 'Keidy Melina Reyes',
    startDate: '2024-10-15',
    endDate: '2029-10-15',
    totalValue: 245000,
    downPayment: 49000,
    financingYears: 5,
    installmentsCount: 60,
    monthlyInstallment: 3267,
    monthlyRent: 3267,
    depositAmount: 0,
    currency: 'USD',
    status: 'Vigente',
    isSignedDigitally: true,
    signedDate: '2024-10-18',
    signatureMode: 'Digital',
    documentStatus: 'Firmado Digitalmente',
    agentName: 'Anthony Rafael Alfaro',
    receivingBankAccount: '2000-1122-3344-99',
    receivingBankName: 'Banco Ficohsa Honduras',
    paymentMethodUsed: 'Transferencia ACH Mensual',
    totalCommissionRate: 20,
    agentCommissionRate: 2,
    agencyCommissionRate: 18,
    ownerNetRate: 80,
    totalCommissionAmount: 49000,
    agentCommissionAmount: 4900,
    agencyCommissionAmount: 44100,
    ownerNetAmount: 196000,
    commissionPayoutMode: 'plazos_proporcional',
    agentCommissionPaid: 980,
    ownerNetPaid: 39200,
    installmentsPaidCount: 0,
    clauses: [
      'PRIMERA: PROMESA DE VENTA A PLAZOS. La parte vendedora promete vender y el adquirente comprar el inmueble.',
      'SEGUNDA: CONDICIONES DE FINANCIAMIENTO. Valor $245,000 USD, prima de $49,000 USD y saldo financiado a 5 años (60 cuotas de $3,267 USD/mes).',
      'TERCERA: REGISTRO Y ESCRITURA. La tradición definitiva operará una vez completadas las cuotas convenidas.'
    ]
  }
];

export const INITIAL_PAYMENTS: PaymentTransaction[] = [
  {
    id: 'pay-hatillo-001',
    receiptNumber: 'REC-2024-9001',
    propertyId: 'prop-4',
    propertyTitle: 'Terreno Panorámico Residencial El Hatillo (Lote Maestro)',
    contractId: 'ctr-hatillo-sale',
    payerName: 'Ing. Roberto Mendoza Alvarado',
    payerEmail: 'roberto.mendoza@inversiones.hn',
    amount: 2000000,
    currency: 'USD',
    type: 'Comisión de Venta',
    paymentMethod: 'Transferencia Bancaria',
    date: '2024-10-15',
    status: 'Completado',
    referenceCode: 'ACH-VTA-DIR-99214'
  },
  {
    id: 'pay-plazos-001',
    receiptNumber: 'REC-2024-9002',
    propertyId: 'prop-3',
    propertyTitle: 'Villa Campestre Los Pinos (Lote y Residencia)',
    contractId: 'ctr-plazos-002',
    payerName: 'Lic. Fernando Barahona',
    payerEmail: 'fernando.barahona@consultores.hn',
    amount: 3267,
    currency: 'USD',
    type: 'Comisión de Venta',
    paymentMethod: 'Transferencia Bancaria',
    date: '2024-10-22',
    status: 'En Proceso',
    monthCovered: 'Cuota #1 Financiamiento',
    referenceCode: 'ACH-PLZ-10482'
  },
  {
    id: 'pay-001',
    receiptNumber: 'REC-2024-1001',
    propertyId: 'prop-1',
    propertyTitle: 'Casa Prince',
    contractId: 'ctr-001',
    payerName: 'Emis Alejandra Torres',
    payerEmail: 'andinoemis@gmail.com',
    amount: 1250,
    currency: 'USD',
    type: 'Pago Renta',
    paymentMethod: 'Tarjeta de Crédito',
    date: '2024-10-02',
    status: 'Completado',
    monthCovered: 'Octubre 2024',
    referenceCode: 'TXN-77491-BAC'
  },
  {
    id: 'pay-002',
    receiptNumber: 'REC-2024-0901',
    propertyId: 'prop-1',
    propertyTitle: 'Casa Prince',
    contractId: 'ctr-001',
    payerName: 'Emis Alejandra Torres',
    payerEmail: 'andinoemis@gmail.com',
    amount: 1250,
    currency: 'USD',
    type: 'Pago Renta',
    paymentMethod: 'Transferencia Bancaria',
    date: '2024-09-03',
    status: 'Completado',
    monthCovered: 'Septiembre 2024',
    referenceCode: 'TXN-66120-FICOHSA'
  },
  {
    id: 'pay-003',
    receiptNumber: 'REC-2024-0801',
    propertyId: 'prop-1',
    propertyTitle: 'Casa Prince',
    contractId: 'ctr-001',
    payerName: 'Emis Alejandra Torres',
    payerEmail: 'andinoemis@gmail.com',
    amount: 1250,
    currency: 'USD',
    type: 'Pago Renta',
    paymentMethod: 'Tarjeta de Débito',
    date: '2024-08-01',
    status: 'Completado',
    monthCovered: 'Agosto 2024',
    referenceCode: 'TXN-55902-ATLANTIDA'
  }
];

export const INITIAL_MAINTENANCE: MaintenanceRequest[] = [
  {
    id: 'mnt-001',
    ticketNumber: 'MNT-2024-042',
    propertyId: 'prop-1',
    propertyTitle: 'Casa Prince',
    propertyAddress: 'Residencial Las Hadas, Tegucigalpa',
    requestedBy: 'Emis Alejandra Torres',
    requesterRole: 'tenant',
    date: '2024-10-10',
    type: 'Correctivo',
    priority: 'Media',
    description: 'Goteo en la llave de paso del baño principal en el segundo nivel. Requiere cambio de empaque o grifería.',
    status: 'En Proceso',
    contractorName: 'Carlos Murillo (Servicios Pro)',
    contractorPhone: '+504 9511-2233',
    estimatedCost: 45,
    actualCost: 0,
    resolutionNotes: 'Contratista asignado para visita el día jueves 10:00 AM.'
  },
  {
    id: 'mnt-002',
    ticketNumber: 'MNT-2024-039',
    propertyId: 'prop-1',
    propertyTitle: 'Casa Prince',
    propertyAddress: 'Residencial Las Hadas, Tegucigalpa',
    requestedBy: 'Keidy Melina Reyes',
    requesterRole: 'owner',
    date: '2024-09-18',
    type: 'Preventivo',
    priority: 'Baja',
    description: 'Mantenimiento semestral del motor del portón eléctrico y limpieza de canaletas pluviales.',
    status: 'Reparado',
    contractorName: 'Carlos Murillo (Servicios Pro)',
    contractorPhone: '+504 9511-2233',
    estimatedCost: 80,
    actualCost: 75,
    completedDate: '2024-09-20',
    resolutionNotes: 'Lubricación completada y canaletas despejadas satisfactoriamente.'
  }
];

export const INITIAL_VISITS: PropertyVisit[] = [
  {
    id: 'vis-001',
    propertyId: 'prop-2',
    propertyTitle: 'Apartamento de Lujo en Torre Sky Penthouse',
    visitorName: 'Dr. Roberto Mendoza',
    visitorEmail: 'roberto.mendoza@clinica.hn',
    visitorPhone: '+504 9988-7766',
    date: '2024-10-15',
    time: '15:30',
    type: 'Presencial',
    status: 'Confirmada',
    agentName: 'Anthony Rafael Alfaro',
    notes: 'Interesado en alquiler corporativo por 2 años.'
  },
  {
    id: 'vis-002',
    propertyId: 'prop-3',
    propertyTitle: 'Villa Campestre Los Pinos',
    visitorName: 'Lic. Claudia Meza',
    visitorEmail: 'cmeza@inversiones.com',
    visitorPhone: '+504 9444-3322',
    date: '2024-10-18',
    time: '11:00',
    type: 'Presencial',
    status: 'Pendiente',
    agentName: 'Anthony Rafael Alfaro',
    notes: 'Solicita recorrido por el terreno y verificación de escrituras.'
  }
];

export const INITIAL_LOGS: SystemLog[] = [
  {
    id: 'log-001',
    timestamp: '2024-10-12 19:45:10',
    userId: 'usr-1',
    userName: 'Kenneth Adonay Zúniga',
    role: 'Administrador',
    action: 'Auditoría y conciliación financiera',
    module: 'Pagos',
    details: 'Verificación de estados de cuenta y pagos recibidos mes en curso.'
  },
  {
    id: 'log-002',
    timestamp: '2024-10-10 14:22:05',
    userId: 'usr-4',
    userName: 'Emis Alejandra Torres',
    role: 'Inquilino',
    action: 'Creación de solicitud de mantenimiento',
    module: 'Mantenimiento',
    details: 'Ticket MNT-2024-042 registrado para Casa Prince.'
  },
  {
    id: 'log-003',
    timestamp: '2024-10-02 09:15:33',
    userId: 'usr-4',
    userName: 'Emis Alejandra Torres',
    role: 'Inquilino',
    action: 'Pago de Renta Mensual',
    module: 'Pagos',
    details: 'Pago exitoso de $1,250.00 USD mediante pasarela de pago.'
  },
  {
    id: 'log-004',
    timestamp: '2024-09-28 11:05:40',
    userId: 'usr-2',
    userName: 'Anthony Rafael Alfaro',
    role: 'Agente Inmobiliario',
    action: 'Actualización de Inventario',
    module: 'Propiedades',
    details: 'Fotos y descripción enriquecida para Casa Prince y Torre Sky.'
  }
];

export const INITIAL_LEADS: ClientLead[] = [
  {
    id: 'lead-1',
    name: 'Dr. Roberto Mendoza',
    email: 'roberto.mendoza@clinica.hn',
    phone: '+504 9988-7766',
    interestType: 'Alquiler',
    budgetMax: 1500,
    preferredZone: 'Lomas del Guijarro / Las Lomas',
    status: 'Visita Agendada',
    assignedAgent: 'Anthony Rafael Alfaro',
    createdAt: '2024-10-08',
    notes: 'Busca apartamento amplio cerca de centros hospitalarios.'
  },
  {
    id: 'lead-2',
    name: 'Ing. Gabriel Solís',
    email: 'g.solis@constructora.hn',
    phone: '+504 9765-1234',
    interestType: 'Compra',
    budgetMax: 260000,
    preferredZone: 'Valle de Ángeles / Santa Lucía',
    status: 'En Negociación',
    assignedAgent: 'Anthony Rafael Alfaro',
    createdAt: '2024-10-01',
    notes: 'Interesado en Villa Campestre Los Pinos como segunda vivienda.'
  }
];

export const INITIAL_CALENDAR_EVENTS: CalendarEvent[] = [
  {
    id: 'evt-1',
    title: 'Visita Guiada Presencial - Torre Sky',
    date: '2024-10-15',
    time: '15:30',
    type: 'Visita',
    priority: 'Alta',
    status: 'Pendiente',
    assignedTo: 'Anthony Rafael Alfaro',
    propertyTitle: 'Apartamento de Lujo en Torre Sky Penthouse',
    clientName: 'Dr. Roberto Mendoza',
    notes: 'Revisar área social y estacionamientos asignados con el cliente.'
  },
  {
    id: 'evt-2',
    title: 'Cobro y Conciliación Renta Octubre - Casa Prince',
    date: '2024-10-16',
    time: '09:00',
    type: 'Cobro',
    priority: 'Media',
    status: 'Completado',
    assignedTo: 'Kenneth Adonay Zúniga',
    propertyTitle: 'Casa Prince',
    clientName: 'Emis Alejandra Torres',
    notes: 'Comprobante REC-2024-1001 validado y conciliado en banco.'
  },
  {
    id: 'evt-3',
    title: 'Inspección Reparación de Grifería - Casa Prince',
    date: '2024-10-17',
    time: '10:00',
    type: 'Mantenimiento',
    priority: 'Media',
    status: 'Pendiente',
    assignedTo: 'Kenneth Adonay Zúniga',
    propertyTitle: 'Casa Prince',
    clientName: 'Carlos Murillo (Contratista)',
    notes: 'Verificar cambio de empaque en baño del segundo piso.'
  },
  {
    id: 'evt-4',
    title: 'Visita a Terreno El Hatillo',
    date: '2024-10-18',
    time: '11:00',
    type: 'Visita',
    priority: 'Alta',
    status: 'Pendiente',
    assignedTo: 'Anthony Rafael Alfaro',
    propertyTitle: 'Terreno Panorámico El Hatillo',
    clientName: 'Lic. Claudia Meza',
    notes: 'Llevar copia de plano topográfico y escrituras.'
  },
  {
    id: 'evt-5',
    title: 'Cierre y Firma Digital Contrato Arrendamiento',
    date: '2024-10-20',
    time: '14:00',
    type: 'Firma Contrato',
    priority: 'Alta',
    status: 'Pendiente',
    assignedTo: 'Anthony Rafael Alfaro',
    propertyTitle: 'Villa Campestre Los Pinos',
    clientName: 'Ing. Gabriel Solís',
    notes: 'Generar borrador de contrato con depósito de 1 mes.'
  }
];

export const INITIAL_MESSAGES: MessageThread[] = [
  {
    id: 'th-1',
    contactName: 'Emis Alejandra Torres',
    contactEmail: 'andinoemis@gmail.com',
    contactRole: 'tenant',
    propertyTitle: 'Casa Prince',
    lastMessage: 'Hola, ¿a qué hora llegará el fontanero mañana para revisar el baño?',
    updatedAt: 'Hoy, 10:45 AM',
    unread: true,
    messages: [
      {
        id: 'm-1',
        sender: 'user',
        senderName: 'Emis Alejandra Torres',
        text: 'Buen día, ya registré el reporte de mantenimiento MNT-2024-042 para la grifería.',
        timestamp: 'Ayer, 3:15 PM'
      },
      {
        id: 'm-2',
        sender: 'agent',
        senderName: 'Anthony Rafael Alfaro',
        text: '¡Hola Emis! Sí, ya asignamos al contratista Carlos Murillo.',
        timestamp: 'Ayer, 4:00 PM'
      },
      {
        id: 'm-3',
        sender: 'user',
        senderName: 'Emis Alejandra Torres',
        text: 'Hola, ¿a qué hora llegará el fontanero mañana para revisar el baño?',
        timestamp: 'Hoy, 10:45 AM'
      }
    ]
  },
  {
    id: 'th-2',
    contactName: 'Dr. Roberto Mendoza',
    contactEmail: 'roberto.mendoza@clinica.hn',
    contactRole: 'tenant',
    propertyTitle: 'Torre Sky Penthouse',
    lastMessage: 'Perfecto, nos vemos a las 3:30 PM en el lobby principal.',
    updatedAt: 'Hoy, 09:12 AM',
    unread: false,
    messages: [
      {
        id: 'm-4',
        sender: 'user',
        senderName: 'Dr. Roberto Mendoza',
        text: 'Hola, me interesa conocer si el apartamento en Torre Sky incluye dos parqueos techados.',
        timestamp: 'Ayer, 11:20 AM'
      },
      {
        id: 'm-5',
        sender: 'agent',
        senderName: 'Anthony Rafael Alfaro',
        text: 'Estimado Dr. Mendoza, correcto, incluye dos estacionamientos en sótano 1 y bodega privada.',
        timestamp: 'Ayer, 11:45 AM'
      },
      {
        id: 'm-6',
        sender: 'user',
        senderName: 'Dr. Roberto Mendoza',
        text: 'Perfecto, nos vemos a las 3:30 PM en el lobby principal.',
        timestamp: 'Hoy, 09:12 AM'
      }
    ]
  },
  {
    id: 'th-3',
    contactName: 'Keidy Melina Reyes',
    contactEmail: 'keidy.reyes@unah.hn',
    contactRole: 'owner',
    propertyTitle: 'Portafolio Residencial',
    lastMessage: 'Kenneth, por favor envíame el reporte consolidado de rentabilidad para revisarlo hoy.',
    updatedAt: 'Ayer, 6:30 PM',
    unread: true,
    messages: [
      {
        id: 'm-7',
        sender: 'user',
        senderName: 'Keidy Melina Reyes',
        text: 'Kenneth, por favor envíame el reporte consolidado de rentabilidad para revisarlo hoy.',
        timestamp: 'Ayer, 6:30 PM'
      }
    ]
  }
];

export const INITIAL_PERMISSIONS: RolePermissions[] = [
  {
    role: 'admin',
    canManageProperties: true,
    canDeleteProperties: true,
    canGenerateContracts: true,
    canProcessPayments: true,
    canDispatchMaintenance: true,
    canManageUsers: true,
    canChangeUserStatus: true,
    canViewAuditLogs: true,
    canConfigurePolicies: true
  },
  {
    role: 'agent',
    canManageProperties: true,
    canDeleteProperties: false,
    canGenerateContracts: true,
    canProcessPayments: false,
    canDispatchMaintenance: false,
    canManageUsers: false,
    canChangeUserStatus: false,
    canViewAuditLogs: false,
    canConfigurePolicies: false
  },
  {
    role: 'owner',
    canManageProperties: true,
    canDeleteProperties: false,
    canGenerateContracts: false,
    canProcessPayments: false,
    canDispatchMaintenance: true,
    canManageUsers: false,
    canChangeUserStatus: false,
    canViewAuditLogs: false,
    canConfigurePolicies: false
  },
  {
    role: 'tenant',
    canManageProperties: false,
    canDeleteProperties: false,
    canGenerateContracts: false,
    canProcessPayments: true,
    canDispatchMaintenance: true,
    canManageUsers: false,
    canChangeUserStatus: false,
    canViewAuditLogs: false,
    canConfigurePolicies: false
  },
  {
    role: 'contractor',
    canManageProperties: false,
    canDeleteProperties: false,
    canGenerateContracts: false,
    canProcessPayments: false,
    canDispatchMaintenance: true,
    canManageUsers: false,
    canChangeUserStatus: false,
    canViewAuditLogs: false,
    canConfigurePolicies: false
  },
  {
    role: 'guest',
    canManageProperties: false,
    canDeleteProperties: false,
    canGenerateContracts: false,
    canProcessPayments: false,
    canDispatchMaintenance: false,
    canManageUsers: false,
    canChangeUserStatus: false,
    canViewAuditLogs: false,
    canConfigurePolicies: false
  },
  {
    role: 'technician',
    canManageProperties: false,
    canDeleteProperties: false,
    canGenerateContracts: false,
    canProcessPayments: false,
    canDispatchMaintenance: true,
    canManageUsers: false,
    canChangeUserStatus: false,
    canViewAuditLogs: true,
    canConfigurePolicies: true
  }
];
 
export const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif-1',
    title: 'Nueva Solicitud de Cita de Visita',
    message: 'El cliente Carlos Flores solicitó visitar "Casa Prince" (CAS-001) para el 28 de Octubre a las 10:00 AM.',
    timestamp: 'Hace 15 min',
    type: 'appointment',
    read: false,
    targetRole: 'staff',
    targetTab: 'calendar',
    linkText: 'Ver en Calendario'
  },
  {
    id: 'notif-2',
    title: 'Nueva Solicitud de Mantenimiento',
    message: 'Ticket #MNT-2024-819 reportado por inquilino: Revisión de bomba de agua y filtración en baño máster.',
    timestamp: 'Hace 45 min',
    type: 'maintenance',
    read: false,
    targetRole: 'staff',
    targetTab: 'admin_dashboard',
    linkText: 'Gestionar Mantenimiento'
  },
  {
    id: 'notif-3',
    title: 'Nueva Solicitud de Inmueble (Prospecto CRM)',
    message: 'La Dra. Sofía Mendoza busca apartamento en renta en Lomas del Guijarro con presupuesto de $1,200/mes.',
    timestamp: 'Hace 2 horas',
    type: 'lead',
    read: false,
    targetRole: 'agent',
    targetTab: 'agent_crm',
    linkText: 'Ver Prospecto en CRM'
  },
  {
    id: 'notif-4',
    title: 'Nuevo Contrato de Arrendamiento Emitido',
    message: 'Contrato #CTR-2024-042 generado con éxito para Villa Montecarlo. Cuenta receptora oficial verificada.',
    timestamp: 'Hoy, 09:15 AM',
    type: 'contract',
    read: true,
    targetRole: 'admin',
    targetTab: 'admin_dashboard',
    linkText: 'Revisar Contrato'
  },
  {
    id: 'notif-tenant-emis',
    title: 'Recordatorio de Renta - Casa Prince',
    message: 'Tu canon mensual correspondiente a Casa Prince está vigente. Puedes efectuar tu pago en línea de forma segura.',
    timestamp: 'Ayer, 10:00 AM',
    type: 'payment',
    read: false,
    targetRole: 'tenant',
    targetEmail: 'andinoemis@gmail.com',
    targetTab: 'tenant_portal',
    linkText: 'Pagar Renta'
  }
];

export const INITIAL_SIMULATED_EMAILS: SimulatedEmail[] = [
  {
    id: 'eml-1',
    to: 'andinoemis@gmail.com',
    recipientName: 'Emis Alejandra Torres',
    subject: '¡Bienvenido a Terranova Inversiones! - Cuenta Confirmada',
    body: 'Estimada Emis Alejandra Torres,\n\nLe damos la más cordial bienvenida al sistema web de Terranova Gestión Inmobiliaria S. de R.L. Su cuenta de inquilino ha sido configurada con éxito con el identificador CTA-INQ-305.\n\nDesde su portal personal puede consultar su contrato activo, dar seguimiento a citas, descargar recibos oficiales y reportar solicitudes de mantenimiento.',
    sentAt: 'Hoy, 08:30 AM',
    type: 'welcome'
  },
  {
    id: 'eml-2',
    to: 'andinoemis@gmail.com',
    recipientName: 'Emis Alejandra Torres',
    subject: 'Recuperación de Contraseña - Código de Seguridad Terranova',
    body: 'Estimado usuario,\n\nHemos recibido una solicitud para restablecer la contraseña asociada a su cuenta en Terranova Inversiones.\n\nSu código de verificación temporal es: TN-948210\n\nPuede utilizar este código en la ventana de recuperación o hacer clic en "Restablecer Contraseña Directamente" para definir una nueva clave de acceso.',
    sentAt: 'Ayer, 04:15 PM',
    type: 'password_reset',
    resetCode: 'TN-948210'
  }
];

export const INITIAL_EMPLOYEES: Employee[] = [
  {
    id: 'emp-1',
    code: 'EMP-001',
    name: 'Anthony Rafael Alfaro',
    email: 'anthony.alfaro@unah.hn',
    phone: '+504-9912-3456',
    nationalId: '0801199323456',
    position: 'Agente Inmobiliario Senior',
    baseSalary: 1200,
    bankName: 'Banco Atlántida',
    bankAccountNumber: '1100-2345-6789',
    status: 'Activo',
    startDate: '2023-01-15',
    defaultCommissionPercent: 2
  },
  {
    id: 'emp-2',
    code: 'EMP-002',
    name: 'Carlos Murillo',
    email: 'carlos.murillo@serviciospro.hn',
    phone: '+504-9876-1234',
    nationalId: '0801198801234',
    position: 'Contratista de Obras',
    baseSalary: 950,
    bankName: 'Banco Ficohsa',
    bankAccountNumber: '2000-8877-6655',
    status: 'Activo',
    startDate: '2023-05-10',
    defaultCommissionPercent: 0
  },
  {
    id: 'emp-3',
    code: 'EMP-003',
    name: 'Lic. Sofía Castellanos',
    email: 'sofia.castellanos@terranova.hn',
    phone: '+504-9555-8899',
    nationalId: '0801199512398',
    position: 'Coordinador Legal',
    baseSalary: 1400,
    bankName: 'BAC Credomatic',
    bankAccountNumber: '7421-9988-1122',
    status: 'Activo',
    startDate: '2023-03-01',
    defaultCommissionPercent: 1
  }
];

export const INITIAL_PAYROLL_RECORDS: PayrollRecord[] = [
  {
    id: 'nom-2024-001',
    payrollNumber: 'NOM-2024-001',
    employeeId: 'emp-1',
    employeeName: 'Anthony Rafael Alfaro',
    position: 'Agente Inmobiliario Senior',
    periodMonth: 'Octubre 2024',
    periodYear: 2024,
    baseSalary: 1200,
    contractCommissions: [
      {
        contractId: 'ctr-hatillo-sale',
        contractNumber: 'VTA-2024-001',
        propertyTitle: 'Terreno Panorámico Residencial El Hatillo (Lote Maestro)',
        saleAmount: 2000000,
        totalCommissionPercent: 20, // 20% acordado con Keydi Reyes ($400,000 USD)
        agentCommissionPercent: 2, // 2% para el agente ($40,000 USD)
        terranovaCommissionPercent: 18, // 18% para Terranova ($360,000 USD)
        agentCommissionEarned: 40000,
        terranovaEarned: 360000,
        date: '2024-10-15'
      }
    ],
    totalCommissions: 40000,
    bonuses: 0,
    deductions: 0,
    netPayable: 41200,
    currency: 'USD',
    status: 'Pagado',
    paymentDate: '2024-10-20',
    paymentMethod: 'Transferencia ACH Interbancaria',
    disbursedBankAccount: '2000-1122-3344-99 (Banco Ficohsa)',
    referenceCode: 'PAY-NOM-88492-ATL',
    notes: 'Liquidación de Salario Base ($1,200) + Comisión de Éxito por Venta del Terreno de El Hatillo por $2,000,000 (2% equivalente a $40,000 de la comisión del 20% pactada con Keydi Reyes). Acreditado en cuenta Banco Atlántida 1100-2345-6789.'
  }
];

export const INITIAL_CONTRACT_TEMPLATES: ContractTemplate[] = [
  {
    id: 'tmpl-arrendamiento',
    name: 'Estándar Oficial de Arrendamiento Residencial Terranova (Word/PDF)',
    type: 'Arrendamiento',
    fileName: 'Estandar_Arrendamiento_Terranova_2024.docx',
    fileFormat: 'docx',
    fileUrl: 'https://terranova-docs.storage.hn/templates/Estandar_Arrendamiento_Terranova_2024.docx',
    uploadedAt: '2024-01-10',
    uploadedBy: 'Kenneth Adonay Zúniga (Admin)',
    description: 'Estándar corporativo obligatorio para alquileres habitacionales: cláusulas de mora a 5 días, depósito en garantía en custodia y obligaciones de mantenimiento.',
    isDefault: true,
    clauses: [
      'PRIMERA: OBJETO Y DESTINO. El inmueble se entrega exclusivamente para vivienda habitacional familiar respetando el orden vecinal.',
      'SEGUNDA: CANON DE ARRENDAMIENTO Y PLAZO. El inquilino pagará la mensualidad pactada dentro de los primeros 5 días hábiles en la cuenta circulada.',
      'TERCERA: DEPÓSITO EN GARANTÍA. Resguarda eventuales daños estructurales y será reintegrado al desocupar previa inspección.',
      'CUARTA: PROHIBICIONES Y CUIDADO. Se prohíbe el subarriendo total o parcial del inmueble sin autorización legal expresa de Terranova.'
    ]
  },
  {
    id: 'tmpl-venta-directa',
    name: 'Estándar Oficial de Compraventa Inmobiliaria y Traspaso de Dominio a Un Solo Dueño (Word/PDF)',
    type: 'Venta',
    fileName: 'Estandar_Compraventa_Traspaso_Unico_Dueno.pdf',
    fileFormat: 'pdf',
    fileUrl: 'https://terranova-docs.storage.hn/templates/Estandar_Compraventa_Traspaso_Unico_Dueno.pdf',
    uploadedAt: '2024-02-15',
    uploadedBy: 'Kenneth Adonay Zúniga (Admin)',
    description: 'Estándar de compraventa directa al contado. Concluido el pago total, el dominio de la propiedad se transfiere registralmente a un solo dueño adquirente.',
    isDefault: true,
    clauses: [
      'PRIMERA: OBJETO Y TRASPASO DE DOMINIO A UN SOLO DUEÑO. La parte vendedora transfiere en venta real y definitiva la propiedad del inmueble al comprador único adquirente, libre de todo gravamen o litigio pendiente.',
      'SEGUNDA: PRECIO DE VENTA Y PAGO ÍNTEGRO. El valor total de la transacción convenido se liquida al 100% al contado a entera satisfacción de las partes.',
      'TERCERA: ESCRITURACIÓN Y NUEVA TITULARIDAD. Al liquidarse la compra, la propiedad pasa registralmente al nuevo único propietario individual.',
      'CUARTA: SANEAMIENTO DE LEY. La parte vendedora se obliga al saneamiento por evicción en los términos prescritos por la legislación civil.'
    ]
  },
  {
    id: 'tmpl-venta-plazos',
    name: 'Estándar Oficial de Promesa de Compraventa con Financiamiento a Plazos (Word/PDF)',
    type: 'Venta a Plazos',
    fileName: 'Estandar_Promesa_Compraventa_Financiamiento_Plazos.docx',
    fileFormat: 'docx',
    fileUrl: 'https://terranova-docs.storage.hn/templates/Estandar_Promesa_Compraventa_Financiamiento_Plazos.docx',
    uploadedAt: '2024-03-01',
    uploadedBy: 'Kenneth Adonay Zúniga (Admin)',
    description: 'Estándar para compras con financiamiento directo: abono de prima inicial, tabla de amortización por cuotas mensuales y tradición de dominio al saldar la última cuota.',
    isDefault: true,
    clauses: [
      'PRIMERA: PROMESA DE COMPRAVENTA A PLAZOS. La parte vendedora promete transferir el dominio y el adquirente promete comprar bajo amortización programada.',
      'SEGUNDA: PRIMA INICIAL Y CALENDARIO DE CUOTAS. El adquirente abona la prima inicial convenida y se compromete a cancelar mensualmente sus cuotas sucesivas.',
      'TERCERA: ENTREGA DE ESCRITURA Y TITULARIDAD A UN SOLO DUEÑO. El traspaso del dominio pleno operará ante notario una vez cancelada la totalidad de las cuotas.',
      'CUARTA: CLÁUSULA RESOLUTORIA POR MORA. El incumplimiento reiterado de 3 cuotas mensuales consecutivas facultará la rescisión contractual conforme a la ley.'
    ]
  }
];

export const INITIAL_MAINTENANCE_INVENTORY: MaintenanceInventoryItem[] = [
  {
    id: 'inv-001',
    itemCode: 'INS-PLM-01',
    name: 'Válvula de Paso Esférica 1/2" Bronce C-40',
    category: 'Plomería',
    stock: 18,
    minStock: 5,
    unit: 'Unidades',
    unitCostUSD: 6.50,
    location: 'Bodega Principal - Estante P1',
    lastRestocked: '2024-10-01',
    notes: 'Para reparaciones de tuberías principales y acometidas de agua'
  },
  {
    id: 'inv-002',
    itemCode: 'INS-PLM-02',
    name: 'Empaques de Silicón para Grifería y Llaves de Paso',
    category: 'Plomería',
    stock: 45,
    minStock: 15,
    unit: 'Piezas',
    unitCostUSD: 0.85,
    location: 'Bodega Principal - Gaveta P3',
    lastRestocked: '2024-10-05',
    notes: 'Uso en corrección de fugas en grifos y sanitarios'
  },
  {
    id: 'inv-003',
    itemCode: 'INS-ELE-01',
    name: 'Disyuntor Termomagnético 20A 1 Polo Square D',
    category: 'Electricidad',
    stock: 12,
    minStock: 4,
    unit: 'Unidades',
    unitCostUSD: 12.00,
    location: 'Bodega Eléctrica - Estante E2',
    lastRestocked: '2024-09-20',
    notes: 'Protección para circuitos residenciales de iluminación y tomas'
  },
  {
    id: 'inv-004',
    itemCode: 'INS-ELE-02',
    name: 'Rollo Cable Eléctrico THHN Calibre 12 AWG (100m)',
    category: 'Electricidad',
    stock: 8,
    minStock: 3,
    unit: 'Cajas',
    unitCostUSD: 48.00,
    location: 'Bodega Eléctrica - Rack Inferior',
    lastRestocked: '2024-09-15',
    notes: 'Reemplazo de líneas eléctricas averiadas o recargadas'
  },
  {
    id: 'inv-005',
    itemCode: 'INS-CER-01',
    name: 'Cerradura Tubular de Pomo para Dormitorio Acero Inoxidable',
    category: 'Cerrajería',
    stock: 9,
    minStock: 4,
    unit: 'Unidades',
    unitCostUSD: 18.50,
    location: 'Bodega Cerrajería - Estante C1',
    lastRestocked: '2024-09-28',
    notes: 'Incluye 3 llaves y pestillo de recambio rápido'
  },
  {
    id: 'inv-006',
    itemCode: 'INS-CER-02',
    name: 'Cilindro de Seguridad Europerfil Doble Embrague 70mm',
    category: 'Cerrajería',
    stock: 3,
    minStock: 5,
    unit: 'Unidades',
    unitCostUSD: 24.00,
    location: 'Bodega Cerrajería - Gaveta C2',
    lastRestocked: '2024-08-30',
    notes: '¡Alerta de stock bajo! Solicitud de reabastecimiento en curso'
  },
  {
    id: 'inv-007',
    itemCode: 'INS-CLI-01',
    name: 'Filtro Antipolvo y Antibacterial para Split A/C 12000 BTU',
    category: 'Climatización',
    stock: 7,
    minStock: 4,
    unit: 'Unidades',
    unitCostUSD: 15.00,
    location: 'Bodega Clima - Estante A1',
    lastRestocked: '2024-09-12',
    notes: 'Mantenimiento preventivo semestral de unidades residenciales'
  },
  {
    id: 'inv-008',
    itemCode: 'INS-PNT-01',
    name: 'Galón de Pintura Látex Blanco Colonial Antihongos',
    category: 'Pintura',
    stock: 14,
    minStock: 5,
    unit: 'Galones',
    unitCostUSD: 22.00,
    location: 'Bodega Pintura - Plataforma 1',
    lastRestocked: '2024-10-08',
    notes: 'Para resanes de muros interiores tras reparaciones'
  },
  {
    id: 'inv-009',
    itemCode: 'INS-GEN-01',
    name: 'Tubo de Silicón Sellador Estructural Transparente 300ml',
    category: 'General',
    stock: 2,
    minStock: 6,
    unit: 'Unidades',
    unitCostUSD: 4.75,
    location: 'Bodega General - Estante G1',
    lastRestocked: '2024-08-25',
    notes: '¡Alerta crítica de stock! Sellado de ventanas y bañeras'
  },
  {
    id: 'inv-010',
    itemCode: 'INS-GEN-02',
    name: 'Cinta Teflón Industrial para Plomería 3/4" x 10m',
    category: 'General',
    stock: 32,
    minStock: 10,
    unit: 'Unidades',
    unitCostUSD: 1.20,
    location: 'Bodega General - Gaveta G2',
    lastRestocked: '2024-10-10',
    notes: 'Insumo de consumo recurrente en fontanería'
  }
];

export const INITIAL_INVENTORY_MOVEMENTS: InventoryMovement[] = [
  {
    id: 'mov-001',
    itemId: 'inv-001',
    itemCode: 'INS-PLM-01',
    itemName: 'Válvula de Paso Esférica 1/2" Bronce C-40',
    type: 'Entrada',
    quantity: 20,
    date: '2024-10-01 09:30',
    performedBy: 'Ing. David Orellana (Técnico)',
    reason: 'Recepción de pedido mayorista Ferretería El Sol'
  },
  {
    id: 'mov-002',
    itemId: 'inv-002',
    itemCode: 'INS-PLM-02',
    itemName: 'Empaques de Silicón para Grifería y Llaves de Paso',
    type: 'Salida',
    quantity: 2,
    date: '2024-10-10 14:15',
    ticketId: 'mnt-001',
    ticketNumber: 'MNT-2024-042',
    performedBy: 'Ing. David Orellana (Técnico)',
    reason: 'Reparación de goteo en baño principal Casa Prince'
  }
];

