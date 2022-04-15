export enum CookieKey {
  UserId = 'hotkey-user-id',
  ScreenNumber = 'hotkey-screen-number',
}

export const cookieTtl = {
  [CookieKey.UserId]: 60 * 60 * 24 * 30 * 12 * 5,
  [CookieKey.ScreenNumber]: 60 * 60 * 24 * 5,
};
