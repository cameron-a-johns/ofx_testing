import { describe, it, expect } from 'vitest';
import { calculateTradeValues } from '../../src/Services/Math';

describe('Math Service', () => {
  describe('calculateTradeValues', () => {
    it('calculates trade values with basic inputs', () => {
      const result = calculateTradeValues(100, 1.2, 0.1);
      
      expect(result).toBeDefined();
      expect(result).toHaveProperty('actual');
      expect(result).toHaveProperty('marked');
      expect(result.actual).toBe('120.00');
      expect(result.marked).toBe('108.00');
    });

    it('calculates trade values with different amounts', () => {
      const result = calculateTradeValues(50, 1.5, 0.2);
      
      expect(result.actual).toBe('75.00');
      expect(result.marked).toBe('60.00');
    });

    it('handles decimal amounts correctly', () => {
      const result = calculateTradeValues(25.5, 2.0, 0.1);
      
      expect(result.actual).toBe('51.00');
      expect(result.marked).toBe('45.90');
    });

    it('respects custom precision parameter', () => {
      const result = calculateTradeValues(100, 1.2345, 0.1, 4);
      
      expect(result.actual).toBe('123.4500');
      expect(result.marked).toBe('111.1050');
    });

    it('uses default precision of 2 when not specified', () => {
      const result = calculateTradeValues(100, 1.23456789, 0.1);
      
      expect(result.actual).toBe('123.46');
      expect(result.marked).toBe('111.11');
    });

    it('handles zero precision', () => {
      const result = calculateTradeValues(100, 1.2345, 0.1, 0);
      
      expect(result.actual).toBe('123');
      expect(result.marked).toBe('111');
    });

    it('handles high precision values', () => {
      const result = calculateTradeValues(1, 1.123456789, 0.1, 6);
      
      expect(result.actual).toBe('1.123457');
      expect(result.marked).toBe('1.011111');
    });

    it('returns undefined when amount is falsy (0)', () => {
      const result = calculateTradeValues(0, 1.2, 0.1);
      
      expect(result).toBeUndefined();
    });

    it('returns undefined when amount is null', () => {
      const result = calculateTradeValues(null, 1.2, 0.1);
      
      expect(result).toBeUndefined();
    });

    it('returns undefined when amount is undefined', () => {
      const result = calculateTradeValues(undefined, 1.2, 0.1);
      
      expect(result).toBeUndefined();
    });

    it('returns undefined when amount is empty string', () => {
      const result = calculateTradeValues('', 1.2, 0.1);
      
      expect(result).toBeUndefined();
    });

    it('handles negative amounts', () => {
      const result = calculateTradeValues(-100, 1.2, 0.1);
      
      expect(result.actual).toBe('-120.00');
      expect(result.marked).toBe('-108.00');
    });

    it('handles zero exchange rate', () => {
      const result = calculateTradeValues(100, 0, 0.1);
      
      expect(result.actual).toBe('0.00');
      expect(result.marked).toBe('0.00');
    });

    it('handles zero ofx rate', () => {
      const result = calculateTradeValues(100, 1.2, 0);
      
      expect(result.actual).toBe('120.00');
      expect(result.marked).toBe('120.00');
    });

    it('handles negative exchange rate', () => {
      const result = calculateTradeValues(100, -1.2, 0.1);
      
      expect(result.actual).toBe('-120.00');
      expect(result.marked).toBe('-108.00');
    });

    it('handles negative ofx rate', () => {
      const result = calculateTradeValues(100, 1.2, -0.1);
      
      expect(result.actual).toBe('120.00');
      expect(result.marked).toBe('132.00');
    });

    it('handles large numbers', () => {
      const result = calculateTradeValues(1000000, 1.5, 0.05);
      
      expect(result.actual).toBe('1500000.00');
      expect(result.marked).toBe('1425000.00');
    });

    it('handles very small numbers', () => {
      const result = calculateTradeValues(0.01, 1.5, 0.05);
      
      expect(result.actual).toBe('0.01');
      expect(result.marked).toBe('0.01');
    });

    it('maintains precision with complex calculations', () => {
      const result = calculateTradeValues(33.33, 1.23456, 0.12345, 5);
      
      expect(result.actual).toBe('41.14788');
      expect(result.marked).toBe('36.06818');
    });

    it('returns string values for actual and marked properties', () => {
      const result = calculateTradeValues(100, 1.2, 0.1);
      
      expect(typeof result.actual).toBe('string');
      expect(typeof result.marked).toBe('string');
    });
  });
});
