import React from 'react';
import { Clock, ShieldCheck, CheckCircle2, FileText, X, AlertTriangle, ExternalLink } from 'lucide-react';
import { PaymentTransaction } from '../../types';

interface PaymentProcessingModalProps {
  isOpen: boolean;
  isProcessing: boolean;
  paymentResult: PaymentTransaction | null;
  onClose: () => void;
  onViewVoucher: () => void;
}

export const PaymentProcessingModal: React.FC<PaymentProcessingModalProps> = ({
  isOpen,
  isProcessing,
  paymentResult,
  onClose,
  onViewVoucher,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white border border-[#CBD8CA] rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-[#263E32] text-white p-6 relative overflow-hidden">
          <div className="absolute -right-6 -bottom-6 w-28 h-28 bg-white/5 rounded-full pointer-events-none" />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#3D5E4E] text-[#BDE2C8] flex items-center justify-center border border-white/10 shadow-xs">
                {isProcessing ? (
                  <div className="w-5 h-5 border-2 border-[#BDE2C8] border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Clock className="w-5 h-5 text-amber-300 animate-pulse" />
                )}
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#BDE2C8] block">
                  Pasarela de Cobros Terranova
                </span>
                <h3 className="font-serif-brand text-lg sm:text-xl font-bold leading-tight">
                  Pago en proceso: Verificando transacción
                </h3>
              </div>
            </div>
            {!isProcessing && (
              <button
                onClick={onClose}
                className="text-white/70 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
                title="Cerrar"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          {isProcessing ? (
            /* Loading State */
            <div className="py-8 text-center space-y-4">
              <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border-4 border-[#EEF5ED] animate-ping opacity-75" />
                <div className="w-16 h-16 rounded-full border-4 border-[#2D4539] border-t-transparent animate-spin" />
                <ShieldCheck className="w-7 h-7 text-[#2D4539] absolute" />
              </div>

              <div className="space-y-1">
                <h4 className="font-bold text-gray-900 text-base">
                  Pago en proceso: Verificando transacción
                </h4>
                <p className="text-xs text-gray-500 max-w-xs mx-auto leading-relaxed">
                  Cifrando datos bancarios y registrando solicitud con token de seguridad único...
                </p>
              </div>

              {/* Progress Steps */}
              <div className="bg-[#FAFBF9] rounded-2xl p-4 border border-[#DEE6DD] text-left text-xs space-y-2.5 max-w-sm mx-auto">
                <div className="flex items-center gap-2 text-emerald-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="font-medium">Máscaras de entrada y verificación numérica</span>
                </div>
                <div className="flex items-center gap-2 text-[#2D4539]">
                  <div className="w-4 h-4 border-2 border-[#2D4539] border-t-transparent rounded-full animate-spin shrink-0" />
                  <span className="font-semibold">Transmisión segura SSL 256-Bit</span>
                </div>
                <div className="flex items-center gap-2 text-gray-400">
                  <Clock className="w-4 h-4 shrink-0" />
                  <span>Emisión de comprobante con estado 'En Proceso'</span>
                </div>
              </div>
            </div>
          ) : (
            /* Result: Transaction In Process / Verification Modal */
            <div className="space-y-4">
              {/* Status Banner */}
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 space-y-2">
                <div className="flex items-start gap-2.5">
                  <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-xs uppercase tracking-wider text-amber-950">
                      Pago Registrado: En Verificación Externa
                    </h4>
                    <p className="text-xs text-amber-900 leading-relaxed mt-1">
                      Tu pago ha sido recibido y clasificado con estado <strong>'En Proceso'</strong>. 
                      Al no disponerse de liquidación bancaria automática directa, tesorería realiza una validación externa con la entidad financiera.
                    </p>
                  </div>
                </div>

                <div className="bg-amber-100/70 p-3 rounded-xl border border-amber-300/80 text-[11px] text-amber-950 font-medium leading-relaxed">
                  <span className="font-bold block mb-0.5">ℹ️ Emisión del Comprobante Final:</span>
                  El <strong>comprobante final definitivo y validado</strong> será emitido y enviado a tu expediente y correo una vez que los fondos sean confirmados externamente por el banco.
                </div>
              </div>

              {/* Payment Details Card */}
              {paymentResult && (
                <div className="p-4 bg-[#FAFBF9] rounded-2xl border border-[#DEE6DD] space-y-2 text-xs">
                  <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                    <span className="text-gray-500">Número de Comprobante:</span>
                    <span className="font-mono font-bold text-gray-800">{paymentResult.receiptNumber}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">Código de Referencia:</span>
                    <span className="font-mono font-bold text-[#1E3628] bg-[#EEF5ED] px-2 py-0.5 rounded">
                      {paymentResult.referenceCode}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">Inmueble / Concepto:</span>
                    <span className="font-medium text-gray-800 text-right">{paymentResult.propertyTitle}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">Método Utilizado:</span>
                    <span className="font-medium text-gray-700">{paymentResult.paymentMethod}</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                    <span className="font-bold text-gray-900">Monto Registrado:</span>
                    <span className="font-mono font-bold text-base text-[#1E3328]">
                      ${paymentResult.amount.toLocaleString()} {paymentResult.currency}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-1">
                    <span className="text-gray-500">Estado Actual:</span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> EN PROCESO
                    </span>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
                <button
                  type="button"
                  onClick={onViewVoucher}
                  className="flex-1 py-3 px-4 rounded-xl bg-[#2D4539] hover:bg-[#20342A] text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-2xs transition-colors"
                >
                  <FileText className="w-4 h-4 text-[#A3C7AD]" />
                  <span>Ver Comprobante Provisional</span>
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="py-3 px-5 rounded-xl border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold text-xs transition-colors"
                >
                  Cerrar
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
