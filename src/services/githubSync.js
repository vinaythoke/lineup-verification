const LOCAL_TOKEN = import.meta.env.VITE_GITHUB_TOKEN;
const GITHUB_REPO = import.meta.env.VITE_GITHUB_REPO || 'vinaythoke/lineup-verification';
const FILE_PATH = 'src/data/organizer_decisions.json';
const RAW_URL = `https://raw.githubusercontent.com/${GITHUB_REPO}/main/${FILE_PATH}`;
const API_URL = `https://api.github.com/repos/${GITHUB_REPO}/contents/${FILE_PATH}`;

export const isGitHubSyncEnabled = true;

/**
 * Fetch organizer decisions from GitHub repository
 */
export async function fetchGitHubDecisions() {
  // If VITE_GITHUB_TOKEN is defined locally, fall back to direct client-side fetching for easy local development
  if (LOCAL_TOKEN) {
    try {
      const cacheBuster = `?t=${Date.now()}`;
      const res = await fetch(RAW_URL + cacheBuster, {
        headers: { 'Cache-Control': 'no-cache' }
      });

      if (res.ok) {
        const data = await res.json();
        return data || {};
      }
    } catch (err) {
      console.warn('Raw GitHub fetch failed, attempting API fetch:', err);
    }

    try {
      const res = await fetch(API_URL, {
        headers: {
          'Authorization': `Bearer ${LOCAL_TOKEN}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      });
      if (res.ok) {
        const fileData = await res.json();
        const content = atob(fileData.content.replace(/\n/g, ''));
        return JSON.parse(content) || {};
      }
    } catch (e) {
      console.error('GitHub API fetch error:', e);
    }
    return null;
  }

  // Otherwise, use Vercel Serverless Function API Proxy (Production mode)
  try {
    const res = await fetch('/api/sync');
    if (res.ok) {
      const data = await res.json();
      return data || {};
    } else {
      console.warn('Failed to fetch decisions from /api/sync:', res.status);
    }
  } catch (err) {
    console.error('Error fetching decisions from /api/sync:', err);
  }
  return null;
}

/**
 * Save organizer decisions map directly into GitHub repository file
 */
export async function saveGitHubDecisionsMap(newDecisionsMap) {
  // If VITE_GITHUB_TOKEN is defined locally, fall back to direct client-side save for easy local development
  if (LOCAL_TOKEN) {
    try {
      // 1. Get current file SHA
      const shaRes = await fetch(API_URL, {
        headers: {
          'Authorization': `Bearer ${LOCAL_TOKEN}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      });

      let currentSha = '';
      if (shaRes.ok) {
        const shaData = await shaRes.json();
        currentSha = shaData.sha;
      }

      // 2. Encode JSON content into Base64 (supporting Unicode string)
      const jsonString = JSON.stringify(newDecisionsMap, null, 2);
      const base64Content = btoa(unescape(encodeURIComponent(jsonString)));

      // 3. Commit PUT request to GitHub repo
      const putRes = await fetch(API_URL, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${LOCAL_TOKEN}`,
          'Content-Type': 'application/json',
          'Accept': 'application/vnd.github.v3+json'
        },
        body: JSON.stringify({
          message: `Update organizer decisions (${Object.keys(newDecisionsMap).length} records) [Auto-Sync]`,
          content: base64Content,
          sha: currentSha,
          branch: 'main'
        })
      });

      return putRes.ok;
    } catch (err) {
      console.error('Failed to commit decisions directly to GitHub repo:', err);
      return false;
    }
  }

  // Otherwise, use Vercel Serverless Function API Proxy (Production mode)
  try {
    const res = await fetch('/api/sync', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newDecisionsMap)
    });

    if (res.ok) {
      return true;
    } else {
      console.error('Failed to save decisions to /api/sync:', res.status);
      return false;
    }
  } catch (err) {
    console.error('Error saving decisions to /api/sync:', err);
    return false;
  }
}

/**
 * Reset all organizer decisions in GitHub repository file
 */
export async function resetGitHubDecisionsMap() {
  return saveGitHubDecisionsMap({});
}
