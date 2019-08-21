import * as shortid from 'shortid';

export class Identifier {
  public makeUniqueId = (): string => {
    return shortid();
  };

  public isValidId = (id: string): boolean => {
    return shortid.isValid(id);
  };
}
