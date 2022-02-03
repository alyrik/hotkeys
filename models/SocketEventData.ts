import { SocketEvent } from './SocketEvent';
import { FormValue } from './FormValue';

export interface SocketEventData {
  [SocketEvent.SaveAnswer]: {
    questionId: number;
    userId: string;
    answer: FormValue;
  };
}
