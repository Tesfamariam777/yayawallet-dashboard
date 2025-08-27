// server/services/yayaApiService.js
import https from 'https';
import { generateAuthHeaders, getServerTime } from '../utils/authUtils.js';

const BASE_URL = process.env.BASE_URL || 'https://sandbox.yayawallet.com';

export class YayaApiService {
  constructor(apiKey, apiSecretJWT) {
    this.apiKey = apiKey;
    this.actualSecret = process.env.YAYA_API_SECRET;
  }

  /**
   * Makes authenticated request to YaYa API
   * @param {string} method - HTTP method
   * @param {string} endpoint - API endpoint
   * @param {Object} data - Request data (for POST requests)
   * @returns {Promise<Object>} API response
   */
  async makeRequest(method, endpoint, data = null) {
    try {
      // Get server time for timestamp
      const timestamp = await getServerTime();
      
      // Prepare request body
      const body = data ? JSON.stringify(data) : '';
      
      // Generate authentication headers
      const headers = generateAuthHeaders(
        timestamp, 
        method, 
        endpoint, 
        body, 
        this.apiKey, 
        this.actualSecret
      );

      // Make the request
      return await this._executeRequest(method, endpoint, headers, body);
    } catch (error) {
      console.error('YaYa API request failed:', error.message);
      throw new Error(`API request failed: ${error.message}`);
    }
  }

  /**
   * Executes the HTTP request
   * @private
   */
  _executeRequest(method, endpoint, headers, body) {
    return new Promise((resolve, reject) => {
      const options = {
        hostname: 'sandbox.yayawallet.com',
        port: 443,
        path: endpoint,
        method: method,
        headers: headers,
        timeout: 15000
      };

      const req = https.request(options, (res) => {
        let responseData = '';
        
        res.on('data', (chunk) => responseData += chunk);
        
        res.on('end', () => {
          try {
            const parsedData = responseData ? JSON.parse(responseData) : {};
            
            if (res.statusCode >= 400) {
              const error = new Error(parsedData.error || `HTTP ${res.statusCode}`);
              error.statusCode = res.statusCode;
              error.responseData = parsedData;
              reject(error);
            } else {
              resolve(parsedData);
            }
          } catch (parseError) {
            reject(new Error(`Failed to parse response: ${parseError.message}`));
          }
        });
      });

      req.on('error', (error) => {
        reject(new Error(`Request failed: ${error.message}`));
      });

      req.on('timeout', () => {
        req.destroy();
        reject(new Error('Request timeout'));
      });

      // Write body for POST requests
      if (body && (method === 'POST' || method === 'PUT')) {
        req.write(body);
      }

      req.end();
    });
  }


  /**
   * Gets transactions with pagination
   * @param {number} page - Page number
   * @returns {Promise<Object>} Transactions data
   */
  async getTransactions(page = 1) {
    const endpoint = `/api/en/transaction/find-by-user?p=${page}`;
    return this.makeRequest('GET', endpoint);
  }

  
  /**
   * Searches transactions with specific parameters
   * @param {Object} searchParam - Single search parameter
   * @returns {Promise<Object>} Search results
   */
  async searchTransactions(searchParam) {
    const endpoint = '/api/en/transaction/search';
    
    // Validate that exactly one search parameter is provided
    const paramKeys = Object.keys(searchParam);
    
    if (paramKeys.length === 0) {
      throw new Error('Exactly one search parameter must be provided');
      //Or default to default search according to API docs
    }
    
    // Use the first parameter only (YaYa API limitation)
    const firstKey = paramKeys[0];
    const firstValue = searchParam[firstKey];
    
    if (!firstValue || firstValue.trim() === '') {
      throw new Error(`Search parameter "${firstKey}" cannot be empty`);
    }

    const requestBody = { [firstKey]: firstValue };
    return this.makeRequest('POST', endpoint, requestBody);
  }

}