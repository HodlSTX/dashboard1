import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const { path } = req.query;
    const apiPath = Array.isArray(path) ? path.join('/') : path;
    const apiUrl = `https://zeroauthoritydao.com/api/${apiPath}`;
    
    console.log(`Proxying request to: ${apiUrl}`);
    
    const response = await fetch(apiUrl, {
      method: req.method,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Dashboard1-Proxy/1.0'
      },
      body: req.method !== 'GET' && req.method !== 'HEAD' ? JSON.stringify(req.body) : undefined,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    // Special handling for bounties endpoint - implement pagination
    if (apiPath === 'bounties' && data.data && data.data.length === 100) {
      console.log("Got 100 bounties, attempting to fetch more with pagination...");
      try {
        // Fetch page 2
        const page2Response = await fetch("https://zeroauthoritydao.com/api/bounties?limit=100&page=2");
        if (page2Response.ok) {
          const page2Data = await page2Response.json();
          if (page2Data.data && page2Data.data.length > 0) {
            data.data = [...data.data, ...page2Data.data];
            console.log(`Combined data after page 2: ${data.data.length} total bounties`);
            
            // If page 2 also has 100 records, try page 3
            if (page2Data.data.length === 100) {
              try {
                const page3Response = await fetch("https://zeroauthoritydao.com/api/bounties?limit=100&page=3");
                if (page3Response.ok) {
                  const page3Data = await page3Response.json();
                  if (page3Data.data && page3Data.data.length > 0) {
                    data.data = [...data.data, ...page3Data.data];
                    console.log(`Combined data after page 3: ${data.data.length} total bounties`);
                  }
                }
              } catch (page3Error) {
                console.log("Page 3 fetch failed, using pages 1-2");
              }
            }
          }
        }
      } catch (paginationError) {
        console.log("Pagination attempt failed, using single page result");
      }
    }
    
    res.status(200).json(data);
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch data from Zero Authority DAO API',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}