import { AddIdea } from '../use-cases/add-idea.types';
import { HttpRequest, HttpResponse } from '@cents-ideas/utils';

interface MakeCreateIdeaPayload {
  addIdea: AddIdea;
}

type CreateIdea = (payload: HttpRequest) => Promise<HttpResponse>;
type MakeCreateIdea = (payload: MakeCreateIdeaPayload) => CreateIdea;

export { MakeCreateIdea, CreateIdea };
