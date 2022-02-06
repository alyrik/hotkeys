import { FormValue } from '../models/FormValue';

export interface IInputData {
  questionId: number;
  userId: string;
  answer: FormValue;
}

type OutputData = {
  [key: number]: {
    [FormValue.Always]: number;
    [FormValue.Sometimes]: number;
    [FormValue.Never]: number;
  };
};

class AnalyticsService {
  prepare(inputData: IInputData[]) {
    const groupedAnswers = inputData.reduce<OutputData>((result, item) => {
      if (!result[item.questionId]) {
        result[item.questionId] = {
          [FormValue.Always]: 0,
          [FormValue.Sometimes]: 0,
          [FormValue.Never]: 0,
        };
      }

      result[item.questionId][item.answer] += 1;

      return result;
    }, {});

    console.log(groupedAnswers);
    return groupedAnswers;
  }
}

export default new AnalyticsService();
