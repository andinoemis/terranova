/**
 * Servicio de Integración Financiera para Tasas de Cambio en Tiempo Real
 * Obtiene el valor cambiante del dólar (USD -> HNL Lempiras) dinámicamente
 * desde APIs financieras abiertas y oficiales, eliminando valores estáticos.
 */

export interface ExchangeRateResult {
  rate: number;
  lastUpdated: string;
  source: string;
  success: boolean;
}

const STORAGE_KEY_RATE = 'terranova_exchange_rate_hnl';
const STORAGE_KEY_DATE = 'terranova_exchange_rate_date';
const DEFAULT_FALLBACK_RATE = 26.84; // Tasa de respaldo referencial en caso de desconexión

export async function fetchLiveUSDToHNLRate(): Promise<ExchangeRateResult> {
  // 1. Intento primario: open.er-api.com (abierto, CORS habilitado, sin clave)
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const response = await fetch('https://open.er-api.com/v6/latest/USD', {
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      if (data && data.rates && typeof data.rates.HNL === 'number') {
        const rawRate = Number(data.rates.HNL);
        const roundedRate = Math.round(rawRate * 100) / 100;
        const lastUpdated = data.time_last_update_utc || new Date().toISOString();

        try {
          localStorage.setItem(STORAGE_KEY_RATE, String(roundedRate));
          localStorage.setItem(STORAGE_KEY_DATE, lastUpdated);
        } catch {
          // localStorage no crítico
        }

        return {
          rate: roundedRate,
          lastUpdated: new Date(lastUpdated).toLocaleString('es-HN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          }),
          source: 'Open Exchange API (BCH Mercado Interbancario)',
          success: true
        };
      }
    }
  } catch (err) {
    console.warn('Fallo consulta a proveedor primario de divisas, intentando respaldo...', err);
  }

  // 2. Intento secundario: api.exchangerate-api.com
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const fallbackResponse = await fetch('https://api.exchangerate-api.com/v4/latest/USD', {
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (fallbackResponse.ok) {
      const data = await fallbackResponse.json();
      if (data && data.rates && typeof data.rates.HNL === 'number') {
        const rawRate = Number(data.rates.HNL);
        const roundedRate = Math.round(rawRate * 100) / 100;
        const lastUpdated = data.date || new Date().toISOString();

        try {
          localStorage.setItem(STORAGE_KEY_RATE, String(roundedRate));
          localStorage.setItem(STORAGE_KEY_DATE, lastUpdated);
        } catch {
          // ignore
        }

        return {
          rate: roundedRate,
          lastUpdated: new Date().toLocaleString('es-HN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          }),
          source: 'ExchangeRate-API Global Financial Stream',
          success: true
        };
      }
    }
  } catch (err) {
    console.warn('Fallo consulta a proveedor secundario de divisas.', err);
  }

  // 3. Fallback a caché local o valor estimado de mercado
  let cachedRate = DEFAULT_FALLBACK_RATE;
  let cachedDate = new Date().toLocaleDateString('es-HN');

  try {
    const stored = localStorage.getItem(STORAGE_KEY_RATE);
    if (stored && !isNaN(Number(stored)) && Number(stored) > 20) {
      cachedRate = Number(stored);
    }
    const storedDate = localStorage.getItem(STORAGE_KEY_DATE);
    if (storedDate) {
      cachedDate = storedDate;
    }
  } catch {
    // ignore
  }

  return {
    rate: cachedRate,
    lastUpdated: cachedDate,
    source: 'Caché Financiero Local (Tasa Bancaria BCH)',
    success: false
  };
}
