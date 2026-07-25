// Instagram usernames: letters, numbers, periods, and underscores only.
export const USERNAME_PATTERN = /^[a-z0-9._]+$/;
export const USERNAME_MIN_LENGTH = 3;
export const USERNAME_MAX_LENGTH = 30;

export function sanitizeUsername(value: string): string {
  return value.replace(/@/g, "").toLowerCase();
}

export function isUsernamePatternValid(username: string): boolean {
  return (
    USERNAME_PATTERN.test(username) &&
    username.length >= USERNAME_MIN_LENGTH &&
    username.length <= USERNAME_MAX_LENGTH
  );
}
