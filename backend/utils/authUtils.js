import crypto from 'crypto';
import https from 'https';

/**
 * Extracts the actual secret from YaYa's JWT format
 * @param {string} jwt - The JWT token provided by YaYa
 * @returns {string} The actual secret for HMAC signing
 */
// export function extractSecretFromJWT(jwt) {
//   try {
//     const parts = jwt.split('.');
//     if (parts.length !== 3) {
//       throw new Error('Invalid JWT format: Expected 3 parts');
//     }

//     const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString());
    
//     if (!payload.secret) {
//       throw new Error('No secret field found in JWT payload');
//     }

//     if (typeof payload.secret !== 'string') {
//       throw new Error('Secret field is not a string');
//     }

//     return payload.secret;
//   } catch (error) {
//     throw new Error(`Failed to extract secret from JWT: ${error.message}`);
//   }
// }

/**
 * Generates authentication headers for YaYa API requests
 * @param {string} timestamp - Unix timestamp in milliseconds
 * @param {string} method - HTTP method (GET, POST, etc.)
 * @param {string} endpoint - API endpoint
 * @param {string} body - Request body (empty for GET requests)
 * @param {string} apiKey - YaYa API key
 * @param {string} secret - Actual secret for HMAC
 * @returns {Object} Headers for YaYa API request
 */
export function generateAuthHeaders(timestamp, method, endpoint, body, apiKey, secret) {
  // Validate inputs
  if (!timestamp || !method || !endpoint || !apiKey || !secret) {
    throw new Error('Missing required parameters for auth headers');
  }

  const preHashString = timestamp + method.toUpperCase() + endpoint + (body || '');
  
  const hmac = crypto.createHmac('sha256', secret);
  hmac.update(preHashString);
  const signature = hmac.digest('base64');

  return {
    'YAYA-API-KEY': apiKey,
    'YAYA-API-TIMESTAMP': timestamp,
    'YAYA-API-SIGN': signature,
    'Content-Type': 'application/json'
  };
}

/**
 * Fetches current server time from YaYa API
 * @returns {Promise<string>} Unix timestamp in milliseconds
 */
export async function getServerTime() {
  return new Promise((resolve, reject) => {
    const req = https.get('https://sandbox.yayawallet.com/api/en/time', (res) => {
      if (res.statusCode !== 200) {
        return reject(new Error(`Time endpoint returned status ${res.statusCode}`));
      }

      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          if (parsed.time && typeof parsed.time === 'number') {
            resolve(parsed.time.toString());
          } else {
            reject(new Error('Invalid time response format'));
          }
        } catch (error) {
          reject(new Error('Failed to parse time response'));
        }
      });
    });

    req.on('error', (error) => {
      reject(new Error(`Failed to fetch server time: ${error.message}`));
    });

    req.setTimeout(10000, () => {
      req.destroy();
      reject(new Error('Server time request timeout'));
    });
  });
}