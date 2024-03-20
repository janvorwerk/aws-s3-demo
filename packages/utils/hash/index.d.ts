/**
 * Computes the base64 sha256 of a buffer.
 */
export async function computeHashValue(buffer: ArrayBuffer): Promise<string>;

/**
 * This is a simple, *insecure* hash that's short, fast, and has no
 * dependencies.
 * 
 * Use for algorithmic use, where security isn't needed!
 */
export function insecureHashCode(str: string): number;
