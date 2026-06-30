import { describe, expect, it } from 'vitest';
import {
  calculateCompletedMonths,
  formatCareerDuration,
  getCareerDurationLabel,
  updateCareerDurationElements,
} from '../src/lib/career-duration';

describe('career duration', () => {
  it('calculates completed months between two dates', () => {
    expect(calculateCompletedMonths(new Date(2021, 11, 20), new Date(2022, 11, 31))).toBe(12);
    expect(calculateCompletedMonths(new Date(2017, 6, 3), new Date(2018, 3, 7))).toBe(9);
  });

  it('formats total months as yr/mo text', () => {
    expect(formatCareerDuration(40)).toBe('3yr 4mo');
    expect(formatCareerDuration(12)).toBe('1yr 0mo');
    expect(formatCareerDuration(9)).toBe('0yr 9mo');
  });

  it('uses the supplied browser date for ongoing career periods', () => {
    const today = new Date(2026, 5, 30);

    expect(getCareerDurationLabel('2023.02.01 — 재직중', today)).toBe('3yr 4mo');
  });

  it('uses the public end date for finished career periods', () => {
    expect(getCareerDurationLabel('2021.12.20 — 2022.12.31')).toBe('1yr 0mo');
  });

  it('returns undefined for periods without full dates', () => {
    expect(getCareerDurationLabel('2017 (수료)')).toBeUndefined();
  });

  it('updates duration elements from their period data attribute', () => {
    document.body.innerHTML =
      '<span data-career-duration data-career-period="2021.12.20 — 2022.12.31"></span>';

    updateCareerDurationElements(document);

    const duration = document.querySelector('[data-career-duration]');
    expect(duration?.textContent).toBe('1yr 0mo');
    expect(duration?.getAttribute('aria-label')).toBe('경력 기간 1yr 0mo');
  });
});
