import ideasDatabase from '../data-access';
import makeAddIdea from './add-idea';

const addIdea = makeAddIdea({ ideasDatabase });

export { addIdea };
