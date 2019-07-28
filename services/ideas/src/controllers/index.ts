import makeCreateIdea from './create-idea';
import { addIdea } from '../use-cases';

const createIdea = makeCreateIdea({ addIdea });

export { createIdea };
