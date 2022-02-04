import { SocketEvent } from './SocketEvent';
import { FormValue } from './FormValue';

export interface SocketEventData {
  [SocketEvent.SaveResponse]: {
    questionId: number;
    userId: string;
    answer: FormValue;
  };
}
