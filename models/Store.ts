export type Action<TType, TPayload> = {
  type: TType;
  payload: TPayload;
};
