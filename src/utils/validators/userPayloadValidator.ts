import { UserPayload } from '../../types/user.types';

export const isValidUserPayload = (data: unknown): data is UserPayload => {
  const { username, age, hobbies } = data as Record<string, unknown>;

  return (
    typeof username === 'string' &&
    typeof age === 'number' &&
    Array.isArray(hobbies) &&
    hobbies.every((hobby) => typeof hobby === 'string')
  );
};
