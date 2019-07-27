import { IdeasDatabase } from '../data-access/ideas-database.types';
import { Idea } from '../idea/idea.types';

interface MakeAddIdeaPayload {
  ideasDatabase: IdeasDatabase;
}

type AddIdea = (payload: Partial<Idea>) => Promise<Idea>;
type MakeAddIdea = (payload: MakeAddIdeaPayload) => AddIdea;

export { MakeAddIdea, AddIdea };
