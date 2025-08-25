import { describe, it, expect } from 'vitest';
import { calculateTradeValues } from '../../src/Services/Math';

describe('Math Service', () => {
  describe('calculateTradeValues', () => {
    it('calculates trade values with basic inputs', () => {
      const result = calculateTradeValues(100, 1.2, 0.1, 2, 'USD', 'EUR');
      
      expect(result).toBeDefined();
      expect(result).toHaveProperty('tradeCost');
      expect(result).toHaveProperty('tradeValue');
      expect(result).toHaveProperty('tradeValueReceived');
      expect(result).toHaveProperty('cost');
      expect(result.tradeCost).toBe('100 USD');
      expect(result.tradeValue).toBe('120.00 EUR');
      expect(result.tradeValueReceived).toBe('108.00 EUR');
      expect(result.cost).toBe('12.00 EUR');
    });

    it('calculates trade values with different amounts', () => {
      const result = calculateTradeValues(50, 1.5, 0.2, 2, 'GBP', 'USD');
      
      expect(result.tradeValue).toBe('75.00 USD');
      expect(result.tradeValueReceived).toBe('60.00 USD');
    });

    it('handles decimal amounts correctly', () => {
      const result = calculateTradeValues(25.5, 2.0, 0.1, 2, 'CAD', 'AUD');
      
      expect(result.tradeValue).toBe('51.00 AUD');
      expect(result.tradeValueReceived).toBe('45.90 AUD');
    });

    it('respects custom precision parameter', () => {
      const result = calculateTradeValues(100, 1.2345, 0.1, 4, 'USD', 'EUR');
      
      expect(result.tradeValue).toBe('123.4500 EUR');
      expect(result.tradeValueReceived).toBe('111.1050 EUR');
    });

    it('uses precision when specified', () => {
      const result = calculateTradeValues(100, 1.23456789, 0.1, 2, 'USD', 'EUR');
      
      expect(result.tradeValue).toBe('123.46 EUR');
      expect(result.tradeValueReceived).toBe('111.11 EUR');
    });

    it('handles zero precision', () => {
      const result = calculateTradeValues(100, 1.2345, 0.1, 0, 'USD', 'EUR');
      
      expect(result.tradeValue).toBe('123 EUR');
      expect(result.tradeValueReceived).toBe('111 EUR');
    });

    it('handles high precision values', () => {
      const result = calculateTradeValues(1, 1.123456789, 0.1, 6, 'USD', 'EUR');
      
      expect(result.tradeValue).toBe('1.123457 EUR');
      expect(result.tradeValueReceived).toBe('1.011111 EUR');
    });

    it('returns undefined when amount is falsy (0)', () => {
      const result = calculateTradeValues(0, 1.2, 0.1, 2, 'USD', 'EUR');
      
      expect(result).toBeUndefined();
    });

    it('returns undefined when amount is null', () => {
      const result = calculateTradeValues(null, 1.2, 0.1, 2, 'USD', 'EUR');
      
      expect(result).toBeUndefined();
    });

    it('returns undefined when amount is undefined', () => {
      const result = calculateTradeValues(undefined, 1.2, 0.1, 2, 'USD', 'EUR');
      
      expect(result).toBeUndefined();
    });

    it('returns undefined when amount is empty string', () => {
      const result = calculateTradeValues('', 1.2, 0.1, 2, 'USD', 'EUR');
      
      expect(result).toBeUndefined();
    });

    it('handles negative amounts', () => {
      const result = calculateTradeValues(-100, 1.2, 0.1, 2, 'USD', 'EUR');
      
      expect(result.tradeValue).toBe('-120.00 EUR');
      expect(result.tradeValueReceived).toBe('-108.00 EUR');
    });

    it('returns undefined when exchange rate is zero', () => {
      const result = calculateTradeValues(100, 0, 0.1, 2, 'USD', 'EUR');
      
      expect(result).toBeUndefined();
    });

    it('returns undefined when ofx rate is zero', () => {
      const result = calculateTradeValues(100, 1.2, 0, 2, 'USD', 'EUR');
      
      expect(result).toBeUndefined();
    });

    it('handles negative exchange rate', () => {
      const result = calculateTradeValues(100, -1.2, 0.1, 2, 'USD', 'EUR');
      
      expect(result.tradeValue).toBe('-120.00 EUR');
      expect(result.tradeValueReceived).toBe('-108.00 EUR');
    });

    it('handles negative ofx rate', () => {
      const result = calculateTradeValues(100, 1.2, -0.1, 2, 'USD', 'EUR');
      
      expect(result.tradeValue).toBe('120.00 EUR');
      expect(result.tradeValueReceived).toBe('132.00 EUR');
    });

    it('handles large numbers', () => {
      const result = calculateTradeValues(1000000, 1.5, 0.05, 2, 'USD', 'EUR');
      
      expect(result.tradeValue).toBe('1500000.00 EUR');
      expect(result.tradeValueReceived).toBe('1425000.00 EUR');
    });

    it('handles very small numbers', () => {
      const result = calculateTradeValues(0.01, 1.5, 0.05, 2, 'USD', 'EUR');
      
      expect(result.tradeValue).toBe('0.01 EUR');
      expect(result.tradeValueReceived).toBe('0.01 EUR');
    });

    it('maintains precision with complex calculations', () => {
      const result = calculateTradeValues(33.33, 1.23456, 0.12345, 5, 'USD', 'EUR');
      
      expect(result.tradeValue).toBe('41.14788 EUR');
      expect(result.tradeValueReceived).toBe('36.06818 EUR');
    });

    it('returns string values for all trade properties', () => {
      const result = calculateTradeValues(100, 1.2, 0.1, 2, 'USD', 'EUR');
      
      expect(typeof result.tradeCost).toBe('string');
      expect(typeof result.tradeValue).toBe('string');
      expect(typeof result.tradeValueReceived).toBe('string');
      expect(typeof result.cost).toBe('string');
    });

    it('returns undefined when precision is null', () => {
      const result = calculateTradeValues(100, 1.2, 0.1, null, 'USD', 'EUR');
      
      expect(result).toBeUndefined();
    });

    it('returns undefined when fromCurrency is missing', () => {
      const result = calculateTradeValues(100, 1.2, 0.1, 2, null, 'EUR');
      
      expect(result).toBeUndefined();
    });

    it('returns undefined when toCurrency is missing', () => {
      const result = calculateTradeValues(100, 1.2, 0.1, 2, 'USD', null);
      
      expect(result).toBeUndefined();
    });
  });
});
