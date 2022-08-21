import { Action } from '@/models/Store';

export enum ActionType {
  SetInitialUsername,
  SetUsername,
  SetIsDefaultUsername,
}

type SetInitialUsernameAction = Action<ActionType.SetInitialUsername, string>;
type SetUsernameAction = Action<ActionType.SetUsername, string>;
type SetIsDefaultUsernameAction = Action<
  ActionType.SetIsDefaultUsername,
  boolean
>;

export function setInitialUsername(value: string): SetInitialUsernameAction {
  return {
    type: ActionType.SetInitialUsername,
    payload: value,
  };
}

export function setUsername(value: string): SetUsernameAction {
  return {
    type: ActionType.SetUsername,
    payload: value,
  };
}

export function setIsDefaultUsername(
  value: boolean,
): SetIsDefaultUsernameAction {
  return {
    type: ActionType.SetIsDefaultUsername,
    payload: value,
  };
}

export type AvailableActions =
  | SetInitialUsernameAction
  | SetUsernameAction
  | SetIsDefaultUsernameAction;
