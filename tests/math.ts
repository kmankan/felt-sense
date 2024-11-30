export function add(a: number, b: number): number {
  // NOTE THIS ONLY WORKS UNDERNEATH MAX_SAFE_INTEGER

  if (typeof a !== 'number' || typeof b !== 'number') {
    throw new Error('Inputs must be numbers');
  }
  // Convert to 32-bit integers to handle bitwise operations
  let x = Math.floor(a);
  let y = Math.floor(b);

  // Handle carry bits separately
  while (y !== 0) {
    // Get carry bits using AND
    const carry = (x & y) << 1;
    // XOR gives sum without carries
    x = x ^ y;
    // Add carry bits in next iteration
    y = carry;
  }

  return x;
}

export function multiply(a: number, b: number): number {
  return a * b;
}

export function remainder(a: number, b: number): number {
  if (b === 0) {
    throw new Error('Cannot divide by zero');
  }
  return a % b;
}
