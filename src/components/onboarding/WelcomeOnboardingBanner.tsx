import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Sparkles, BookOpen, X, ArrowRight, ShieldCheck, Check } from 'lucide-react';

interface WelcomeOnboardingBannerProps {
  onStartTour: () => void;
  onOpenManual: () => void;
}

export const WelcomeOnboardingBanner: React.FC<WelcomeOnboardingBannerProps> = ({
  onStartTour,
  onOpenManual
}) => {
  const { currentUser, isAuthenticated } = useApp();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || !currentUser || currentUser.role === 'guest') {
      setIsVisible(false);
      return;
    }

    const tourKey = `terranova_tour_dismissed_${currentUser.id}`;
    const tourCompletedKey = `terranova_tour_${currentUser.id}`;
    const isDismissed = localStorage.getItem(tourKey) === 'true';
    const isCompleted = localStorage.getItem(tourCompletedKey) === 'completed';

    // Show if user is newly registered, or marked as first login, or hasn't dismissed/completed
    if (currentUser.isNewUser || (!isDismissed && !isCompleted)) {
      // Small timeout for smooth appearance
      const timer = setTimeout(() => setIsVisible(true), 1200);
      return () => clearTimeout(timer);
    }
  }, [currentUser, isAuthenticated]);

  if (!isVisible || !currentUser) return null;

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem(`terranova_tour_dismissed_${currentUser.id}`, 'true');
  };

  const handleTourClick = () => {
    handleDismiss();
    onStartTour();
  };

  const handleManualClick = () => {
    handleDismiss();
    onOpenManual();
  };

  return (
    <div className="fixed bottom-6 left-6 right-6 sm:left-auto sm:right-6 sm:max-w-md z-50 bg-[#1E3228] text-white p-5 rounded-3xl shadow-2xl border border-white/20 animate-in slide-in-from-bottom-5 duration-300">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-[#2D4539] flex items-center justify-center border border-white/10 shrink-0 shadow-xs">
            <Sparkles className="w-5 h-5 text-[#A3C7AD]" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#A3C7AD] block leading-none">
              Primer Ingreso Detectado
            </span>
            <h4 className="font-serif-brand font-bold text-sm text-white mt-0.5">
              ¡Bienvenido/a, {currentUser.name.split(' ')[0]}!
            </h4>
          </div>
        </div>

        <button
          onClick={handleDismiss}
          className="text-white/60 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
          title="Omitir aviso"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <p className="text-xs text-white/80 leading-relaxed mt-3">
        Detectamos que tu cuenta es nueva. Preparamos un recorrido rápido de 1 minuto y tu manual de uso adaptado exclusivamente a tu perfil ({
          currentUser.role === 'admin' ? 'Administrador' :
          currentUser.role === 'agent' ? 'Asesor Inmobiliario' :
          currentUser.role === 'tenant' ? 'Inquilino' :
          currentUser.role === 'owner' ? 'Propietario' :
          currentUser.role === 'technician' ? 'Técnico de Sistemas' :
          currentUser.role === 'contractor' ? 'Contratista' : 'Cliente'
        }).
      </p>

      <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between gap-2">
        <button
          onClick={handleManualClick}
          className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
        >
          <BookOpen className="w-3.5 h-3.5 text-[#A3C7AD]" />
          <span>Manual de Uso</span>
        </button>

        <button
          onClick={handleTourClick}
          className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
        >
          <span>Hacer Tour de la Página</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
