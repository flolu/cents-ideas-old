import { makeUniqueId, isIdValid, sanitizeText } from '@cents-ideas/utils';
import buildMakeIdea from './idea.entity';
import { MakeIdea } from './idea.types';

const makeIdea: MakeIdea = buildMakeIdea({
  sanitizeText,
  makeUniqueId,
  isIdValid
});

export default makeIdea;
