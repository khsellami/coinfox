import { isUserSignedIn, getFile, putFile } from 'blockstack';

const GAIA_ALERTS_FILE = 'coinfox_alerts.json';

// Load alerts from Gaia if signed in, otherwise from localStorage
export async function loadAlerts() {
  if (isUserSignedIn()) {
    try {
      const decrypt = true;
      const gaia = await getFile(GAIA_ALERTS_FILE, decrypt);
      if (!gaia) return {};
      const parsed = JSON.parse(gaia || '{}');
      return parsed.alerts || {};
    } catch (e) {
      console.warn('Failed to load alerts from Gaia', e);
      return {};
    }
  } else {
    try {
      return JSON.parse(localStorage.getItem('alerts') || '{}');
    } catch (e) {
      return {};
    }
  }
}

// Save alerts object {coin: [alerts]} into Gaia or localStorage
export async function saveAlerts(alerts) {
  if (isUserSignedIn()) {
    try {
      const encrypt = true;
      const data = { alerts };
      await putFile(GAIA_ALERTS_FILE, JSON.stringify(data), encrypt);
      return true;
    } catch (e) {
      console.warn('Failed to save alerts to Gaia', e);
      return false;
    }
  } else {
    try {
      localStorage.setItem('alerts', JSON.stringify(alerts));
      return true;
    } catch (e) {
      console.warn('Failed to save alerts to localStorage', e);
      return false;
    }
  }
}

export function makeAlert({ coin, targetPrice, type }) {
  return {
    id: Date.now() + Math.random(),
    coin: coin.toUpperCase(),
    targetPrice: Number(targetPrice),
    type: type, // 'above' or 'below'
    status: 'active', // active | triggered | dismissed
    createdAt: new Date().toISOString()
  };
}

// Mark an alert status and persist
export async function updateAlertStatus(alertId, newStatus) {
  const alerts = await loadAlerts();
  let changed = false;
  for (const coin in alerts) {
    alerts[coin] = alerts[coin].map(a => {
      if (a.id === alertId) {
        changed = true;
        return { ...a, status: newStatus };
      }
      return a;
    });
  }
  if (changed) await saveAlerts(alerts);
  return alerts;
}

// Simple in-memory check function (uses marketData from App). Returns list of triggered alert ids.
export function evaluateAlertsWithMarketData(alerts, marketData, exchangeRate = 1) {
  const triggered = [];
  for (const coin in alerts) {
    const list = alerts[coin] || [];
    list.forEach(alert => {
      if (alert.status !== 'active') return;
      const price = marketData[coin] && marketData[coin].ticker && marketData[coin].ticker.price
        ? Number(marketData[coin].ticker.price) * exchangeRate
        : null;
      if (price === null) return;
      if (alert.type === 'above' && price >= alert.targetPrice) triggered.push(alert.id);
      if (alert.type === 'below' && price <= alert.targetPrice) triggered.push(alert.id);
    });
  }
  return triggered;
}
