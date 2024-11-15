import { describe, it, expect, vi } from 'vitest';
import { getIterator, getEmailAddresses, getNames } from './index';
import kaanon from './kaanon.json';

// Mock the kaanon.json data
vi.mock('./kaanon.json', () => ({
  default: {
    'item1': ['category1', 'category2'],
    'item2': ['category1'],
    'item3': ['category2'],
    'item4': ['category3'],
    'Matti Meikäläinen': ['nimi'],
    'Åke Örn': ['nimi'],
  }
}));

describe('Kaanon Iterator', () => {
  describe('getIterator', () => {
    it('should return an iterator with next and take methods', () => {
      const iterator = getIterator();
      expect(iterator.next).toBeDefined();
      expect(iterator.take).toBeDefined();
    });

    it('should iterate through all items when no categories are specified', () => {
      const iterator = getIterator();
      const results = new Set();
      
      let value;
      while ((value = iterator.next()) !== "") {
        results.add(value);
      }

      expect(results.size).toBe(6);
      expect(results).toContain('item1');
      expect(results).toContain('item2');
      expect(results).toContain('item3');
      expect(results).toContain('item4');
    });

    it('should only return items from specified category', () => {
      const iterator = getIterator(['category1']);
      const results = new Set();
      
      let value;
      while ((value = iterator.next()) !== "") {
        results.add(value);
      }

      expect(results.size).toBe(2);
      expect(results).toContain('item1');
      expect(results).toContain('item2');
    });

    it('should return default value when exhausted', () => {
      const iterator = getIterator();
      // Exhaust the iterator
      while (iterator.next() !== "") {}
      
      expect(iterator.next()).toBe("");
    });

    it('should take specified number of items', () => {
      const iterator = getIterator();
      const items = iterator.take(2);
      expect(items).toHaveLength(2);
    });

    it('should take all available items if count exceeds available items', () => {
      const iterator = getIterator();
      const items = iterator.take(10);
      expect(items).toHaveLength(6); // Total number of items in mock data
    });

    it('should report done status correctly via isDone', () => {
      const iterator = getIterator();
      expect(iterator.isDone()).toBe(false);
      
      // Exhaust the iterator
      while (iterator.next() !== "") {}
      
      expect(iterator.isDone()).toBe(true);
    });

    it('should call mapper with undefined when exhausted', () => {
      const mockMapper = vi.fn(x => x === undefined ? "default" : x);
      const iterator = getIterator([], mockMapper);
      
      // Exhaust the iterator
      while (iterator.next() !== "default") {}
      
      // Verify the mapper was called with undefined
      expect(mockMapper).toHaveBeenCalledWith(undefined);
      expect(iterator.next()).toBe("default");
    });
  });
});

describe('getEmailAddresses', () => {
  it('should create valid email addresses from names', () => {
    const iterator = getEmailAddresses();
    const emails = iterator.take(Infinity);
    expect(emails).toHaveLength(2);
    emails.forEach(email => {
      expect(email).toMatch(/^[a-z.]+@example\.com$/);
    });
  });

  it('should handle scandinavian characters correctly', () => {
    const iterator = getEmailAddresses();
    const emails = iterator.take(Infinity);
    expect(emails).toContain('matti.meikalainen@example.com');
    expect(emails).toContain('ake.orn@example.com');
  });

  it('should return emails one by one via next()', () => {
    const iterator = getEmailAddresses();
    const firstEmail = iterator.next();
    expect(firstEmail).toMatch(/^[a-z.]+@example\.com$/);
  });

  it('should use custom server domain when provided', () => {
    const iterator = getEmailAddresses('custom.org');
    const emails = iterator.take(Infinity);
    expect(emails).toHaveLength(2);
    emails.forEach(email => {
      expect(email).toMatch(/^[a-z.]+@custom\.org$/);
    });
  });

  it('should return anonymous email when iterator is exhausted', () => {
    const iterator = getEmailAddresses('example.com');
    // Exhaust the iterator first
    const allEmails = iterator.take(Infinity);
    expect(iterator.isDone()).toBe(true);
    expect(iterator.next()).toBe('anonymous@example.com');
  });
});

describe('getNames', () => {
    it('should return properly formatted names', () => {
        const iterator = getNames();
        const names = iterator.take(Infinity);
        expect(names).toHaveLength(2);
        expect(names).toContain('Matti Meikäläinen');
        expect(names).toContain('Åke Örn');
    });

    it('should return names one by one via next()', () => {
        const iterator = getNames();
        const firstName = iterator.next();
        expect(firstName).toMatch(/^[A-ZÅÄÖ][a-zåäö]+ [A-ZÅÄÖ][a-zåäö]+$/);
    });

    it('should properly capitalize mixed case input', () => {
        // Add a mixed case name to the mock
        vi.mocked(kaanon)['mIkKo tEIkäLäINEN'] = ['nimi'];
        const iterator = getNames();
        const names = iterator.take(Infinity);
        expect(names).toContain('Mikko Teikäläinen');
    });

    it('should return anonymous name when iterator is exhausted', () => {
        const iterator = getNames();
        // Exhaust the iterator first
        const allNames = iterator.take(Infinity);
        expect(iterator.isDone()).toBe(true);
        expect(iterator.next()).toBe('Anonymous User');
    });
}); 