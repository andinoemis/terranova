import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  Database, 
  Download, 
  Copy, 
  Check, 
  Terminal, 
  FileCode, 
  Server, 
  Layers, 
  CheckCircle2, 
  Info,
  ExternalLink,
  Lock,
  ShieldAlert
} from 'lucide-react';

interface DatabaseExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DatabaseExportModal: React.FC<DatabaseExportModalProps> = ({ isOpen, onClose }) => {
  const { 
    currentUser,
    switchUser,
    properties, 
    contracts, 
    contractTemplates, 
    users, 
    payments, 
    maintenance, 
    visits, 
    leads, 
    employees, 
    payrollRecords, 
    companySettings,
    showToast 
  } = useApp();

  const [copied, setCopied] = useState(false);
  const [activeEngine, setActiveEngine] = useState<'mysql' | 'postgres'>('mysql');

  if (!isOpen) return null;

  // RESTRICCIÓN ESTRICTA: La base de datos es exclusivamente para el personal técnico / DBA.
  // El administrador NO tiene acceso a este módulo.
  if (currentUser.role !== 'technician') {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
        <div className="bg-white border border-rose-300 rounded-3xl max-w-md w-full shadow-2xl p-6 sm:p-8 text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-700 mx-auto flex items-center justify-center border border-rose-200">
            <ShieldAlert className="w-9 h-9" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700 bg-rose-100 px-3 py-1 rounded-full border border-rose-200">
              No Disponible para Administrador
            </span>
            <h3 className="font-serif-brand text-xl font-bold text-gray-900 mt-2.5">
              Módulo Exclusivo para Técnicos & DBA
            </h3>
            <p className="text-xs text-gray-600 mt-2 leading-relaxed">
              La parte de la base de datos no está disponible para el administrador del sistema; está reservada exclusivamente para el personal técnico certificado (Ingeniería de Sistemas y DBA).
            </p>
          </div>

          <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-[11px] text-amber-900 text-left space-y-1">
            <p className="font-bold flex items-center gap-1.5 text-amber-950">
              <Lock className="w-3.5 h-3.5" /> Política de Segregación de Funciones:
            </p>
            <p className="text-amber-800">
              El Administrador gestiona el catálogo, usuarios y contratos. Los scripts SQL y la manipulación de base de datos son de exclusiva competencia técnica.
            </p>
          </div>

          <div className="pt-2 border-t border-gray-100 flex flex-col gap-2">
            <button
              onClick={() => {
                const techUser = users.find(u => u.role === 'technician');
                if (techUser) {
                  switchUser(techUser.id);
                  showToast('Sesión cambiada a perfil Técnico de Sistemas / DBA');
                } else {
                  showToast('No se encontró cuenta de técnico registrada');
                }
              }}
              className="w-full py-2.5 rounded-xl bg-indigo-700 hover:bg-indigo-800 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2 shadow-2xs"
            >
              <Terminal className="w-4 h-4" />
              <span>Acceder como Técnico / DBA (Ing. David Orellana)</span>
            </button>
            <button
              onClick={onClose}
              className="w-full py-2.5 rounded-xl border border-gray-300 text-gray-700 font-semibold text-xs hover:bg-gray-50 transition-colors"
            >
              Entendido · Cerrar Ventana
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Generate dynamic, complete SQL script with updated tables and current data
  const generateSqlScript = (engine: 'mysql' | 'postgres') => {
    const isPg = engine === 'postgres';

    return `-- ============================================================================
-- TERRANOVA GESTIÓN INMOBILIARIA S. DE R.L.
-- SCRIPT DE BASE DE DATOS COMPLETO (DDL & DML)
-- COMPATIBILIDAD: ${isPg ? 'PostgreSQL 14+ / Supabase / Neon / Cloud SQL' : 'MySQL 8.0+ / MariaDB 10.4+ (XAMPP / phpMyAdmin)'}
-- Generado el: ${new Date().toISOString()}
-- Versión del Sistema: 2.8.0 (Actualización de Contratos, Nómina y Plantillas)
-- ============================================================================

${isPg ? `-- Creación de esquema en PostgreSQL:
-- CREATE DATABASE terranova_inmobiliaria;
-- \\c terranova_inmobiliaria;
` : `DROP DATABASE IF EXISTS terranova_inmobiliaria;
CREATE DATABASE terranova_inmobiliaria 
  CHARACTER SET utf8mb4 
  COLLATE utf8mb4_unicode_ci;
USE terranova_inmobiliaria;
`}

-- ----------------------------------------------------------------------------
-- 1. TABLA: roles
-- ----------------------------------------------------------------------------
CREATE TABLE roles (
    role_key VARCHAR(30) PRIMARY KEY,
    name VARCHAR(60) NOT NULL,
    description VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO roles (role_key, name, description) VALUES
('admin', 'Administrador General', 'Acceso irrestricto a inventario, contratos, nómina y configuración'),
('agent', 'Asesor Inmobiliario', 'Gestión de cartera, prospectos, emisión de contratos y resguardo'),
('tenant', 'Inquilino / Arrendatario', 'Portal personal de canon de renta, recibos y reportes de mantenimiento'),
('owner', 'Propietario de Inmuebles', 'Supervisión de finanzas confidenciales y liquidaciones'),
('client', 'Cliente Comprador', 'Búsqueda en catálogo y solicitudes de citas');

-- ----------------------------------------------------------------------------
-- 2. TABLA: users (Credenciales con Hash Criptográfico)
-- ----------------------------------------------------------------------------
CREATE TABLE users (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    phone VARCHAR(30) NOT NULL,
    national_id VARCHAR(20), -- DNI Honduras (13 dígitos)
    role VARCHAR(30) NOT NULL,
    account_number VARCHAR(30) UNIQUE,
    status VARCHAR(20) NOT NULL DEFAULT 'active',
    is_subscribed BOOLEAN NOT NULL DEFAULT FALSE,
    avatar_url VARCHAR(500),
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (role) REFERENCES roles(role_key) ON UPDATE CASCADE
);

-- Inserción de usuarios semilla
INSERT INTO users (id, name, email, phone, national_id, role, account_number, status, password_hash) VALUES
('usr-1', 'Kenneth Adonay Zúniga', 'kenneth.zuniga@unah.hn', '+504 9876-5432', '0801-1992-03481', 'admin', 'CTA-ADM-001', 'active', '$2a$12$e8YQ3f8Yt9q1QZ9r...'),
('usr-2', 'Anthony Rafael Alfaro', 'anthony.alfaro@unah.hn', '+504 9988-7766', '0801-1994-11234', 'agent', 'CTA-AGT-002', 'active', '$2a$12$e8YQ3f8Yt9q1QZ9r...'),
('usr-3', 'Keydi Reyes', 'keydi.reyes@unah.hn', '+504 9456-1122', '0801-1988-55412', 'owner', 'CTA-PROP-003', 'active', '$2a$12$e8YQ3f8Yt9q1QZ9r...'),
('usr-4', 'Carlos Mendoza', 'carlos.mendoza@cliente.hn', '+504 9623-4567', '0801-1996-04812', 'tenant', 'CTA-INQ-004', 'active', '$2a$12$e8YQ3f8Yt9q1QZ9r...');

-- ----------------------------------------------------------------------------
-- 3. TABLA: company_settings & bank_accounts
-- ----------------------------------------------------------------------------
CREATE TABLE company_settings (
    id INT PRIMARY KEY ${isPg ? 'GENERATED ALWAYS AS IDENTITY' : 'AUTO_INCREMENT'},
    company_name VARCHAR(150) NOT NULL,
    slogan VARCHAR(120) NOT NULL,
    rtn VARCHAR(30) NOT NULL,
    address VARCHAR(255) NOT NULL,
    phone VARCHAR(30) NOT NULL,
    whatsapp VARCHAR(30) NOT NULL,
    email VARCHAR(120) NOT NULL,
    customer_service_hours VARCHAR(150) NOT NULL,
    active_currency VARCHAR(10) DEFAULT 'USD',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE bank_accounts (
    id VARCHAR(36) PRIMARY KEY,
    bank_name VARCHAR(100) NOT NULL,
    account_number VARCHAR(60) NOT NULL UNIQUE,
    account_type VARCHAR(60) NOT NULL,
    account_holder VARCHAR(150) NOT NULL,
    currency VARCHAR(10) NOT NULL DEFAULT 'USD',
    is_default_receiving BOOLEAN NOT NULL DEFAULT FALSE,
    swift_code VARCHAR(30)
);

-- ----------------------------------------------------------------------------
-- 4. TABLA: properties (Catálogo Inmobiliario & Transacciones)
-- ----------------------------------------------------------------------------
CREATE TABLE properties (
    id VARCHAR(36) PRIMARY KEY,
    code VARCHAR(30) NOT NULL UNIQUE,
    title VARCHAR(180) NOT NULL,
    address VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL DEFAULT 'Tegucigalpa, M.D.C.',
    neighborhood VARCHAR(120) NOT NULL,
    size DECIMAL(10,2) NOT NULL,
    property_type VARCHAR(40) NOT NULL,
    transaction_type VARCHAR(40) NOT NULL,
    price DECIMAL(12,2) NOT NULL,
    currency VARCHAR(10) NOT NULL DEFAULT 'USD',
    status VARCHAR(40) NOT NULL DEFAULT 'Disponible',
    bedrooms INT NOT NULL DEFAULT 0,
    bathrooms DECIMAL(3,1) NOT NULL DEFAULT 1.0,
    parking_spots INT NOT NULL DEFAULT 0,
    description TEXT,
    owner_id VARCHAR(36) NOT NULL,
    owner_name VARCHAR(150) NOT NULL,
    assigned_agent_id VARCHAR(36) NOT NULL,
    assigned_agent_name VARCHAR(150) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (owner_id) REFERENCES users(id) ON UPDATE CASCADE,
    FOREIGN KEY (assigned_agent_id) REFERENCES users(id) ON UPDATE CASCADE
);

-- ----------------------------------------------------------------------------
-- 5. TABLA: contract_templates (Estándares Corporativos Word & PDF)
-- ----------------------------------------------------------------------------
CREATE TABLE contract_templates (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    type VARCHAR(40) NOT NULL, -- Arrendamiento, Venta, Venta a Plazos
    file_name VARCHAR(180) NOT NULL,
    file_format VARCHAR(10) NOT NULL, -- docx, pdf
    file_url TEXT,
    uploaded_at VARCHAR(40) NOT NULL,
    uploaded_by VARCHAR(150) NOT NULL,
    description TEXT,
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ----------------------------------------------------------------------------
-- 6. TABLA: lease_contracts (Contratos de Venta, Plazos y Arriendo)
-- ----------------------------------------------------------------------------
CREATE TABLE lease_contracts (
    id VARCHAR(36) PRIMARY KEY,
    contract_number VARCHAR(40) NOT NULL UNIQUE,
    contract_type VARCHAR(40) NOT NULL DEFAULT 'Arrendamiento', -- Arrendamiento, Venta, Venta a Plazos
    property_id VARCHAR(36) NOT NULL,
    property_code VARCHAR(30) NOT NULL,
    property_title VARCHAR(180) NOT NULL,
    tenant_id VARCHAR(36) NOT NULL,
    tenant_name VARCHAR(150) NOT NULL,
    tenant_national_id VARCHAR(20),
    tenant_phone VARCHAR(30),
    tenant_email VARCHAR(150),
    owner_id VARCHAR(36) NOT NULL,
    owner_name VARCHAR(150) NOT NULL,
    manager_name VARCHAR(150) NOT NULL,
    manager_email VARCHAR(150) NOT NULL,
    receiving_bank_account VARCHAR(60) NOT NULL,
    receiving_bank_name VARCHAR(100) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    monthly_rent DECIMAL(12,2) NOT NULL,
    deposit_amount DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    currency VARCHAR(10) NOT NULL DEFAULT 'USD',
    status VARCHAR(40) NOT NULL DEFAULT 'Vigente',
    
    -- Condiciones de Venta & Financiamiento
    total_value DECIMAL(12,2),
    down_payment DECIMAL(12,2),
    financing_years INT,
    installments_count INT,
    monthly_installment DECIMAL(12,2),
    
    -- Modalidades de Firma & Resguardo
    signature_mode VARCHAR(40) DEFAULT 'digital',
    is_signed_digitally BOOLEAN DEFAULT FALSE,
    is_signed_physically BOOLEAN DEFAULT FALSE,
    signed_document_url TEXT,
    signed_document_file_name VARCHAR(255),
    signed_document_file_size VARCHAR(50),
    signed_document_file_type VARCHAR(100),
    document_status VARCHAR(60) DEFAULT 'Pendiente_Subida',
    signed_date DATE,
    
    -- Invalidaciones & Cancelación
    invalidation_requested BOOLEAN DEFAULT FALSE,
    invalidation_reason TEXT,
    invalidated_by_admin VARCHAR(150),
    cancellation_reason TEXT,
    cancelled_at TIMESTAMP NULL,
    
    -- Firmas Digitales en Base64
    signature_image_tenant TEXT,
    signature_image_owner TEXT,
    signature_image_admin TEXT,
    
    -- Comisiones & Liquidación
    total_commission_rate DECIMAL(5,2) DEFAULT 20.00,
    agent_commission_rate DECIMAL(5,2) DEFAULT 2.00,
    agency_commission_rate DECIMAL(5,2) DEFAULT 18.00,
    owner_net_rate DECIMAL(5,2) DEFAULT 80.00,
    commission_payout_mode VARCHAR(40) DEFAULT 'directa_total',
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (property_id) REFERENCES properties(id) ON UPDATE CASCADE,
    FOREIGN KEY (tenant_id) REFERENCES users(id) ON UPDATE CASCADE,
    FOREIGN KEY (owner_id) REFERENCES users(id) ON UPDATE CASCADE
);

-- ----------------------------------------------------------------------------
-- 7. TABLA: employees & payroll_records (Nómina y Comisiones)
-- ----------------------------------------------------------------------------
CREATE TABLE employees (
    id VARCHAR(36) PRIMARY KEY,
    code VARCHAR(30) NOT NULL UNIQUE,
    name VARCHAR(150) NOT NULL,
    national_id VARCHAR(20) NOT NULL,
    email VARCHAR(150) NOT NULL,
    phone VARCHAR(30) NOT NULL,
    department VARCHAR(60) NOT NULL,
    position VARCHAR(80) NOT NULL,
    base_salary DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    commission_rate DECIMAL(5,2) NOT NULL DEFAULT 2.00,
    bank_name VARCHAR(80) NOT NULL,
    bank_account_number VARCHAR(60) NOT NULL,
    hire_date DATE NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'Activo'
);

CREATE TABLE payroll_records (
    id VARCHAR(36) PRIMARY KEY,
    payroll_number VARCHAR(40) NOT NULL UNIQUE,
    employee_id VARCHAR(36) NOT NULL,
    employee_name VARCHAR(150) NOT NULL,
    period VARCHAR(60) NOT NULL,
    base_salary DECIMAL(10,2) NOT NULL,
    commission_amount DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    bonuses DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    deductions DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    net_salary DECIMAL(10,2) NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'Pendiente',
    payment_date DATE,
    FOREIGN KEY (employee_id) REFERENCES employees(id) ON UPDATE CASCADE
);

-- ----------------------------------------------------------------------------
-- 8. TABLA: payment_transactions (Cobros y Recibos)
-- ----------------------------------------------------------------------------
CREATE TABLE payment_transactions (
    id VARCHAR(36) PRIMARY KEY,
    receipt_number VARCHAR(40) NOT NULL UNIQUE,
    property_id VARCHAR(36) NOT NULL,
    property_title VARCHAR(180) NOT NULL,
    payer_name VARCHAR(150) NOT NULL,
    payer_email VARCHAR(150) NOT NULL,
    amount DECIMAL(12,2) NOT NULL,
    currency VARCHAR(10) NOT NULL DEFAULT 'USD',
    date DATE NOT NULL,
    type VARCHAR(40) NOT NULL,
    payment_method VARCHAR(60) NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'En Proceso',
    reference_code VARCHAR(80) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (property_id) REFERENCES properties(id) ON UPDATE CASCADE
);

-- ============================================================================
-- FIN DEL SCRIPT SQL · TERRANOVA INMOBILIARIA
-- ============================================================================
`;
  };

  const sqlContent = generateSqlScript(activeEngine);

  const handleCopy = () => {
    navigator.clipboard.writeText(sqlContent);
    setCopied(true);
    showToast('Script SQL copiado al portapapeles');
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadSql = () => {
    const blob = new Blob([sqlContent], { type: 'text/sql;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `terranova_database_${activeEngine}_complete.sql`;
    link.click();
    URL.revokeObjectURL(url);
    showToast(`Descargando script SQL para ${activeEngine.toUpperCase()}...`);
  };

  const handleDownloadJsonBackup = () => {
    const backupData = {
      exportDate: new Date().toISOString(),
      systemVersion: '2.8.0',
      companySettings,
      properties,
      contracts,
      contractTemplates,
      users,
      payments,
      maintenance,
      visits,
      leads,
      employees,
      payrollRecords
    };

    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `terranova_backup_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    showToast('Respaldo JSON exportado exitosamente.');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white border border-[#CBD8CA] rounded-3xl max-w-4xl w-full shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
        {/* Header */}
        <div className="bg-[#2D4539] text-white p-5 sm:p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center border border-white/20">
              <Database className="w-5 h-5 text-[#A3C7AD]" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#A3C7AD] block leading-none">
                Base de Datos & Exportación Local
              </span>
              <h2 className="font-serif-brand text-lg sm:text-xl font-bold block mt-1">
                Script SQL Completo (DDL & DML) para Ejecución Local
              </h2>
            </div>
          </div>

          <button 
            onClick={onClose} 
            className="text-white/70 hover:text-white p-1 rounded-xl hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Bar */}
        <div className="p-4 bg-[#FAFBF9] border-b border-gray-200 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold text-gray-700">Motor Destino:</span>
            <div className="inline-flex bg-white p-0.5 rounded-xl border border-gray-300">
              <button
                onClick={() => setActiveEngine('mysql')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                  activeEngine === 'mysql' ? 'bg-[#2D4539] text-white shadow-2xs' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                MySQL / XAMPP / MariaDB
              </button>
              <button
                onClick={() => setActiveEngine('postgres')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                  activeEngine === 'postgres' ? 'bg-[#2D4539] text-white shadow-2xs' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                PostgreSQL / Supabase / Neon
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="px-3 py-2 rounded-xl border border-gray-300 bg-white hover:bg-gray-50 text-gray-800 font-semibold flex items-center gap-1.5 transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700 font-bold">Copiado</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-gray-500" />
                  <span>Copiar SQL</span>
                </>
              )}
            </button>

            <button
              onClick={handleDownloadSql}
              className="px-4 py-2 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold flex items-center gap-1.5 shadow-2xs transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Descargar .sql</span>
            </button>

            <button
              onClick={handleDownloadJsonBackup}
              className="px-3 py-2 rounded-xl border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 font-bold flex items-center gap-1.5 transition-colors"
              title="Descarga una copia completa de las entidades en JSON"
            >
              <FileCode className="w-3.5 h-3.5 text-emerald-700" />
              <span>Backup JSON</span>
            </button>
          </div>
        </div>

        {/* Quick Guide instructions */}
        <div className="p-4 bg-blue-50/60 border-b border-blue-200 text-xs text-blue-950 space-y-1">
          <div className="flex items-center gap-1.5 font-bold">
            <Info className="w-4 h-4 text-blue-700 shrink-0" />
            <span>Instrucciones para correrlo localmente:</span>
          </div>
          <div className="pl-5 text-[11px] text-blue-900 space-y-0.5 font-mono">
            {activeEngine === 'mysql' ? (
              <>
                <p>1. Inicia Apache y MySQL en tu panel de control de <strong>XAMPP</strong>.</p>
                <p>2. Abre tu navegador en <span className="underline">http://localhost/phpmyadmin</span>.</p>
                <p>3. Pestaña <strong>Importar</strong> ➔ Selecciona el archivo <span className="font-bold">terranova_database_mysql_complete.sql</span> ➔ Pulsa "Continuar".</p>
                <p>4. O vía terminal: <span className="bg-white/80 px-1 py-0.5 rounded border border-blue-300">mysql -u root -p &lt; terranova_database_mysql_complete.sql</span></p>
              </>
            ) : (
              <>
                <p>1. Inicia tu servidor PostgreSQL o abre <strong>pgAdmin</strong>.</p>
                <p>2. Ejecuta en terminal: <span className="bg-white/80 px-1 py-0.5 rounded border border-blue-300">psql -U postgres -d terranova_inmobiliaria -f terranova_database_postgres_complete.sql</span></p>
                <p>3. O bien conéctate a Supabase, Neon o Cloud SQL y pega este script en el Query SQL Editor.</p>
              </>
            )}
          </div>
        </div>

        {/* Code viewer */}
        <div className="p-4 bg-[#1E2E28] overflow-y-auto flex-1 font-mono text-[11px] text-emerald-300 leading-relaxed selection:bg-emerald-800">
          <pre className="whitespace-pre-wrap">{sqlContent}</pre>
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#FAFBF9] border-t border-gray-200 flex items-center justify-between text-xs">
          <span className="text-gray-500 text-[11px]">
            Tablas: <code>roles, users, properties, contract_templates, lease_contracts, employees, payroll_records, payment_transactions</code>
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#2D4539] hover:bg-[#20342A] text-white font-bold transition-colors"
          >
            Cerrar Visor
          </button>
        </div>
      </div>
    </div>
  );
};
