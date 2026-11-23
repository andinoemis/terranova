import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  ArrowRight, 
  ArrowLeft, 
  Sparkles, 
  Building2, 
  FileText, 
  CreditCard, 
  CheckCircle2, 
  HelpCircle, 
  BookOpen, 
  ShieldCheck, 
  UploadCloud, 
  Coins, 
  Database,
  Compass
} from 'lucide-react';

interface GuidedTourModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenManual?: () => void;
}

export const GuidedTourModal: React.FC<GuidedTourModalProps> = ({ 
  isOpen, 
  onClose,
  onOpenManual 
}) => {
  const { currentUser, companySettings, completeTour } = useApp();
  const [currentStep, setCurrentStep] = useState(0);

  if (!isOpen) return null;

  const tourSteps = [
    {
      step: 1,
      badge: 'Bienvenida & Perfil Activo',
      icon: Sparkles,
      iconBg: 'bg-emerald-100 text-emerald-800',
      title: `¡Bienvenido a ${companySettings.companyName}!`,
      subtitle: `Has ingresado con el perfil: ${currentUser.role.toUpperCase()} (${currentUser.name})`,
      content: (
        <div className="space-y-3 text-xs text-gray-600 leading-relaxed text-justify">
          <p>
            Terranova es una plataforma integral diseñada para la gestión, compraventa y arrendamiento seguro de bienes raíces en Honduras.
          </p>
          <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-emerald-950 space-y-1">
            <span className="font-bold text-[11px] block">Tu Rol y Capacidades en el Sistema:</span>
            <p className="text-[11px]">
              {currentUser.role === 'admin' && 'Como Administrador tienes control total sobre inventario, contratos, nómina de comisiones, plantillas oficiales, invalidaciones y configuración general.'}
              {currentUser.role === 'agent' && 'Como Asesor Inmobiliario dispones de tu CRM para gestionar prospectos, agendar citas, emitir contratos con cálculo de cuotas y subir documentos.pdf firmados.'}
              {currentUser.role === 'tenant' && 'Como Inquilino tienes acceso a tu portal privado para consultar tu contrato vigente, verificar cuentas bancarias circuladas, realizar pagos y reportar incidencias.'}
              {currentUser.role === 'owner' && 'Como Propietario puedes supervisar tus inmuebles y consultar confidencialmente la liquidación neta de tu ganancia (80% convenido).'}
              {currentUser.role === 'client' && 'Como Cliente puedes explorar libremente el catálogo, comparar inmuebles, solicitar visitas presenciales y postularte a compras o rentas.'}
              {currentUser.role === 'technician' && 'Como Técnico de Sistemas / DBA tienes acceso exclusivo a la Consola SQL para supervisar esquemas relacionales, exportar la base de datos local y mantener la seguridad.'}
              {currentUser.role === 'contractor' && 'Como Contratista de Mantenimiento recibes órdenes de servicio técnico, reportes de averías de inquilinos y facturación de mano de obra.'}
            </p>
          </div>
          <p className="text-[11px] text-gray-500">
            A continuación te mostraremos en 4 pasos rápidos las funciones clave para sacar el máximo provecho de la plataforma.
          </p>
        </div>
      )
    },
    {
      step: 2,
      badge: 'Catálogo & Conversión Multidivisa',
      icon: Compass,
      iconBg: 'bg-blue-100 text-blue-800',
      title: 'Exploración de Inmuebles & Tasas en Vivo',
      subtitle: 'Búsqueda por código catastral, comparador triple y precios en USD / Lempiras HNL',
      content: (
        <div className="space-y-3 text-xs text-gray-600 leading-relaxed text-justify">
          <p>
            En la barra superior encontrarás el <strong>Catálogo Inmobiliario</strong> con filtros avanzados por tipología (Casas, Terrenos, Apartamentos, Locales) y modalidad (Venta o Alquiler).
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
            <div className="p-2.5 bg-gray-50 rounded-xl border border-gray-200">
              <strong className="block text-gray-900 mb-0.5">💱 Conversor USD / HNL</strong>
              <span>Precios conmutables con tasa de cambio financiera en vivo del BCH o mercado para cumplir con la legislación monetaria de Honduras.</span>
            </div>
            <div className="p-2.5 bg-gray-50 rounded-xl border border-gray-200">
              <strong className="block text-gray-900 mb-0.5">⚖️ Comparador Triple</strong>
              <span>Selecciona hasta 3 propiedades para cotejar simultáneamente precios, áreas en m², dormitorios y amenidades.</span>
            </div>
          </div>
          <p className="text-[11px]">
            Cada propiedad cuenta con su <strong>Ficha Técnica</strong> detallada y botón para solicitar visitas agendadas con nuestros asesores.
          </p>
        </div>
      )
    },
    {
      step: 3,
      badge: 'Contratos & Financiamiento',
      icon: FileText,
      iconBg: 'bg-amber-100 text-amber-900',
      title: 'Contratos de Venta, Plazos & Arrendamiento',
      subtitle: 'Generación automatizada con cláusulas oficiales y traspaso a un solo dueño',
      content: (
        <div className="space-y-3 text-xs text-gray-600 leading-relaxed text-justify">
          <p>
            El generador de contratos admite 3 modalidades jurídicas estructuradas:
          </p>
          <ul className="space-y-1.5 list-disc pl-4 text-[11px] text-gray-700">
            <li><strong>Arrendamiento Residencial / Comercial:</strong> Canon mensual, depósito de garantía y fechas de vigencia.</li>
            <li><strong>Venta Directa:</strong> Traspaso definitivo e irrevocable de la titularidad registral al comprador único.</li>
            <li><strong>Venta a Plazos con Financiamiento:</strong> Cálculo automático de prima inicial, plazo en años y cuotas mensuales fijas con asignación transparente de comisiones.</li>
          </ul>
          <div className="p-2.5 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 text-[11px]">
            🔒 <strong>Regla de exclusividad de inmuebles:</strong> Un inquilino puede tener múltiples propiedades arrendadas, pero ningún inmueble puede tener dos contratos activos simultáneos.
          </div>
        </div>
      )
    },
    {
      step: 4,
      badge: 'Firmas & Resguardo de Documentos',
      icon: UploadCloud,
      iconBg: 'bg-indigo-100 text-indigo-900',
      title: 'Firma Digital & Subida de documentos.pdf',
      subtitle: 'Garantía de validez legal, canvas táctil y resguardo de escaneos oficiales',
      content: (
        <div className="space-y-3 text-xs text-gray-600 leading-relaxed text-justify">
          <p>
            Para garantizar que ningún documento carezca de validez jurídica, la plataforma cuenta con dos mecanismos de formalización:
          </p>
          <div className="space-y-2 text-[11px]">
            <div className="p-2.5 bg-white rounded-xl border border-indigo-200">
              <strong className="text-indigo-950 block">1. Firma Digital en Pantalla / Carga de Imagen:</strong>
              <span>Dibuja tu rúbrica directamente desde cualquier celular, tablet o computadora con estampado criptográfico fehaciente.</span>
            </div>
            <div className="p-2.5 bg-white rounded-xl border border-indigo-200">
              <strong className="text-indigo-950 block">2. Carga Oficial de documentos.pdf / Escaneo Físico:</strong>
              <span>Si el contrato se firma en papel, el asesor sube el archivo PDF o escaneo. Se resguarda con sello oficial y queda disponible para su descarga en cualquier momento.</span>
            </div>
          </div>
          <p className="text-[10px] text-gray-500">
            * Carga única: si requiere corregir un archivo subido, el asesor puede solicitar invalidación motivada al Administrador.
          </p>
        </div>
      )
    },
    {
      step: 5,
      badge: 'Pagos & Cuentas Circuladas',
      icon: CreditCard,
      iconBg: 'bg-emerald-100 text-emerald-900',
      title: 'Depósitos, Cuentas Oficiales & Recibos',
      subtitle: 'Cuentas bancarias circuladas para evitar fraudes y validación en tiempo real',
      content: (
        <div className="space-y-3 text-xs text-gray-600 leading-relaxed text-justify">
          <p>
            Todos los contratos y formatos de impresión destacan de forma destacada la <strong>Cuenta Bancaria Receptora Oficial Circulada</strong> de la empresa.
          </p>
          <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-300 text-emerald-950 text-[11px] space-y-1">
            <span className="font-bold block">✓ Emisión de Recibos y Validación:</span>
            <p>
              Los pagos registrados generan un comprobante con código único de referencia y número de recibo consecutivo. La administración valida los comprobantes antes de autorizar comisiones o finiquitos.
            </p>
          </div>
          <p className="text-[11px] text-gray-600">
            En el módulo de Nómina, las comisiones de asesores y el porcentaje del dueño del terreno se liquidan ordenadamente según la modalidad de pago pactada.
          </p>
        </div>
      )
    },
    {
      step: 6,
      badge: 'Manual de Uso & Soporte',
      icon: BookOpen,
      iconBg: 'bg-emerald-100 text-emerald-900',
      title: 'Manuales de Usuario & Centro de Soporte',
      subtitle: 'Documentación operativa completa, guías paso a paso por perfil y asistencia continua',
      content: (
        <div className="space-y-3 text-xs text-gray-600 leading-relaxed text-justify">
          <p>
            ¡Ya estás listo para utilizar el sistema! Recuerda que siempre tienes a tu disposición:
          </p>
          <div className="space-y-2 text-[11px]">
            <div className="p-3 bg-purple-50 rounded-2xl border border-purple-200 text-purple-950">
              <strong className="block mb-1 flex items-center gap-1.5 text-xs text-purple-900">
                <BookOpen className="w-4 h-4 text-purple-700" />
                Manuales de Usuario por Perfil
              </strong>
              <span>Guías detalladas para Administradores, Asesores, Inquilinos y Propietarios con buscador en vivo, preguntas frecuentes e impresión directa a formato PDF.</span>
            </div>
          </div>
          <p className="text-[11px] text-gray-500">
            Puedes volver a abrir este tour en cualquier momento desde el pie de página o el menú de usuario.
          </p>
        </div>
      )
    }
  ];

  const currentStepData = tourSteps[currentStep];
  const Icon = currentStepData.icon;
  const isLast = currentStep === tourSteps.length - 1;

  const handleNext = () => {
    if (isLast) {
      completeTour();
      onClose();
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSkip = () => {
    completeTour();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white border border-[#CBD8CA] rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header with step progress */}
        <div className="bg-[#2D4539] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center border border-white/20">
              <Icon className="w-4 h-4 text-[#A3C7AD]" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#A3C7AD] block leading-none">
                {currentStepData.badge}
              </span>
              <span className="font-serif-brand text-sm font-bold block mt-0.5">
                Tour Guiado · Paso {currentStep + 1} de {tourSteps.length}
              </span>
            </div>
          </div>
          <button 
            onClick={handleSkip} 
            className="text-white/70 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
            title="Cerrar tour"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-[#E5EDE4] h-1.5 flex">
          {tourSteps.map((_, i) => (
            <div
              key={i}
              className={`h-full flex-1 transition-all duration-300 ${
                i <= currentStep ? 'bg-[#2D4539]' : 'bg-transparent'
              }`}
            />
          ))}
        </div>

        {/* Step Body */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          <div>
            <h2 className="font-serif-brand text-xl font-bold text-gray-900 leading-snug">
              {currentStepData.title}
            </h2>
            <p className="text-xs text-gray-500 font-medium mt-0.5">
              {currentStepData.subtitle}
            </p>
          </div>

          <div className="pt-1">
            {currentStepData.content}
          </div>
        </div>

        {/* Footer controls */}
        <div className="p-4 bg-[#FAFBF9] border-t border-gray-200 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleSkip}
              className="text-xs text-gray-500 hover:text-gray-800 font-semibold px-2 py-1.5"
            >
              Omitir tour
            </button>
            {onOpenManual && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenManual();
                }}
                className="text-xs text-[#2D4539] hover:underline font-bold px-2 py-1.5 flex items-center gap-1"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Ver Manual</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            {currentStep > 0 && (
              <button
                type="button"
                onClick={handlePrev}
                className="px-3.5 py-2 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-100 font-semibold text-xs flex items-center gap-1 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Anterior</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleNext}
              className="px-5 py-2 rounded-xl bg-[#2D4539] hover:bg-[#20342A] text-white font-bold text-xs flex items-center gap-1.5 shadow-2xs transition-colors"
            >
              <span>{isLast ? '¡Comenzar ahora!' : 'Siguiente'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
