export const getPercent = (count: number, total: number) =>
  Math.round((count / total) * 100);

export const formatPercent = (value: number) => `${value}%`;

export const getPercentFormatted = (count: number, total: number) =>
  formatPercent(getPercent(count, total));
