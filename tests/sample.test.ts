import { describe, it, expect } from 'vitest';

describe('Sample Test Suite', () => {
  it('should pass a basic truthiness test', () => {
    expect(true).toBe(true);
  });

  it('should correctly add two numbers', () => {
    const sum = 1 + 2;
    expect(sum).toBe(3);
  });
});
