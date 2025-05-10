import { randomUUID } from 'node:crypto';
import { users } from '../db/store';
import { User, UserPayload } from '../types/user.types';

export const createUser = (
  username: string,
  age: number,
  hobbies: string[]
): User => {
  const newUser: User = {
    id: randomUUID(),
    username,
    age,
    hobbies,
  };
  users.push(newUser);

  return newUser;
};

export const getUsers = () => {
  return users;
};

export const getUserById = (id: string): User | undefined => {
  return users.find((user) => user.id === id);
};

export const updateUser = (
  id: string,
  data: Partial<UserPayload>
): User | undefined => {
  const user = users.find((user) => user.id === id);
  if (!user) return undefined;
  Object.assign(user, data);

  return user;
};

export const deleteUser = (id: string): boolean => {
  const userIndex = users.findIndex((user) => user.id === id);
  if (userIndex === -1) return false;

  users.splice(userIndex, 1);

  return true;
};
