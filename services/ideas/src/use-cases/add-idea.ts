import { MakeAddIdea, AddIdea } from './add-idea.types';
import { Idea } from '../idea/idea.types';
import makeIdea from '../idea';

const makeAddIdea: MakeAddIdea = ({ ideasDatabase }) => {
  const addIdea: AddIdea = payload => {
    const idea: Idea = makeIdea(payload);
    return ideasDatabase.insertIdea(idea);
  };
  return addIdea;
};

export default makeAddIdea;
