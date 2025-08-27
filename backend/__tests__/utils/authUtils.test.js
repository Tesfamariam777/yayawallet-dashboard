import { 
  generateAuthHeaders, 
  generateSignature 
} from '../../utils/authUtils.js';

describe('Auth Utilities', () => {
  
  describe('generateSignature', () => {
    test('should generate correct HMAC signature', () => {
      const timestamp = '1756238312000';
      const method = 'GET';
      const endpoint = '/api/en/transaction/find-by-user?p=1';
      const body = '';
      const secret = 'ca9f2a0c9db5fdcee119a63b33d35e1d8a5d4fbc';

      const signature = generateSignature(timestamp, method, endpoint, body, secret);
      
      // This should match our previous calculation
      expect(signature).toBe('emyqQv2EM09ierTYuIyl2/YtlR3OFtwRI29gfet+qyg=');
    });
  });

  describe('generateAuthHeaders', () => {
    test('should generate complete auth headers', () => {
      const headers = generateAuthHeaders(
        '1756238312000',
        'GET',
        '/api/en/transaction/find-by-user?p=1',
        '',
        'test-api-key',
        'test-secret'
      );

      expect(headers).toEqual({
        'YAYA-API-KEY': 'test-api-key',
        'YAYA-API-TIMESTAMP': '1756238312000',
        'YAYA-API-SIGN': expect.any(String),
        'Content-Type': 'application/json'
      });
    });
  });
});