const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_REPO = process.env.GITHUB_REPO || 'vinaythoke/lineup-verification';
const FILE_PATH = 'src/data/organizer_decisions.json';
const API_URL = `https://api.github.com/repos/${GITHUB_REPO}/contents/${FILE_PATH}`;

export default async function handler(req, res) {
  // Check if GITHUB_TOKEN is configured
  if (!GITHUB_TOKEN) {
    console.error('Missing GITHUB_TOKEN environment variable.');
    return res.status(500).json({ error: 'GITHUB_TOKEN environment variable is not configured on the server.' });
  }

  const headers = {
    'Authorization': `Bearer ${GITHUB_TOKEN}`,
    'Accept': 'application/vnd.github.v3+json',
    'User-Agent': 'Vercel-Serverless-Function'
  };

  // GET: Fetch decisions from GitHub
  if (req.method === 'GET') {
    try {
      const response = await fetch(API_URL, { headers });

      if (response.status === 404) {
        // File does not exist yet (first time initialization)
        return res.status(200).json({});
      }

      if (!response.ok) {
        const errText = await response.text();
        console.error('Failed to fetch from GitHub API:', response.status, errText);
        return res.status(response.status).json({ error: `GitHub API error: ${errText}` });
      }

      const fileData = await response.json();
      const content = Buffer.from(fileData.content, 'base64').toString('utf-8');
      const decisions = JSON.parse(content) || {};
      
      return res.status(200).json(decisions);
    } catch (error) {
      console.error('Error fetching decisions from GitHub:', error);
      return res.status(500).json({ error: 'Internal server error while fetching decisions.' });
    }
  }

  // POST: Commit new decisions map back to GitHub
  if (req.method === 'POST') {
    try {
      const newDecisionsMap = req.body;
      if (!newDecisionsMap || typeof newDecisionsMap !== 'object') {
        return res.status(400).json({ error: 'Invalid request body. Expected a decisions JSON object.' });
      }

      // 1. Fetch current file SHA
      const getResponse = await fetch(API_URL, { headers });
      let currentSha = '';
      if (getResponse.ok) {
        const fileData = await getResponse.json();
        currentSha = fileData.sha;
      }

      // 2. Encode decisions to Base64 (supporting Unicode characters)
      const jsonString = JSON.stringify(newDecisionsMap, null, 2);
      const base64Content = Buffer.from(jsonString, 'utf-8').toString('base64');

      // 3. Put request to commit to main branch
      const putRes = await fetch(API_URL, {
        method: 'PUT',
        headers: {
          ...headers,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: `Update organizer decisions (${Object.keys(newDecisionsMap).length} records) [Auto-Sync via API]`,
          content: base64Content,
          sha: currentSha,
          branch: 'main'
        })
      });

      if (!putRes.ok) {
        const errText = await putRes.text();
        console.error('Failed to commit decisions to GitHub:', putRes.status, errText);
        return res.status(putRes.status).json({ error: `Failed to commit to GitHub: ${errText}` });
      }

      const responseData = await putRes.json();
      return res.status(200).json({ success: true, sha: responseData.content.sha });
    } catch (error) {
      console.error('Error saving decisions to GitHub:', error);
      return res.status(500).json({ error: 'Internal server error while saving decisions.' });
    }
  }

  // Fallback for unsupported methods
  res.setHeader('Allow', ['GET', 'POST']);
  return res.status(405).json({ error: `Method ${req.method} not allowed.` });
}
