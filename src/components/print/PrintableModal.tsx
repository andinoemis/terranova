import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  Printer, 
  CheckCircle2, 
  Download, 
  Building2, 
  Clock, 
  AlertCircle, 
  FileCheck2, 
  Coins, 
  ShieldAlert,
  Pen,
  Eraser,
  Upload,
  Check,
  Sparkles,
  FileText
} from 'lucide-react';
import { Property, LeaseContract, PaymentTransaction, PayrollRecord } from '../../types';

export const PrintableModal: React.FC = () => {
  const { 
    printDoc, 
    closePrintModal, 
    companySettings, 
    showToast, 
    formatMoney, 
    currentUser,
    signContractDigitally 
  } = useApp();

  const [showSignaturePad, setShowSignaturePad] = useState(false);
  const [signingRole, setSigningRole] = useState<'tenant' | 'owner' | 'admin'>('tenant');
  const [signMethod, setSignMethod] = useState<'draw' | 'upload'>('draw');
  const [uploadedSignatureUrl, setUploadedSignatureUrl] = useState<string | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  if (!printDoc) return null;

  const isContractUnsigned = printDoc.type === 'contract' &&
    !(printDoc.data as LeaseContract).isSignedDigitally &&
    !(printDoc.data as LeaseContract).signedDocumentUrl;

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    setIsDrawing(true);
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    ctx.beginPath();
    ctx.moveTo(clientX - rect.left, clientY - rect.top);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#1E3328';
    ctx.lineTo(clientX - rect.left, clientY - rect.top);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const handleSignatureImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setUploadedSignatureUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSaveDigitalSignature = (contractId: string) => {
    let sigUrl = '';
    if (signMethod === 'draw') {
      const canvas = canvasRef.current;
      if (!canvas) return;
      sigUrl = canvas.toDataURL('image/png');
    } else {
      if (!uploadedSignatureUrl) {
        showToast('Por favor seleccione una imagen de firma primero');
        return;
      }
      sigUrl = uploadedSignatureUrl;
    }
    signContractDigitally(contractId, signingRole, sigUrl);
    if (printDoc?.data) {
      if (signingRole === 'tenant') printDoc.data.signatureImageTenant = sigUrl;
      if (signingRole === 'owner') printDoc.data.signatureImageOwner = sigUrl;
      if (signingRole === 'admin') printDoc.data.signatureImageAdmin = sigUrl;
      printDoc.data.isSignedDigitally = true;
      printDoc.data.documentStatus = 'Firmado_Digital';
    }
    showToast(`Firma digital estampada con éxito`);
    clearCanvas();
    setUploadedSignatureUrl(null);
  };

  const handlePrint = () => {
    if (isContractUnsigned) {
      showToast('Bloqueo de seguridad: No se puede imprimir un contrato sin firmas (digital o física escaneada).');
      return;
    }
    window.print();
  };

  const handleDownloadDocument = (asDraft: boolean = false) => {
    if (!printDoc) return;
    if (isContractUnsigned && !asDraft) {
      showToast('Bloqueo de seguridad: No se puede descargar un contrato oficial sin firmas. Puede firmarlo digitalmente arriba o descargarlo como borrador.');
      return;
    }
    let filename = 'documento_terranova.html';
    let htmlContent = '';

    if (printDoc.type === 'contract') {
      const ctr = printDoc.data as LeaseContract;
      filename = asDraft 
        ? `Borrador_Minuta_Contrato_${ctr.contractNumber}_Terranova.html`
        : `Contrato_Firmado_Oficial_${ctr.contractNumber}_Terranova.html`;
      const isSale = ctr.contractType === 'Venta' || ctr.contractType === 'Venta a Plazos';
      const contractTitle = isSale
        ? (ctr.contractType === 'Venta a Plazos' ? 'CONTRATO DE PROMESA DE COMPRAVENTA A PLAZOS' : 'CONTRATO DE COMPRAVENTA INMOBILIARIA (TRASPASO A UN SOLO DUEÑO)')
        : 'CONTRATO PRIVADO DE ARRENDAMIENTO RESIDENCIAL';

      const ownerSigHtml = ctr.signatureImageOwner 
        ? `<img src="${ctr.signatureImageOwner}" style="max-height: 48px; max-width: 160px; display: block; margin: 0 auto 4px auto;" /><br>`
        : (ctr.isSignedDigitally ? `<div style="font-style: italic; color: #1E3328; font-weight: bold; margin-bottom: 6px;">✓ Firmado Digitalmente: ${ctr.ownerName}</div>` : '');

      const tenantSigHtml = ctr.signatureImageTenant 
        ? `<img src="${ctr.signatureImageTenant}" style="max-height: 48px; max-width: 160px; display: block; margin: 0 auto 4px auto;" /><br>`
        : (ctr.isSignedDigitally ? `<div style="font-style: italic; color: #1E3328; font-weight: bold; margin-bottom: 6px;">✓ Firmado Digitalmente: ${ctr.tenantName}</div>` : '');

      const adminSigHtml = ctr.signatureImageAdmin 
        ? `<img src="${ctr.signatureImageAdmin}" style="max-height: 48px; max-width: 160px; display: block; margin: 0 auto 4px auto;" /><br>`
        : (ctr.isSignedDigitally ? `<div style="font-style: italic; color: #1E3328; font-weight: bold; margin-bottom: 6px;">✓ Atestiguado: ${ctr.managerName || 'Kenneth Adonay Zúniga'}</div>` : '');

      htmlContent = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Contrato ${ctr.contractNumber} - ${companySettings.companyName}</title>
  <style>
    body { font-family: 'Times New Roman', serif; margin: 40px; color: #111; line-height: 1.6; font-size: 14px; }
    h1 { text-align: center; font-size: 20px; margin-bottom: 4px; text-transform: uppercase; color: #1E3328; }
    .subtitle { text-align: center; font-size: 13px; font-weight: bold; margin-bottom: 25px; color: #555; }
    .contract-num { text-align: center; font-family: monospace; font-size: 14px; font-weight: bold; margin-bottom: 30px; }
    .clause { margin-bottom: 14px; text-align: justify; }
    .bank-box { border: 2px dashed #2D4539; background: #f0f7f2; padding: 15px; border-radius: 10px; margin: 20px 0; }
    .circled-account { border: 2px solid #2D4539; padding: 10px; border-radius: 8px; background: #ffffff; font-weight: bold; margin-top: 8px; }
    .signatures { margin-top: 50px; display: flex; justify-content: space-around; text-align: center; }
    .signature-line { width: 220px; border-top: 1px solid #333; padding-top: 6px; margin: 0 auto; font-size: 12px; }
    .rtn-stamp { font-size: 12px; text-align: center; color: #333; margin-top: 5px; }
    .cert-stamp { margin-top: 35px; padding: 12px; background: #f0fdf4; border: 1px solid #86efac; border-radius: 8px; text-align: center; font-size: 11px; color: #166534; font-family: sans-serif; }
  </style>
</head>
<body>
  <h1>${companySettings.companyName}</h1>
  ${companySettings.includeTaxRtn !== false && companySettings.rtn ? `<div class="rtn-stamp">RTN: ${companySettings.rtn}</div>` : ''}
  <div class="subtitle">${contractTitle}</div>
  <div class="contract-num">EXPEDIENTE N° ${ctr.contractNumber} ${asDraft ? '(BORRADOR DE REVISIÓN)' : '(DOCUMENTO OFICIAL FIRMADO)'}</div>

  <p>En la ciudad de Tegucigalpa, Municipio del Distrito Central, comparecen por una parte el <strong>${isSale ? 'PROPIETARIO / VENDEDOR' : 'ARRENDADOR'}: ${ctr.ownerName}</strong>; y por otra parte el <strong>${isSale ? 'COMPRADOR' : 'ARRENDATARIO'}: ${ctr.tenantName}</strong>, con Documento Nacional de Identificación (DNI) N° <strong>${ctr.tenantNationalId || '0801-1996-04812'}</strong>, teléfono de contacto <strong>${ctr.tenantPhone || '+504 9623-4567'}</strong> y correo electrónico <strong>${ctr.tenantEmail}</strong>; bajo la supervisión y representación del Encargado y Administrador Inmobiliario <strong>${ctr.managerName || 'Lic. Kenneth Adonay Zúniga'}</strong> (Correo: ${ctr.managerEmail || 'kenneth.zuniga@unah.hn'}, Tel: ${ctr.managerPhone || '+504 9876-5432'}).</p>

  <div class="clause"><strong>PRIMERA: OBJETO DEL CONTRATO.</strong> El titular dispone el bien inmueble identificado con código <strong>${ctr.propertyCode}</strong> (${ctr.propertyTitle}), ubicado en ${companySettings.city || 'Tegucigalpa M.D.C.'}. ${isSale ? 'Se establece formalmente que al perfeccionarse la compraventa, la titularidad del inmueble pasará registralmente a un solo dueño (el comprador único adquirente).' : ''}</div>
  
  <div class="clause"><strong>SEGUNDA: VALOR Y CONDICIONES ECONÓMICAS.</strong> ${isSale ? `Valor total de la transacción convenido en <strong>$${ctr.totalValue?.toLocaleString() || ctr.monthlyRent.toLocaleString()} USD</strong>.${ctr.contractType === 'Venta a Plazos' ? ` Prima inicial convenida: <strong>$${ctr.downPayment?.toLocaleString()} USD</strong> a un plazo de <strong>${ctr.financingYears} años</strong> (${ctr.installmentsCount} cuotas mensuales calculadas en <strong>$${ctr.monthlyInstallment?.toLocaleString()} USD/mes</strong>).` : ''}` : `El canon mensual de arrendamiento convenido es de <strong>$${ctr.monthlyRent}.00 ${ctr.currency}</strong> mensuales pagaderos dentro de los primeros 5 días hábiles.`}</div>

  <div class="bank-box">
    <strong>CUENTA BANCARIA DESIGNADA PARA TRANSACCIÓN (CIRCULADA Y ACREDITADA OFICIALMENTE):</strong>
    <div class="circled-account">
      ⭕ Banco: ${ctr.receivingBankName || 'Banco Ficohsa Honduras'}<br>
      ⭕ Cuenta N°: ${ctr.receivingBankAccount || '2000-1122-3344-99'}<br>
      ⭕ Titular Acreditado: ${companySettings.companyName}<br>
      ⭕ Estado: CUENTA RECEPTORA OFICIAL CIRCULADA (FONDOS ACREDITADOS)
    </div>
  </div>

  <div class="signatures">
    <div>
      ${ownerSigHtml}
      <div class="signature-line">
        <strong>${ctr.ownerName}</strong><br>${isSale ? 'EL VENDEDOR' : 'EL ARRENDADOR'}
      </div>
    </div>
    <div>
      ${tenantSigHtml}
      <div class="signature-line">
        <strong>${ctr.tenantName}</strong><br>${isSale ? 'EL COMPRADOR / ADQUIRIENTE' : 'EL ARRENDATARIO'}<br>DNI: ${ctr.tenantNationalId || '0801-1996-04812'}
      </div>
    </div>
    <div>
      ${adminSigHtml}
      <div class="signature-line">
        <strong>${ctr.managerName || 'Kenneth Adonay Zúniga'}</strong><br>ENCARGADO ADMINISTRATIVO
      </div>
    </div>
  </div>

  ${!asDraft ? `<div class="cert-stamp"><strong>DOCUMENTO OFICIAL FIRMADO Y CERTIFICADO DIGITALMENTE</strong><br>Validez legal plena · Código Hash de Verificación: ${ctr.contractNumber}-CERT-${Date.now().toString(36).toUpperCase()}<br>Terranova Gestión Inmobiliaria · República de Honduras</div>` : ''}
</body>
</html>`;
    } else if (printDoc.type === 'payroll_receipt') {
      const rec = printDoc.data as PayrollRecord;
      filename = `Recibo_Nomina_${rec.payrollNumber}_Terranova.html`;
      htmlContent = `<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><title>Recibo Nómina ${rec.payrollNumber}</title><style>body{font-family:sans-serif;margin:40px;color:#222;line-height:1.5;}h1{color:#1E3328;margin-bottom:2px;}.box{background:#f9fafb;border:1px solid #e5e7eb;padding:16px;border-radius:10px;margin:15px 0;}.total{background:#2D4539;color:#fff;padding:14px;border-radius:10px;font-size:18px;font-weight:bold;display:flex;justify-content:space-between;}</style></head><body><h1>${companySettings.companyName}</h1><p>RECIBO OFICIAL DE NÓMINA Y COMISIONES: ${rec.payrollNumber}</p><div class="box"><p><strong>Empleado:</strong> ${rec.employeeName} (${rec.position})</p><p><strong>Periodo:</strong> ${rec.periodMonth} ${rec.periodYear}</p><p><strong>Salario Base:</strong> $${rec.baseSalary} USD</p><p><strong>Comisiones por Contratos:</strong> $${rec.totalCommissions.toLocaleString()} USD</p></div><div class="total"><span>Neto a Percibir:</span><span>$${rec.netPayable.toLocaleString()} USD</span></div></body></html>`;
    } else if (printDoc.type === 'property_sheet') {
      const prop = printDoc.data as Property;
      filename = `Ficha_Tecnica_${prop.code}_Terranova.html`;
      htmlContent = `<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><title>Ficha Técnica ${prop.code}</title><style>body{font-family:sans-serif;margin:40px;color:#222;}h1{color:#1E3328;}table{width:100%;border-collapse:collapse;}td,th{padding:8px;border:1px solid #ddd;}</style></head><body><h1>${companySettings.companyName}</h1><h2>Ficha Técnica de Inmueble: ${prop.code} - ${prop.title}</h2><p><strong>Precio:</strong> $${prop.price} USD | <strong>Tipo:</strong> ${prop.propertyType} (${prop.transactionType})</p><p><strong>Dirección:</strong> ${prop.address}, ${prop.city}</p><p><strong>Superficie:</strong> ${prop.size} m² | <strong>Habitaciones:</strong> ${prop.bedrooms} | <strong>Baños:</strong> ${prop.bathrooms}</p><p><strong>Descripción:</strong> ${prop.description}</p></body></html>`;
    } else if (printDoc.type === 'receipt') {
      const pay = printDoc.data as PaymentTransaction;
      const isEnProceso = pay.status === 'En Proceso' || pay.status === 'Pendiente';
      filename = `Comprobante_${pay.receiptNumber}_Terranova.html`;
      const rtnHtml = companySettings.includeTaxRtn !== false && companySettings.rtn
        ? `<p><strong>RTN:</strong> ${companySettings.rtn}</p>`
        : `<p style="color:#777; font-style:italic;">(Facturación Exenta / Sin declaración de RTN)</p>`;

      htmlContent = `<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><title>Comprobante ${pay.receiptNumber}</title><style>body{font-family:sans-serif;margin:40px;color:#222;line-height:1.5;}h1{color:#1E3328;margin-bottom:2px;}.badge{display:inline-block;padding:6px 14px;border-radius:20px;font-weight:bold;font-size:12px;margin:15px 0;}.badge-proc{background:#fef3c7;color:#92400e;border:1px solid #fcd34d;}.badge-paid{background:#dcfce7;color:#166534;border:1px solid #86efac;}.box{background:#f9fafb;border:1px solid #e5e7eb;padding:16px;border-radius:10px;margin:15px 0;}.total{background:#2D4539;color:#fff;padding:14px;border-radius:10px;font-size:18px;font-weight:bold;display:flex;justify-content:space-between;}</style></head><body><h1>${companySettings.companyName}</h1><p style="font-size:12px;color:#666;">TU SUEÑO, AL ALCANCE</p>${rtnHtml}<hr><div style="display:flex;justify-content:space-between;"><h2>COMPROBANTE OFICIAL #${pay.receiptNumber}</h2><p><strong>Fecha:</strong> ${pay.date}</p></div><div class="${isEnProceso ? 'badge badge-proc' : 'badge badge-paid'}">${isEnProceso ? 'ESTADO: PAGO EN PROCESO - VERIFICANDO TRANSACCIÓN' : 'ESTADO: PAGADO Y CONCILIADO'}</div>${isEnProceso ? '<div style="background:#fffbeb;border:1px solid #fde68a;padding:12px;border-radius:8px;font-size:12px;color:#92400e;margin-bottom:15px;"><strong>Aviso de Validación:</strong> La transacción está en proceso de verificación por tesorería. El comprobante final definitivo será enviado una vez validado externamente por el banco.</div>' : ''}<div class="box"><p><strong>Recibido de:</strong> ${pay.payerName} (${pay.payerEmail})</p><p><strong>Concepto:</strong> ${pay.type} (${pay.monthCovered || 'Mes corriente'})</p><p><strong>Propiedad:</strong> ${pay.propertyTitle}</p><p><strong>Método de Pago:</strong> ${pay.paymentMethod}</p><p><strong>Código de Referencia:</strong> <code>${pay.referenceCode}</code></p></div><div class="total"><span>${isEnProceso ? 'Monto a Validar:' : 'Monto Total Recibido:'}</span><span>$${pay.amount} ${pay.currency}</span></div><p style="font-size:11px;color:#888;margin-top:20px;">Terranova Gestión Inmobiliaria S. de R.L. · Documento digital emitido para efectos de control financiero interno.</p></body></html>`;
    } else {
      filename = `Documento_Oficial_Terranova.html`;
      htmlContent = `<!DOCTYPE html><html><body><h1>${companySettings.companyName}</h1><p>Documento oficial emitido.</p></body></html>`;
    }

    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const renderContent = () => {
    if (printDoc.type === 'property_sheet') {
      const prop = printDoc.data as Property;
      return (
        <div className="printable-document bg-white p-8 max-w-3xl mx-auto space-y-6 text-gray-900 border border-gray-300">
          {/* Header matching PDF Page 27 Mockup */}
          <div className="flex justify-between items-center border-b-2 border-[#2D4539] pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#2D4539] text-[#E3ECE3] flex items-center justify-center">
                <Building2 className="w-6 h-6 text-[#A3C7AD]" />
              </div>
              <div>
                <h1 className="font-serif-brand text-2xl font-bold tracking-widest text-[#1D3227] uppercase">
                  TERRANOVA
                </h1>
                <p className="text-[10px] tracking-[0.2em] text-[#637C6C] font-semibold uppercase">
                  TU SUEÑO, AL ALCANCE
                </p>
              </div>
            </div>

            <div className="text-right">
              <span className="font-mono text-sm font-bold bg-[#FAFBF9] border px-2.5 py-1 rounded">
                FICHA TÉCNICA · {prop.code}
              </span>
              <p className="text-xs text-gray-500 mt-1">Fecha Emisión: {new Date().toLocaleDateString()}</p>
            </div>
          </div>

          {/* Photo and Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="h-64 rounded-xl overflow-hidden border border-gray-200">
              <img src={prop.images[0]} alt={prop.title} className="w-full h-full object-cover" />
            </div>

            <div className="space-y-3 text-xs bg-[#FAFBF9] p-4 rounded-xl border border-gray-200 flex flex-col justify-between">
              <div>
                <span className="font-bold text-base text-[#1E3328] block mb-2">{prop.title}</span>
                <p className="text-gray-600 mb-2"><strong>Ubicación:</strong> {prop.address}, {prop.city}</p>
                <p className="text-gray-600 mb-2"><strong>Tipo Inmueble:</strong> {prop.propertyType} ({prop.transactionType})</p>
                <p className="text-gray-600 mb-2"><strong>Superficie Construida:</strong> {prop.size} m²</p>
                <p className="text-gray-600 mb-2"><strong>Distribución:</strong> {prop.bedrooms} Habitaciones · {prop.bathrooms} Baños</p>
                <p className="text-gray-600 mb-2"><strong>Estacionamiento:</strong> {prop.parkingSpots} Vehículos</p>
                <p className="text-gray-600"><strong>Encargado:</strong> {prop.assignedAgentName}</p>
              </div>

              <div className="pt-3 border-t border-gray-200">
                <span className="text-[11px] text-gray-500 block">Valor Referencial Oficial:</span>
                <span className="font-mono text-2xl font-bold text-[#1E3328]">
                  ${prop.price.toLocaleString()} {prop.currency}
                </span>
              </div>
            </div>
          </div>

          {/* Detailed Features */}
          <div className="space-y-2 text-xs">
            <h4 className="font-bold uppercase tracking-wider text-gray-700 border-b pb-1">
              Características & Especificaciones de Construcción
            </h4>
            <p className="text-gray-700 leading-relaxed">{prop.description}</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2">
              {prop.features.map((f, i) => (
                <div key={i} className="flex items-center gap-1.5 text-gray-700">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                  <span>{f}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Footer as in mockup: TU SUEÑO, AL ALCANCE */}
          <div className="pt-6 border-t border-gray-200 flex justify-between items-center text-[11px] text-gray-500">
            <span>TERRANOVA GESTIÓN INMOBILIARIA · TEGUCIGALPA M.D.C., HONDURAS</span>
            <span className="font-serif-brand font-bold tracking-widest text-gray-700">TU SUEÑO, AL ALCANCE</span>
          </div>
        </div>
      );
    }

    if (printDoc.type === 'contract') {
      const ctr = printDoc.data as LeaseContract;
      const receivingAccNumber = ctr.receivingBankAccount || '2000-1122-3344-99';
      const isSale = ctr.contractType === 'Venta' || ctr.contractType === 'Venta a Plazos';
      const contractTitle = isSale
        ? (ctr.contractType === 'Venta a Plazos' ? 'CONTRATO DE PROMESA DE COMPRAVENTA A PLAZOS' : 'CONTRATO DE COMPRAVENTA INMOBILIARIA')
        : 'CONTRATO PRIVADO DE ARRENDAMIENTO RESIDENCIAL';

      return (
        <div className="printable-document bg-white p-8 sm:p-12 max-w-3xl mx-auto space-y-6 text-gray-900 border border-gray-300 text-xs">
          {/* Alerta de bloqueo si no está firmado */}
          {isContractUnsigned && (
            <div className="p-4 rounded-2xl bg-rose-50 border-2 border-rose-300 text-rose-900 space-y-1">
              <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wide text-rose-950">
                <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0" />
                <span>BLOQUEO DE SEGURIDAD LEGAL: PROHIBIDO IMPRIMIR SIN FIRMAS</span>
              </div>
              <p className="text-[11px] leading-relaxed text-rose-800">
                Por política de concordancia e integridad jurídica, un contrato <strong>NO puede imprimirse ni descargarse como documento formal</strong> sin haber sido firmado digitalmente o sin que el agente haya subido el escaneo del documento físico debidamente firmado por las partes.
              </p>
            </div>
          )}

          {/* MÓDULO INTERACTIVO DE FIRMA DIGITAL Y DESCARGA OFICIAL */}
          <div className="no-print p-4 rounded-2xl bg-[#F2F6F3] border-2 border-[#2D4539]/30 space-y-3">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <Pen className="w-4 h-4 text-[#2D4539]" />
                  <h4 className="font-bold text-sm text-[#1E3328]">
                    Firma Digital Interactiva & Validación Jurídica
                  </h4>
                </div>
                <p className="text-[11px] text-gray-600 mt-0.5">
                  Firme en pantalla táctil/mouse o cargue su imagen de firma para dar plena validez ejecutoria al contrato y habilitar su descarga oficial.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowSignaturePad(!showSignaturePad)}
                className="px-3.5 py-1.5 rounded-xl bg-[#2D4539] hover:bg-[#1E3328] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shrink-0 shadow-2xs"
              >
                <Pen className="w-3.5 h-3.5" />
                <span>{showSignaturePad ? 'Cerrar Panel de Firma' : 'Firmar Digitalmente Ahora'}</span>
              </button>
            </div>

            {/* Panel Desplegable para Dibujar o Subir Firma */}
            {showSignaturePad && (
              <div className="pt-3 border-t border-[#D5E1D4] space-y-3 animate-in fade-in">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 mb-1">
                      1. Seleccionar Compareciente que Firma:
                    </label>
                    <select
                      value={signingRole}
                      onChange={(e) => setSigningRole(e.target.value as any)}
                      className="w-full text-xs p-2 rounded-xl border border-gray-300 bg-white font-medium"
                    >
                      <option value="tenant">
                        Inquilino / Comprador: {ctr.tenantName} {ctr.signatureImageTenant ? '(✓ Ya Firmado)' : '(Pendiente)'}
                      </option>
                      <option value="owner">
                        Propietario / Vendedor: {ctr.ownerName} {ctr.signatureImageOwner ? '(✓ Ya Firmado)' : '(Pendiente)'}
                      </option>
                      <option value="admin">
                        Encargado Administrativo: {ctr.managerName || 'Kenneth Adonay Zúniga'} {ctr.signatureImageAdmin ? '(✓ Ya Firmado)' : '(Pendiente)'}
                      </option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 mb-1">
                      2. Modalidad de Firma:
                    </label>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setSignMethod('draw')}
                        className={`flex-1 py-1.5 text-xs rounded-xl font-semibold flex items-center justify-center gap-1.5 border transition-all ${
                          signMethod === 'draw'
                            ? 'bg-[#2D4539] text-white border-[#2D4539] shadow-2xs'
                            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        <Pen className="w-3.5 h-3.5" />
                        <span>Dibujar en Pantalla</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setSignMethod('upload')}
                        className={`flex-1 py-1.5 text-xs rounded-xl font-semibold flex items-center justify-center gap-1.5 border transition-all ${
                          signMethod === 'upload'
                            ? 'bg-[#2D4539] text-white border-[#2D4539] shadow-2xs'
                            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>Cargar Imagen</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Canvas de Trazo o File Input */}
                {signMethod === 'draw' ? (
                  <div className="space-y-2">
                    <div className="border-2 border-dashed border-[#2D4539]/40 bg-white rounded-2xl p-2 flex flex-col items-center justify-center">
                      <span className="text-[10px] text-gray-400 mb-1 block">
                        Dibuje su firma con el cursor, lápiz óptico o dedo:
                      </span>
                      <canvas
                        ref={canvasRef}
                        width={460}
                        height={120}
                        onMouseDown={startDrawing}
                        onMouseMove={draw}
                        onMouseUp={stopDrawing}
                        onMouseLeave={stopDrawing}
                        onTouchStart={startDrawing}
                        onTouchMove={draw}
                        onTouchEnd={stopDrawing}
                        className="w-full max-w-[460px] h-[120px] bg-white cursor-crosshair border border-gray-200 rounded-xl touch-none"
                      />
                    </div>
                    <div className="flex justify-between items-center gap-2">
                      <button
                        type="button"
                        onClick={clearCanvas}
                        className="px-3 py-1.5 rounded-xl border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 text-xs font-semibold flex items-center gap-1"
                      >
                        <Eraser className="w-3.5 h-3.5 text-gray-500" />
                        <span>Borrar / Limpiar Trazo</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleSaveDigitalSignature(ctr.id)}
                        className="px-4 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold flex items-center gap-1.5 shadow-2xs"
                      >
                        <Check className="w-4 h-4" />
                        <span>Estampar Firma Digital en Contrato</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3 bg-white p-3.5 rounded-2xl border border-gray-300">
                    <div>
                      <label className="block text-xs font-bold text-gray-800 mb-1">
                        Cargar archivo de firma (PNG o JPG):
                      </label>
                      <input
                        type="file"
                        accept="image/png, image/jpeg, image/jpg, image/webp"
                        onChange={handleSignatureImageUpload}
                        className="text-xs file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-[#2D4539] file:text-white hover:file:bg-[#1E3328] cursor-pointer"
                      />
                    </div>

                    {uploadedSignatureUrl && (
                      <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-gray-500 font-medium">Previsualización:</span>
                          <img src={uploadedSignatureUrl} alt="Firma preview" className="h-10 max-w-[150px] object-contain border bg-white p-1 rounded" />
                        </div>
                        <button
                          type="button"
                          onClick={() => handleSaveDigitalSignature(ctr.id)}
                          className="px-4 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold flex items-center gap-1.5 shadow-2xs"
                        >
                          <Check className="w-4 h-4" />
                          <span>Estampar Imagen en Contrato</span>
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* Badges de estado de firmas */}
                <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-gray-200 text-[10px]">
                  <span className={`px-2.5 py-0.5 rounded-full font-bold border flex items-center gap-1 ${
                    ctr.signatureImageTenant || ctr.isSignedDigitally ? 'bg-emerald-100 text-emerald-800 border-emerald-300' : 'bg-gray-100 text-gray-500 border-gray-200'
                  }`}>
                    {ctr.signatureImageTenant || ctr.isSignedDigitally ? '✓ Inquilino / Comprador Firmado' : '○ Inquilino / Comprador Pendiente'}
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-full font-bold border flex items-center gap-1 ${
                    ctr.signatureImageOwner || ctr.isSignedDigitally ? 'bg-emerald-100 text-emerald-800 border-emerald-300' : 'bg-gray-100 text-gray-500 border-gray-200'
                  }`}>
                    {ctr.signatureImageOwner || ctr.isSignedDigitally ? '✓ Propietario / Vendedor Firmado' : '○ Propietario / Vendedor Pendiente'}
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-full font-bold border flex items-center gap-1 ${
                    ctr.signatureImageAdmin || ctr.isSignedDigitally ? 'bg-emerald-100 text-emerald-800 border-emerald-300' : 'bg-gray-100 text-gray-500 border-gray-200'
                  }`}>
                    {ctr.signatureImageAdmin || ctr.isSignedDigitally ? '✓ Administración Atestiguada' : '○ Administración Pendiente'}
                  </span>
                </div>
              </div>
            )}

            {/* Banner de Documento Original Escaneado / PDF Resguardado */}
            {ctr.signedDocumentUrl && (
              <div className="mt-4 p-4 bg-emerald-50 rounded-2xl border border-emerald-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-bold text-xs text-emerald-950 block">
                      Documento Original Escaneado / PDF Resguardado
                    </span>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="font-mono text-[11px] text-emerald-800 font-bold">
                        {ctr.signedDocumentFileName || 'documentos.pdf'}
                      </span>
                      {ctr.signedDocumentFileSize && (
                        <span className="text-[10px] text-gray-500 font-medium">({ctr.signedDocumentFileSize})</span>
                      )}
                    </div>
                  </div>
                </div>

                <a
                  href={ctr.signedDocumentUrl}
                  download={ctr.signedDocumentFileName || 'documentos.pdf'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs inline-flex items-center gap-1.5 shadow-2xs transition-colors shrink-0"
                >
                  <Download className="w-4 h-4" />
                  <span>Descargar PDF Original</span>
                </a>
              </div>
            )}
          </div>

          {/* Header */}
          <div className="text-center space-y-1 border-b pb-4">
            <h1 className="font-serif-brand text-2xl font-bold tracking-widest text-[#1D3227] uppercase">
              {companySettings.companyName}
            </h1>
            {companySettings.includeTaxRtn !== false && companySettings.rtn && (
              <p className="text-[11px] font-mono text-gray-600">RTN: {companySettings.rtn}</p>
            )}
            <p className="text-xs uppercase tracking-wider text-gray-500 font-semibold">
              {contractTitle}
            </p>
            <p className="font-mono font-bold text-sm text-[#2D4539]">{ctr.contractNumber}</p>
          </div>

          {/* Comparecientes */}
          <div className="space-y-3 leading-relaxed text-gray-800">
            <p className="text-justify">
              En la ciudad de Tegucigalpa, Municipio del Distrito Central, a los {new Date(ctr.startDate).getDate()} días del mes de {new Date(ctr.startDate).toLocaleString('es-HN', { month: 'long' })}, comparecen por una parte en calidad de <strong>{isSale ? 'PROPIETARIO / VENDEDOR' : 'ARRENDADOR'}: {ctr.ownerName}</strong>; y por otra parte en calidad de <strong>{isSale ? 'COMPRADOR' : 'ARRENDATARIO'}: {ctr.tenantName}</strong>, titular de Documento Nacional de Identificación (DNI) N° <strong>{ctr.tenantNationalId || '0801-1996-04812'}</strong>, teléfono de contacto <strong>{ctr.tenantPhone || '+504 9623-4567'}</strong> y correo electrónico <strong>{ctr.tenantEmail}</strong>; actuando bajo la intermediación del Administrador y Asesor Inmobiliario <strong>{ctr.managerName || ctr.agentName}</strong> (Correo: <strong>{ctr.managerEmail || 'administracion@terranova.hn'}</strong>, Tel: <strong>{ctr.managerPhone || '+504 9876-5432'}</strong>), conviniendo en formalizar el presente acto sobre el bien inmueble identificado con código <strong>{ctr.propertyCode}</strong> ({ctr.propertyTitle}), bajo las siguientes cláusulas:
            </p>

            {/* Cláusulas */}
            <div className="space-y-2.5 pt-2">
              {((currentUser.role === 'admin' || currentUser.role === 'owner') ? ctr.clauses : ctr.clauses.filter(cl => !cl.toUpperCase().includes('COMISIÓN') && !cl.toUpperCase().includes('CORRETAJE'))).map((clause, idx) => (
                <p key={idx} className="text-justify text-gray-700">
                  {clause}
                </p>
              ))}

              {(currentUser.role === 'admin' || currentUser.role === 'owner') && isSale && ctr.totalCommissionRate && (
                <div className="my-3 p-3.5 rounded-xl bg-amber-50/70 border border-amber-200 text-xs space-y-1">
                  <span className="font-bold text-amber-950 uppercase tracking-wide text-[10px] block">
                    🔒 ANEXO CONFIDENCIAL EXCLUSIVO PROPIETARIO Y ADMINISTRACIÓN (OCULTO PARA COMPRADOR Y AGENTE)
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 font-mono text-[11px]">
                    <div>
                      <span className="text-gray-500 block text-[9px]">Tasa de Ganancia / Corretaje:</span>
                      <strong className="text-amber-900">{ctr.totalCommissionRate}% (${ctr.totalCommissionAmount?.toLocaleString() || Math.round((ctr.totalValue || 0) * (ctr.totalCommissionRate / 100)).toLocaleString()} USD)</strong>
                    </div>
                    <div>
                      <span className="text-gray-500 block text-[9px]">Neto Dueño del Terreno:</span>
                      <strong className="text-emerald-800">{ctr.ownerNetRate || 80}% (${ctr.ownerNetAmount?.toLocaleString() || Math.round((ctr.totalValue || 0) * 0.8).toLocaleString()} USD)</strong>
                    </div>
                    <div>
                      <span className="text-gray-500 block text-[9px]">Comisión Asesor (Agente):</span>
                      <strong className="text-blue-900">{ctr.agentCommissionRate || 2}% (${ctr.agentCommissionAmount?.toLocaleString() || Math.round((ctr.totalValue || 0) * 0.02).toLocaleString()} USD)</strong>
                    </div>
                    <div>
                      <span className="text-gray-500 block text-[9px]">Modalidad Liquidación:</span>
                      <strong className="text-gray-900">{ctr.contractType === 'Venta' ? 'Total al Contado' : 'Depósito por Cuotas'}</strong>
                    </div>
                  </div>
                </div>
              )}

              <p className="text-justify text-gray-700">
                <strong>CONDICIONES ECONÓMICAS:</strong> {isSale ? (
                  <>
                    El valor de la compraventa se estipula en <strong>${ctr.totalValue?.toLocaleString() || ctr.monthlyRent.toLocaleString()} USD</strong>.
                    {ctr.contractType === 'Venta a Plazos' && (
                      <span> Con una prima inicial de <strong>${ctr.downPayment?.toLocaleString()} USD</strong> y saldo restante financiado a <strong>${ctr.financingYears} años</strong> ({ctr.installmentsCount} cuotas mensuales calculadas en <strong>${ctr.monthlyInstallment?.toLocaleString()} USD/mes</strong>).</span>
                    )}
                  </>
                ) : (
                  <>El arrendatario cancelará mensualmente la suma de <strong>${ctr.monthlyRent}.00 {ctr.currency}</strong> dentro de los primeros 5 días hábiles de cada periodo en la cuenta bancaria autorizada.</>
                )}
              </p>

              {/* CUENTAS BANCARIAS Y CUENTA CIRCULADA */}
              <div className="my-4 p-4 rounded-2xl bg-[#FAFBF9] border-2 border-dashed border-[#2D4539] space-y-2.5">
                <div className="flex items-center justify-between border-b pb-2">
                  <span className="font-bold text-xs uppercase tracking-wide text-[#1E3328] flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full border-2 border-emerald-700 bg-emerald-500 inline-block"></span>
                    Cuentas Bancarias Oficiales & Cuenta Receptora Designada
                  </span>
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-300">
                    Circulación de Cuenta Oficial
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                  {companySettings.bankAccounts.map((b) => {
                    const isReceiving = b.accountNumber === receivingAccNumber || (b.isDefaultReceiving && !companySettings.bankAccounts.some(x => x.accountNumber === receivingAccNumber));
                    return (
                      <div
                        key={b.id}
                        className={`p-3 rounded-xl transition-all relative ${
                          isReceiving
                            ? 'ring-3 ring-emerald-700 bg-emerald-50/90 border-2 border-emerald-600 shadow-sm'
                            : 'bg-white border border-gray-200 text-gray-500 opacity-60'
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-gray-900">{b.bankName}</span>
                          {isReceiving && (
                            <span className="text-[10px] bg-emerald-700 text-white px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                              <span>⭕</span> CUENTA CIRCULADA
                            </span>
                          )}
                        </div>
                        <p className="font-mono font-bold text-gray-900 mt-1">Cuenta N°: {b.accountNumber}</p>
                        <p className="text-[10px] text-gray-600">Titular: {b.accountHolder} · {b.accountType}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              <p className="text-justify text-gray-700">
                <strong>VIGENCIA:</strong> El presente contrato rige desde el <strong>{ctr.startDate}</strong> hasta el <strong>{ctr.endDate}</strong>.
              </p>
            </div>
          </div>

          {/* Firmas */}
          <div className="pt-8 border-t border-gray-200 grid grid-cols-3 gap-4 text-center">
            <div className="space-y-2">
              <div className="h-16 flex items-end justify-center">
                {ctr.signatureImageOwner ? (
                  <img src={ctr.signatureImageOwner} alt="Firma Propietario" className="max-h-14 max-w-[150px] object-contain" />
                ) : ctr.isSignedDigitally ? (
                  <span className="font-serif-brand italic text-sm text-[#1E3328] font-bold">✓ {ctr.ownerName}</span>
                ) : ctr.signedDocumentUrl ? (
                  <span className="text-xs text-blue-700 font-bold">✓ Firma Física</span>
                ) : (
                  <span className="text-gray-300">_____________________</span>
                )}
              </div>
              <div className="border-t border-gray-400 pt-1">
                <p className="font-bold text-[11px] text-gray-900">{isSale ? 'EL VENDEDOR' : 'EL ARRENDADOR'}</p>
                <p className="text-[10px] text-gray-500">{ctr.ownerName}</p>
                {ctr.signatureImageOwner && (
                  <span className="text-[9px] text-emerald-700 font-bold block">✓ Firma Digital Validada</span>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <div className="h-16 flex items-end justify-center">
                {ctr.signatureImageTenant ? (
                  <img src={ctr.signatureImageTenant} alt="Firma Inquilino" className="max-h-14 max-w-[150px] object-contain" />
                ) : ctr.isSignedDigitally ? (
                  <span className="font-serif-brand italic text-sm text-[#1E3328] font-bold">✓ {ctr.tenantName}</span>
                ) : ctr.signedDocumentUrl ? (
                  <span className="text-xs text-blue-700 font-bold">✓ Firma Física</span>
                ) : (
                  <span className="text-gray-300">_____________________</span>
                )}
              </div>
              <div className="border-t border-gray-400 pt-1">
                <p className="font-bold text-[11px] text-gray-900">{isSale ? 'EL COMPRADOR' : 'EL ARRENDATARIO'}</p>
                <p className="text-[10px] text-gray-500">{ctr.tenantName}</p>
                <p className="text-[9px] text-gray-400 font-mono">DNI: {ctr.tenantNationalId || '0801-1996-04812'}</p>
                {ctr.signatureImageTenant && (
                  <span className="text-[9px] text-emerald-700 font-bold block">✓ Firma Digital Validada</span>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <div className="h-16 flex items-end justify-center">
                {ctr.signatureImageAdmin ? (
                  <img src={ctr.signatureImageAdmin} alt="Firma Administrador" className="max-h-14 max-w-[150px] object-contain" />
                ) : ctr.isSignedDigitally ? (
                  <span className="font-serif-brand italic text-sm text-[#1E3328] font-bold">✓ {ctr.managerName || 'Kenneth Adonay Zúniga'}</span>
                ) : ctr.signedDocumentUrl ? (
                  <span className="text-xs text-blue-700 font-bold">✓ Atestiguado</span>
                ) : (
                  <span className="text-gray-300">_____________________</span>
                )}
              </div>
              <div className="border-t border-gray-400 pt-1">
                <p className="font-bold text-[11px] text-gray-900">ENCARGADO ADMINISTRATIVO</p>
                <p className="text-[10px] text-gray-500">{ctr.managerEmail || 'administracion@terranova.hn'}</p>
                {ctr.signatureImageAdmin && (
                  <span className="text-[9px] text-emerald-700 font-bold block">✓ Firma Digital Validada</span>
                )}
              </div>
            </div>
          </div>

          {/* Digital Certification Stamp */}
          <div className="bg-[#FAFBF9] p-3 rounded-lg border border-gray-200 text-center text-[10px] text-gray-500">
            {ctr.isSignedDigitally
              ? `Documento electrónico validado con firma digital · Sellado por ${ctr.managerName || ctr.agentName} · Terranova Gestión Inmobiliaria`
              : (ctr.signedDocumentUrl
                ? `Instrumento físico con firmas autógrafas resguardado mediante escaneo digital (${ctr.signedDocumentFileName}) · Terranova Inversiones`
                : `Borrador provisional sin validez ejecutoria · Pendiente de firmas`)}
          </div>
        </div>
      );
    }

    if (printDoc.type === 'payroll_receipt') {
      const rec = printDoc.data as PayrollRecord;
      return (
        <div className="printable-document bg-white p-8 sm:p-12 max-w-3xl mx-auto space-y-6 text-gray-900 border border-gray-300 text-xs">
          {/* Header */}
          <div className="flex justify-between items-start border-b pb-4">
            <div>
              <h1 className="font-serif-brand text-2xl font-bold tracking-widest text-[#1D3227] uppercase">
                {companySettings.companyName}
              </h1>
              <p className="text-xs uppercase tracking-wider text-gray-500 font-semibold">
                RECIBO OFICIAL DE LIQUIDACIÓN DE NÓMINA & COMISIONES
              </p>
              {companySettings.includeTaxRtn !== false && companySettings.rtn && (
                <p className="text-[11px] font-mono text-gray-600 mt-0.5">RTN: {companySettings.rtn}</p>
              )}
            </div>
            <div className="text-right">
              <span className="font-mono text-sm font-bold text-[#1E3328] bg-gray-100 px-3 py-1 rounded block">
                {rec.payrollNumber}
              </span>
              <p className="text-xs text-gray-500 mt-1">Periodo: {rec.periodMonth} {rec.periodYear}</p>
              <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 inline-block mt-1">
                Estado: {rec.status}
              </span>
            </div>
          </div>

          {/* Datos del Colaborador */}
          <div className="bg-[#FAFBF9] p-4 rounded-xl border border-gray-200 grid grid-cols-2 gap-3">
            <div>
              <span className="text-gray-500 text-[10px] block">Colaborador / Beneficiario:</span>
              <span className="font-bold text-gray-900 text-sm">{rec.employeeName}</span>
              <span className="text-gray-600 text-xs block">{rec.position}</span>
            </div>
            <div>
              <span className="text-gray-500 text-[10px] block">Forma y Vía de Pago:</span>
              <span className="font-semibold text-gray-800 text-xs block">{rec.paymentMethod}</span>
              <span className="text-gray-600 text-[11px] font-mono block">Cta Dispersada: {rec.disbursedBankAccount || 'Banco Ficohsa'}</span>
              <span className="text-gray-600 text-[11px] font-mono block">Ref ACH: {rec.referenceCode || 'ACH-NOM-88492'}</span>
            </div>
          </div>

          {/* Desglose de Haberes: Salario Base + Comisiones Vinculadas */}
          <div className="space-y-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-[#1E3328] border-b pb-1">
              Desglose Detallado de Percepciones & Comisiones Contractuales
            </h4>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-100 text-gray-700 font-bold text-[11px] border-b">
                    <th className="p-2">Concepto / Contrato Vinculado</th>
                    <th className="p-2 text-right">Monto Venta / Base</th>
                    {(currentUser.role === 'admin' || currentUser.role === 'owner') && (
                      <>
                        <th className="p-2 text-center">% Acordado</th>
                        <th className="p-2 text-center">Part. Terranova</th>
                      </>
                    )}
                    <th className="p-2 text-center">Part. Agente</th>
                    <th className="p-2 text-right">Subtotal Liquidado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="p-2 font-semibold">Salario Base Mensual Ordinario</td>
                    <td className="p-2 text-right font-mono">${rec.baseSalary.toLocaleString()}</td>
                    {(currentUser.role === 'admin' || currentUser.role === 'owner') && (
                      <>
                        <td className="p-2 text-center text-gray-500">-</td>
                        <td className="p-2 text-center text-gray-500">-</td>
                      </>
                    )}
                    <td className="p-2 text-center text-gray-500">-</td>
                    <td className="p-2 text-right font-mono font-bold text-gray-900">${rec.baseSalary.toLocaleString()} USD</td>
                  </tr>

                  {rec.contractCommissions.map((comm, idx) => (
                    <tr key={idx} className="bg-emerald-50/40">
                      <td className="p-2">
                        <span className="font-bold text-gray-900 block">{comm.contractNumber} · {comm.propertyTitle}</span>
                        <span className="text-[10px] text-gray-500">Cierre de Venta Exitoso ({comm.date})</span>
                      </td>
                      <td className="p-2 text-right font-mono font-semibold">${comm.saleAmount.toLocaleString()}</td>
                      {(currentUser.role === 'admin' || currentUser.role === 'owner') && (
                        <>
                          <td className="p-2 text-center font-bold text-emerald-800">{comm.totalCommissionPercent}% (${(comm.saleAmount * (comm.totalCommissionPercent / 100)).toLocaleString()})</td>
                          <td className="p-2 text-center text-gray-600">{comm.terranovaCommissionPercent}% (${comm.terranovaEarned.toLocaleString()})</td>
                        </>
                      )}
                      <td className="p-2 text-center font-bold text-[#1E3328]">{comm.agentCommissionPercent}% (${comm.agentCommissionEarned.toLocaleString()})</td>
                      <td className="p-2 text-right font-mono font-bold text-emerald-800">${comm.agentCommissionEarned.toLocaleString()} USD</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Total Box */}
            <div className="bg-[#2D4539] text-white p-4 rounded-xl flex justify-between items-center font-mono">
              <div>
                <span className="text-xs uppercase tracking-wider text-white/70 block">Total Líquido Devengado & Acreditado:</span>
                <span className="text-[11px] text-emerald-200 font-sans">Salario Base (${rec.baseSalary.toLocaleString()}) + Comisiones (${rec.totalCommissions.toLocaleString()})</span>
              </div>
              <span className="text-2xl font-bold font-serif-brand">${rec.netPayable.toLocaleString()} {rec.currency}</span>
            </div>

            {rec.notes && (
              <p className="text-[11px] text-gray-600 italic bg-[#FAFBF9] p-2.5 rounded-lg border border-gray-200">
                <strong>Observaciones de Tesorería:</strong> {rec.notes}
              </p>
            )}
          </div>

          {/* Firmas */}
          <div className="pt-8 border-t border-gray-200 grid grid-cols-2 gap-8 text-center">
            <div>
              <div className="h-12 border-b border-gray-400 flex items-end justify-center pb-1 font-serif-brand italic">
                {rec.employeeName}
              </div>
              <p className="font-bold text-[11px] mt-1 text-gray-900">FIRMA DEL COLABORADOR</p>
              <p className="text-[10px] text-gray-500">Recibí conforme el importe total liquidado</p>
            </div>
            <div>
              <div className="h-12 border-b border-gray-400 flex items-end justify-center pb-1 font-serif-brand italic font-bold text-[#1E3328]">
                Lic. Kenneth Adonay Zúniga
              </div>
              <p className="font-bold text-[11px] mt-1 text-gray-900">ADMINISTRACIÓN & TESORERÍA</p>
              <p className="text-[10px] text-gray-500">Terranova Gestión Inmobiliaria S. de R.L.</p>
            </div>
          </div>
        </div>
      );
    }

    if (printDoc.type === 'receipt') {
      const pay = printDoc.data as PaymentTransaction;
      const isEnProceso = pay.status === 'En Proceso' || pay.status === 'Pendiente';

      return (
        <div className="printable-document bg-white p-8 max-w-xl mx-auto space-y-6 text-gray-900 border border-gray-300 text-xs">
          {/* Header */}
          <div className="flex justify-between items-start border-b pb-4">
            <div>
              <h1 className="font-serif-brand text-2xl font-bold tracking-widest text-[#1D3227] uppercase">
                TERRANOVA
              </h1>
              <p className="text-[10px] tracking-[0.2em] text-[#637C6C] font-semibold uppercase">
                TU SUEÑO, AL ALCANCE
              </p>
              {companySettings.includeTaxRtn !== false && companySettings.rtn ? (
                <p className="text-[11px] text-gray-500 mt-1">RTN: {companySettings.rtn}</p>
              ) : (
                <p className="text-[10px] text-gray-400 italic mt-1">(RTN no declarado / Facturación fiscal exenta)</p>
              )}
            </div>

            <div className="text-right">
              <span className="font-mono text-sm font-bold text-[#1E3328] bg-gray-100 px-3 py-1 rounded block">
                {pay.receiptNumber}
              </span>
              <p className="text-xs text-gray-500 mt-1">Fecha: {pay.date}</p>
            </div>
          </div>

          {/* En Proceso Warning Banner if pending clearance */}
          {isEnProceso && (
            <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-300 text-amber-900 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-xs text-amber-950">
                <Clock className="w-4 h-4 text-amber-700 shrink-0" />
                <span>PAGO EN PROCESO: Verificando transacción</span>
              </div>
              <p className="text-[11px] text-amber-800 leading-relaxed">
                Este comprobante acredita la recepción de la solicitud de pago. Dado que la plataforma no cuenta con débito bancario automático directo, el pago se encuentra en proceso de verificación por tesorería. El comprobante final definitivo será enviado y validado externamente una vez confirmada la acreditación bancaria.
              </p>
            </div>
          )}

          {/* Details */}
          <div className="bg-[#FAFBF9] p-4 rounded-xl border border-gray-200 space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-500">Recibido de:</span>
              <span className="font-bold text-gray-900">{pay.payerName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Correo Electrónico:</span>
              <span className="text-gray-800">{pay.payerEmail}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Concepto:</span>
              <span className="font-semibold text-gray-800">{pay.type} ({pay.monthCovered || 'Periodo corriente'})</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Propiedad:</span>
              <span className="font-semibold text-gray-800">{pay.propertyTitle}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Método de Pago:</span>
              <span className="text-gray-800">{pay.paymentMethod}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Código de Referencia:</span>
              <span className="font-mono font-bold text-gray-900">{pay.referenceCode}</span>
            </div>
          </div>

          {/* Total Amount Box */}
          <div className="p-4 bg-[#2D4539] text-white rounded-xl flex justify-between items-center">
            <span className="font-bold text-sm uppercase tracking-wider">
              {isEnProceso ? 'Monto a Validar:' : 'Monto Total Recibido:'}
            </span>
            <span className="font-mono text-2xl font-bold">${pay.amount.toLocaleString()} {pay.currency}</span>
          </div>

          <div className="pt-4 border-t border-gray-200 flex justify-between items-center text-[10px] text-gray-500">
            <span>Comprobante digital emitido para efectos de control financiero interno</span>
            {isEnProceso ? (
              <span className="font-bold text-amber-800 bg-amber-100 px-2.5 py-1 rounded-full border border-amber-300 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> ESTADO: EN PROCESO
              </span>
            ) : (
              <span className="font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full border border-emerald-300 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> ESTADO: PAGADO
              </span>
            )}
          </div>
        </div>
      );
    }

    if (printDoc.type === 'financial_report') {
      const rep = printDoc.data;
      return (
        <div className="printable-document bg-white p-8 max-w-3xl mx-auto space-y-6 text-gray-900 border border-gray-300 text-xs">
          <div className="flex justify-between items-center border-b pb-4">
            <div>
              <h1 className="font-serif-brand text-2xl font-bold tracking-widest text-[#1D3227] uppercase">
                TERRANOVA GESTIÓN INMOBILIARIA
              </h1>
              <p className="text-xs uppercase tracking-wider text-gray-500 font-semibold">
                INFORME EJECUTIVO FINANCIERO Y DE OCUPACIÓN
              </p>
            </div>
            <div className="text-right">
              <span className="font-mono text-xs text-gray-500">Fecha de corte: {rep.date}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div className="bg-[#FAFBF9] p-4 rounded-xl border">
              <span className="text-gray-500 block">Total Recaudación Bruta</span>
              <span className="font-mono text-xl font-bold text-emerald-800">${rep.totalGrossIncome?.toLocaleString()} USD</span>
            </div>
            <div className="bg-[#FAFBF9] p-4 rounded-xl border">
              <span className="text-gray-500 block">Gastos por Mantenimiento</span>
              <span className="font-mono text-xl font-bold text-rose-800">${rep.totalMaintenanceExpenses?.toLocaleString()} USD</span>
            </div>
            <div className="bg-[#FAFBF9] p-4 rounded-xl border">
              <span className="text-gray-500 block">Utilidad Neta Operativa</span>
              <span className="font-mono text-xl font-bold text-emerald-700">${rep.netOperatingIncome?.toLocaleString()} USD</span>
            </div>
          </div>

          <div className="bg-[#FAFBF9] p-4 rounded-xl border space-y-2">
            <h4 className="font-bold text-sm">Resumen de Ocupación de Inmuebles</h4>
            <p>Propiedades Totales en Inventario: <strong>{rep.totalProperties}</strong></p>
            <p>Propiedades Alquiladas con Contrato: <strong>{rep.occupiedProperties}</strong></p>
            <p>Tasa de Ocupación Global: <strong>{rep.globalOccupancyRate}%</strong></p>
          </div>

          <div className="pt-6 border-t text-[11px] text-gray-500 flex justify-between">
            <span>Generado por: Administrador Kenneth Adonay Zúniga</span>
            <span className="font-serif-brand tracking-widest">TU SUEÑO, AL ALCANCE</span>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-2xl flex flex-col">
        {/* Top Control Bar (Hidden on Print) */}
        <div className="no-print p-4 sm:p-6 border-b border-gray-100 flex items-center justify-between bg-[#FAFBF9] rounded-t-3xl sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-wider text-[#2D4539] font-bold">
              Vista Previa de Documento Oficial Imprimible
            </span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {printDoc.type === 'contract' && (
              <button
                onClick={() => setShowSignaturePad(prev => !prev)}
                className="px-3 py-1.5 rounded-xl bg-[#2D4539] hover:bg-[#1E3328] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs"
              >
                <Pen className="w-3.5 h-3.5" />
                <span>{showSignaturePad ? 'Ocultar Panel Firma' : 'Firmar Digital'}</span>
              </button>
            )}

            {isContractUnsigned ? (
              <>
                <button
                  onClick={() => handleDownloadDocument(true)}
                  className="px-3.5 py-1.5 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors shadow-2xs"
                  title="Descargar versión borrador / minuta previa para revisión o firmas físicas presenciales"
                >
                  <Download className="w-3.5 h-3.5 text-gray-500" />
                  <span>Descargar Borrador</span>
                </button>

                <button
                  onClick={() => handleDownloadDocument(false)}
                  disabled
                  className="px-4 py-1.5 bg-gray-300 text-gray-500 text-xs font-semibold rounded-xl flex items-center gap-1.5 cursor-not-allowed opacity-75"
                  title="Requiere al menos una firma digital o escaneo cargado"
                >
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span>Descargar Contrato Firmado (Bloqueado)</span>
                </button>
              </>
            ) : (
              <button
                onClick={() => handleDownloadDocument(false)}
                className="px-4 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors shadow-xs"
                title="Descargar Contrato Oficial con Sellos y Firmas Digitales"
              >
                <FileCheck2 className="w-4 h-4" />
                <span>Descargar Contrato Firmado</span>
              </button>
            )}

            <button
              onClick={handlePrint}
              disabled={isContractUnsigned}
              className={`px-3.5 py-1.5 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors shadow-xs ${
                isContractUnsigned ? 'bg-gray-400 cursor-not-allowed opacity-60' : 'bg-[#2D4539] hover:bg-[#20342A]'
              }`}
              title={isContractUnsigned ? 'Contrato sin firmar: prohibida su impresión oficial' : 'Imprimir / Guardar PDF'}
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Imprimir PDF</span>
            </button>

            <button
              onClick={closePrintModal}
              className="p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Printable Content */}
        <div className="p-4 sm:p-8 overflow-y-auto">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};
