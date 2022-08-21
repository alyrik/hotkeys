import {
  ActionType,
  AvailableActions,
} from '@/components/Analytics/store/actions';

export const initialState = {
  initialUsername: '',
  usernameInputValue: '',
  isDefaultUsername: false,
};

export function reducer(
  state: typeof initialState,
  action: AvailableActions,
): typeof initialState {
  switch (action.type) {
    case ActionType.SetUsername:
      return { ...state, usernameInputValue: action.payload };
    case ActionType.SetInitialUsername:
      return { ...state, initialUsername: action.payload };
    case ActionType.SetIsDefaultUsername:
      return { ...state, isDefaultUsername: action.payload };
  }

  return state;
}
