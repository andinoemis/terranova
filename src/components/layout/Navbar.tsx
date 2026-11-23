import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Building2, 
  Home, 
  KeyRound, 
  Briefcase, 
  ShieldCheck, 
  FileText, 
  RotateCcw, 
  Menu, 
  X,
  ChevronDown,
  LogIn,
  UserPlus,
  LogOut,
  Calendar,
  MessageSquare,
  Bell,
  Mail,
  Layers,
  Coins,
  BookOpen,
  HelpCircle,
  Database,
  Wrench
} from 'lucide-react';
import { NotificationsModal } from '../common/NotificationsModal';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenAuth: (mode: 'login' | 'register') => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, onOpenAuth }) => {
  const { 
    currentUser, 
    switchUser, 
    users, 
    resetDatabase, 
    logout, 
    isAuthenticated,
    activeCurrency,
    setActiveCurrency,
    exchangeRateUSDToHNL,
    exchangeRateSource,
    isFetchingExchangeRate,
    refreshExchangeRate,
    unreadNotificationsCount,
    comparisonProperties,
    setIsComparingModalOpen,
    startTour,
    setIsManualOpen,
    isDatabaseModalOpen,
    setIsDatabaseModalOpen
  } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const getNavLinks = () => {
    if (!isAuthenticated || currentUser.role === 'guest') {
      return [
        { id: 'catalog', label: 'Catálogo Inmobiliario', icon: Home }
      ];
    }

    // Cliente comprador / interesado: su área principal es el catálogo sin secciones innecesarias
    if (currentUser.role === 'client') {
      return [
        { id: 'catalog', label: 'Catálogo Inmobiliario', icon: Home }
      ];
    }

    if (currentUser.role === 'tenant') {
      // El inquilino tiene el catálogo y su portal (citas y mensajes están integrados dentro de su portal)
      return [
        { id: 'catalog', label: 'Catálogo Inmobiliario', icon: Home },
        { id: 'tenant_portal', label: 'Mi Portal Inquilino', icon: KeyRound, badge: 'Activo' }
      ];
    }

    if (currentUser.role === 'owner') {
      return [
        { id: 'catalog', label: 'Catálogo Inmobiliario', icon: Home },
        { id: 'owner_portal', label: 'Portal Propietario', icon: Building2 },
        { id: 'messages', label: 'Mensajes', icon: MessageSquare }
      ];
    }

    if (currentUser.role === 'agent') {
      return [
        { id: 'catalog', label: 'Catálogo Inmobiliario', icon: Home },
        { id: 'agent_crm', label: 'Agente & CRM', icon: Briefcase }
      ];
    }

    if (currentUser.role === 'technician') {
      return [
        { id: 'catalog', label: 'Catálogo Inmobiliario', icon: Home },
        { id: 'maintenance_dashboard', label: 'Centro Técnico & Mantenimiento', icon: Wrench, badge: 'Técnico' }
      ];
    }

    // Admin tiene control total con módulos integrados en Administración
    return [
      { id: 'catalog', label: 'Catálogo Inmobiliario', icon: Home },
      { id: 'admin_dashboard', label: 'Administración', icon: ShieldCheck },
      { id: 'agent_crm', label: 'Agente & CRM', icon: Briefcase },
      { id: 'owner_portal', label: 'Portal Propietario', icon: Building2 },
      { id: 'tenant_portal', label: 'Portal Inquilino', icon: KeyRound }
    ];
  };

  const navLinks = getNavLinks();

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'agent': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'owner': return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'tenant': return 'bg-rose-100 text-rose-800 border-rose-300';
      case 'client': return 'bg-cyan-100 text-cyan-800 border-cyan-300';
      case 'contractor': return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'technician': return 'bg-indigo-100 text-indigo-800 border-indigo-300';
      default: return 'bg-slate-100 text-slate-800 border-slate-300';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin': return 'Administrador';
      case 'agent': return 'Agente Inmobiliario';
      case 'owner': return 'Propietario';
      case 'tenant': return 'Inquilino Activo';
      case 'client': return 'Cliente / Comprador';
      case 'contractor': return 'Contratista';
      case 'technician': return 'Técnico de Sistemas / DBA';
      default: return 'Modo Visitante / Invitado';
    }
  };

  const handleGoToMyPortal = () => {
    setRoleDropdownOpen(false);
    if (currentUser.role === 'tenant') setActiveTab('tenant_portal');
    else if (currentUser.role === 'owner') setActiveTab('owner_portal');
    else if (currentUser.role === 'agent') setActiveTab('agent_crm');
    else if (currentUser.role === 'admin') setActiveTab('admin_dashboard');
    else if (currentUser.role === 'technician') setActiveTab('maintenance_dashboard');
    else setActiveTab('guest_panel');
  };

  const handleLogoutToGuest = () => {
    setRoleDropdownOpen(false);
    logout();
    setActiveTab('guest_panel');
  };

  return (
    <header className="sticky top-0 z-40 bg-[#F4F6F2] border-b border-[#D8DFD5] shadow-xs">

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5">
        <div className="flex items-center justify-between gap-3">
          
          {/* Terranova Brand Logo matching PDF Page 27 */}
          <div 
            onClick={() => setActiveTab(isAuthenticated ? (currentUser.role === 'tenant' ? 'tenant_portal' : 'catalog') : 'guest_panel')} 
            className="flex items-center gap-2.5 cursor-pointer group shrink-0"
          >
            {/* House Logo Icon */}
            <div className="w-10 h-10 rounded-xl bg-[#2D4539] text-[#E3ECE3] flex flex-col items-center justify-center shadow-sm group-hover:bg-[#20342A] transition-all">
              <div className="relative">
                <Building2 className="w-5 h-5 text-[#A3C7AD]" />
                <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#C36449] rounded-full border-2 border-[#2D4539]"></div>
              </div>
            </div>
            
            <div className="flex flex-col">
              <span className="font-serif-brand text-xl sm:text-2xl font-bold tracking-widest text-[#1D3227] uppercase leading-none">
                TERRANOVA
              </span>
              <span className="text-[9px] uppercase tracking-[0.22em] text-[#637C6C] font-semibold mt-0.5">
                TU SUEÑO, AL ALCANCE
              </span>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden xl:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = activeTab === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => setActiveTab(link.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-[#2D4539] text-white shadow-xs'
                      : 'text-[#3E5547] hover:bg-[#E7EDE4] hover:text-[#1F3327]'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#A3C7AD]' : 'text-[#617B6B]'}`} />
                  <span>{link.label}</span>
                  {link.badge && (
                    <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-indigo-700 text-white font-bold ml-0.5">
                      {link.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Section: Utility Tools, Notifications, Auth buttons & User Profile */}
          <div className="flex items-center gap-2">
            
            {/* Currency Switcher: Cumplimiento Ley Monetaria de Honduras (Decreto 131-98) */}
            <div 
              className="flex items-center bg-[#E6EEE3] p-0.5 rounded-xl border border-[#CBD8CA] text-[11px] font-bold shadow-2xs"
              title="Cambiar divisa según Ley Monetaria de Honduras (Decreto 131-98)"
            >
              <button
                onClick={() => setActiveCurrency('USD')}
                className={`px-2 py-1 rounded-lg transition-all ${
                  activeCurrency === 'USD' 
                    ? 'bg-[#2D4539] text-white shadow-xs' 
                    : 'text-[#486352] hover:text-[#1F3327]'
                }`}
              >
                USD $
              </button>
              <button
                onClick={() => setActiveCurrency('HNL')}
                className={`px-2 py-1 rounded-lg transition-all ${
                  activeCurrency === 'HNL' 
                    ? 'bg-[#2D4539] text-white shadow-xs' 
                    : 'text-[#486352] hover:text-[#1F3327]'
                }`}
              >
                HNL L.
              </button>
            </div>

            {/* Live Exchange Rate Status Badge (API Financiera en Vivo / BCH) */}
            <div 
              className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white border border-[#CBD8CA] text-[11px] text-gray-700 shadow-2xs"
              title={`Tasa financiera en vivo: 1 USD = L. ${exchangeRateUSDToHNL.toFixed(2)} HNL (${exchangeRateSource})`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="font-mono font-bold text-[#1E3328]">1$ = L. {exchangeRateUSDToHNL.toFixed(2)}</span>
              <button
                onClick={() => refreshExchangeRate()}
                disabled={isFetchingExchangeRate}
                className="text-[#3F5B4B] hover:text-[#1E3328] p-0.5 rounded transition-transform active:rotate-180"
                title="Sincronizar tasa de cambio en vivo con API financiera"
              >
                <RotateCcw className={`w-3 h-3 ${isFetchingExchangeRate ? 'animate-spin text-emerald-600' : ''}`} />
              </button>
            </div>

            {/* Property Comparison Trigger (if properties are selected) */}
            {comparisonProperties.length > 0 && (
              <button
                onClick={() => setIsComparingModalOpen(true)}
                className="relative px-2.5 py-1.5 rounded-xl bg-[#C36449] hover:bg-[#B1573D] text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-2xs animate-in fade-in"
                title="Abrir tabla comparativa de propiedades técnicas y precios"
              >
                <Layers className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Comparar ({comparisonProperties.length}/3)</span>
                <span className="sm:hidden font-mono text-[10px]">{comparisonProperties.length}/3</span>
              </button>
            )}

            {/* Manual de Usuario Adaptativo según Perfil / Rol */}
            <button
              onClick={() => setIsManualOpen(true)}
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-[#CBD8CA] bg-white hover:bg-[#EEF5ED] text-[#2D4539] text-xs font-semibold transition-colors shadow-2xs"
              title={`Consultar manual de usuario específico para ${currentUser.role === 'guest' ? 'Visitante' : getRoleLabel(currentUser.role)}`}
            >
              <BookOpen className="w-3.5 h-3.5 text-[#3F5B4B]" />
              <span className="hidden md:inline">
                Manual ({currentUser.role === 'guest' ? 'Visitante' : getRoleLabel(currentUser.role).split(' ')[0]})
              </span>
            </button>

            {/* Real-time Notifications Bell: SOLO visible para usuarios autenticados con cuenta */}
            {isAuthenticated && currentUser.role !== 'guest' && (
              <button
                onClick={() => setNotificationsOpen(true)}
                className="relative p-2 rounded-xl border border-[#CBD8CA] bg-white hover:bg-[#EEF5ED] text-[#2D4539] transition-colors shadow-2xs"
                title="Notificaciones de nuevas solicitudes (citas, reparaciones, leads)"
              >
                <Bell className="w-4 h-4 text-[#4A6454]" />
                {unreadNotificationsCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-[#C36449] text-white rounded-full text-[10px] font-bold flex items-center justify-center border-2 border-white animate-pulse">
                    {unreadNotificationsCount}
                  </span>
                )}
              </button>
            )}



            {/* Active User Avatar & Profile Dropdown */}
            <div className="relative flex items-center gap-1.5 pl-1 border-l border-gray-300/70">
              <div className="hidden md:flex flex-col text-right">
                <span className="text-xs font-semibold text-[#1F3327] max-w-[130px] truncate">
                  {isAuthenticated ? currentUser.name : 'Modo Visitante'}
                </span>
                <span className={`inline-block text-[9px] font-bold px-1.5 py-0.2 rounded-md border ${getRoleBadgeColor(currentUser.role)}`}>
                  {getRoleLabel(currentUser.role)}
                </span>
              </div>

              <button
                onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                className="flex items-center gap-1 p-1 rounded-xl border border-[#C5D2C2] bg-white hover:bg-[#F2F6F0] transition-colors shadow-2xs"
                title="Menú de cuenta y perfil"
              >
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-8 h-8 rounded-lg object-cover border border-[#D5E0D2]"
                />
                <ChevronDown className="w-3.5 h-3.5 text-[#526B5C]" />
              </button>

              {/* Account Dropdown Menu */}
              {roleDropdownOpen && (
                <div 
                  className="absolute right-0 top-11 w-80 bg-white rounded-2xl shadow-xl border border-[#D0DDD0] py-2 z-50 animate-in fade-in slide-in-from-top-2 text-xs"
                  onMouseLeave={() => setRoleDropdownOpen(false)}
                >
                  <div className="px-4 py-3 border-b border-gray-100 bg-[#FAFBF9]">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={currentUser.avatar}
                        alt={currentUser.name}
                        className="w-10 h-10 rounded-xl object-cover border border-[#D5E0D2]"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-gray-900 truncate">{currentUser.name}</p>
                        <p className="text-[11px] text-gray-500 truncate">{currentUser.email}</p>
                        <div className="mt-1 flex items-center gap-1.5 flex-wrap">
                          <span className={`text-[9px] font-bold px-2 py-0.5 rounded border ${getRoleBadgeColor(currentUser.role)}`}>
                            {getRoleLabel(currentUser.role)}
                          </span>
                          {currentUser.accountNumber && (
                            <span className="text-[9px] font-mono text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">
                              {currentUser.accountNumber}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions & Role Specific portal navigation */}
                  <div className="p-2 space-y-1 bg-white">
                    {isAuthenticated ? (
                      <>
                        <button
                          onClick={handleGoToMyPortal}
                          className="w-full flex items-center gap-2 px-3 py-2 text-left font-semibold text-[#2D4539] hover:bg-[#EEF5ED] rounded-xl transition-colors"
                        >
                          <KeyRound className="w-4 h-4 text-[#436450]" />
                          <span>Ir a Mi Portal ({getRoleLabel(currentUser.role)})</span>
                        </button>

                        <div className="pt-2 pb-1 border-t border-gray-100 px-1">
                          <p className="text-[11px] text-gray-500 mb-2 leading-tight">
                            Para cambiar a otro perfil de usuario, debes cerrar tu sesión actual e ingresar desde el Panel de Invitado:
                          </p>
                          <button
                            onClick={handleLogoutToGuest}
                            className="w-full flex items-center justify-center gap-2 px-3 py-2.5 font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition-colors shadow-2xs"
                          >
                            <LogOut className="w-4 h-4" />
                            <span>Cerrar Sesión (Ir a Panel de Invitado)</span>
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => {
                            setRoleDropdownOpen(false);
                            onOpenAuth('login');
                          }}
                          className="w-full flex items-center gap-2 px-3 py-2 text-left font-semibold text-[#2D4539] hover:bg-[#EEF5ED] rounded-xl transition-colors"
                        >
                          <LogIn className="w-4 h-4" />
                          <span>Iniciar Sesión en el Sistema</span>
                        </button>
                        <button
                          onClick={() => {
                            setRoleDropdownOpen(false);
                            onOpenAuth('register');
                          }}
                          className="w-full flex items-center gap-2 px-3 py-2 text-left font-semibold text-[#C36449] hover:bg-orange-50 rounded-xl transition-colors"
                        >
                          <UserPlus className="w-4 h-4" />
                          <span>Registrar Nuevo Usuario</span>
                        </button>
                        <button
                          onClick={() => {
                            setRoleDropdownOpen(false);
                            setActiveTab('guest_panel');
                          }}
                          className="w-full flex items-center gap-2 px-3 py-2 text-left font-medium text-gray-700 hover:bg-gray-50 rounded-xl transition-colors"
                        >
                          <ShieldCheck className="w-4 h-4 text-emerald-600" />
                          <span>Ver Panel de Invitado y Cuentas de Acceso</span>
                        </button>
                      </>
                    )}
                  </div>

                  {/* Help, Manual & Local Database Tools */}
                  <div className="p-2 border-t border-gray-100 bg-[#FAFBF9] space-y-1">
                    <button
                      onClick={() => {
                        setRoleDropdownOpen(false);
                        setIsManualOpen(true);
                      }}
                      className="w-full flex items-center gap-2 px-2.5 py-1.5 text-left font-medium text-gray-700 hover:text-[#2D4539] hover:bg-white rounded-lg transition-colors text-[11px]"
                    >
                      <BookOpen className="w-3.5 h-3.5 text-[#2D4539]" />
                      <span>Manual de Uso ({currentUser.role === 'guest' ? 'Visitante' : getRoleLabel(currentUser.role)})</span>
                    </button>
                    <button
                      onClick={() => {
                        setRoleDropdownOpen(false);
                        startTour();
                      }}
                      className="w-full flex items-center gap-2 px-2.5 py-1.5 text-left font-medium text-gray-700 hover:text-[#2D4539] hover:bg-white rounded-lg transition-colors text-[11px]"
                    >
                      <HelpCircle className="w-3.5 h-3.5 text-emerald-700" />
                      <span>Iniciar Tour Guiado de la Plataforma</span>
                    </button>
                    {currentUser.role === 'technician' && (
                      <button
                        onClick={() => {
                          setRoleDropdownOpen(false);
                          setActiveTab('maintenance_dashboard');
                        }}
                        className="w-full flex items-center gap-2 px-2.5 py-1.5 text-left font-medium text-emerald-800 hover:text-emerald-950 hover:bg-emerald-50 rounded-lg transition-colors text-[11px]"
                      >
                        <Wrench className="w-3.5 h-3.5 text-emerald-700" />
                        <span>Panel Técnico & Mantenimiento</span>
                      </button>
                    )}
                    <button
                      onClick={() => {
                        setRoleDropdownOpen(false);
                        resetDatabase();
                      }}
                      className="w-full py-1 text-[11px] text-gray-600 hover:text-[#2D4539] flex items-center justify-center gap-1.5 font-medium hover:bg-gray-100 rounded-md transition-colors"
                    >
                      <RotateCcw className="w-3 h-3" /> Restablecer Base de Datos Inicial
                    </button>
                  </div>
                </div>
              )}

              {/* Mobile menu toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="xl:hidden p-2 rounded-lg bg-[#E7EDE4] text-[#2D4539]"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {mobileMenuOpen && (
          <div className="xl:hidden mt-3 pt-3 border-t border-[#D5E0D2] flex flex-col gap-1 pb-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = activeTab === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => {
                    setActiveTab(link.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center justify-between px-4 py-2.5 rounded-lg text-sm font-medium ${
                    isActive ? 'bg-[#2D4539] text-white' : 'text-[#2D4539] hover:bg-[#E5ECE2]'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4" />
                    <span>{link.label}</span>
                  </div>
                  {link.badge && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#C36449] text-white font-bold">
                      {link.badge}
                    </span>
                  )}
                </button>
              );
            })}

            <div className="pt-2 border-t border-[#DEE6DC] flex flex-col gap-1.5">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setIsManualOpen(true);
                }}
                className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-[#2D4539] hover:bg-[#E5ECE2] rounded-lg"
              >
                <BookOpen className="w-4 h-4 text-[#3F5B4B]" />
                <span>Manual de Uso ({currentUser.role === 'guest' ? 'Visitante' : getRoleLabel(currentUser.role)})</span>
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  startTour();
                }}
                className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-[#2D4539] hover:bg-[#E5ECE2] rounded-lg"
              >
                <HelpCircle className="w-4 h-4 text-emerald-700" />
                <span>Iniciar Tour Guiado</span>
              </button>
              {currentUser.role === 'technician' && (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setActiveTab('maintenance_dashboard');
                  }}
                  className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-emerald-900 hover:bg-emerald-50 rounded-lg"
                >
                  <Wrench className="w-4 h-4 text-emerald-700" />
                  <span>Panel Técnico & Mantenimiento</span>
                </button>
              )}
            </div>

            {isAuthenticated && (
              <div className="pt-2 border-t border-[#DEE6DC] flex flex-col gap-2">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogoutToGuest();
                  }}
                  className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 shadow-2xs"
                >
                  <LogOut className="w-3.5 h-3.5" /> Cerrar Sesión
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Notifications Modal */}
      <NotificationsModal
        isOpen={notificationsOpen}
        onClose={() => setNotificationsOpen(false)}
        onNavigateTab={(tab) => {
          setActiveTab(tab);
          setNotificationsOpen(false);
        }}
      />
    </header>
  );
};
