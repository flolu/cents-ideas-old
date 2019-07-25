import { MakeUniqueId, IsValidId, SanitizeText } from '@cents-ideas/utils';

interface Idea {
  id: string;
  userId: string;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

interface BuildMakeIdeaPayload {
  makeUniqueId: MakeUniqueId;
  isIdValid: IsValidId;
  sanitizeText: SanitizeText;
}

type MakeIdea = (payload: Partial<Idea>) => Readonly<Idea>;
type BuildMakeIdea = (dependencies: BuildMakeIdeaPayload) => MakeIdea;

export {
  Idea,
  BuildMakeIdeaPayload,
  MakeIdea,
  BuildMakeIdea,
  IsValidId,
  MakeUniqueId,
  SanitizeText as Sanitize
};
