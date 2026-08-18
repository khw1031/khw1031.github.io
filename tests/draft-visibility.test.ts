import { describe, expect, it } from 'vitest';
import { isVisibleInListing } from '../src/lib/listing';

describe('draft listing visibility', () => {
  it('includes published and draft entries in development', () => {
    expect(isVisibleInListing(false, true)).toBe(true);
    expect(isVisibleInListing(true, true)).toBe(true);
  });

  it('excludes draft entries in production', () => {
    expect(isVisibleInListing(false, false)).toBe(true);
    expect(isVisibleInListing(true, false)).toBe(false);
  });
});
