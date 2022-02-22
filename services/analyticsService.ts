import groupBy from 'lodash.groupby';
import sortBy from 'lodash.sortby';

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
    return inputData.reduce<OutputData>((result, item) => {
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
  }

  prepareIndividual(inputData: IInputData[], userId: string) {
    const userData = inputData.filter((data) => data.userId === userId);

    if (!userData.length) {
      return null;
    }

    return this.prepare(userData);
  }

  prepareTopUsers(inputData: IInputData[]) {
    const filteredItems = inputData.filter(
      (item) => item.answer === FormValue.Always,
    );
    const groups = groupBy(filteredItems, (item) => item.userId);
    const sortedGroups = sortBy(groups, (group) => -group.length).slice(0, 3);
    const userIds = sortedGroups.map((group) => group[0]?.userId);

    return {
      userIds,
      data: userIds.map((userId) => this.prepareIndividual(inputData, userId)!),
    };
  }

  findUserPlace(userIds: string[], currentUserId: string) {
    const rawUserPlace = userIds.findIndex((id) => id === currentUserId);

    return rawUserPlace > -1 ? rawUserPlace + 1 : null;
  }
}

export default new AnalyticsService();
