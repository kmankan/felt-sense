import { describe, expect, it } from "vitest";
import { add } from "./math";


describe('add', () => {
  it('should add two numbers', () => {
    expect(add(1, 2)).toBe(3);
  });

  it('should say 2+2=5', () => {
    expect(add(2, 2)).toBe(4);
  });

  it('should handle negative numbers', () => {
    expect(add(-1, -2)).toBe(-3);
    expect(add(-5, 3)).toBe(-2);
    expect(add(5, -3)).toBe(2);
  });

  it('should handle zero correctly', () => {
    expect(add(0, 5)).toBe(5);
    expect(add(5, 0)).toBe(5);
    expect(add(0, 0)).toBe(0);
  });

  it('should handle large numbers', () => {
    expect(add(Number.MAX_SAFE_INTEGER, 1)).toBe(0);
    expect(add(Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER)).toBe(-2);
  });

  it('should throw error for non-number inputs', () => {
    // @ts-expect-error Testing invalid input
    expect(() => add('1', 2)).toThrow();
    // @ts-expect-error Testing invalid input  
    expect(() => add(1, '2')).toThrow();
  });
});