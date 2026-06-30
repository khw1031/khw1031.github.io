const periodDatePattern = /(\d{4})\.(\d{2})\.(\d{2})/g;

function toLocalDate(year: string, month: string, day: string): Date | undefined {
  const y = Number(year);
  const m = Number(month);
  const d = Number(day);
  const date = new Date(y, m - 1, d);

  if (date.getFullYear() !== y || date.getMonth() !== m - 1 || date.getDate() !== d) {
    return undefined;
  }

  return date;
}

function toLocalDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function calculateCompletedMonths(start: Date, end: Date): number {
  const normalizedStart = toLocalDay(start);
  const normalizedEnd = toLocalDay(end);

  if (normalizedEnd < normalizedStart) {
    return 0;
  }

  let months =
    (normalizedEnd.getFullYear() - normalizedStart.getFullYear()) * 12 +
    (normalizedEnd.getMonth() - normalizedStart.getMonth());

  if (normalizedEnd.getDate() < normalizedStart.getDate()) {
    months -= 1;
  }

  return Math.max(months, 0);
}

export function formatCareerDuration(totalMonths: number): string {
  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;
  return `${years}yr ${months}mo`;
}

export function getCareerDurationLabel(period: string, today = new Date()): string | undefined {
  const matches = [...period.matchAll(periodDatePattern)];
  const startMatch = matches[0];

  if (!startMatch) {
    return undefined;
  }

  const start = toLocalDate(startMatch[1], startMatch[2], startMatch[3]);
  if (!start) {
    return undefined;
  }

  const endMatch = matches[1];
  const end = period.includes('재직중')
    ? today
    : endMatch
      ? toLocalDate(endMatch[1], endMatch[2], endMatch[3])
      : undefined;

  if (!end) {
    return undefined;
  }

  return formatCareerDuration(calculateCompletedMonths(start, end));
}

export function updateCareerDurationElements(root: ParentNode = document): void {
  const today = new Date();
  const elements = root.querySelectorAll<HTMLElement>('[data-career-duration]');

  for (const element of elements) {
    const period = element.dataset.careerPeriod;
    const duration = period ? getCareerDurationLabel(period, today) : undefined;

    if (!duration) {
      element.hidden = true;
      continue;
    }

    element.hidden = false;
    element.textContent = duration;
    element.setAttribute('aria-label', `경력 기간 ${duration}`);
  }
}
