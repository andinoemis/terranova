import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  Search, 
  BookOpen, 
  ShieldCheck, 
  Briefcase, 
  KeyRound, 
  Building2, 
  Printer, 
  FileText, 
  CheckCircle2, 
  Sparkles, 
  DollarSign, 
  UploadCloud, 
  Lock, 
  HelpCircle,
  Database,
  ArrowRight,
  User,
  Wrench,
  Compass,
  AlertTriangle,
  FileCheck2,
  Calendar,
  MessageSquare,
  Coins
} from 'lucide-react';
import { UserRole } from '../../types';

interface UserManualModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartTour?: () => void;
  onOpenDatabaseExport?: () => void;
}

type ManualSection = 
  | 'client_guest' 
  | 'tenant' 
  | 'agent' 
  | 'admin' 
  | 'owner' 
  | 'technician' 
  | 'contractor' 
  | 'faq';

export const UserManualModal: React.FC<UserManualModalProps> = ({
  isOpen,
  onClose,
  onStartTour,
  onOpenDatabaseExport
}) => {
  const { currentUser, companySettings, isAuthenticated } = useApp();
  
  // Determine user's native role
  const userRole: UserRole = !isAuthenticated ? 'guest' : currentUser.role;

  // Map user role to default manual section
  const getInitialSection = (role: UserRole): ManualSection => {
    switch (role) {
      case 'guest':
      case 'client':
        return 'client_guest';
      case 'tenant':
        return 'tenant';
      case 'agent':
        return 'agent';
      case 'owner':
        return 'owner';
      case 'technician':
        return 'technician';
      case 'contractor':
        return 'contractor';
      case 'admin':
        return 'admin';
      default:
        return 'client_guest';
    }
  };

  const [activeTab, setActiveTab] = useState<ManualSection>(() => getInitialSection(userRole));
  const [searchTerm, setSearchTerm] = useState('');

  // Synchronize initial section when modal opens or user switches
  React.useEffect(() => {
    if (isOpen) {
      setActiveTab(getInitialSection(userRole));
      setSearchTerm('');
    }
  }, [isOpen, userRole]);

  if (!isOpen) return null;

  const handlePrintManual = () => {
    window.print();
  };

  // RBAC Access Control: Which manual sections is this user permitted to see?
  // Visitors, Clients, Agents, Tenants, Owners, Contractors, Technicians can ONLY see their own role guide + FAQ.
  // Only the Administrator has supervisor privilege to consult guides of all roles to assist users.
  const isAdmin = userRole === 'admin';

  const roleLabels: Record<ManualSection, { label: string; icon: React.ComponentType<{ className?: string }>; description: string }> = {
    client_guest: { 
      label: 'Visitante / Cliente', 
      icon: Compass, 
      description: 'Búsqueda de inmuebles, comparador, cambio de moneda, agendamiento de visitas y registro.' 
    },
    tenant: { 
      label: 'Inquilino / Arrendatario', 
      icon: KeyRound, 
      description: 'Portal de inquilino, firma digital, pagos con comprobante, reportes de mantenimiento.' 
    },
    agent: { 
      label: 'Asesor Inmobiliario (Agente)', 
      icon: Briefcase, 
      description: 'Emisión de contratos (plazos/directa), carga única de documentos.pdf, comisiones y citas.' 
    },
    owner: { 
      label: 'Propietario de Inmuebles', 
      icon: Building2, 
      description: 'Estado de terrenos y propiedades, cobros por venta directa o plazos, confidencialidad del 80%.' 
    },
    technician: { 
      label: 'Técnico de Sistemas / DBA', 
      icon: Database, 
      description: 'Consola SQL exclusiva, exportación de esquemas y montaje de base de datos local.' 
    },
    contractor: { 
      label: 'Contratista de Servicios', 
      icon: Wrench, 
      description: 'Órdenes de mantenimiento, averías asignadas, presupuestos y certificaciones.' 
    },
    admin: { 
      label: 'Administrador General', 
      icon: ShieldCheck, 
      description: 'Control de plantillas Word/PDF, cancelación de contratos, nómina, roles y políticas.' 
    },
    faq: { 
      label: 'Preguntas Frecuentes & FAQ', 
      icon: HelpCircle, 
      description: 'Resolución de dudas frecuentes sobre contratos, pagos, moneda y accesos.' 
    }
  };

  // Calculate available tabs based on current role permissions
  const availableTabs: ManualSection[] = isAdmin
    ? ['admin', 'client_guest', 'tenant', 'agent', 'owner', 'technician', 'contractor', 'faq']
    : [getInitialSection(userRole), 'faq'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white border border-[#CBD8CA] rounded-3xl max-w-4xl w-full shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
        
        {/* Header */}
        <div className="bg-[#2D4539] text-white p-5 sm:p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center border border-white/20">
              <BookOpen className="w-5 h-5 text-[#A3C7AD]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#A3C7AD] block leading-none">
                  Manual de Usuario Oficial
                </span>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-white/20 text-emerald-200 border border-white/10">
                  Acceso por Rol: {roleLabels[getInitialSection(userRole)].label}
                </span>
              </div>
              <h2 className="font-serif-brand text-lg sm:text-xl font-bold block mt-1">
                Guía Operativa del Sistema · {companySettings.companyName}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrintManual}
              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
              title="Imprimir o guardar manual como PDF"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Imprimir</span>
            </button>
            <button 
              onClick={onClose} 
              className="text-white/70 hover:text-white p-1 rounded-xl hover:bg-white/10 transition-colors"
              title="Cerrar manual"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Subheader: Info banner & Role tabs */}
        <div className="p-4 bg-[#FAFBF9] border-b border-gray-200 space-y-3">
          
          {/* Role access notice for non-admin */}
          {!isAdmin && (
            <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950 flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>
                  <strong>Acceso Personalizado:</strong> Estás visualizando exclusivamente las funciones e instrucciones autorizadas para tu perfil (<strong>{roleLabels[getInitialSection(userRole)].label}</strong>).
                </span>
              </div>
            </div>
          )}

          {/* Supervisor notice for admin */}
          {isAdmin && (
            <div className="p-2.5 rounded-xl bg-purple-50 border border-purple-200 text-purple-950 flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-purple-700 shrink-0" />
                <span>
                  <strong>Modo Supervisor (Administrador):</strong> Tienes acceso a tu manual maestro y a consultar los manuales operativos de todos los roles para brindar asistencia a clientes y colaboradores.
                </span>
              </div>
            </div>
          )}

          {/* Quick Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar tema en tu manual (ej. contratos, pagos, visitas, comisiones, documentos.pdf, divisas)..."
              className="w-full pl-10 pr-4 py-2 bg-white border border-[#CAD8C8] rounded-xl text-xs focus:ring-2 focus:ring-[#2D4539] focus:outline-hidden"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs font-semibold"
              >
                ✕ Limpiar
              </button>
            )}
          </div>

          {/* Role Navigation Tabs: Only authorized tabs for this user */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            {availableTabs.map((tabKey) => {
              const TabIcon = roleLabels[tabKey].icon;
              const isActive = activeTab === tabKey;
              return (
                <button
                  key={tabKey}
                  onClick={() => setActiveTab(tabKey)}
                  className={`px-3.5 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-[#2D4539] text-white shadow-xs'
                      : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <TabIcon className="w-3.5 h-3.5" />
                  <span>{roleLabels[tabKey].label}</span>
                  {tabKey === getInitialSection(userRole) && (
                    <span className="text-[9px] bg-emerald-200 text-emerald-900 px-1.5 py-0.2 rounded-full font-bold ml-0.5">
                      Tu Rol
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Manual Content Area */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs text-gray-700 leading-relaxed">
          
          {/* ========================================================= */}
          {/* TAB: VISITANTE / CLIENTE (GUEST / CLIENT) */}
          {/* ========================================================= */}
          {activeTab === 'client_guest' && (
            <div className="space-y-6 animate-in fade-in">
              <div className="border-b border-gray-200 pb-3">
                <span className="text-[10px] font-bold uppercase text-emerald-800 tracking-wider">
                  Guía Oficial · Visitante & Cliente Interesado
                </span>
                <h3 className="font-serif-brand text-xl font-bold text-gray-900 mt-0.5">
                  ¿Cómo Explorar, Comparar y Adquirir Inmuebles en Terranova?
                </h3>
                <p className="text-gray-500 text-[11px] mt-0.5">
                  Conoce paso a paso todas las funciones públicas a tu disposición para encontrar tu próxima propiedad o terreno.
                </p>
              </div>

              {/* Paso 1 */}
              <div className="space-y-2 bg-[#FAFBF9] p-4 rounded-2xl border border-gray-200">
                <h4 className="font-bold text-gray-900 text-sm flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-mono text-xs font-bold">1</span>
                  <span>Catálogo Inmobiliario & Filtros Inteligentes</span>
                </h4>
                <div className="pl-8 space-y-1.5 text-gray-600">
                  <p>
                    • <strong>Tipo de Operación:</strong> En la parte superior del catálogo puedes alternar entre inmuebles en <strong>Alquiler</strong> (renta mensual) o en <strong>Venta Directa</strong>.
                  </p>
                  <p>
                    • <strong>Tipología de Inmuebles:</strong> Filtra por Casa Unifamiliar, Apartamento Residencial, Terreno / Lote, Local Comercial o Villa Campestre.
                  </p>
                  <p>
                    • <strong>Ubicación & Presupuesto:</strong> Filtra por departamento (Francisco Morazán, Cortés, etc.) y establece rangos de precio acordes a tu presupuesto.
                  </p>
                </div>
              </div>

              {/* Paso 2 */}
              <div className="space-y-2 bg-[#FAFBF9] p-4 rounded-2xl border border-gray-200">
                <h4 className="font-bold text-gray-900 text-sm flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-mono text-xs font-bold">2</span>
                  <span>Conversor de Moneda en Tiempo Real (USD / Lempiras HNL)</span>
                </h4>
                <div className="pl-8 space-y-1.5 text-gray-600">
                  <p>
                    • En la barra superior encontrarás el selector de moneda <strong>USD / HNL</strong>.
                  </p>
                  <p>
                    • Al activarlo, todos los precios del catálogo, primas y cuotas se convierten de inmediato a <strong>Lempiras Hondureños (HNL)</strong> utilizando la tasa de cambio oficial provista por el Banco Central de Honduras (BCH).
                  </p>
                </div>
              </div>

              {/* Paso 3 */}
              <div className="space-y-2 bg-[#FAFBF9] p-4 rounded-2xl border border-gray-200">
                <h4 className="font-bold text-gray-900 text-sm flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-mono text-xs font-bold">3</span>
                  <span>Comparador Triple de Propiedades</span>
                </h4>
                <div className="pl-8 space-y-1.5 text-gray-600">
                  <p>
                    • Haz clic en el botón <strong>"Comparar"</strong> en las tarjetas de hasta 3 propiedades que te llamen la atención.
                  </p>
                  <p>
                    • Aparecerá un botón destacado en la cabecera que abre una tabla técnica comparando metrajes, habitaciones, estacionamientos, amenidades y precio por metro cuadrado lado a lado.
                  </p>
                </div>
              </div>

              {/* Paso 4 */}
              <div className="space-y-2 bg-[#FAFBF9] p-4 rounded-2xl border border-gray-200">
                <h4 className="font-bold text-gray-900 text-sm flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-mono text-xs font-bold">4</span>
                  <span>Agendamiento de Visitas Presenciales & Contacto</span>
                </h4>
                <div className="pl-8 space-y-1.5 text-gray-600">
                  <p>
                    • Dentro de la ficha de cualquier propiedad, pulsa el botón <strong>"Agendar Visita"</strong>.
                  </p>
                  <p>
                    • Podrás seleccionar la fecha y franja horaria que mejor te convenga. El sistema asignará automáticamente a un Asesor Inmobiliario certificado de Terranova para recibirte en el inmueble.
                  </p>
                  <p>
                    • Si requieres atención inmediata, cuentas con el enlace directo al <strong>WhatsApp Oficial</strong> y PBX de la empresa en la parte inferior.
                  </p>
                </div>
              </div>

              {/* Paso 5 */}
              <div className="space-y-2 bg-[#FAFBF9] p-4 rounded-2xl border border-gray-200">
                <h4 className="font-bold text-gray-900 text-sm flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-mono text-xs font-bold">5</span>
                  <span>Creación de Cuenta / Inicio de Sesión</span>
                </h4>
                <div className="pl-8 space-y-1.5 text-gray-600">
                  <p>
                    • Para formalizar una oferta, postularte como inquilino o adquirir un terreno a plazos, pulsa <strong>"Iniciar Sesión / Registrarse"</strong> en la cabecera.
                  </p>
                  <p>
                    • Una vez registrado, tu cuenta tendrá acceso a su portal privado donde podrás consultar tus contratos, comprobantes y realizar firmas digitales.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB: INQUILINO (TENANT) */}
          {/* ========================================================= */}
          {activeTab === 'tenant' && (
            <div className="space-y-6 animate-in fade-in">
              <div className="border-b border-gray-200 pb-3">
                <span className="text-[10px] font-bold uppercase text-emerald-800 tracking-wider">
                  Guía Oficial · Inquilino & Arrendatario
                </span>
                <h3 className="font-serif-brand text-xl font-bold text-gray-900 mt-0.5">
                  Portal del Inquilino: Contratos, Firma Digital y Pagos
                </h3>
                <p className="text-gray-500 text-[11px] mt-0.5">
                  Todo lo que puedes hacer para gestionar tu residencia, cancelar cuotas y solicitar asistencia.
                </p>
              </div>

              {/* Regla de negocio */}
              <div className="p-3 bg-blue-50 rounded-xl border border-blue-200 text-blue-900 text-[11px] space-y-1">
                <p className="font-bold flex items-center gap-1.5 text-blue-950">
                  <CheckCircle2 className="w-4 h-4 text-blue-700 shrink-0" />
                  Regla de Integridad Inmobiliaria:
                </p>
                <p>
                  Un inquilino <strong>puede tener más de un inmueble arrendado</strong> (con contratos independientes simultáneos). Sin embargo, <strong>un inmueble nunca puede tener dos inquilinos concurrentes</strong> si todavía tiene un contrato vigente.
                </p>
              </div>

              {/* Sección 1 */}
              <div className="space-y-2 bg-[#FAFBF9] p-4 rounded-2xl border border-gray-200">
                <h4 className="font-bold text-gray-900 text-sm flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-mono text-xs font-bold">1</span>
                  <span>Portal del Inquilino & Visualización de Contratos</span>
                </h4>
                <div className="pl-8 space-y-1.5 text-gray-600">
                  <p>
                    • En tu barra de navegación tienes acceso directo a tu <strong>"Portal Inquilino"</strong>.
                  </p>
                  <p>
                    • Allí visualizas tu contrato activo, la propiedad que ocupas, fecha de inicio y vencimiento, canon mensual acordado y el asesor inmobiliario que te atiende.
                  </p>
                </div>
              </div>

              {/* Sección 2 */}
              <div className="space-y-2 bg-[#FAFBF9] p-4 rounded-2xl border border-gray-200">
                <h4 className="font-bold text-gray-900 text-sm flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-mono text-xs font-bold">2</span>
                  <span>Firma Digital Interactiva y Descarga de Documento Oficial</span>
                </h4>
                <div className="pl-8 space-y-1.5 text-gray-600">
                  <p>
                    • Cuando tu contrato esté listo para formalizarse, presiona <strong>"Ver Contrato / Firmar"</strong>.
                  </p>
                  <p>
                    • <strong>Firma Digital:</strong> Podrás dibujar tu firma con el ratón o pantalla táctil, o bien cargar una imagen nítida de tu firma autógrafa.
                  </p>
                  <p>
                    • <strong>Descarga de Contrato Firmado:</strong> Al completarse las firmas o validarse el escaneo oficial, se habilita el botón verde <strong>"Descargar Contrato Firmado"</strong> para obtener tu documento legal certificado con sello y folio.
                  </p>
                </div>
              </div>

              {/* Sección 3 */}
              <div className="space-y-2 bg-[#FAFBF9] p-4 rounded-2xl border border-gray-200">
                <h4 className="font-bold text-gray-900 text-sm flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-mono text-xs font-bold">3</span>
                  <span>Reporte de Pagos de Mensualidad & Recibos con QR</span>
                </h4>
                <div className="pl-8 space-y-1.5 text-gray-600">
                  <p>
                    • Deposita siempre únicamente en la cuenta bancaria oficial de Terranova señalada en tu contrato.
                  </p>
                  <p>
                    • Haz clic en <strong>"Registrar Pago"</strong>, ingresa el número de referencia bancaria y adjunta tu comprobante.
                  </p>
                  <p>
                    • Una vez conciliado por administración, podrás descargar tu <strong>Recibo Oficial de Pago</strong> con desglose tributario y código QR de autenticidad.
                  </p>
                </div>
              </div>

              {/* Sección 4 */}
              <div className="space-y-2 bg-[#FAFBF9] p-4 rounded-2xl border border-gray-200">
                <h4 className="font-bold text-gray-900 text-sm flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-mono text-xs font-bold">4</span>
                  <span>Reporte de Mantenimiento y Mensajería</span>
                </h4>
                <div className="pl-8 space-y-1.5 text-gray-600">
                  <p>
                    • Si tu inmueble presenta alguna falla de plomería, electricidad o cerrajería, crea un ticket desde <strong>"Solicitar Mantenimiento"</strong>.
                  </p>
                  <p>
                    • Se te asignará un contratista autorizado para realizar la inspección y reparación.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB: AGENTE (AGENT) */}
          {/* ========================================================= */}
          {activeTab === 'agent' && (
            <div className="space-y-6 animate-in fade-in">
              <div className="border-b border-gray-200 pb-3">
                <span className="text-[10px] font-bold uppercase text-blue-800 tracking-wider">
                  Guía Oficial · Asesor Inmobiliario (Agente)
                </span>
                <h3 className="font-serif-brand text-xl font-bold text-gray-900 mt-0.5">
                  Manual de Asesoría Comercial & Emisión de Contratos
                </h3>
                <p className="text-gray-500 text-[11px] mt-0.5">
                  Emisión de ventas a plazos y directas, subida de documentos.pdf, comisiones y seguimiento.
                </p>
              </div>

              {/* Confidencialidad y Restricción para el Agente */}
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 text-[11px] space-y-1">
                <p className="font-bold flex items-center gap-1.5 text-amber-950">
                  <Lock className="w-4 h-4 text-amber-700 shrink-0" />
                  Privacidad Financiera Restringida:
                </p>
                <p>
                  El agente inmobiliario <strong>no tiene acceso ni puede visualizar la tasa de ganancia pactada entre el dueño del terreno y el administrador (80% neto)</strong>. Esta cifra es un acuerdo estrictamente confidencial de la alta dirección.
                </p>
              </div>

              {/* Paso 1 */}
              <div className="space-y-2 bg-[#FAFBF9] p-4 rounded-2xl border border-gray-200">
                <h4 className="font-bold text-gray-900 text-sm flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center font-mono text-xs font-bold">1</span>
                  <span>Emisión de Contratos (Venta, Venta a Plazos y Alquiler)</span>
                </h4>
                <div className="pl-8 space-y-1.5 text-gray-600">
                  <p>
                    • Ingresa a la sección <strong>Contratos</strong> y pulsa <strong>"Emitir Nuevo Contrato"</strong>.
                  </p>
                  <p>
                    • <strong>Control de Disponibilidad:</strong> Si el inmueble seleccionado ya tiene un contrato vigente, el sistema bloqueará la emisión para evitar que existan dos contratos activos sobre la misma propiedad.
                  </p>
                  <p>
                    • <strong>Venta a Plazos:</strong> Si el cliente adquiere a financiamiento, digita la prima inicial pactada y los años de plazo. El sistema calcula automáticamente el total de cuotas y el pago mensual exacto.
                  </p>
                  <p>
                    • <strong>Selección de Plantilla:</strong> Puedes elegir entre las plantillas de contrato estándar (.docx o .pdf) previamente autorizadas por el Administrador.
                  </p>
                </div>
              </div>

              {/* Paso 2 */}
              <div className="space-y-2 bg-[#FAFBF9] p-4 rounded-2xl border border-gray-200">
                <h4 className="font-bold text-gray-900 text-sm flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center font-mono text-xs font-bold">2</span>
                  <span>Subida Única de documentos.pdf / Escaneo Físico</span>
                </h4>
                <div className="pl-8 space-y-1.5 text-gray-600">
                  <p>
                    • Una vez que el cliente firma el contrato en físico, pulsa el botón <strong>"Subir Firmado"</strong> en la fila del contrato.
                  </p>
                  <p>
                    • Selecciona o arrastra el archivo digital (formato <strong>.pdf</strong>, como <code>documentos.pdf</code>, o imágenes escaneadas en alta resolución).
                  </p>
                  <p>
                    • El archivo se almacena en el sistema con su tamaño real en KB/MB y queda disponible para su descarga oficial.
                  </p>
                </div>
              </div>

              {/* Paso 3 */}
              <div className="space-y-2 bg-[#FAFBF9] p-4 rounded-2xl border border-gray-200">
                <h4 className="font-bold text-gray-900 text-sm flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center font-mono text-xs font-bold">3</span>
                  <span>Solicitud de Invalidación por Error de Carga</span>
                </h4>
                <div className="pl-8 space-y-1.5 text-gray-600">
                  <p>
                    • Por seguridad jurídica, los contratos solo permiten una subida. Si por equivocación adjuntaste un PDF equivocado o ilegible, pulsa <strong>"Solicitar Invalidación"</strong>.
                  </p>
                  <p>
                    • Describe el motivo del error. El Administrador recibirá tu solicitud y, al aprobarla, se habilitará nuevamente el botón de subida para cargar el documento correcto.
                  </p>
                </div>
              </div>

              {/* Paso 4 */}
              <div className="space-y-2 bg-[#FAFBF9] p-4 rounded-2xl border border-gray-200">
                <h4 className="font-bold text-gray-900 text-sm flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center font-mono text-xs font-bold">4</span>
                  <span>Liquidación de Comisiones por Ventas Formalizadas</span>
                </h4>
                <div className="pl-8 space-y-1.5 text-gray-600">
                  <p>
                    • <strong>Venta Directa:</strong> Al liquidarse la compraventa en su totalidad, se te acredita el 100% de tu comisión convenida en tu recibo de nómina.
                  </p>
                  <p>
                    • <strong>Venta a Plazos:</strong> Se te deposita proporcionalmente tu comisión conforme se vayan recibiendo los pagos de la prima y las cuotas mensuales del adquirente.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB: PROPIETARIO (OWNER) */}
          {/* ========================================================= */}
          {activeTab === 'owner' && (
            <div className="space-y-6 animate-in fade-in">
              <div className="border-b border-gray-200 pb-3">
                <span className="text-[10px] font-bold uppercase text-amber-800 tracking-wider">
                  Guía Oficial · Propietario de Terrenos & Inmuebles
                </span>
                <h3 className="font-serif-brand text-xl font-bold text-gray-900 mt-0.5">
                  Portal de Propietario: Rentabilidad, Liquidaciones y Confidencialidad
                </h3>
                <p className="text-gray-500 text-[11px] mt-0.5">
                  Control transparente de tus activos consignados y recepción de fondos pactados.
                </p>
              </div>

              {/* Confidencialidad y Ganancia */}
              <div className="p-4 bg-amber-50 rounded-2xl border border-amber-300 text-amber-950 text-xs space-y-2">
                <div className="flex items-center gap-2 font-bold text-amber-900">
                  <ShieldCheck className="w-5 h-5 text-amber-700 shrink-0" />
                  <span>Confidencialidad Financiera Pactada (80% Neto):</span>
                </div>
                <p className="leading-relaxed">
                  Tu porcentaje de ganancia convenido (<strong>80% del valor pactado</strong>) es información <strong>exclusiva y estrictamente confidencial</strong> entre tú (dueño del terreno/inmueble) y el Administrador de Terranova.
                </p>
                <p className="text-[11px] text-amber-800">
                  • Ni el comprador ni el agente inmobiliario tienen visibilidad de este margen de rentabilidad institucional.
                </p>
              </div>

              {/* Modalidades de Pago */}
              <div className="space-y-2 bg-[#FAFBF9] p-4 rounded-2xl border border-gray-200">
                <h4 className="font-bold text-gray-900 text-sm flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center font-mono text-xs font-bold">1</span>
                  <span>Mecanismo de Depósito de Ganancias</span>
                </h4>
                <div className="pl-8 space-y-1.5 text-gray-600">
                  <p>
                    • <strong>Venta Directa:</strong> Cuando la compraventa de tu terreno o propiedad se ejecuta correctamente al contado, se te transfiere el <strong>100% total de tu ganancia neta pactada</strong> a tu cuenta bancaria registrada.
                  </p>
                  <p>
                    • <strong>Venta a Plazos:</strong> Se te va depositando tu porcentaje de ganancia proporcionalmente con cada pago recibido (empezando con el porcentaje correspondiente de la prima inicial y luego con cada abono mensual cancelado por el comprador).
                  </p>
                </div>
              </div>

              {/* Traspaso a un solo dueño */}
              <div className="space-y-2 bg-[#FAFBF9] p-4 rounded-2xl border border-gray-200">
                <h4 className="font-bold text-gray-900 text-sm flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center font-mono text-xs font-bold">2</span>
                  <span>Traspaso Registral de Dominio a un Solo Dueño</span>
                </h4>
                <div className="pl-8 space-y-1.5 text-gray-600">
                  <p>
                    • Al formalizarse una venta, la propiedad pasa a nombre del <strong>comprador único titular</strong>, garantizando certeza legal y catastral para ambas partes.
                  </p>
                  <p>
                    • En tu portal podrás consultar el histórico de contratos ejecutados, liquidaciones y recibos bancarios de transferencia.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB: TÉCNICO DE SISTEMAS / DBA (TECHNICIAN) */}
          {/* ========================================================= */}
          {activeTab === 'technician' && (
            <div className="space-y-6 animate-in fade-in">
              <div className="border-b border-gray-200 pb-3">
                <span className="text-[10px] font-bold uppercase text-indigo-800 tracking-wider">
                  Guía Oficial · Técnico de Sistemas & Mantenimiento
                </span>
                <h3 className="font-serif-brand text-xl font-bold text-gray-900 mt-0.5">
                  Panel Técnico: Mantenimiento, Inventario de Insumos y Servicios SQL
                </h3>
                <p className="text-gray-500 text-[11px] mt-0.5">
                  Operaciones de reparación de inmuebles, control de suministros de bodega y mantenimiento de infraestructura de datos.
                </p>
              </div>

              {/* Segregación y Privacidad */}
              <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-200 text-indigo-950 text-xs space-y-2">
                <div className="flex items-center gap-2 font-bold text-indigo-900">
                  <ShieldCheck className="w-5 h-5 text-indigo-700 shrink-0" />
                  <span>Segregación de Responsabilidades y Funciones No Comerciales:</span>
                </div>
                <p className="leading-relaxed">
                  Tu perfil cuenta con su propio <strong>Panel de Mantenimiento ('MaintenanceDashboard')</strong> para gestionar reparaciones e inventario de insumos sin acceso a las funciones comerciales administrativas (contratos de compraventa, nómina salarial, comisiones ni finanzas de la empresa).
                </p>
                <p className="text-[11px] text-indigo-900/90">
                  • <strong>Espacio Específico de Base de Datos:</strong> El acceso a la base de datos ha sido retirado de la barra pública y reubicado en su propia pestaña técnica reservada dentro de tu panel de control.
                </p>
              </div>

              {/* Paso 1: Tickets */}
              <div className="space-y-2 bg-[#FAFBF9] p-4 rounded-2xl border border-gray-200">
                <h4 className="font-bold text-gray-900 text-sm flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-800 flex items-center justify-center font-mono text-xs font-bold">1</span>
                  <span>Gestión de Tickets de Avería y Actualización de Reparaciones</span>
                </h4>
                <div className="pl-8 space-y-1.5 text-gray-600">
                  <p>
                    • Visualiza todos los reportes de averías clasificados por estado (Pendiente, En Proceso, Reparado, Cancelado) y prioridad (Emergencia, Alta, Media, Baja).
                  </p>
                  <p>
                    • Pulsa <strong>"Actualizar Reparación"</strong> para cambiar el estado, asignar al técnico responsable, registrar el costo real de mano de obra y consignar las notas de diagnóstico técnico.
                  </p>
                  <p>
                    • Puedes vincular y descontar del inventario los repuestos utilizados en cada intervención.
                  </p>
                </div>
              </div>

              {/* Paso 2: Inventario */}
              <div className="space-y-2 bg-[#FAFBF9] p-4 rounded-2xl border border-gray-200">
                <h4 className="font-bold text-gray-900 text-sm flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-800 flex items-center justify-center font-mono text-xs font-bold">2</span>
                  <span>Control de Inventario de Suministros y Kardex de Bodega</span>
                </h4>
                <div className="pl-8 space-y-1.5 text-gray-600">
                  <p>
                    • Catálogo clasificado por especialidades: Plomería, Electricidad, Cerrajería, Climatización, Pintura, Herramientas y General.
                  </p>
                  <p>
                    • <strong>Entradas (+):</strong> Registra recepciones de pedidos con número de factura y proveedor para sumar stock.
                  </p>
                  <p>
                    • <strong>Salidas (-):</strong> Registra despachos directos o consumos asociados a tickets de mantenimiento.
                  </p>
                  <p>
                    • <strong>Alertas de Seguridad:</strong> El sistema emite alertas automáticas cuando el stock de un repuesto desciende de su umbral mínimo de seguridad.
                  </p>
                </div>
              </div>

              {/* Paso 3: Servicios de Base de Datos SQL */}
              <div className="space-y-2 bg-[#FAFBF9] p-4 rounded-2xl border border-gray-200">
                <h4 className="font-bold text-gray-900 text-sm flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-800 flex items-center justify-center font-mono text-xs font-bold">3</span>
                  <span>Espacio Específico: Servicios de Base de Datos & SQL</span>
                </h4>
                <div className="pl-8 space-y-1.5 text-gray-600">
                  <p>
                    • Ubicado dentro de tu panel en la pestaña <strong>"Servicios de Base de Datos & SQL"</strong>.
                  </p>
                  <p>
                    • Monitoreo de conteo de registros en tiempo real en las 12 tablas relacionales.
                  </p>
                  <p>
                    • Acceso a la <strong>Consola SQL & Exportador</strong> para consultar DDL/DML y descargar el script <code>database_schema.sql</code> para montaje local en MySQL (XAMPP) o PostgreSQL (pgAdmin).
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB: CONTRATISTA (CONTRACTOR) */}
          {/* ========================================================= */}
          {activeTab === 'contractor' && (
            <div className="space-y-6 animate-in fade-in">
              <div className="border-b border-gray-200 pb-3">
                <span className="text-[10px] font-bold uppercase text-orange-800 tracking-wider">
                  Guía Oficial · Contratista de Mantenimiento
                </span>
                <h3 className="font-serif-brand text-xl font-bold text-gray-900 mt-0.5">
                  Gestión de Averías, Órdenes de Trabajo y Certificación de Obras
                </h3>
                <p className="text-gray-500 text-[11px] mt-0.5">
                  Atención técnica a inmuebles arrendados y comercializados.
                </p>
              </div>

              <div className="space-y-2 bg-[#FAFBF9] p-4 rounded-2xl border border-gray-200">
                <h4 className="font-bold text-gray-900 text-sm flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-orange-100 text-orange-800 flex items-center justify-center font-mono text-xs font-bold">1</span>
                  <span>Recepción y Diagnóstico de Tickets</span>
                </h4>
                <div className="pl-8 space-y-1.5 text-gray-600">
                  <p>
                    • Consulta tus órdenes de trabajo asignadas con dirección exacta del inmueble, teléfono del inquilino y descripción de la avería.
                  </p>
                  <p>
                    • Actualiza el estado a <strong>"En Progreso"</strong> al iniciar los trabajos de reparación.
                  </p>
                </div>
              </div>

              <div className="space-y-2 bg-[#FAFBF9] p-4 rounded-2xl border border-gray-200">
                <h4 className="font-bold text-gray-900 text-sm flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-orange-100 text-orange-800 flex items-center justify-center font-mono text-xs font-bold">2</span>
                  <span>Finalización y Facturación de Servicios</span>
                </h4>
                <div className="pl-8 space-y-1.5 text-gray-600">
                  <p>
                    • Al culminar la labor, marca la orden como <strong>"Resuelto"</strong> e ingresa el reporte final de costos de mano de obra y repuestos utilizados.
                  </p>
                  <p>
                    • La liquidación de tus servicios técnicos se tramitará directamente con el departamento contable de Terranova.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB: ADMINISTRADOR (ADMIN) */}
          {/* ========================================================= */}
          {activeTab === 'admin' && (
            <div className="space-y-6 animate-in fade-in">
              <div className="border-b border-gray-200 pb-3">
                <span className="text-[10px] font-bold uppercase text-purple-800 tracking-wider">
                  Guía Oficial · Administrador General & Alta Dirección
                </span>
                <h3 className="font-serif-brand text-xl font-bold text-gray-900 mt-0.5">
                  Manual de Gobernanza, Operaciones y Control Total
                </h3>
                <p className="text-gray-500 text-[11px] mt-0.5">
                  Plantillas oficiales, resolución de contratos, nómina de comisiones, auditoría y control de roles.
                </p>
              </div>

              {/* Paso 1 */}
              <div className="space-y-2 bg-[#FAFBF9] p-4 rounded-2xl border border-gray-200">
                <h4 className="font-bold text-gray-900 text-sm flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-purple-100 text-purple-800 flex items-center justify-center font-mono text-xs font-bold">1</span>
                  <span>Gestión de Plantillas de Contratos (.docx y .pdf)</span>
                </h4>
                <div className="pl-8 space-y-1.5 text-gray-600">
                  <p>
                    • En la pestaña <strong>"Plantillas de Contratos"</strong> puedes subir documentos corporativos estándar en formato Microsoft Word (.docx/.doc) o PDF (.pdf).
                  </p>
                  <p>
                    • Estas plantillas se guardan en el almacenamiento y quedan disponibles para ser seleccionadas dinámicamente al redactar contratos de arrendamiento o compraventa.
                  </p>
                </div>
              </div>

              {/* Paso 2 */}
              <div className="space-y-2 bg-[#FAFBF9] p-4 rounded-2xl border border-gray-200">
                <h4 className="font-bold text-gray-900 text-sm flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-purple-100 text-purple-800 flex items-center justify-center font-mono text-xs font-bold">2</span>
                  <span>Cancelación de Contratos y Liberación de Inmuebles</span>
                </h4>
                <div className="pl-8 space-y-1.5 text-gray-600">
                  <p>
                    • Si un contrato vigente finaliza por mutuo acuerdo o rescisión anticipada, presiona <strong>"Cancelar"</strong> en la tabla de contratos.
                  </p>
                  <p>
                    • El contrato cambiará a estado <strong>"Cancelado"</strong> y el inmueble quedará liberado automáticamente a estado <strong>"Disponible"</strong> en el catálogo.
                  </p>
                  <p>
                    • <strong>Traspaso de Dueño Único en Ventas:</strong> Al formalizarse una venta directa o liquidada a plazos, la titularidad registral se transfiere irrevocablemente al comprador único y el inmueble pasa a "Vendida".
                  </p>
                </div>
              </div>

              {/* Paso 3 */}
              <div className="space-y-2 bg-[#FAFBF9] p-4 rounded-2xl border border-gray-200">
                <h4 className="font-bold text-gray-900 text-sm flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-purple-100 text-purple-800 flex items-center justify-center font-mono text-xs font-bold">3</span>
                  <span>Aprobación de Invalidaciones de Documentos de Agentes</span>
                </h4>
                <div className="pl-8 space-y-1.5 text-gray-600">
                  <p>
                    • Cuando un asesor solicita invalidar un archivo con error, aparecerá una alerta de color rosa en la lista de contratos.
                  </p>
                  <p>
                    • Pulsa <strong>"Invalidar"</strong> para revisar la justificación del agente, ingresar tus notas administrativas y autorizar la resubida del archivo correcto.
                  </p>
                </div>
              </div>

              {/* Paso 4 */}
              <div className="space-y-2 bg-[#FAFBF9] p-4 rounded-2xl border border-gray-200">
                <h4 className="font-bold text-gray-900 text-sm flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-purple-100 text-purple-800 flex items-center justify-center font-mono text-xs font-bold">4</span>
                  <span>Administración de Usuarios y Asignación de Roles</span>
                </h4>
                <div className="pl-8 space-y-1.5 text-gray-600">
                  <p>
                    • En la pestaña <strong>"Usuarios Registrados"</strong> puedes activar o dar de baja cuentas, y asignar cualquier tipo de cuenta (Cliente, Inquilino, Propietario, Agente, Administrador, Contratista y <strong>Técnico de Sistemas / DBA</strong>).
                  </p>
                  <p>
                    • En la matriz <strong>RBAC</strong> puedes definir qué módulos están habilitados o restringidos para cada perfil.
                  </p>
                </div>
              </div>

              {/* Paso 5 */}
              <div className="space-y-2 bg-[#FAFBF9] p-4 rounded-2xl border border-gray-200">
                <h4 className="font-bold text-gray-900 text-sm flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-purple-100 text-purple-800 flex items-center justify-center font-mono text-xs font-bold">5</span>
                  <span>Nómina, Liquidación de Comisiones & Servidor SMTP</span>
                </h4>
                <div className="pl-8 space-y-1.5 text-gray-600">
                  <p>
                    • En <strong>"Nómina & Comisiones"</strong> puedes dispersar salarios y liquidar comisiones de ventas cerradas generando los recibos oficiales.
                  </p>
                  <p>
                    • En <strong>"Configuración"</strong> puedes activar la inclusión del RTN fiscal de la empresa en recibos y configurar el servidor SMTP para envíos automáticos por correo.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB: FAQ */}
          {/* ========================================================= */}
          {activeTab === 'faq' && (
            <div className="space-y-4 animate-in fade-in">
              <div className="border-b border-gray-200 pb-3">
                <span className="text-[10px] font-bold uppercase text-gray-600 tracking-wider">
                  Soporte & Respuestas Rápidas
                </span>
                <h3 className="font-serif-brand text-xl font-bold text-gray-900 mt-0.5">
                  Preguntas Frecuentes del Sistema
                </h3>
              </div>

              <div className="space-y-3">
                <div className="p-3 bg-gray-50 rounded-2xl border border-gray-200 space-y-1">
                  <strong className="text-gray-900 font-bold block">¿Puede un inquilino tener más de un inmueble alquilado?</strong>
                  <p className="text-gray-600 text-[11px]">
                    Sí. Un mismo usuario inquilino puede poseer múltiples contratos vigentes para diferentes propiedades (por ejemplo, su residencia y un local comercial). Lo que la regla prohíbe es que un mismo inmueble tenga dos inquilinos concurrentes con contratos vigentes a la vez.
                  </p>
                </div>

                <div className="p-3 bg-gray-50 rounded-2xl border border-gray-200 space-y-1">
                  <strong className="text-gray-900 font-bold block">¿Cómo se liquida la ganancia del dueño de un terreno?</strong>
                  <p className="text-gray-600 text-[11px]">
                    Si la venta se efectúa al contado (Venta Directa), se le transfiere la totalidad de su ganancia convenida (80% pactado). Si la venta es a plazos, se le va depositando proporcionalmente con la prima inicial y con cada mensualidad cobrada al comprador.
                  </p>
                </div>

                <div className="p-3 bg-gray-50 rounded-2xl border border-gray-200 space-y-1">
                  <strong className="text-gray-900 font-bold block">¿Quién tiene acceso a la tasa de ganancia pactada del terreno?</strong>
                  <p className="text-gray-600 text-[11px]">
                    Únicamente el dueño del terreno y el Administrador. Ni los asesores comerciales ni los compradores tienen acceso a esta información confidencial.
                  </p>
                </div>

                <div className="p-3 bg-gray-50 rounded-2xl border border-gray-200 space-y-1">
                  <strong className="text-gray-900 font-bold block">¿Qué formatos de archivo admite la plataforma?</strong>
                  <p className="text-gray-600 text-[11px]">
                    Para contratos firmados por asesores: archivos <code>.pdf</code> (incluyendo <code>documentos.pdf</code>) e imágenes escaneadas (.png, .jpg). Para estándares de contratos subidos por el Administrador: documentos Microsoft Word (<code>.docx / .doc</code>) y <code>.pdf</code>.
                  </p>
                </div>

                <div className="p-3 bg-gray-50 rounded-2xl border border-gray-200 space-y-1">
                  <strong className="text-gray-900 font-bold block">¿Por qué la base de datos SQL no está en el panel del Administrador?</strong>
                  <p className="text-gray-600 text-[11px]">
                    Por normativa estricta de seguridad informática y segregación de funciones, el acceso directo a la consola de base de datos y scripts DDL/DML está reservado exclusivamente para los Técnicos de Sistemas y Administradores de Base de Datos (DBA).
                  </p>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer actions */}
        <div className="p-4 bg-[#FAFBF9] border-t border-gray-200 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            {onStartTour && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onStartTour();
                }}
                className="px-4 py-2 rounded-xl bg-emerald-50 border border-emerald-300 hover:bg-emerald-100 text-emerald-900 font-bold flex items-center gap-1.5 transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
                <span>Tour Interactivo</span>
              </button>
            )}

            {onOpenDatabaseExport && userRole === 'technician' && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenDatabaseExport();
                }}
                className="px-3.5 py-2 rounded-xl border border-indigo-300 bg-indigo-50 hover:bg-indigo-100 text-indigo-900 font-bold flex items-center gap-1.5 transition-colors"
              >
                <Database className="w-3.5 h-3.5 text-indigo-700" />
                <span>Consola SQL (Técnico)</span>
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#2D4539] hover:bg-[#20342A] text-white font-bold transition-colors shadow-2xs"
          >
            Entendido / Cerrar Guía
          </button>
        </div>

      </div>
    </div>
  );
};
