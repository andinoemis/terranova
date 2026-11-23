import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Building2, 
  Phone, 
  Mail, 
  Clock, 
  ShieldCheck, 
  FileText, 
  BookOpen, 
  Sparkles, 
  Database, 
  AlertTriangle,
  HelpCircle,
  Terminal
} from 'lucide-react';

interface FooterProps {
  onOpenPrivacyPolicy: () => void;
  onOpenTerms: () => void;
  onOpenManual?: () => void;
  onStartTour?: () => void;
  onOpenDatabaseExport?: () => void;
  onTest404?: () => void;
  onTest500?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ 
  onOpenPrivacyPolicy,
  onOpenTerms,
  onOpenManual,
  onStartTour,
  onOpenDatabaseExport,
  onTest404,
  onTest500
}) => {
  const { companySettings, currentUser } = useApp();

  return (
    <footer className="no-print bg-[#1E3228] text-white border-t border-[#314E40] mt-16 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* 1. Datos de la Empresa */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#2D4539] text-[#E3ECE3] flex items-center justify-center border border-white/20">
                <Building2 className="w-5 h-5 text-[#A3C7AD]" />
              </div>
              <div>
                <span className="font-serif-brand text-xl font-bold tracking-widest text-white uppercase block leading-none">
                  {companySettings.companyName.split(' ')[0]}
                </span>
                <span className="text-[9px] uppercase tracking-[0.2em] text-[#86AB93] font-semibold">
                  {companySettings.slogan}
                </span>
              </div>
            </div>

            <p className="text-xs text-white/70 leading-relaxed">
              {companySettings.companyName}
            </p>
            <p className="text-xs text-white/60">
              <strong>Dirección Principal:</strong> {companySettings.address}
            </p>
          </div>

          {/* 2. Atención al Cliente */}
          <div className="space-y-3 text-xs">
            <h4 className="font-bold text-white uppercase tracking-wider text-xs border-b border-white/10 pb-2 flex items-center gap-2">
              <Phone className="w-4 h-4 text-[#A3C7AD]" />
              <span>Atención al Cliente</span>
            </h4>
            
            <div className="space-y-2 text-white/75">
              <p className="flex items-center gap-2">
                <span className="text-white/50">PBX Oficial:</span>
                <a href={`tel:${companySettings.phone.replace(/[^0-9+]/g, '')}`} className="font-bold text-white hover:text-[#A3C7AD] transition-colors underline">
                  {companySettings.phone}
                </a>
              </p>

              {companySettings.whatsapp && (
                <p className="flex items-center gap-2">
                  <span className="text-white/50">WhatsApp:</span>
                  <a href={`https://wa.me/${companySettings.whatsapp.replace(/[^0-9]/g, '')}`} target="_blank" rel="noreferrer" className="text-emerald-300 font-semibold hover:underline">
                    {companySettings.whatsapp}
                  </a>
                </p>
              )}

              <p className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#A3C7AD]" />
                <a href={`mailto:${companySettings.email}`} className="text-[#A3C7AD] hover:underline font-medium">
                  {companySettings.email}
                </a>
              </p>

              <div className="pt-1 flex items-start gap-2 text-[11px] text-white/60">
                <Clock className="w-3.5 h-3.5 text-[#A3C7AD] shrink-0 mt-0.5" />
                <span>Horario: {companySettings.customerServiceHours}</span>
              </div>
            </div>
          </div>

          {/* 3. Políticas y Términos */}
          <div className="space-y-3 text-xs text-white/75">
            <h4 className="font-bold text-white uppercase tracking-wider text-xs border-b border-white/10 pb-2 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#A3C7AD]" />
              <span>Políticas & Términos</span>
            </h4>

            <p className="text-[11px] text-white/60 leading-relaxed">
              Normativa legal aplicable a contratos y protección de datos corporativos.
            </p>

            <div className="space-y-2 pt-1">
              <button
                onClick={onOpenPrivacyPolicy}
                className="w-full text-left py-2 px-3 rounded-xl bg-white/5 hover:bg-white/10 text-white/90 hover:text-white transition-colors flex items-center justify-between border border-white/10"
              >
                <span>Políticas de Privacidad</span>
                <FileText className="w-3.5 h-3.5 text-[#A3C7AD]" />
              </button>

              <button
                onClick={onOpenTerms}
                className="w-full text-left py-2 px-3 rounded-xl bg-white/5 hover:bg-white/10 text-white/90 hover:text-white transition-colors flex items-center justify-between border border-white/10"
              >
                <span>Términos y Condiciones</span>
                <FileText className="w-3.5 h-3.5 text-[#A3C7AD]" />
              </button>
            </div>
          </div>
        </div>

        {/* Barra inferior */}
        <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center text-xs text-white/50 gap-3">
          <p>© {new Date().getFullYear()} {companySettings.companyName}. Todos los derechos reservados.</p>
          <p className="font-serif-brand tracking-widest text-[#B4DAC0]">{companySettings.slogan}</p>
        </div>
      </div>
    </footer>
  );
};
