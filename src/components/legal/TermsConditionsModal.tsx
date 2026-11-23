import React from 'react';
import { X, FileText, CheckCircle2, AlertCircle, Scale } from 'lucide-react';

interface TermsConditionsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TermsConditionsModal: React.FC<TermsConditionsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white border border-[#CDD8CB] rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-6 bg-[#263E32] text-white rounded-t-3xl flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/10 rounded-xl">
              <Scale className="w-6 h-6 text-[#A3C7AD]" />
            </div>
            <div>
              <h2 className="font-serif-brand text-2xl font-bold">Términos y Condiciones de Uso</h2>
              <p className="text-xs text-white/75">Reglamento Operativo de la Plataforma Inmobiliaria TERRANOVA</p>
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
          <section className="space-y-2">
            <h3 className="font-bold text-sm text-[#1E3228]">1. Aceptación de los Términos</h3>
            <p>
              Al acceder, navegar o utilizar la plataforma <strong>TERRANOVA</strong>, el usuario acepta de forma plena e incondicional los presentes Términos y Condiciones. Si no está de acuerdo con alguno de los apartados, le rogamos abstenerse de utilizar el servicio.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="font-bold text-sm text-[#1E3228]">2. Publicación de Propiedades y Exactitud</h3>
            <p>
              Toda propiedad listada en el catálogo (Casas, Apartamentos, Terrenos, Villas, Locales) debe contar con documentación legítima acreditada ante el Registro de la Propiedad Inmueble y la Municipalidad correspondiente. TERRANOVA realiza una verificación previa de los títulos de dominio antes de publicar cualquier inmueble en estado "Disponible".
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="font-bold text-sm text-[#1E3228]">3. Validez Legal de Contratos de Arrendamiento Digitales</h3>
            <p>
              Los contratos generados a través del módulo automatizado de Terranova se rigen por la legislación civil y mercantil aplicable en Honduras. Las firmas electrónicas estampadas por el arrendador y el arrendatario poseen pleno valor probatorio y obligatoriedad contractual según la Ley sobre Mensajes de Datos y Firmas Electrónicas.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="font-bold text-sm text-[#1E3228]">4. Obligaciones de Pago y Políticas de Arrendamiento</h3>
            <p>
              Los pagos de renta procesados a través de la pasarela online se registran de forma inmediata con su respectivo código de transacción bancario. Los inquilinos disponen de un plazo de 5 días hábiles a partir de la fecha de corte mensual para efectuar su pago sin recargos por mora.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="font-bold text-sm text-[#1E3228]">5. Mantenimientos y Reparaciones</h3>
            <p>
              Las solicitudes de mantenimiento correctivo por desperfectos estructurales o vicios ocultos corresponden al propietario del inmueble. El inquilino es responsable por el mantenimiento locativo derivado del uso ordinario y debe permitir el ingreso de los técnicos y contratistas autorizados para solventar emergencias debidamente notificadas.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="font-bold text-sm text-[#1E3228]">6. Jurisdicción y Resolución de Conflictos</h3>
            <p>
              Cualquier controversia derivada de la interpretación o ejecución de los servicios de esta plataforma será sometida a los tribunales competentes de la ciudad de Tegucigalpa, Municipio del Distrito Central, Honduras.
            </p>
          </section>
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#FAFBF9] border-t border-gray-100 flex justify-end rounded-b-3xl">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-[#2D4539] hover:bg-[#20342A] text-white rounded-xl font-semibold text-xs transition-colors"
          >
            Aceptar Términos de Servicio
          </button>
        </div>
      </div>
    </div>
  );
};
