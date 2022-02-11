import { SocketEvent } from './SocketEvent';
import { FormValue } from './FormValue';
import { AnalyticsData } from './AnalyticsData';

export interface SocketEventData {
  [SocketEvent.SaveResponse]: {
    questionId: number;
    userId: string;
    answer: FormValue;
  };
  [SocketEvent.ReceiveAnalyticsData]: AnalyticsData;
  [SocketEvent.ReceiveIndividualAnalyticsData]: AnalyticsData;
}
