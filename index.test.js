import { describe, it, expect, vi } from 'vitest';
import { getIterator, getRandom, getEmailAddresses, getNames } from './index';
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
    it('should return an iterator', () => {
      const iterator = getIterator();
      expect(iterator.next).toBeDefined();
    });

    it('should iterate through all items when no categories are specified', () => {
      const iterator = getIterator();
      const results = new Set();
      
      for (let i = 0; i < Object.keys(kaanon).length; i++) {
        const { value, done } = iterator.next();
        if (!done) {
          results.add(value);
        }
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
      
      while (true) {
        const { value, done } = iterator.next();
        if (done) break;
        results.add(value);
      }

      expect(results.size).toBe(2);
      expect(results).toContain('item1');
      expect(results).toContain('item2');
    });

    it('should return done=true when exhausted', () => {
      const iterator = getIterator();
      // Exhaust the iterator
      for (let i = 0; i < Object.keys(kaanon).length; i++) {
        iterator.next();
      }
      expect(iterator.next().done).toBe(true);
    });
  });

  describe('getRandom', () => {
    it('should return the requested number of items', () => {
      const items = getRandom(2);
      expect(items).toHaveLength(2);
    });

    it('should return all available items if count exceeds available items', () => {
      const items = getRandom(10);
      expect(items).toHaveLength(6); // Total number of items in mock data
    });

    it('should return items from specified category only', () => {
      const items = getRandom(10, ['category1']);
      expect(items).toHaveLength(2);
      items.forEach(item => {
        expect(['item1', 'item2']).toContain(item);
      });
    });

    it('should return empty array when no items match category', () => {
      const items = getRandom(10, ['nonexistent']);
      expect(items).toHaveLength(0);
    });

    it('should return unique items', () => {
      const items = getRandom(4);
      const uniqueItems = new Set(items);
      expect(uniqueItems.size).toBe(items.length);
    });
  });
});

describe('getEmailAddresses', () => {
  it('should create valid email addresses from names', () => {
    const emails = getEmailAddresses();
    expect(emails).toHaveLength(2);
    emails.forEach(email => {
      expect(email).toMatch(/^[a-z.]+@example\.com$/);
    });
  });

  it('should handle scandinavian characters correctly', () => {
    const emails = getEmailAddresses();
    expect(emails).toContain('matti.meikalainen@example.com');
    expect(emails).toContain('ake.orn@example.com');
  });

  it('should respect the count parameter', () => {
    const emails = getEmailAddresses(1);
    expect(emails).toHaveLength(1);
  });

  it('should use custom server domain when provided', () => {
    const emails = getEmailAddresses(Infinity, 'custom.org');
    expect(emails).toHaveLength(2);
    emails.forEach(email => {
      expect(email).toMatch(/^[a-z.]+@custom\.org$/);
    });
  });
});

describe('getNames', () => {
    it('should return properly formatted names', () => {
        const names = getNames();
        expect(names).toHaveLength(2);
        expect(names).toContain('Matti Meikäläinen');
        expect(names).toContain('Åke Örn');
    });

    it('should respect the count parameter', () => {
        const names = getNames(1);
        expect(names).toHaveLength(1);
    });

    it('should properly capitalize mixed case input', () => {
        // Add a mixed case name to the mock
        vi.mocked(kaanon)['mIkKo tEIkäLäINEN'] = ['nimi'];
        const names = getNames();
        expect(names).toContain('Mikko Teikäläinen');
    });
}); 