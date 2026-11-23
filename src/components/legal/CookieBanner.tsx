import React, { useState, useEffect } from 'react';
import { Shield, Cookie, X, Check, Settings, Eye } from 'lucide-react';

interface CookieBannerProps {
  onOpenPrivacyPolicy: () => void;
}

export const CookieBanner: React.FC<CookieBannerProps> = ({ onOpenPrivacyPolicy }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [analyticsEnabled, setAnalyticsEnabled] = useState(true);
  const [marketingEnabled, setMarketingEnabled] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('terranova_cookie_consent');
    if (!consent) {
      // Delay slightly for better UX
      const timer = setTimeout(() => setIsOpen(true), 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAcceptAll = () => {
    localStorage.setItem('terranova_cookie_consent', JSON.stringify({
      necessary: true,
      analytics: true,
      marketing: true,
      date: new Date().toISOString()
    }));
    setIsOpen(false);
  };

  const handleSavePreferences = () => {
    localStorage.setItem('terranova_cookie_consent', JSON.stringify({
      necessary: true,
      analytics: analyticsEnabled,
      marketing: marketingEnabled,
      date: new Date().toISOString()
    }));
    setIsOpen(false);
  };

  const handleRejectNonEssential = () => {
    localStorage.setItem('terranova_cookie_consent', JSON.stringify({
      necessary: true,
      analytics: false,
      marketing: false,
      date: new Date().toISOString()
    }));
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-8 md:max-w-xl z-50 animate-in slide-in-from-bottom-5">
      <div className="bg-[#1E3228] text-white p-5 rounded-2xl shadow-2xl border border-[#3A5647] text-xs space-y-4">
        {/* Banner Top */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-[#2D4539] text-[#A3C7AD] rounded-xl shrink-0">
              <Cookie className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-white font-serif-brand">
                Privacidad & Uso de Cookies en Terranova
              </h4>
              <p className="text-[11px] text-white/70">
                Respetamos tu privacidad y cumplimos con las normativas internacionales de protección de datos (GDPR / Google Consent Mode v2).
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="text-white/50 hover:text-white p-1 rounded-lg"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Detailed Preferences View */}
        {showPreferences ? (
          <div className="space-y-3 bg-[#17271F] p-3.5 rounded-xl border border-white/10 text-[11px]">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-white">Cookies Estrictamente Necesarias</p>
                <p className="text-white/60">Sesión de usuario, seguridad HTTPS y funcionamiento básico.</p>
              </div>
              <span className="text-[10px] font-bold bg-white/20 px-2 py-0.5 rounded text-white/90">
                Obligatorias
              </span>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-white/10">
              <div>
                <p className="font-semibold text-white">Analíticas y Rendimiento (Google Analytics GA4)</p>
                <p className="text-white/60">Métricas agregadas anónimas sobre velocidad y uso de filtros.</p>
              </div>
              <input
                type="checkbox"
                checked={analyticsEnabled}
                onChange={(e) => setAnalyticsEnabled(e.target.checked)}
                className="w-4 h-4 accent-[#C36449] rounded cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-white/10">
              <div>
                <p className="font-semibold text-white">Publicidad y Personalización</p>
                <p className="text-white/60">Recomendaciones de propiedades acordes a tu presupuesto.</p>
              </div>
              <input
                type="checkbox"
                checked={marketingEnabled}
                onChange={(e) => setMarketingEnabled(e.target.checked)}
                className="w-4 h-4 accent-[#C36449] rounded cursor-pointer"
              />
            </div>
          </div>
        ) : (
          <p className="text-[11px] text-white/80 leading-relaxed">
            Utilizamos cookies técnicas para garantizar la seguridad de tus transacciones y cookies analíticas para mejorar tu experiencia inmobiliaria. Puedes consultar nuestra{' '}
            <button
              onClick={onOpenPrivacyPolicy}
              className="text-[#A3C7AD] underline hover:text-white font-medium"
            >
              Política de Privacidad
            </button>{' '}
            para más detalles.
          </p>
        )}

        {/* Actions */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-white/10">
          <button
            onClick={() => setShowPreferences(!showPreferences)}
            className="text-[11px] text-white/70 hover:text-white flex items-center gap-1 font-medium underline"
          >
            <Settings className="w-3.5 h-3.5" />
            <span>{showPreferences ? 'Ocultar opciones' : 'Personalizar cookies'}</span>
          </button>

          <div className="flex items-center gap-2">
            {showPreferences ? (
              <button
                onClick={handleSavePreferences}
                className="px-3.5 py-1.5 rounded-xl bg-white/20 hover:bg-white/30 text-white font-semibold text-xs transition-colors"
              >
                Guardar selección
              </button>
            ) : (
              <button
                onClick={handleRejectNonEssential}
                className="px-3 py-1.5 rounded-xl text-white/70 hover:text-white hover:bg-white/10 font-semibold text-xs transition-colors"
              >
                Solo necesarias
              </button>
            )}

            <button
              onClick={handleAcceptAll}
              className="px-4 py-1.5 rounded-xl bg-[#C36449] hover:bg-[#B1573D] text-white font-semibold text-xs shadow-xs transition-colors"
            >
              Aceptar todas
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
