import { Idea } from '../idea/idea.types';
import { MakeCreateIdea, CreateIdea } from './create-idea.types';

const makeCreateIdea: MakeCreateIdea = ({ addIdea }) => {
  const createIdea: CreateIdea = async httpRequest => {
    try {
      const payload = httpRequest.body;
      const created: Idea = await addIdea(payload);
      return {
        statusCode: 201,
        body: { created }
      };
    } catch (error) {
      return {
        statusCode: 400,
        body: {},
        error: error.message
      };
    }
  };
  return createIdea;
};

export default makeCreateIdea;
