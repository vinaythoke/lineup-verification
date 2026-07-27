const DEFAULT_CLOUD_URL = 'https://jsonblob.com/api/jsonBlob/019fa402-5775-70b2-ae21-be5b4c7c8c26';
const CLOUD_URL = import.meta.env.VITE_CLOUD_SYNC_URL || DEFAULT_CLOUD_URL;

/**
 * Fetch all shared organizer decisions from free cloud storage
 */
export async function fetchCloudDecisions() {
  try {
    const res = await fetch(CLOUD_URL, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Cache-Control': 'no-cache'
      }
    });

    if (!res.ok) {
      console.warn('Cloud fetch failed with status:', res.status);
      return null;
    }

    const data = await res.json();
    return data?.decisions || {};
  } catch (err) {
    console.error('Failed to fetch cloud decisions:', err);
    return null;
  }
}

/**
 * Save updated organizer decisions map to free cloud storage
 */
export async function saveCloudDecisionsMap(newDecisionsMap) {
  try {
    const payload = {
      satara_marathon: true,
      updated_at: new Date().toISOString(),
      decisions: newDecisionsMap
    };

    const res = await fetch(CLOUD_URL, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    return res.ok;
  } catch (err) {
    console.error('Failed to save to cloud storage:', err);
    return false;
  }
}

/**
 * Reset all shared cloud decisions
 */
export async function resetCloudDecisionsMap() {
  return saveCloudDecisionsMap({});
}
