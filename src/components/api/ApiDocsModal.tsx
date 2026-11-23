import React, { useState } from 'react';
import { X, Code, Key, Server, Copy, Check, Lock, Shield, Terminal, BookOpen, Layers } from 'lucide-react';

interface ApiDocsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ApiDocsModal: React.FC<ApiDocsModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'endpoints' | 'secrets' | 'auth' | 'sdk'>('endpoints');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, idx: number) => {
    navigator.clipboard?.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const endpoints = [
    {
      method: 'GET',
      path: '/api/v1/properties',
      description: 'Obtiene el listado de propiedades con filtros avanzados (estado, tipo, precio, ciudad).',
      auth: 'Público / Opcional Bearer',
      sampleResponse: `{\n  "status": "success",\n  "total": 6,\n  "data": [\n    {\n      "id": "prop-1",\n      "code": "CASA PRINCE",\n      "title": "Casa Prince - Modelo Clásico",\n      "price": 1250,\n      "currency": "USD",\n      "status": "Alquilada",\n      "size_m2": 280\n    }\n  ]\n}`
    },
    {
      method: 'POST',
      path: '/api/v1/properties',
      description: 'Registra un nuevo inmueble en el catálogo con validación de metraje y datos catastrales.',
      auth: 'Bearer Token (Roles: Admin, Agent, Owner)',
      sampleRequest: `{\n  "title": "Residencia Las Cumbres",\n  "code": "CUM-102",\n  "propertyType": "Casa",\n  "transactionType": "Venta",\n  "price": 210000,\n  "currency": "USD",\n  "size": 310,\n  "bedrooms": 4,\n  "bathrooms": 3.5\n}`,
      sampleResponse: `{\n  "status": "created",\n  "id": "prop-173829102",\n  "message": "Propiedad registrada exitosamente"\n}`
    },
    {
      method: 'POST',
      path: '/api/v1/contracts',
      description: 'Genera un contrato de arrendamiento oficial a partir de plantillas, asignando inquilino y propietario.',
      auth: 'Bearer Token (Roles: Admin, Agent)',
      sampleRequest: `{\n  "propertyId": "prop-1",\n  "tenantId": "usr-4",\n  "startDate": "2024-11-01",\n  "endDate": "2025-11-01",\n  "monthlyRent": 1250,\n  "depositAmount": 1250\n}`,
      sampleResponse: `{\n  "status": "success",\n  "contractNumber": "CTR-2024-884",\n  "digitalSignatureHash": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",\n  "isSignedDigitally": true\n}`
    },
    {
      method: 'POST',
      path: '/api/v1/payments/checkout',
      description: 'Procesa un pago de renta o depósito y genera el comprobante fiscal con folio único.',
      auth: 'Bearer Token (Rol: Tenant, Admin)',
      sampleRequest: `{\n  "contractId": "ctr-001",\n  "amount": 1250,\n  "currency": "USD",\n  "paymentMethod": "Tarjeta de Crédito",\n  "monthCovered": "Noviembre 2024"\n}`,
      sampleResponse: `{\n  "status": "completed",\n  "receiptNumber": "REC-2024-9102",\n  "referenceCode": "TXN-88402-BAC",\n  "date": "2024-10-12"\n}`
    },
    {
      method: 'GET',
      path: '/api/v1/reports/kpis',
      description: 'Retorna el resumen ejecutivo financiero: ingresos brutos, gastos de reparación y ocupación.',
      auth: 'Bearer Token (Roles: Admin, Owner)',
      sampleResponse: `{\n  "totalGrossIncome": 3750,\n  "totalMaintenanceExpenses": 75,\n  "netOperatingIncome": 3675,\n  "occupancyRate": 85.5,\n  "currency": "USD"\n}`
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white border border-[#CDD8CB] rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-6 bg-[#263E32] text-white rounded-t-3xl flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/10 rounded-xl">
              <Server className="w-6 h-6 text-[#A3C7AD]" />
            </div>
            <div>
              <h2 className="font-serif-brand text-2xl font-bold">Documentación de la API & Gestión de Secretos</h2>
              <p className="text-xs text-white/75">Especificación OpenAPI v3.1 · Arquitectura REST & Control de Variables de Entorno</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/20 text-white/80 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Subnav Tabs */}
        <div className="bg-[#FAFBF9] px-6 py-2 border-b border-gray-200 flex gap-2 overflow-x-auto text-xs font-semibold">
          {[
            { id: 'endpoints', label: 'Endpoints REST', icon: Code },
            { id: 'secrets', label: 'Variables de Entorno & Secretos', icon: Key },
            { id: 'auth', label: 'Autenticación & RBAC', icon: Lock },
            { id: 'sdk', label: 'Ejemplo SDK en TypeScript', icon: Terminal }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3.5 py-2 rounded-xl flex items-center gap-2 transition-all ${
                  isActive
                    ? 'bg-[#2D4539] text-white shadow-2xs'
                    : 'text-gray-600 hover:bg-[#EEF4EC] hover:text-[#1E3228]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="p-6 sm:p-8 space-y-6 text-xs text-gray-700">
          {/* TAB: ENDPOINTS */}
          {activeTab === 'endpoints' && (
            <div className="space-y-4">
              <div className="p-4 bg-[#F5F8F4] rounded-2xl border border-[#D5E2D3] flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold text-gray-500 uppercase">Base URL</span>
                  <p className="font-mono text-sm font-bold text-[#1E3228]">https://api.terranova.hn/v1</p>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                  HTTPS Forzado (TLS 1.3)
                </span>
              </div>

              <div className="space-y-4">
                {endpoints.map((ep, idx) => (
                  <div key={idx} className="border border-[#DEE6DD] rounded-2xl p-4 bg-white shadow-2xs space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className={`px-2.5 py-1 rounded-md font-mono text-xs font-bold ${
                          ep.method === 'GET' ? 'bg-blue-100 text-blue-800' : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {ep.method}
                        </span>
                        <span className="font-mono font-bold text-gray-900 text-xs">{ep.path}</span>
                      </div>
                      <span className="text-[11px] font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                        {ep.auth}
                      </span>
                    </div>

                    <p className="text-gray-600">{ep.description}</p>

                    {ep.sampleRequest && (
                      <div className="space-y-1">
                        <span className="text-[10px] uppercase font-bold text-gray-400 block">Payload Request (JSON):</span>
                        <pre className="p-3 bg-gray-900 text-gray-100 rounded-xl font-mono text-[11px] overflow-x-auto">
                          {ep.sampleRequest}
                        </pre>
                      </div>
                    )}

                    <div className="space-y-1">
                      <span className="text-[10px] uppercase font-bold text-gray-400 block">Response (200 OK / 201 Created):</span>
                      <pre className="p-3 bg-gray-900 text-emerald-400 rounded-xl font-mono text-[11px] overflow-x-auto">
                        {ep.sampleResponse}
                      </pre>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: SECRETS & ENV VARS */}
          {activeTab === 'secrets' && (
            <div className="space-y-5">
              <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-amber-900 flex items-start gap-3">
                <Shield className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-bold text-sm">Seguridad y Almacenamiento de Claves Secretas</p>
                  <p className="text-xs text-amber-800">
                    Nunca expongas claves en el código del cliente ni en repositorios públicos. Los secretos se gestionan en el servidor mediante el archivo <code>.env</code> y se inyectan automáticamente en el entorno de despliegue seguro (Google Cloud Run / AI Studio Secret Manager).
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div className="p-4 rounded-2xl bg-[#FAFBF9] border border-[#DEE6DD] space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-mono font-bold text-sm text-[#1E3228]">GEMINI_API_KEY</span>
                    <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-800 text-[10px] font-bold">Secreto Servidor</span>
                  </div>
                  <p className="text-gray-600">
                    <strong>Propósito:</strong> Clave del modelo generativo multimodal @google/genai para valoraciones predictivas de propiedades, enriquecimiento de descripciones comerciales y análisis de contratos.
                  </p>
                  <p className="text-[11px] text-gray-400 font-mono">Inyección: Proceso seguro en runtime desde user secrets (sin exposición en UI del cliente).</p>
                </div>

                <div className="p-4 rounded-2xl bg-[#FAFBF9] border border-[#DEE6DD] space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-mono font-bold text-sm text-[#1E3228]">APP_URL</span>
                    <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 text-[10px] font-bold">Público / Runtime</span>
                  </div>
                  <p className="text-gray-600">
                    <strong>Propósito:</strong> URL canónica base de la aplicación para enlaces en correos electrónicos de confirmación, webhooks de pago y redireccionamientos seguros HTTPS.
                  </p>
                  <p className="text-[11px] text-gray-400 font-mono">Ejemplo: https://ais-dev-w4sywdwntousefqhrqbm6u-112249538281.us-west1.run.app</p>
                </div>

                <div className="p-4 rounded-2xl bg-[#FAFBF9] border border-[#DEE6DD] space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-mono font-bold text-sm text-[#1E3228]">DATABASE_URL</span>
                    <span className="px-2 py-0.5 rounded bg-purple-100 text-purple-800 text-[10px] font-bold">Cadena de Conexión</span>
                  </div>
                  <p className="text-gray-600">
                    <strong>Propósito:</strong> Cadena de conexión cifrada SSL a la base de datos relacional (MySQL/PostgreSQL) para las tablas <code>tbl_propiedad</code>, <code>tbl_inquilino</code>, <code>tbl_contrato_arrendamiento</code>.
                  </p>
                  <p className="text-[11px] text-gray-400 font-mono">Formato: mysql://usuario:contraseña@servidor.cloudsql:3306/GestionPropiedades?ssl=true</p>
                </div>

                <div className="p-4 rounded-2xl bg-[#FAFBF9] border border-[#DEE6DD] space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-mono font-bold text-sm text-[#1E3228]">JWT_SECRET / SIGNING_KEY</span>
                    <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 text-[10px] font-bold">Criptográfico</span>
                  </div>
                  <p className="text-gray-600">
                    <strong>Propósito:</strong> Semilla criptográfica de 256 bits para firmar y verificar tokens de sesión de usuarios y hashes de integridad de contratos de alquiler.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB: AUTH & ROLES */}
          {activeTab === 'auth' && (
            <div className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                Todas las peticiones autenticadas deben incluir el encabezado HTTP estándar <code>Authorization</code> con el esquema <code>Bearer &lt;token&gt;</code>:
              </p>

              <pre className="p-3 bg-gray-900 text-gray-200 rounded-xl font-mono text-xs">
                Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
              </pre>

              <h4 className="font-bold text-sm text-gray-900 pt-2">Matriz de Roles y Permisos (RBAC):</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b bg-[#F5F8F4] text-gray-700">
                      <th className="p-2.5">Rol</th>
                      <th className="p-2.5">Catálogo</th>
                      <th className="p-2.5">Contratos</th>
                      <th className="p-2.5">Pagos</th>
                      <th className="p-2.5">Mantenimiento</th>
                      <th className="p-2.5">Usuarios & Logs</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    <tr>
                      <td className="p-2.5 font-bold text-[#1E3228]">admin</td>
                      <td className="p-2.5 text-emerald-700 font-semibold">CRUD Total</td>
                      <td className="p-2.5 text-emerald-700 font-semibold">Emitir / Cancelar</td>
                      <td className="p-2.5 text-emerald-700 font-semibold">Conciliar</td>
                      <td className="p-2.5 text-emerald-700 font-semibold">Asignar</td>
                      <td className="p-2.5 text-emerald-700 font-semibold">Auditoría Total</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold text-blue-800">agent</td>
                      <td className="p-2.5 text-emerald-700 font-semibold">Crear / Editar</td>
                      <td className="p-2.5 text-emerald-700 font-semibold">Negociar</td>
                      <td className="p-2.5 text-gray-400">Ver comisión</td>
                      <td className="p-2.5 text-gray-400">Lectura</td>
                      <td className="p-2.5 text-gray-400">Sin acceso</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold text-emerald-800">owner</td>
                      <td className="p-2.5 text-emerald-700 font-semibold">Mis inmuebles</td>
                      <td className="p-2.5 text-emerald-700 font-semibold">Ver activos</td>
                      <td className="p-2.5 text-emerald-700 font-semibold">Historial cobros</td>
                      <td className="p-2.5 text-emerald-700 font-semibold">Solicitar</td>
                      <td className="p-2.5 text-gray-400">Sin acceso</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold text-rose-800">tenant</td>
                      <td className="p-2.5 text-gray-600">Ver / Filtrar</td>
                      <td className="p-2.5 text-emerald-700 font-semibold">Mi contrato</td>
                      <td className="p-2.5 text-emerald-700 font-semibold">Pagar Renta</td>
                      <td className="p-2.5 text-emerald-700 font-semibold">Reportar daño</td>
                      <td className="p-2.5 text-gray-400">Sin acceso</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB: SDK CODE */}
          {activeTab === 'sdk' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <p className="text-gray-700 font-semibold">Consumo del API mediante cliente TypeScript (Fetch/Axios):</p>
                <button
                  onClick={() => copyToClipboard(`// Cliente TypeScript para API Terranova\nexport async function getProperties(filter = { type: 'Casa', maxPrice: 2000 }) {\n  const res = await fetch(\`https://api.terranova.hn/v1/properties?type=\${filter.type}&maxPrice=\${filter.maxPrice}\`, {\n    headers: {\n      'Accept': 'application/json',\n      'Authorization': \`Bearer \${process.env.TERRANOVA_API_TOKEN}\`\n    }\n  });\n  if (!res.ok) throw new Error(\`Error API: \${res.status}\`);\n  return res.json();\n}`, 99)}
                  className="px-3 py-1 bg-[#2D4539] text-white rounded-lg flex items-center gap-1 text-[11px] font-medium hover:bg-[#20342A]"
                >
                  {copiedIndex === 99 ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedIndex === 99 ? 'Copiado' : 'Copiar Código'}</span>
                </button>
              </div>

              <pre className="p-4 bg-gray-900 text-gray-100 rounded-2xl font-mono text-[11px] leading-relaxed overflow-x-auto">
{`// Cliente TypeScript para API Terranova
export async function getProperties(filter = { type: 'Casa', maxPrice: 2000 }) {
  const res = await fetch(\`https://api.terranova.hn/v1/properties?type=\${filter.type}&maxPrice=\${filter.maxPrice}\`, {
    headers: {
      'Accept': 'application/json',
      'Authorization': \`Bearer \${process.env.TERRANOVA_API_TOKEN}\`
    }
  });
  if (!res.ok) throw new Error(\`Error API: \${res.status}\`);
  return res.json();
}

// Procesar Pago de Renta
export async function payRentOnline(contractId: string, amount: number, paymentMethod: string) {
  const res = await fetch('https://api.terranova.hn/v1/payments/checkout', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': \`Bearer \${process.env.TERRANOVA_API_TOKEN}\`
    },
    body: JSON.stringify({ contractId, amount, paymentMethod })
  });
  return res.json();
}`}
              </pre>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#FAFBF9] border-t border-gray-100 flex justify-end rounded-b-3xl">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-[#2D4539] hover:bg-[#20342A] text-white rounded-xl font-semibold text-xs transition-colors"
          >
            Cerrar Documentación
          </button>
        </div>
      </div>
    </div>
  );
};
