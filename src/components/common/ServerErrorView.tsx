import React, { useState } from 'react';
import { 
  AlertTriangle, 
  RefreshCw, 
  Home, 
  Database, 
  Copy, 
  Check, 
  Terminal, 
  ShieldAlert, 
  Phone, 
  Mail,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface ServerErrorViewProps {
  errorCode?: 500 | 502 | 503 | 504;
  errorMessage?: string;
  errorStack?: string;
  onRetry?: () => void;
  onGoHome?: () => void;
  onResetData?: () => void;
}

export const ServerErrorView: React.FC<ServerErrorViewProps> = ({
  errorCode = 500,
  errorMessage = 'Error interno inesperado en el procesamiento de datos del sistema.',
  errorStack,
  onRetry,
  onGoHome,
  onResetData
}) => {
  const [showTechnicalDetails, setShowTechnicalDetails] = useState(false);
  const [copied, setCopied] = useState(false);

  const errorTitle = errorCode === 503 
    ? 'Servicio Temporalmente Fuera de Servicio' 
    : 'Error Interno del Servidor';

  const errorSubtitle = errorCode === 503
    ? 'El servidor se encuentra en mantenimiento o los recursos de datos locales están sobrecargados.'
    : 'Se ha producido una excepción imprevista durante la ejecución o lectura del estado de la plataforma.';

  const handleCopyDiagnostics = () => {
    const diagnosticText = `--- REPORTE DE ERROR TERRANOVA INMOBILIARIA ---
Código: ${errorCode}
Fecha: ${new Date().toISOString()}
Mensaje: ${errorMessage}
Navegador: ${navigator.userAgent}
URL: ${window.location.href}
Stack:
${errorStack || 'No stack trace provided'}
------------------------------------------------`;

    navigator.clipboard.writeText(diagnosticText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleReload = () => {
    if (onRetry) {
      onRetry();
    } else {
      window.location.reload();
    }
  };

  return (
    <div className="min-h-[75vh] flex flex-col items-center justify-center text-center p-6 sm:p-12 animate-in fade-in max-w-3xl mx-auto">
      {/* Icon Badge */}
      <div className="relative mb-6">
        <div className="w-24 h-24 rounded-3xl bg-rose-50 text-rose-700 flex items-center justify-center shadow-lg border-2 border-rose-200">
          <ShieldAlert className="w-12 h-12 text-rose-600 animate-pulse" />
        </div>
        <span className="absolute -bottom-2 -right-2 px-2.5 py-0.5 rounded-full bg-rose-700 text-white font-mono font-bold text-xs shadow-md">
          {errorCode}
        </span>
      </div>

      <span className="font-mono text-xs font-bold text-rose-700 uppercase tracking-widest mb-1.5 bg-rose-100 px-3 py-1 rounded-full border border-rose-200">
        Error {errorCode} · {errorTitle}
      </span>

      <h1 className="font-serif-brand text-3xl sm:text-4xl font-bold text-gray-900 leading-tight mb-3">
        Ha ocurrido una interrupción inesperada en el sistema
      </h1>

      <p className="text-sm text-gray-600 max-w-xl leading-relaxed mb-6">
        {errorSubtitle} Los datos previamente guardados en tu sesión se encuentran protegidos. Puedes reintentar la operación o restablecer la caché del sistema.
      </p>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
        <button
          onClick={handleReload}
          className="px-6 py-3 bg-[#2D4539] hover:bg-[#20342A] text-white font-semibold text-xs sm:text-sm rounded-xl flex items-center gap-2 shadow-md transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Reintentar y Recargar</span>
        </button>

        {onGoHome && (
          <button
            onClick={onGoHome}
            className="px-6 py-3 border border-[#CAD6C8] hover:bg-[#EEF5ED] text-gray-800 font-semibold text-xs sm:text-sm rounded-xl flex items-center gap-2 transition-colors"
          >
            <Home className="w-4 h-4" />
            <span>Volver al Catálogo Seguro</span>
          </button>
        )}

        {onResetData && (
          <button
            onClick={onResetData}
            className="px-5 py-3 border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-900 font-semibold text-xs sm:text-sm rounded-xl flex items-center gap-2 transition-colors"
            title="Restaura los datos iniciales y limpia cualquier caché local inconsistente"
          >
            <Database className="w-4 h-4 text-amber-700" />
            <span>Limpiar Caché y Restablecer</span>
          </button>
        )}
      </div>

      {/* Collapsible Technical Diagnostics */}
      <div className="w-full bg-[#FAFBF9] border border-gray-200 rounded-2xl p-4 text-left shadow-2xs mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-gray-700">
            <Terminal className="w-4 h-4 text-gray-500" />
            <span>Diagnóstico Técnico para Desarrolladores & Administradores</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyDiagnostics}
              className="text-xs px-2.5 py-1 rounded-lg border border-gray-300 hover:bg-white text-gray-700 flex items-center gap-1 transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700 font-bold">Copiado</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-gray-500" />
                  <span>Copiar Reporte</span>
                </>
              )}
            </button>

            <button
              onClick={() => setShowTechnicalDetails(!showTechnicalDetails)}
              className="text-gray-500 hover:text-gray-700 p-1"
            >
              {showTechnicalDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {showTechnicalDetails && (
          <div className="mt-3 pt-3 border-t border-gray-200 font-mono text-[11px] space-y-2 text-gray-800">
            <p><strong>Mensaje:</strong> {errorMessage}</p>
            {errorStack && (
              <div>
                <strong>Pila de Ejecución (Stack Trace):</strong>
                <pre className="mt-1 p-3 bg-gray-900 text-emerald-400 rounded-xl overflow-x-auto text-[10px] leading-relaxed max-h-48">
                  {errorStack}
                </pre>
              </div>
            )}
            <p className="text-[10px] text-gray-500">
              Ambiente: Vite + React SPA · Local Storage Sync Activo · Protocolo: HTTPS
            </p>
          </div>
        )}
      </div>

      {/* Support footer */}
      <div className="pt-4 border-t border-gray-200 w-full flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-2">
        <div className="flex items-center gap-1.5">
          <Phone className="w-3.5 h-3.5 text-[#2D4539]" />
          <span>Soporte Técnico Inmediato: <strong>+504 2235-8000</strong></span>
        </div>
        <div className="flex items-center gap-1.5">
          <Mail className="w-3.5 h-3.5 text-[#2D4539]" />
          <span>Reportes: <strong>soporte@terranova.hn</strong></span>
        </div>
      </div>
    </div>
  );
};
