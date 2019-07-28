import { Idea } from '../idea/idea.types';
import { MakeCreateIdea, CreateIdea } from './create-idea.types';
import { HttpStatusCodes } from '@cents-ideas/utils';

const makeCreateIdea: MakeCreateIdea = ({ addIdea }) => {
  const createIdea: CreateIdea = async httpRequest => {
    try {
      const payload = httpRequest.body;
      const created: Idea = await addIdea(payload);
      return {
        statusCode: HttpStatusCodes.CREATED,
        body: { created }
      };
    } catch (error) {
      return {
        // TODO or bad request
        statusCode: HttpStatusCodes.INTERNAL_SERVER_ERROR,
        body: {},
        error: error.message
      };
    }
  };
  return createIdea;
};

export default makeCreateIdea;
