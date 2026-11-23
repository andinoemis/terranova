import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  Lock, 
  Mail, 
  User, 
  Phone, 
  AlertCircle, 
  CheckCircle2, 
  KeyRound, 
  ShieldCheck, 
  Building2, 
  RotateCcw,
  Eye,
  EyeOff,
  Sparkles,
  Check
} from 'lucide-react';
import { UserRole } from '../../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register';
  presetEmail?: string;
  presetPassword?: string;
  onLoginSuccess?: (role: UserRole) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ 
  isOpen, 
  onClose,
  initialMode = 'login',
  presetEmail,
  presetPassword,
  onLoginSuccess
}) => {
  const { 
    login, 
    registerUser, 
    users, 
    showToast, 
    sendPasswordRecoveryEmail, 
    resetPasswordWithCode
  } = useApp();

  const [mode, setMode] = useState<'login' | 'register' | 'recover'>(initialMode);
  
  // Login fields
  const [loginEmail, setLoginEmail] = useState(presetEmail || '');
  const [loginPassword, setLoginPassword] = useState(presetPassword || '');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);

  // Sync mode and presets when opened
  React.useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      if (presetEmail) setLoginEmail(presetEmail);
      if (presetPassword) setLoginPassword(presetPassword);
      setAuthError(null);
      if (presetEmail) {
        setInfoMessage(`Credenciales de prueba cargadas para ${presetEmail}. Haz clic en "Ingresar al Sistema" para validar.`);
      } else {
        setInfoMessage(null);
      }
      setRecoveryStage('email');
    }
  }, [isOpen, initialMode, presetEmail, presetPassword]);

  // Register fields with Honduras DNI and phone constraints
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regDni, setRegDni] = useState(''); // 13 dígitos numéricos Honduras
  const [regPhone, setRegPhone] = useState('+504-');
  const [regRole, setRegRole] = useState<UserRole>('tenant');
  const [regPassword, setRegPassword] = useState('');
  const [regIsSubscribed, setRegIsSubscribed] = useState(true);

  // Recovery fields
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [recoveryStage, setRecoveryStage] = useState<'email' | 'code_and_new_password'>('email');
  const [recoveryCode, setRecoveryCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [dispatchedCode, setDispatchedCode] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setInfoMessage(null);

    const result = login(loginEmail, loginPassword);
    if (!result.success) {
      setAuthError(result.error || 'Credenciales incorrectas');
    } else {
      const loggedUser = users.find(u => u.email.toLowerCase() === loginEmail.trim().toLowerCase());
      if (loggedUser && onLoginSuccess) {
        onLoginSuccess(loggedUser.role);
      }
      onClose();
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Validación de Nombre (solo letras y espacios, mínimo 3 caracteres)
    const cleanName = regName.trim();
    if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s'-]{3,}$/.test(cleanName)) {
      setAuthError('El nombre completo solo puede contener letras y espacios válidos (mínimo 3 caracteres, sin números ni símbolos).');
      return;
    }

    // Validación de DNI de Honduras (exactamente 13 dígitos numéricos)
    const cleanDni = regDni.replace(/\D/g, '');
    if (cleanDni.length !== 13) {
      setAuthError('El Documento Nacional de Identificación (DNI de Honduras) debe contener exactamente 13 dígitos numéricos (ej: 0801199512345).');
      return;
    }

    // Validación de teléfono (solo números, + y - como separador, mínimo 8 dígitos numéricos)
    const phoneRegex = /^[+]?[0-9]+(-[0-9]+)*$/;
    const cleanPhoneDigits = regPhone.replace(/\D/g, '');
    if (!phoneRegex.test(regPhone.trim()) || cleanPhoneDigits.length < 8) {
      setAuthError('El número de teléfono debe contener al menos 8 dígitos numéricos válidos (ej: +504-9876-5432).');
      return;
    }

    if (regPassword.length < 6) {
      setAuthError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    const result = registerUser({
      name: regName.trim(),
      email: regEmail.trim(),
      nationalId: cleanDni,
      phone: regPhone.trim(),
      role: regRole,
      isSubscribed: regIsSubscribed,
      password: regPassword
    });

    if (!result.success) {
      setAuthError(result.error || 'Error al crear la cuenta');
    } else {
      showToast('¡Registro completado! Tu cuenta está lista para ingresar.');
      if (onLoginSuccess) {
        onLoginSuccess(regRole);
      }
      onClose();
    }
  };

  const handleRequestRecoveryCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setInfoMessage(null);

    const result = await sendPasswordRecoveryEmail(recoveryEmail);
    if (!result.success) {
      setAuthError(result.error || 'Correo no encontrado en el sistema.');
    } else {
      const code = result.resetCode || 'TN-948210';
      setDispatchedCode(code);
      setRecoveryCode(code); // Pre-filled for convenience
      setRecoveryStage('code_and_new_password');
      showToast(`Código de verificación enviado a ${recoveryEmail}.`);
    }
  };

  const handleResetPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    const result = resetPasswordWithCode(recoveryEmail, recoveryCode, newPassword);
    if (!result.success) {
      setAuthError(result.error || 'Código incorrecto o error al restablecer');
    } else {
      setInfoMessage('¡Contraseña actualizada con éxito! Ingresa con tus nuevas credenciales.');
      setMode('login');
      setLoginEmail(recoveryEmail);
      setLoginPassword(newPassword);
      setRecoveryStage('email');
    }
  };

  const selectDemoUser = (email: string, pass: string, roleName: string) => {
    setLoginEmail(email);
    setLoginPassword(pass);
    setAuthError(null);
    setInfoMessage(`Credenciales cargadas para ${roleName}. Haz clic en "Ingresar al Sistema" para autenticar.`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white border border-[#CBD8CA] rounded-3xl max-w-md w-full overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-5 bg-[#263E32] text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
              <Building2 className="w-6 h-6 text-[#A3C7AD]" />
            </div>
            <div>
              <h3 className="font-serif-brand text-xl font-bold tracking-wider">
                {mode === 'login' ? 'Iniciar Sesión en Terranova' :
                 mode === 'register' ? 'Registro de Nuevo Usuario' : 'Recuperar Contraseña'}
              </h3>
              <p className="text-[11px] text-white/70">
                {mode === 'login' ? 'Acceso seguro al portal inmobiliario' :
                 mode === 'register' ? 'Crea tu cuenta de inquilino o propietario' : 'Restablecimiento de credenciales'}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-1.5 rounded-full hover:bg-white/10 text-white/70 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher (Login / Registro) */}
        {mode !== 'recover' && (
          <div className="grid grid-cols-2 bg-[#FAFBF9] border-b border-gray-200 text-xs font-semibold">
            <button
              onClick={() => { setMode('login'); setAuthError(null); }}
              className={`py-3 text-center transition-all ${
                mode === 'login'
                  ? 'border-b-2 border-[#2D4539] text-[#1E3228] bg-white'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              Iniciar Sesión
            </button>
            <button
              onClick={() => { setMode('register'); setAuthError(null); }}
              className={`py-3 text-center transition-all ${
                mode === 'register'
                  ? 'border-b-2 border-[#2D4539] text-[#1E3228] bg-white'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              Registrarse (Crear Cuenta)
            </button>
          </div>
        )}

        {/* Body Container */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs">
          
          {/* Error Message Box according to proposal pág 26 & 28 */}
          {authError && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl text-rose-800 space-y-2 animate-in shake">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-[12px]">Error de Validación de Credenciales</p>
                  <p className="text-[11px] text-rose-700 mt-0.5">{authError}</p>
                </div>
              </div>

              <div className="pt-2 border-t border-rose-200/60 flex items-center justify-between text-[11px]">
                <button
                  type="button"
                  onClick={() => setAuthError(null)}
                  className="font-bold text-rose-900 hover:underline flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" /> Reintentar
                </button>
                <button
                  type="button"
                  onClick={() => { setMode('recover'); setAuthError(null); }}
                  className="text-rose-800 underline hover:text-rose-950 font-medium"
                >
                  ¿Olvidaste tu contraseña?
                </button>
              </div>
            </div>
          )}

          {/* Informative info banner for loaded credentials */}
          {infoMessage && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-[11px] flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{infoMessage}</span>
            </div>
          )}

          {/* MODE: LOGIN */}
          {mode === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block font-semibold text-gray-700 mb-1 flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-[#537260]" /> Correo Electrónico
                </label>
                <input
                  type="email"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="ejemplo@unah.hn o correo@dominio.com"
                  className="w-full bg-[#FAFBF9] border border-[#CAD8C8] rounded-xl p-2.5 text-gray-800 focus:outline-hidden focus:ring-2 focus:ring-[#446251]"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="font-semibold text-gray-700 flex items-center gap-1">
                    <Lock className="w-3.5 h-3.5 text-[#537260]" /> Contraseña (Encriptada)
                  </label>
                  <button
                    type="button"
                    onClick={() => { setMode('recover'); setAuthError(null); }}
                    className="text-[11px] text-[#2D4539] hover:underline font-medium"
                  >
                    ¿Olvidaste tu contraseña?
                  </button>
                </div>

                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-[#FAFBF9] border border-[#CAD8C8] rounded-xl p-2.5 pr-10 text-gray-800 focus:outline-hidden focus:ring-2 focus:ring-[#446251] font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#2D4539] hover:bg-[#20342A] text-white font-semibold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Ingresar al Sistema (Validar Credenciales)</span>
              </button>

              {/* Quick Demo Access Bar */}
              <div className="pt-3 border-t border-gray-100 space-y-2">
                <span className="text-[11px] text-gray-500 font-semibold block text-center">
                  Cargar Credenciales de Prueba (Para Validar):
                </span>
                <div className="grid grid-cols-2 gap-2 text-[10px]">
                  <button
                    type="button"
                    onClick={() => selectDemoUser('kenneth.zuniga@unah.hn', 'Admin123!', 'Administrador')}
                    className="p-2 rounded-lg bg-[#FAFBF9] border border-[#CCD8CB] hover:bg-[#EEF5ED] text-left transition-colors"
                  >
                    <span className="font-bold block text-gray-900">Administrador</span>
                    <span className="text-gray-500 truncate block">kenneth.zuniga@unah.hn</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => selectDemoUser('anthony.alfaro@unah.hn', 'Agente123!', 'Agente Inmobiliario')}
                    className="p-2 rounded-lg bg-[#FAFBF9] border border-[#CCD8CB] hover:bg-[#EEF5ED] text-left transition-colors"
                  >
                    <span className="font-bold block text-gray-900">Agente Inmobiliario</span>
                    <span className="text-gray-500 truncate block">anthony.alfaro@unah.hn</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => selectDemoUser('keidy.reyes@unah.hn', 'Propietario123!', 'Propietario')}
                    className="p-2 rounded-lg bg-[#FAFBF9] border border-[#CCD8CB] hover:bg-[#EEF5ED] text-left transition-colors"
                  >
                    <span className="font-bold block text-gray-900">Propietario</span>
                    <span className="text-gray-500 truncate block">keidy.reyes@unah.hn</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => selectDemoUser('andinoemis@gmail.com', 'Inquilino123!', 'Inquilino Suscrito')}
                    className="p-2 rounded-lg bg-[#FAFBF9] border border-[#CCD8CB] hover:bg-[#EEF5ED] text-left transition-colors"
                  >
                    <span className="font-bold block text-gray-900">Inquilino Suscrito</span>
                    <span className="text-gray-500 truncate block">andinoemis@gmail.com</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => selectDemoUser('tecnico.sistemas@terranova.hn', 'Tecnico123!', 'Técnico / DBA')}
                    className="col-span-2 p-2 rounded-lg bg-indigo-50/70 border border-indigo-200 hover:bg-indigo-100 text-left transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-indigo-900">Técnico de Sistemas / DBA (Base de Datos)</span>
                      <span className="text-[9px] bg-indigo-200 text-indigo-800 font-bold px-1.5 py-0.2 rounded font-mono">Exclusivo SQL</span>
                    </div>
                    <span className="text-indigo-600 truncate block text-[10px]">tecnico.sistemas@terranova.hn</span>
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* MODE: REGISTER (RF-0101) */}
          {mode === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-3">
              <div>
                <label className="block font-semibold text-gray-700 mb-1 flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-[#537260]" /> Nombre Completo
                </label>
                <input
                  type="text"
                  required
                  value={regName}
                  onChange={(e) => setRegName(e.target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s'-]/g, ''))}
                  placeholder="Tu nombre y apellidos (solo letras)"
                  className="w-full bg-[#FAFBF9] border border-[#CAD8C8] rounded-xl p-2.5 text-gray-800"
                />
                <span className="text-[10px] text-gray-400 mt-0.5 block">Solo caracteres alfabéticos</span>
              </div>

              {/* DNI Honduras (13 dígitos) y Correo */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#537260]" /> DNI Honduras (13 dígitos)
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={13}
                    value={regDni}
                    onChange={(e) => setRegDni(e.target.value.replace(/\D/g, ''))}
                    placeholder="Ej: 0801199512345"
                    className="w-full bg-[#FAFBF9] border border-[#CAD8C8] rounded-xl p-2.5 font-mono text-gray-800"
                  />
                  <span className="text-[10px] text-gray-400 mt-0.5 block">
                    {regDni.length}/13 dígitos numéricos
                  </span>
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1 flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-[#537260]" /> Teléfono (+ y -)
                  </label>
                  <input
                    type="tel"
                    required
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value.replace(/[^0-9+\-]/g, ''))}
                    placeholder="+504-9876-5432"
                    className="w-full bg-[#FAFBF9] border border-[#CAD8C8] rounded-xl p-2.5 font-mono text-gray-800"
                  />
                  <span className="text-[10px] text-gray-400 mt-0.5 block">
                    Solo números, + y - como separador
                  </span>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1 flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-[#537260]" /> Correo Electrónico
                </label>
                <input
                  type="email"
                  required
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="correo@ejemplo.com"
                  className="w-full bg-[#FAFBF9] border border-[#CAD8C8] rounded-xl p-2.5 text-gray-800"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Tipo de Cuenta a Registrar</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'client', label: 'Cliente', desc: 'Buscador de catálogo y citas de visitas' },
                    { id: 'tenant', label: 'Inquilino', desc: 'Arrendatario con portal personal de renta' }
                  ].map((r) => (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => setRegRole(r.id as any)}
                      className={`p-2.5 rounded-xl border text-left transition-all ${
                        regRole === r.id
                          ? 'border-[#2D4539] bg-[#EEF5ED] text-[#1E3628] shadow-2xs font-bold ring-1 ring-[#2D4539]'
                          : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <span className="block text-xs font-bold text-gray-900">{r.label}</span>
                      <span className="block text-[10px] text-gray-500 mt-0.5">{r.desc}</span>
                    </button>
                  ))}
                </div>
                <p className="text-[10px] text-gray-400 mt-1">
                  * Registro público habilitado únicamente para Cliente o Inquilino.
                </p>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1 flex items-center gap-1">
                  <Lock className="w-3.5 h-3.5 text-[#537260]" /> Contraseña Segura
                </label>
                <input
                  type="password"
                  required
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="Mínimo 6 caracteres"
                  className="w-full bg-[#FAFBF9] border border-[#CAD8C8] rounded-xl p-2.5 text-gray-800 font-mono"
                />
                <span className="text-[10px] text-gray-400 mt-0.5 block">
                  Cifrado de contraseña bcrypt / SHA-256 según norma RNF-204
                </span>
              </div>

              {/* Proposal Page 26/28: "Acceso suscripto" vs "Acceso sin suscripción" */}
              <div className="p-3 bg-[#FAFBF9] rounded-xl border border-gray-200 flex items-center justify-between">
                <div>
                  <span className="font-semibold text-gray-800 block text-[11px]">Suscripción Activa a Servicios</span>
                  <span className="text-[10px] text-gray-500">Habilita pagos en línea y gestiones preferenciales</span>
                </div>
                <input
                  type="checkbox"
                  checked={regIsSubscribed}
                  onChange={(e) => setRegIsSubscribed(e.target.checked)}
                  className="w-4 h-4 accent-[#2D4539] rounded"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#C36449] hover:bg-[#B1573D] text-white font-semibold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2"
              >
                <span>Crear Cuenta en Terranova</span>
              </button>
            </form>
          )}

          {/* MODE: RECOVER (Recuperación con Código mediante Servidor de Correo) */}
          {mode === 'recover' && (
            <div className="space-y-4 text-xs">
              {/* Information Alert */}
              <div className="bg-[#EEF5ED] border border-[#CAD8C8] rounded-2xl p-3 flex items-start gap-2 text-gray-700">
                <AlertCircle className="w-4 h-4 text-[#2D4539] shrink-0 mt-0.5" />
                <div className="text-[11px] leading-relaxed">
                  <strong>Servicio de Correo Integrado:</strong> El código de seguridad temporal se envía directamente a tu cuenta mediante el servidor de correo transaccional configurado en Terranova.
                </div>
              </div>

              {recoveryStage === 'email' ? (
                <form onSubmit={handleRequestRecoveryCode} className="space-y-3">
                  <p className="text-gray-600 leading-relaxed text-xs">
                    Ingresa tu correo registrado para generar tu código de seguridad temporal:
                  </p>

                  <div>
                    <label className="block font-semibold text-gray-700 mb-1 flex items-center gap-1">
                      <Mail className="w-3.5 h-3.5 text-[#537260]" /> Correo Electrónico Registrado
                    </label>
                    <input
                      type="email"
                      required
                      value={recoveryEmail}
                      onChange={(e) => setRecoveryEmail(e.target.value)}
                      placeholder="tu.correo@ejemplo.com"
                      className="w-full bg-[#FAFBF9] border border-[#CAD8C8] rounded-xl p-2.5 text-gray-800"
                    />
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setMode('login')}
                      className="w-1/2 py-2.5 border border-gray-300 rounded-xl font-semibold text-gray-700 hover:bg-gray-50"
                    >
                      Volver al Login
                    </button>
                    <button
                      type="submit"
                      className="w-1/2 py-2.5 bg-[#2D4539] hover:bg-[#20342A] text-white rounded-xl font-semibold transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
                    >
                      <KeyRound className="w-3.5 h-3.5" />
                      <span>Generar Código</span>
                    </button>
                  </div>
                </form>
              ) : (
                <form onSubmit={handleResetPasswordSubmit} className="space-y-3 animate-in fade-in">
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-between">
                    <div>
                      <span className="text-[11px] text-amber-800 font-semibold block">Código de seguridad generado para:</span>
                      <span className="font-mono text-xs font-bold text-gray-900">{recoveryEmail}</span>
                    </div>
                    <span className="font-mono text-xs font-bold bg-amber-200 text-amber-900 px-2 py-1 rounded">
                      {dispatchedCode || 'TN-948210'}
                    </span>
                  </div>

                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">Código de Seguridad (6 dígitos)</label>
                    <input
                      type="text"
                      required
                      value={recoveryCode}
                      onChange={(e) => setRecoveryCode(e.target.value)}
                      placeholder="TN-XXXXXX"
                      className="w-full bg-[#FAFBF9] border border-[#CAD8C8] rounded-xl p-2.5 font-mono text-center text-sm font-bold tracking-widest text-[#1E3628]"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">Nueva Contraseña</label>
                    <input
                      type="password"
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Mínimo 6 caracteres"
                      className="w-full bg-[#FAFBF9] border border-[#CAD8C8] rounded-xl p-2.5 font-mono"
                    />
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setRecoveryStage('email')}
                      className="w-1/3 py-2.5 border border-gray-300 rounded-xl font-semibold text-gray-700 hover:bg-gray-50"
                    >
                      Atrás
                    </button>
                    <button
                      type="submit"
                      className="w-2/3 py-2.5 bg-[#C36449] hover:bg-[#B1573D] text-white rounded-xl font-bold transition-colors shadow-2xs flex items-center justify-center gap-1.5"
                    >
                      <Check className="w-4 h-4" />
                      <span>Restablecer Contraseña</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
