import { describe, expect, it } from 'vitest';
import { determineInitialTheme, isTheme, THEME_STORAGE_KEY } from '../src/lib/theme';

describe('isTheme', () => {
  it('accepts "light" and "dark"', () => {
    expect(isTheme('light')).toBe(true);
    expect(isTheme('dark')).toBe(true);
  });

  it('rejects anything else', () => {
    expect(isTheme(null)).toBe(false);
    expect(isTheme(undefined)).toBe(false);
    expect(isTheme('')).toBe(false);
    expect(isTheme('auto')).toBe(false);
    expect(isTheme(0)).toBe(false);
  });
});

describe('determineInitialTheme', () => {
  it('honors a stored "dark" value', () => {
    expect(determineInitialTheme('dark', false)).toBe('dark');
  });

  it('honors a stored "light" value even when the system prefers dark', () => {
    expect(determineInitialTheme('light', true)).toBe('light');
  });

  it('falls back to system preference when nothing is stored', () => {
    expect(determineInitialTheme(null, true)).toBe('dark');
    expect(determineInitialTheme(null, false)).toBe('light');
  });

  it('ignores an invalid stored value and uses system preference', () => {
    expect(determineInitialTheme('garbage', true)).toBe('dark');
    expect(determineInitialTheme('garbage', false)).toBe('light');
  });
});

describe('THEME_STORAGE_KEY', () => {
  it('is the literal string "theme"', () => {
    expect(THEME_STORAGE_KEY).toBe('theme');
  });
});
