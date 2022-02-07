import { FormValue } from './FormValue';

export type AnalyticsData = {
  [key: number]: {
    [FormValue.Always]: number;
    [FormValue.Sometimes]: number;
    [FormValue.Never]: number;
  };
};
