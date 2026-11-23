/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { PropertyCatalog } from './components/catalog/PropertyCatalog';
import { PropertyDetailModal } from './components/catalog/PropertyDetailModal';
import { PropertyComparisonModal } from './components/catalog/PropertyComparisonModal';
import { BookVisitModal } from './components/visits/BookVisitModal';
import { TenantPortal } from './components/tenant/TenantPortal';
import { OwnerPortal } from './components/owner/OwnerPortal';
import { AgentCRM } from './components/agent/AgentCRM';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { WorkCalendarView } from './components/calendar/WorkCalendarView';
import { MessagesInbox } from './components/messages/MessagesInbox';
import { PrintFormatsView } from './components/print/PrintFormatsView';
import { PrintableModal } from './components/print/PrintableModal';
import { PrivacyPolicyModal } from './components/legal/PrivacyPolicyModal';
import { TermsConditionsModal } from './components/legal/TermsConditionsModal';
import { CookieBanner } from './components/legal/CookieBanner';
import { ApiDocsModal } from './components/api/ApiDocsModal';
import { AuthModal } from './components/auth/AuthModal';
import { GuestPanel } from './components/guest/GuestPanel';
import { NotFoundView } from './components/common/NotFoundView';
import { ServerErrorView } from './components/common/ServerErrorView';
import { GuidedTourModal } from './components/onboarding/GuidedTourModal';
import { UserManualModal } from './components/common/UserManualModal';
import { DatabaseExportModal } from './components/admin/DatabaseExportModal';
import { WelcomeOnboardingBanner } from './components/onboarding/WelcomeOnboardingBanner';
import { MaintenanceDashboard } from './components/technician/MaintenanceDashboard';
import { Property, UserRole } from './types';
import { CheckCircle2, ShieldCheck, Lock } from 'lucide-react';

function MainApp() {
  const { 
    toastMessage, 
    currentUser, 
    isAuthenticated,
    isComparingModalOpen,
    setIsComparingModalOpen,
    isTourOpen,
    setIsTourOpen,
    startTour,
    isManualOpen,
    setIsManualOpen,
    isDatabaseModalOpen,
    setIsDatabaseModalOpen 
  } = useApp();
  const [activeTab, setActiveTab] = useState<string>('catalog');
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [visitingProperty, setVisitingProperty] = useState<Property | null>(null);

  // Auth Modal State
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [presetEmail, setPresetEmail] = useState<string | undefined>();
  const [presetPass, setPresetPass] = useState<string | undefined>();

  // Legal & API Modals
  const [privacyModalOpen, setPrivacyModalOpen] = useState(false);
  const [termsModalOpen, setTermsModalOpen] = useState(false);
  const [apiDocsModalOpen, setApiDocsModalOpen] = useState(false);

  const handleOpenAuth = (mode: 'login' | 'register', email?: string, pass?: string) => {
    setAuthMode(mode);
    setPresetEmail(email);
    setPresetPass(pass);
    setAuthModalOpen(true);
  };

  const handleLoginSuccess = (role: UserRole) => {
    if (role === 'tenant') setActiveTab('tenant_portal');
    else if (role === 'client') setActiveTab('catalog');
    else if (role === 'admin') setActiveTab('admin_dashboard');
    else if (role === 'agent') setActiveTab('agent_crm');
    else if (role === 'owner') setActiveTab('owner_portal');
    else if (role === 'technician') {
      setActiveTab('maintenance_dashboard');
    }
    else setActiveTab('catalog');
  };

  // Helper check for role access
  const isClientRestrictedTab = currentUser.role === 'client' && ['admin_dashboard', 'agent_crm', 'owner_portal', 'tenant_portal', 'calendar', 'messages', 'print_formats'].includes(activeTab);
  const isTenantRestrictedTab = currentUser.role === 'tenant' && ['admin_dashboard', 'agent_crm', 'owner_portal', 'print_formats'].includes(activeTab);
  const isGuestRestrictedTab = (!isAuthenticated || currentUser.role === 'guest') && ['admin_dashboard', 'agent_crm', 'owner_portal', 'tenant_portal', 'calendar', 'messages', 'print_formats'].includes(activeTab);
  const isTechnicianRestrictedTab = currentUser.role === 'technician' && ['admin_dashboard', 'agent_crm', 'owner_portal', 'tenant_portal', 'print_formats'].includes(activeTab);

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAF7] text-[#1E2E28]">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#2D4539] text-white px-4 py-3 rounded-2xl shadow-xl border border-white/20 flex items-center gap-2.5 text-xs animate-in slide-in-from-bottom-3">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAuth={handleOpenAuth}
      />

      {/* Main View Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        
        {/* Guest Panel */}
        {activeTab === 'guest_panel' && (
          <GuestPanel
            onOpenAuth={handleOpenAuth}
            onBrowseCatalog={() => setActiveTab('catalog')}
          />
        )}

        {/* Protection: When an unauthenticated visitor tries to access protected portals */}
        {isGuestRestrictedTab && (
          <GuestPanel
            onOpenAuth={handleOpenAuth}
            onBrowseCatalog={() => setActiveTab('catalog')}
          />
        )}

        {/* Protection: When a tenant tries to access admin/commercial management */}
        {isTenantRestrictedTab && (
          <div className="bg-white rounded-3xl border border-[#D5E1D4] p-8 text-center max-w-lg mx-auto space-y-4 shadow-sm my-8 animate-in fade-in">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-800 mx-auto flex items-center justify-center border border-amber-200">
              <ShieldCheck className="w-8 h-8 text-amber-600" />
            </div>
            <h3 className="font-serif-brand text-2xl font-bold text-gray-900">
              Módulo Administrativo Restringido
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Como inquilino, no tienes permisos para acceder a las áreas de administración general o gestión inmobiliaria comercial. Tu cuenta cuenta con acceso exclusivo a tus citas, mensajes y contrato.
            </p>
            <div className="pt-2 flex justify-center gap-3">
              <button
                onClick={() => setActiveTab('tenant_portal')}
                className="px-5 py-2.5 bg-[#2D4539] hover:bg-[#20342A] text-white rounded-xl text-xs font-semibold shadow-2xs"
              >
                Ir a Mi Portal Inquilino
              </button>
              <button
                onClick={() => setActiveTab('calendar')}
                className="px-5 py-2.5 border border-[#CBD8CA] hover:bg-gray-50 text-gray-800 rounded-xl text-xs font-semibold"
              >
                Ver Mis Citas
              </button>
            </div>
          </div>
        )}

        {/* Protection: When a technician tries to access administrative commercial modules */}
        {isTechnicianRestrictedTab && (
          <div className="bg-white rounded-3xl border border-indigo-200 p-8 text-center max-w-lg mx-auto space-y-4 shadow-sm my-8 animate-in fade-in">
            <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-800 mx-auto flex items-center justify-center border border-indigo-200">
              <ShieldCheck className="w-8 h-8 text-indigo-600" />
            </div>
            <h3 className="font-serif-brand text-2xl font-bold text-gray-900">
              Área Comercial Administrativa Restringida
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Como <strong>Técnico de Sistemas & Mantenimiento</strong>, tu perfil gestiona los tickets de reparación, el inventario de insumos de bodega y la infraestructura SQL. Las funciones comerciales administrativas (contratos de compraventa, nómina y comisiones) corresponden a la administración.
            </p>
            <div className="pt-2 flex justify-center gap-3">
              <button
                onClick={() => setActiveTab('maintenance_dashboard')}
                className="px-5 py-2.5 bg-[#2D4539] hover:bg-[#20342A] text-white rounded-xl text-xs font-semibold shadow-2xs"
              >
                Ir a Mantenimiento & Técnico
              </button>
              <button
                onClick={() => setActiveTab('catalog')}
                className="px-5 py-2.5 border border-[#CBD8CA] hover:bg-gray-50 text-gray-800 rounded-xl text-xs font-semibold"
              >
                Ver Catálogo
              </button>
            </div>
          </div>
        )}

        {/* Catalog */}
        {activeTab === 'catalog' && (
          <PropertyCatalog
            onSelectProperty={(prop) => setSelectedProperty(prop)}
            onBookVisit={(prop) => setVisitingProperty(prop)}
          />
        )}

        {/* Tenant Portal */}
        {activeTab === 'tenant_portal' && !isGuestRestrictedTab && (
          <TenantPortal
            onBrowseCatalog={() => setActiveTab('catalog')}
          />
        )}

        {/* Owner Portal */}
        {activeTab === 'owner_portal' && !isGuestRestrictedTab && !isTenantRestrictedTab && (
          <OwnerPortal />
        )}

        {/* Agent CRM */}
        {activeTab === 'agent_crm' && !isGuestRestrictedTab && !isTenantRestrictedTab && (
          <AgentCRM />
        )}

        {/* Admin Dashboard */}
        {activeTab === 'admin_dashboard' && !isGuestRestrictedTab && !isTenantRestrictedTab && (
          <AdminDashboard />
        )}

        {/* Maintenance Dashboard (Technician) */}
        {activeTab === 'maintenance_dashboard' && !isGuestRestrictedTab && !isTenantRestrictedTab && (
          <MaintenanceDashboard />
        )}

        {/* Calendar */}
        {activeTab === 'calendar' && (
          <WorkCalendarView />
        )}

        {/* Messages */}
        {activeTab === 'messages' && (
          <MessagesInbox />
        )}

        {/* Print Formats (Only Admin) */}
        {activeTab === 'print_formats' && currentUser.role === 'admin' && (
          <PrintFormatsView />
        )}

        {/* Error 404 */}
        {activeTab === '404' && (
          <NotFoundView
            onGoHome={() => setActiveTab('catalog')}
            onGoCatalog={() => setActiveTab('catalog')}
            onOpenManual={() => setIsManualOpen(true)}
          />
        )}

        {/* Error 500 (Servidor / Falla del Sistema) */}
        {activeTab === '500' && (
          <ServerErrorView
            errorCode={500}
            errorMessage="Simulación o interrupción del servidor de base de datos local."
            onRetry={() => window.location.reload()}
            onGoHome={() => setActiveTab('catalog')}
            onResetData={() => {
              try {
                localStorage.clear();
                window.location.reload();
              } catch {
                window.location.reload();
              }
            }}
          />
        )}
      </main>

      {/* Footer */}
      <Footer
        onOpenPrivacyPolicy={() => setPrivacyModalOpen(true)}
        onOpenTerms={() => setTermsModalOpen(true)}
        onOpenManual={() => setIsManualOpen(true)}
        onStartTour={startTour}
        onOpenDatabaseExport={() => setIsDatabaseModalOpen(true)}
        onTest404={() => setActiveTab('404')}
        onTest500={() => setActiveTab('500')}
      />

      {/* Modals */}
      <PropertyDetailModal
        property={selectedProperty}
        onClose={() => setSelectedProperty(null)}
        onBookVisit={(prop) => setVisitingProperty(prop)}
      />

      <BookVisitModal
        property={visitingProperty}
        isOpen={Boolean(visitingProperty)}
        onClose={() => setVisitingProperty(null)}
      />

      {/* Property Comparison Modal (Accessible globally from Navbar and Catalog) */}
      <PropertyComparisonModal
        isOpen={isComparingModalOpen}
        onClose={() => setIsComparingModalOpen(false)}
        onSelectProperty={(prop) => setSelectedProperty(prop)}
        onBookVisit={(prop) => setVisitingProperty(prop)}
      />

      <PrintableModal />

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode={authMode}
        presetEmail={presetEmail}
        presetPassword={presetPass}
        onLoginSuccess={handleLoginSuccess}
      />

      <PrivacyPolicyModal
        isOpen={privacyModalOpen}
        onClose={() => setPrivacyModalOpen(false)}
      />

      <TermsConditionsModal
        isOpen={termsModalOpen}
        onClose={() => setTermsModalOpen(false)}
      />

      <ApiDocsModal
        isOpen={apiDocsModalOpen}
        onClose={() => setApiDocsModalOpen(false)}
      />

      {/* Onboarding Tour Modal */}
      <GuidedTourModal
        isOpen={isTourOpen}
        onClose={() => setIsTourOpen(false)}
        onOpenManual={() => setIsManualOpen(true)}
      />

      {/* Interactive User Manual Modal */}
      <UserManualModal
        isOpen={isManualOpen}
        onClose={() => setIsManualOpen(false)}
        onStartTour={startTour}
        onOpenDatabaseExport={() => setIsDatabaseModalOpen(true)}
      />

      {/* Complete Database SQL Exporter Modal */}
      <DatabaseExportModal
        isOpen={isDatabaseModalOpen}
        onClose={() => setIsDatabaseModalOpen(false)}
      />

      {/* Welcome Onboarding Banner for New Users */}
      <WelcomeOnboardingBanner
        onStartTour={startTour}
        onOpenManual={() => setIsManualOpen(true)}
      />

      {/* Cookies & Google Analytics Consent Banner */}
      <CookieBanner
        onOpenPrivacyPolicy={() => setPrivacyModalOpen(true)}
      />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
}
