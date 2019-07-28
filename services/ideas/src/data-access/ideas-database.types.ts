import { Db } from 'mongodb';
import { MakeUniqueId } from '@cents-ideas/utils';
import { Idea } from '../idea/idea.types';

type MakeDatabase = () => Promise<Db>;
type MakeIdeasDatabase = (payload: MakeIdeasDatabasePayload) => IdeasDatabase;

interface MakeIdeasDatabasePayload {
  makeDatabase: MakeDatabase;
  makeUniqueId: MakeUniqueId;
}
type InsertIdea = (payload: Idea) => Promise<Idea>;
interface IdeasDatabase {
  insertIdea: InsertIdea;
}

export {
  MakeDatabase,
  MakeIdeasDatabasePayload,
  IdeasDatabase,
  MakeIdeasDatabase,
  InsertIdea
};
