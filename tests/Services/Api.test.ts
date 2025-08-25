import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { fetchCurrencyRate, isOkResult } from '../../src/Services/Api';

// Mock the JSON imports
vi.mock('../Libs/CountryCurrency.json', () => ({
  default: {
    'US': 'USD',
    'GB': 'GBP',
    'EU': 'EUR',
    'AU': 'AUD',
    'CA': 'CAD',
    'JP': 'JPY',
  }
}));

vi.mock('../Libs/Countries.json', () => ({
  default: {
    CountryCodes: [
      { name: 'United States', countryCode: '+1', code: 'US' },
      { name: 'United Kingdom', countryCode: '+44', code: 'GB' },
    ]
  }
}));

// Mock fetch globally
const mockFetch = vi.fn();
global.fetch = mockFetch;

// Mock console.error to avoid noise in tests
let mockConsoleError: ReturnType<typeof vi.spyOn>;

describe('API Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockConsoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('isOkResult', () => {
    it('returns true for ok results', () => {
      const okResult = { status: 'ok' as const, data: { retailRate: 1.25 } };
      expect(isOkResult(okResult)).toBe(true);
    });

    it('returns false for error results', () => {
      const errorResult = { status: 'error' as const, message: 'Error message' };
      expect(isOkResult(errorResult)).toBe(false);
    });
  });

  describe('fetchCurrencyRate', () => {
    it('returns error result when fromCurrency is empty', async () => {
      const result = await fetchCurrencyRate('', 'GB', 1.0);
      
      expect(result.status).toBe('error');
      expect(result.message).toBe('Invalid currency');
      expect(mockFetch).not.toHaveBeenCalled();
    });

    it('returns error result when toCurrency is empty', async () => {
      const result = await fetchCurrencyRate('US', '', 1.0);
      
      expect(result.status).toBe('error');
      expect(result.message).toBe('Invalid currency');
      expect(mockFetch).not.toHaveBeenCalled();
    });

    it('returns error result when fromCurrency is null', async () => {
      const result = await fetchCurrencyRate(null as any, 'GB', 1.0);
      
      expect(result.status).toBe('error');
      expect(result.message).toBe('Invalid currency');
      expect(mockFetch).not.toHaveBeenCalled();
    });

    it('returns error result when toCurrency is null', async () => {
      const result = await fetchCurrencyRate('US', null as any, 1.0);
      
      expect(result.status).toBe('error');
      expect(result.message).toBe('Invalid currency');
      expect(mockFetch).not.toHaveBeenCalled();
    });

    it('returns error result when fromCurrency is undefined', async () => {
      const result = await fetchCurrencyRate(undefined as any, 'GB', 1.0);
      
      expect(result.status).toBe('error');
      expect(result.message).toBe('Invalid currency');
      expect(mockFetch).not.toHaveBeenCalled();
    });

    it('returns error result when toCurrency is undefined', async () => {
      const result = await fetchCurrencyRate('US', undefined as any, 1.0);
      
      expect(result.status).toBe('error');
      expect(result.message).toBe('Invalid currency');
      expect(mockFetch).not.toHaveBeenCalled();
    });

    it('successfully fetches currency rate', async () => {
      const mockResponse = {
        ok: true,
        status: 200,
        json: vi.fn().mockResolvedValue({
          retailRate: 1.25
        })
      };
      mockFetch.mockResolvedValue(mockResponse);

      const result = await fetchCurrencyRate('US', 'GB', 1.0);

      expect(mockFetch).toHaveBeenCalledTimes(1);
      expect(mockFetch).toHaveBeenCalledWith(
        'https://rates.staging.api.paytron.com/rate/public?sellCurrency=USD&buyCurrency=GBP',
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      expect(result.status).toBe('ok');
      expect(isOkResult(result) && result.data.retailRate).toBe(1.25);
    });

    it('returns default rate when retailRate is not present', async () => {
      const mockResponse = {
        ok: true,
        status: 200,
        json: vi.fn().mockResolvedValue({
          someOtherField: 'value'
        })
      };
      mockFetch.mockResolvedValue(mockResponse);

      const result = await fetchCurrencyRate('US', 'GB', 1.5);

      expect(result.status).toBe('ok');
      expect(isOkResult(result) && result.data.retailRate).toBe(1.5);
    });

    it('returns default rate when retailRate is null', async () => {
      const mockResponse = {
        ok: true,
        status: 200,
        json: vi.fn().mockResolvedValue({
          retailRate: null
        })
      };
      mockFetch.mockResolvedValue(mockResponse);

      const result = await fetchCurrencyRate('US', 'GB', 2.0);

      expect(result.status).toBe('ok');
      expect(isOkResult(result) && result.data.retailRate).toBe(2.0);
    });

    it('returns default rate when retailRate is undefined', async () => {
      const mockResponse = {
        ok: true,
        status: 200,
        json: vi.fn().mockResolvedValue({
          retailRate: undefined
        })
      };
      mockFetch.mockResolvedValue(mockResponse);

      const result = await fetchCurrencyRate('US', 'GB', 3.0);

      expect(result.status).toBe('ok');
      expect(isOkResult(result) && result.data.retailRate).toBe(3.0);
    });

    it('handles HTTP error responses', async () => {
      const mockResponse = {
        ok: false,
        status: 404
      };
      mockFetch.mockResolvedValue(mockResponse);

      const result = await fetchCurrencyRate('US', 'GB', 1.0);

      expect(mockConsoleError).toHaveBeenCalledWith(
        'Could not fetch exchange rate:',
        expect.any(Error)
      );
      expect(result.status).toBe('error');
      expect(result.message).toBe('Could not fetch exchange rate');
    });

    it('handles network errors', async () => {
      const networkError = new Error('Network error');
      mockFetch.mockRejectedValue(networkError);

      const result = await fetchCurrencyRate('US', 'GB', 1.0);

      expect(mockConsoleError).toHaveBeenCalledWith(
        'Could not fetch exchange rate:',
        networkError
      );
      expect(result.status).toBe('error');
      expect(result.message).toBe('Could not fetch exchange rate');
    });

    it('handles JSON parsing errors', async () => {
      const mockResponse = {
        ok: true,
        status: 200,
        json: vi.fn().mockRejectedValue(new Error('Invalid JSON'))
      };
      mockFetch.mockResolvedValue(mockResponse);

      const result = await fetchCurrencyRate('US', 'GB', 1.0);

      expect(mockConsoleError).toHaveBeenCalledWith(
        'Could not fetch exchange rate:',
        expect.any(Error)
      );
      expect(result.status).toBe('error');
      expect(result.message).toBe('Could not fetch exchange rate');
    });

    it('constructs correct URL with different currencies', async () => {
      const mockResponse = {
        ok: true,
        status: 200,
        json: vi.fn().mockResolvedValue({ retailRate: 1.5 })
      };
      mockFetch.mockResolvedValue(mockResponse);

      const result = await fetchCurrencyRate('AU', 'CA', 1.0);

      expect(mockFetch).toHaveBeenCalledWith(
        'https://rates.staging.api.paytron.com/rate/public?sellCurrency=AUD&buyCurrency=CAD',
        expect.any(Object)
      );
      expect(result.status).toBe('ok');
      expect(isOkResult(result) && result.data.retailRate).toBe(1.5);
    });

    it('returns error for invalid from currency code', async () => {
      const result = await fetchCurrencyRate('INVALID', 'GB', 1.0);
      
      expect(result.status).toBe('error');
      expect(result.message).toBe('Invalid currency');
      expect(mockFetch).not.toHaveBeenCalled();
    });

    it('returns error for invalid to currency code', async () => {
      const result = await fetchCurrencyRate('US', 'INVALID', 1.0);
      
      expect(result.status).toBe('error');
      expect(result.message).toBe('Invalid currency');
      expect(mockFetch).not.toHaveBeenCalled();
    });

    it('sets correct request headers', async () => {
      const mockResponse = {
        ok: true,
        status: 200,
        json: vi.fn().mockResolvedValue({ retailRate: 1.25 })
      };
      mockFetch.mockResolvedValue(mockResponse);

      const result = await fetchCurrencyRate('US', 'GB', 1.0);

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      expect(result.status).toBe('ok');
    });

    it('handles 500 server error', async () => {
      const mockResponse = {
        ok: false,
        status: 500
      };
      mockFetch.mockResolvedValue(mockResponse);

      const result = await fetchCurrencyRate('US', 'GB', 1.0);

      expect(mockConsoleError).toHaveBeenCalledWith(
        'Could not fetch exchange rate:',
        expect.objectContaining({
          message: 'HTTP error! status: 500'
        })
      );
      expect(result.status).toBe('error');
      expect(result.message).toBe('Could not fetch exchange rate');
    });

    it('handles 401 unauthorized error', async () => {
      const mockResponse = {
        ok: false,
        status: 401
      };
      mockFetch.mockResolvedValue(mockResponse);

      const result = await fetchCurrencyRate('US', 'GB', 1.0);

      expect(mockConsoleError).toHaveBeenCalledWith(
        'Could not fetch exchange rate:',
        expect.objectContaining({
          message: 'HTTP error! status: 401'
        })
      );
      expect(result.status).toBe('error');
      expect(result.message).toBe('Could not fetch exchange rate');
    });

    it('handles response with zero retailRate', async () => {
      const mockResponse = {
        ok: true,
        status: 200,
        json: vi.fn().mockResolvedValue({
          retailRate: 0
        })
      };
      mockFetch.mockResolvedValue(mockResponse);

      const result = await fetchCurrencyRate('US', 'GB', 1.5);

      expect(result.status).toBe('ok');
      // Since 0 is falsy, it falls back to default rate
      expect(isOkResult(result) && result.data.retailRate).toBe(1.5);
    });

    it('handles response with negative retailRate', async () => {
      const mockResponse = {
        ok: true,
        status: 200,
        json: vi.fn().mockResolvedValue({
          retailRate: -1.5
        })
      };
      mockFetch.mockResolvedValue(mockResponse);

      const result = await fetchCurrencyRate('US', 'GB', 1.0);

      expect(result.status).toBe('ok');
      expect(isOkResult(result) && result.data.retailRate).toBe(-1.5);
    });

    it('handles same currency conversion', async () => {
      const mockResponse = {
        ok: true,
        status: 200,
        json: vi.fn().mockResolvedValue({
          retailRate: 1.0
        })
      };
      mockFetch.mockResolvedValue(mockResponse);

      const result = await fetchCurrencyRate('US', 'US', 1.0);

      expect(mockFetch).toHaveBeenCalledWith(
        'https://rates.staging.api.paytron.com/rate/public?sellCurrency=USD&buyCurrency=USD',
        expect.any(Object)
      );
      expect(result.status).toBe('ok');
      expect(isOkResult(result) && result.data.retailRate).toBe(1.0);
    });

    it('handles empty response body', async () => {
      const mockResponse = {
        ok: true,
        status: 200,
        json: vi.fn().mockResolvedValue({})
      };
      mockFetch.mockResolvedValue(mockResponse);

      const result = await fetchCurrencyRate('US', 'GB', 2.5);

      expect(result.status).toBe('ok');
      expect(isOkResult(result) && result.data.retailRate).toBe(2.5);
    });

    it('handles response with additional fields', async () => {
      const mockResponse = {
        ok: true,
        status: 200,
        json: vi.fn().mockResolvedValue({
          retailRate: 1.35,
          wholesaleRate: 1.30,
          timestamp: '2024-01-01T00:00:00Z',
          currency: 'GBP'
        })
      };
      mockFetch.mockResolvedValue(mockResponse);

      const result = await fetchCurrencyRate('US', 'GB', 1.0);

      expect(result.status).toBe('ok');
      expect(isOkResult(result) && result.data.retailRate).toBe(1.35);
    });

    it('preserves decimal precision in retailRate', async () => {
      const mockResponse = {
        ok: true,
        status: 200,
        json: vi.fn().mockResolvedValue({
          retailRate: 1.234567
        })
      };
      mockFetch.mockResolvedValue(mockResponse);

      const result = await fetchCurrencyRate('US', 'GB', 1.0);

      expect(result.status).toBe('ok');
      expect(isOkResult(result) && result.data.retailRate).toBe(1.234567);
    });
  });
});
