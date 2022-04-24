import { AnalyticsData } from '@/models/AnalyticsData';
import { FormValue } from '@/models/FormValue';

export interface ITotalValues {
  [FormValue.Always]: number;
  [FormValue.Sometimes]: number;
  [FormValue.Never]: number;
}

const generateTotalValuesTemplate = () => ({
  [FormValue.Always]: 0,
  [FormValue.Sometimes]: 0,
  [FormValue.Never]: 0,
});
export const prepareTotalValues = (data: AnalyticsData | null) => {
  if (!data) return generateTotalValuesTemplate();

  return Object.entries(data).reduce(
    (result, [_, value]) => {
      result[FormValue.Always] += value[FormValue.Always] ?? 0;
      result[FormValue.Sometimes] += value[FormValue.Sometimes] ?? 0;
      result[FormValue.Never] += value[FormValue.Never] ?? 0;

      return result;
    },
    {
      [FormValue.Always]: 0,
      [FormValue.Sometimes]: 0,
      [FormValue.Never]: 0,
    },
  );
};
export const prepareTotalSum = (values: ITotalValues) =>
  values[FormValue.Always] +
  values[FormValue.Sometimes] +
  values[FormValue.Never];
