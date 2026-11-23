import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  FileText, 
  Printer, 
  CheckCircle2, 
  Home, 
  CreditCard, 
  Layers, 
  Calendar, 
  Palette, 
  Download,
  Building2,
  Users,
  ShieldAlert
} from 'lucide-react';

export const PrintFormatsView: React.FC = () => {
  const { 
    currentUser,
    properties, 
    contracts, 
    payments, 
    openPrintModal,
    companySettings,
    updateCompanySettings,
    addBankAccount,
    deleteBankAccount,
    setDefaultReceivingAccount,
    showToast
  } = useApp();

  const casaPrince = properties.find(p => p.code === 'CASA PRINCE') || properties[0];
  const demoContract = contracts[0];
  const demoReceipt = payments[0];

  // State for Customer Service & Company Settings Editor
  const [csPhone, setCsPhone] = React.useState(companySettings.phone);
  const [csWhatsapp, setCsWhatsapp] = React.useState(companySettings.whatsapp);
  const [csEmail, setCsEmail] = React.useState(companySettings.email);
  const [csHours, setCsHours] = React.useState(companySettings.customerServiceHours);
  const [compName, setCompName] = React.useState(companySettings.companyName);
  const [compSlogan, setCompSlogan] = React.useState(companySettings.slogan);
  const [compRtn, setCompRtn] = React.useState(companySettings.rtn);
  const [compAddress, setCompAddress] = React.useState(companySettings.address);

  // State for New Bank Account Form
  const [showAddBank, setShowAddBank] = React.useState(false);
  const [newBankName, setNewBankName] = React.useState('');
  const [newBankAccNumber, setNewBankAccNumber] = React.useState('');
  const [newBankType, setNewBankType] = React.useState('Cuenta de Cheques USD');
  const [newBankHolder, setNewBankHolder] = React.useState(companySettings.companyName);

  const [bankFormError, setBankFormError] = React.useState<string | null>(null);

  const handleSaveCompanySettings = (e: React.FormEvent) => {
    e.preventDefault();

    // Validar teléfono: debe tener al menos 8 dígitos numéricos
    const cleanPhoneDigits = csPhone.replace(/\D/g, '');
    if (cleanPhoneDigits.length < 8) {
      showToast('Error: El teléfono PBX debe contener al menos 8 dígitos numéricos.');
      return;
    }

    // Validar WhatsApp
    const cleanWaDigits = csWhatsapp.replace(/\D/g, '');
    if (csWhatsapp && cleanWaDigits.length < 8) {
      showToast('Error: El WhatsApp debe contener al menos 8 dígitos numéricos.');
      return;
    }

    // Validar RTN de Honduras: exactamente 14 dígitos numéricos
    const cleanRtnDigits = compRtn.replace(/\D/g, '');
    if (cleanRtnDigits.length !== 14) {
      showToast('Error: El RTN oficial de Honduras debe contener exactamente 14 dígitos numéricos.');
      return;
    }

    updateCompanySettings({
      phone: csPhone.trim(),
      whatsapp: csWhatsapp.trim(),
      email: csEmail.trim(),
      customerServiceHours: csHours.trim(),
      companyName: compName.trim(),
      slogan: compSlogan.trim(),
      rtn: compRtn.trim(),
      address: compAddress.trim()
    });
    showToast('Datos de atención al cliente y empresa actualizados exitosamente');
  };

  const handleAddBankSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setBankFormError(null);

    const cleanBankName = newBankName.trim();
    const cleanAccNumber = newBankAccNumber.trim();
    const cleanHolder = newBankHolder.trim();

    // Validar nombre del banco (solo letras y espacios, mínimo 3 caracteres)
    if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s.&'-]{3,}$/.test(cleanBankName)) {
      setBankFormError('El nombre de la institución bancaria solo debe contener letras y tener al menos 3 caracteres.');
      return;
    }

    // Validar número de cuenta: solo dígitos numéricos y guiones (mínimo 8 dígitos)
    const digitsOnly = cleanAccNumber.replace(/\D/g, '');
    if (digitsOnly.length < 8) {
      setBankFormError('El número de cuenta bancaria debe contener al menos 8 dígitos numéricos.');
      return;
    }

    // Validar titular (solo letras y espacios)
    if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s.&'-]{3,}$/.test(cleanHolder)) {
      setBankFormError('El nombre del titular de la cuenta debe contener letras y un mínimo de 3 caracteres.');
      return;
    }

    addBankAccount({
      bankName: cleanBankName,
      accountNumber: cleanAccNumber,
      accountType: newBankType.trim(),
      accountHolder: cleanHolder,
      beneficiaryName: cleanHolder || 'TERRANOVA GESTIÓN INMOBILIARIA S. DE R.L.',
      currency: newBankType.includes('HNL') ? 'HNL' : 'USD',
      isDefaultReceiving: companySettings.bankAccounts.length === 0
    });

    setNewBankName('');
    setNewBankAccNumber('');
    setShowAddBank(false);
    showToast(`Cuenta bancaria ${cleanBankName} registrada exitosamente.`);
  };

  // Restricción visual si un no-administrador intentase entrar
  if (currentUser.role !== 'admin') {
    return (
      <div className="bg-white rounded-3xl border border-rose-200 p-8 text-center space-y-4 max-w-xl mx-auto my-12 shadow-sm">
        <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-700 flex items-center justify-center mx-auto">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h2 className="font-serif-brand text-2xl font-bold text-gray-900">
          Módulo Exclusivo para Administrador
        </h2>
        <p className="text-xs text-gray-600 leading-relaxed">
          Los formatos de impresión oficiales, papelería corporativa y edición de parámetros de atención al cliente están reservados estrictamente para la cuenta administrativa de Terranova.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Banner */}
      <div className="bg-[#263E32] rounded-3xl p-6 sm:p-8 text-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-md">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-[#3D5E4E] text-[#BDE2C8] text-xs font-bold uppercase tracking-wider">
              Control Administrativo · Papelería Oficial & Formatos
            </span>
          </div>
          <h1 className="font-serif-brand text-2xl sm:text-3xl font-bold">
            Formatos de Impresión, Fichas Técnicas & Parámetros
          </h1>
          <p className="text-xs sm:text-sm text-white/80 mt-1 max-w-2xl">
            Modifica los datos de atención al cliente, bancos y cuentas oficiales receptoras (que aparecerán circuladas en los contratos legales) sin requerir código técnico.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => openPrintModal({ type: 'contract', data: demoContract })}
            className="px-4 py-2.5 rounded-xl bg-[#C36449] hover:bg-[#B1573D] text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>Ver Contrato con Cuenta Circulada</span>
          </button>
        </div>
      </div>

      {/* SECCIÓN 1: EDITOR DE ATENCIÓN AL CLIENTE Y DATOS DE LA EMPRESA (PARA NO PROGRAMADORES) */}
      <div className="bg-white rounded-3xl border border-[#D5E1D4] p-6 sm:p-8 shadow-2xs space-y-6 text-xs">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-gray-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-[#2D4539]" />
              <h3 className="font-serif-brand text-xl font-bold text-gray-900">
                Editor de Datos de Atención al Cliente & Pie de Página
              </h3>
            </div>
            <p className="text-gray-500 mt-0.5">
              Cambia los teléfonos, correos y horarios que se reflejan automáticamente en el pie de página, fichas técnicas y contratos.
            </p>
          </div>

          <span className="px-3 py-1 rounded-full bg-[#EEF5ED] text-[#244231] font-bold text-[11px] border border-[#CAD8C8]">
            Panel de Administrador
          </span>
        </div>

        <form onSubmit={handleSaveCompanySettings} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Teléfono PBX de Atención</label>
              <input
                type="text"
                required
                placeholder="+504 2239-0000"
                value={csPhone}
                onChange={(e) => setCsPhone(e.target.value.replace(/[^0-9+\s-]/g, ''))}
                className="w-full bg-[#FAFBF9] border border-[#CAD8C8] rounded-xl p-2.5 text-gray-800 font-mono"
              />
              <span className="text-[10px] text-gray-400 mt-0.5 block">Solo dígitos numéricos y prefijo '+'</span>
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">WhatsApp de Contacto</label>
              <input
                type="text"
                required
                placeholder="+504 9912-3456"
                value={csWhatsapp}
                onChange={(e) => setCsWhatsapp(e.target.value.replace(/[^0-9+\s-]/g, ''))}
                className="w-full bg-[#FAFBF9] border border-[#CAD8C8] rounded-xl p-2.5 text-gray-800 font-mono"
              />
              <span className="text-[10px] text-gray-400 mt-0.5 block">Solo dígitos numéricos y prefijo '+'</span>
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">Correo de Atención al Cliente</label>
              <input
                type="email"
                required
                value={csEmail}
                onChange={(e) => setCsEmail(e.target.value)}
                className="w-full bg-[#FAFBF9] border border-[#CAD8C8] rounded-xl p-2.5 text-gray-800"
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">Horario de Recepción</label>
              <input
                type="text"
                required
                value={csHours}
                onChange={(e) => setCsHours(e.target.value)}
                className="w-full bg-[#FAFBF9] border border-[#CAD8C8] rounded-xl p-2.5 text-gray-800"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Nombre Comercial de la Empresa</label>
              <input
                type="text"
                required
                value={compName}
                onChange={(e) => setCompName(e.target.value)}
                className="w-full bg-[#FAFBF9] border border-[#CAD8C8] rounded-xl p-2.5 text-gray-800 font-semibold"
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">Eslogan Corporativo</label>
              <input
                type="text"
                required
                value={compSlogan}
                onChange={(e) => setCompSlogan(e.target.value)}
                className="w-full bg-[#FAFBF9] border border-[#CAD8C8] rounded-xl p-2.5 text-gray-800"
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">RTN Jurídico (Solo para Facturas y Contratos)</label>
              <input
                type="text"
                required
                placeholder="08011990123456"
                value={compRtn}
                onChange={(e) => setCompRtn(e.target.value.replace(/[^0-9-]/g, '').slice(0, 16))}
                className="w-full bg-[#FAFBF9] border border-[#CAD8C8] rounded-xl p-2.5 text-gray-800 font-mono"
              />
              <span className="text-[10px] text-gray-400 mt-0.5 block">14 dígitos numéricos (No visible en pie de página)</span>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-gray-700 mb-1">Dirección Oficial en Tegucigalpa</label>
            <input
              type="text"
              required
              value={compAddress}
              onChange={(e) => setCompAddress(e.target.value)}
              className="w-full bg-[#FAFBF9] border border-[#CAD8C8] rounded-xl p-2.5 text-gray-800"
            />
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-[#2D4539] hover:bg-[#20342A] text-white font-bold text-xs flex items-center gap-2 shadow-xs transition-colors"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-300" />
              <span>Guardar Cambios de Atención al Cliente & Empresa</span>
            </button>
          </div>
        </form>
      </div>

      {/* SECCIÓN 2: GESTIÓN DE BANCOS Y CUENTAS RECEPTORAS (CIRCULACIÓN EN CONTRATOS) */}
      <div className="bg-white rounded-3xl border border-[#D5E1D4] p-6 sm:p-8 shadow-2xs space-y-6 text-xs">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-gray-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-[#C36449]" />
              <h3 className="font-serif-brand text-xl font-bold text-gray-900">
                Gestión de Tipos de Pago, Bancos & Cuentas Receptoras
              </h3>
            </div>
            <p className="text-gray-500 mt-0.5">
              Administra las cuentas bancarias autorizadas. En los contratos legales se circulará automáticamente la cuenta designada como receptora.
            </p>
          </div>

          <button
            onClick={() => setShowAddBank(!showAddBank)}
            className="px-4 py-2 rounded-xl bg-[#2D4539] hover:bg-[#20342A] text-white font-semibold text-xs transition-colors flex items-center gap-1.5 shadow-2xs"
          >
            <span>{showAddBank ? 'Cerrar Formulario' : '+ Agregar Otro Banco o Cuenta'}</span>
          </button>
        </div>

        {/* Modal / Formulario para Agregar Banco */}
        {showAddBank && (
          <form onSubmit={handleAddBankSubmit} className="p-4 bg-[#FAFBF9] border border-[#CAD8C8] rounded-2xl space-y-3 animate-in fade-in">
            <h4 className="font-bold text-sm text-[#1E3328]">Registrar Nueva Cuenta Bancaria</h4>
            
            {bankFormError && (
              <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-[11px] font-medium">
                {bankFormError}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Nombre de la Institución Bancaria</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: BAC Credomatic, Banco Atlántida..."
                  value={newBankName}
                  onChange={(e) => setNewBankName(e.target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s.&'-]/g, ''))}
                  className="w-full bg-white border border-[#CAD8C8] rounded-xl p-2 text-xs"
                />
                <span className="text-[10px] text-gray-400 mt-0.5 block">Solo letras y nombres bancarios</span>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Número de Cuenta</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: 7421-9988-1234-55"
                  value={newBankAccNumber}
                  onChange={(e) => setNewBankAccNumber(e.target.value.replace(/[^0-9-]/g, '').slice(0, 24))}
                  className="w-full bg-white border border-[#CAD8C8] rounded-xl p-2 text-xs font-mono"
                />
                <span className="text-[10px] text-gray-400 mt-0.5 block">Solo números y guiones</span>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Tipo de Cuenta</label>
                <select
                  value={newBankType}
                  onChange={(e) => setNewBankType(e.target.value)}
                  className="w-full bg-white border border-[#CAD8C8] rounded-xl p-2 text-xs font-medium"
                >
                  <option value="Cuenta de Cheques USD">Cuenta de Cheques (USD)</option>
                  <option value="Cuenta de Ahorros USD">Cuenta de Ahorros (USD)</option>
                  <option value="Cuenta de Cheques HNL">Cuenta de Cheques (Lempiras HNL)</option>
                  <option value="Cuenta de Ahorros HNL">Cuenta de Ahorros (Lempiras HNL)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Titular de la Cuenta</label>
                <input
                  type="text"
                  required
                  value={newBankHolder}
                  onChange={(e) => setNewBankHolder(e.target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s.&'-]/g, ''))}
                  className="w-full bg-white border border-[#CAD8C8] rounded-xl p-2 text-xs"
                />
                <span className="text-[10px] text-gray-400 mt-0.5 block">Solo letras y denominación social</span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setShowAddBank(false)}
                className="px-3 py-1.5 rounded-xl border border-gray-300 text-gray-700 font-semibold"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-xl bg-[#2D4539] text-white font-semibold hover:bg-[#20342A]"
              >
                Guardar Cuenta
              </button>
            </div>
          </form>
        )}

        {/* Listado de Cuentas Actuales con Indicación de Cuenta Circulada */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {companySettings.bankAccounts.map((b) => (
            <div 
              key={b.id} 
              className={`p-4 rounded-2xl border transition-all ${
                b.isDefaultReceiving 
                  ? 'border-emerald-600 bg-emerald-50/70 ring-2 ring-emerald-600 shadow-xs' 
                  : 'border-gray-200 bg-[#FAFBF9]'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-bold text-gray-900 text-sm">{b.bankName}</h4>
                  <p className="text-[11px] text-gray-500 font-mono">N° {b.accountNumber}</p>
                </div>
                {b.isDefaultReceiving ? (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-700 text-white font-bold text-[10px]">
                    ⭕ Circulada en Contratos
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 font-semibold text-[10px]">
                    Secundaria
                  </span>
                )}
              </div>

              <div className="space-y-1 text-[11px] text-gray-600 mb-3">
                <p><strong>Titular:</strong> {b.accountHolder}</p>
                <p><strong>Tipo:</strong> {b.accountType} ({b.currency})</p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-gray-200/80">
                {!b.isDefaultReceiving ? (
                  <button
                    onClick={() => setDefaultReceivingAccount(b.id)}
                    className="text-xs text-[#2D4539] hover:underline font-bold"
                  >
                    Marcar como Receptora
                  </button>
                ) : (
                  <span className="text-[10px] text-emerald-800 font-bold">
                    ✓ Receptora Designada
                  </span>
                )}

                {companySettings.bankAccounts.length > 1 && (
                  <button
                    onClick={() => deleteBankAccount(b.id)}
                    className="text-xs text-rose-600 hover:text-rose-800"
                    title="Eliminar cuenta"
                  >
                    Eliminar
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECCIÓN 3: EXPEDICIÓN DE FORMATOS IMPRIMIBLES OFICIALES */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Document 1: Ficha Técnica Casa Prince */}
        <div className="bg-white rounded-3xl border border-[#D5E1D4] p-5 shadow-2xs flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#EEF5ED] text-[#2D4539] flex items-center justify-center">
              <Home className="w-6 h-6" />
            </div>
            <h4 className="font-serif-brand text-lg font-bold text-gray-900">
              Ficha Técnica de Inmueble
            </h4>
            <p className="text-xs text-gray-500 leading-relaxed">
              Formato exacto de la página 27 y 29: Código, detalles de habitaciones, parqueos, baños extras, superficie, encargado y precio.
            </p>
          </div>

          <button
            onClick={() => openPrintModal({ type: 'property_sheet', data: casaPrince })}
            className="w-full py-2.5 bg-[#FAFBF9] hover:bg-[#EEF5ED] border border-[#CAD6C8] text-[#244231] rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Ver Ficha Técnica</span>
          </button>
        </div>

        {/* Document 2: Contrato Privado de Arrendamiento */}
        <div className="bg-white rounded-3xl border border-[#D5E1D4] p-5 shadow-2xs flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#EEF5ED] text-[#2D4539] flex items-center justify-center">
              <FileText className="w-6 h-6" />
            </div>
            <h4 className="font-serif-brand text-lg font-bold text-gray-900">
              Contrato de Arrendamiento
            </h4>
            <p className="text-xs text-gray-500 leading-relaxed">
              Documento legal generado con datos de inquilino (ID, teléfono), encargado y la cuenta bancaria receptora circulada.
            </p>
          </div>

          <button
            onClick={() => openPrintModal({ type: 'contract', data: demoContract })}
            className="w-full py-2.5 bg-[#FAFBF9] hover:bg-[#EEF5ED] border border-[#CAD6C8] text-[#244231] rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Ver Contrato Arrendamiento</span>
          </button>
        </div>

        {/* Document 3: Recibo de Pago */}
        <div className="bg-white rounded-3xl border border-[#D5E1D4] p-5 shadow-2xs flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#EEF5ED] text-[#2D4539] flex items-center justify-center">
              <CreditCard className="w-6 h-6" />
            </div>
            <h4 className="font-serif-brand text-lg font-bold text-gray-900">
              Comprobante Oficial de Pago
            </h4>
            <p className="text-xs text-gray-500 leading-relaxed">
              Recibo fiscal con folio único, método de pago, código de autorización y desglose de canon mensual.
            </p>
          </div>

          <button
            onClick={() => openPrintModal({ type: 'receipt', data: demoReceipt })}
            className="w-full py-2.5 bg-[#FAFBF9] hover:bg-[#EEF5ED] border border-[#CAD6C8] text-[#244231] rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Ver Recibo Fiscal</span>
          </button>
        </div>

        {/* Document 4: Reporte Financiero */}
        <div className="bg-white rounded-3xl border border-[#D5E1D4] p-5 shadow-2xs flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#EEF5ED] text-[#2D4539] flex items-center justify-center">
              <Layers className="w-6 h-6" />
            </div>
            <h4 className="font-serif-brand text-lg font-bold text-gray-900">
              Reporte de Ocupación e Ingresos
            </h4>
            <p className="text-xs text-gray-500 leading-relaxed">
              Resumen ejecutivo para la administración y propietarios con flujo neto y porcentaje de ocupación global.
            </p>
          </div>

          <button
            onClick={() => openPrintModal({
              type: 'financial_report',
              data: {
                totalGrossIncome: 3750,
                totalMaintenanceExpenses: 75,
                netOperatingIncome: 3675,
                occupiedProperties: 1,
                totalProperties: 6,
                globalOccupancyRate: 17,
                date: new Date().toLocaleDateString()
              }
            })}
            className="w-full py-2.5 bg-[#FAFBF9] hover:bg-[#EEF5ED] border border-[#CAD6C8] text-[#244231] rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Ver Reporte Financiero</span>
          </button>
        </div>
      </div>
    </div>
  );
};
