import * as shortid from 'shortid';
import { MakeUniqueId, IsValidId } from './identifier.types';

const makeUniqueId: MakeUniqueId = (): string => {
  return shortid();
};

const isIdValid: IsValidId = (id: string): boolean => {
  return shortid.isValid(id);
};

export { makeUniqueId, isIdValid };
