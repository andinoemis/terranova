import React from 'react';
import { X, Shield, Lock, Eye, FileText, CheckCircle2 } from 'lucide-react';

interface PrivacyPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrivacyPolicyModal: React.FC<PrivacyPolicyModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white border border-[#CDD8CB] rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-6 bg-[#263E32] text-white rounded-t-3xl flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/10 rounded-xl">
              <Shield className="w-6 h-6 text-[#A3C7AD]" />
            </div>
            <div>
              <h2 className="font-serif-brand text-2xl font-bold">Política de Privacidad y Protección de Datos</h2>
              <p className="text-xs text-white/75">Última actualización: Octubre 2024 · Cumplimiento GDPR y Normativa Nacional</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/20 text-white/80 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8 space-y-6 text-xs text-gray-700 leading-relaxed">
          <div className="p-4 bg-[#F5F8F4] rounded-2xl border border-[#D5E2D3] flex items-center gap-3">
            <Lock className="w-5 h-5 text-[#2D4539] shrink-0" />
            <p>
              En <strong>TERRANOVA Bienes Raíces S.A.</strong> protegemos la confidencialidad de propietarios, inquilinos y visitantes. No vendemos ni compartimos sus datos personales con terceros para fines comerciales sin su consentimiento expreso.
            </p>
          </div>

          <section className="space-y-2">
            <h3 className="font-bold text-sm text-[#1E3228] flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-[#2D4539] text-white flex items-center justify-center text-[10px]">1</span>
              Información que Recopilamos
            </h3>
            <p>
              Recopilamos únicamente los datos necesarios para brindar servicios inmobiliarios de alta confianza:
            </p>
            <ul className="list-disc list-inside space-y-1 pl-2 text-gray-600">
              <li><strong>Datos de contacto e identidad:</strong> Nombre completo, número de teléfono, correo electrónico y documento de identidad (para redacción de contratos de arrendamiento).</li>
              <li><strong>Datos de transacciones y facturación:</strong> Montos de renta pagados, método seleccionado, números de referencia bancaria y comprobantes fiscales (los datos sensibles de tarjetas de crédito son procesados directamente por la pasarela de pago certificada PCI-DSS y nunca se guardan en texto plano en nuestros servidores).</li>
              <li><strong>Preferencias de búsqueda y visitas:</strong> Propiedades agendadas, fechas de interés y características buscadas.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h3 className="font-bold text-sm text-[#1E3228] flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-[#2D4539] text-white flex items-center justify-center text-[10px]">2</span>
              Finalidad del Tratamiento de Datos
            </h3>
            <p>
              Sus datos personales son utilizados estrictamente para:
            </p>
            <ul className="list-disc list-inside space-y-1 pl-2 text-gray-600">
              <li>Formalización y emisión de contratos privados de arrendamiento y compraventa con firma digital.</li>
              <li>Generación de recibos fiscales y conciliación de cobros de renta.</li>
              <li>Asignación de órdenes de mantenimiento residencial a contratistas autorizados.</li>
              <li>Coordinación de citas presenciales y virtuales con asesores inmobiliarios certificados.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h3 className="font-bold text-sm text-[#1E3228] flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-[#2D4539] text-white flex items-center justify-center text-[10px]">3</span>
              Seguridad y Encriptación (HTTPS & TLS 1.3)
            </h3>
            <p>
              Toda la comunicación entre su navegador y nuestra plataforma viaja encriptada mediante protocolos forzados <strong>HTTPS (TLS 1.3)</strong>. Aplicamos políticas estrictas de control de acceso basadas en roles (RBAC) y encabezados de seguridad modernos (Content-Security-Policy, HSTS, X-Content-Type-Options).
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="font-bold text-sm text-[#1E3228] flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-[#2D4539] text-white flex items-center justify-center text-[10px]">4</span>
              Derechos ARCO (Acceso, Rectificación, Cancelación y Oposición)
            </h3>
            <p>
              Usted tiene el derecho inalienable de solicitar en cualquier momento una copia de sus datos personales, la corrección de errores o la baja definitiva de su cuenta dirigiéndose a nuestro Delegado de Protección de Datos a través del correo: <strong className="text-[#2D4539]">privacidad@terranova.hn</strong>.
            </p>
          </section>
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#FAFBF9] border-t border-gray-100 flex justify-end rounded-b-3xl">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-[#2D4539] hover:bg-[#20342A] text-white rounded-xl font-semibold text-xs transition-colors"
          >
            Entendido y Aceptar
          </button>
        </div>
      </div>
    </div>
  );
};
