import { Identifier, Sanitizer } from '@cents-ideas/utils';
import { Idea } from '@cents-ideas/types';

const identifier = new Identifier();
const sanitizer = new Sanitizer();

export enum IdeaErrors {
  IdRequired = 'Idea must have an id',
  IdInvalid = 'Idea must have a valid id',
  UserIdRequired = 'Idea must have a user',
  UserIdInvalid = 'Idea must have a valid user id',
  TitleRequired = 'Idea must have a title',
  TitleMaxLength = 'The title of an idea should not be longer than 100 characters',
  TitleSanitizedInvalid = 'Idea title contains no usable text',
  DescriptionRequired = 'Idea must have a description',
  DescriptionMaxLength = 'The description of an idea should not be longer than 10,000 characters',
  DescriptionSanitizedInvalid = 'Idea description contains no usable text'
}

export default ({
  id = identifier.makeUniqueId(),
  userId,
  title,
  description,
  createdAt = new Date().toUTCString(),
  updatedAt = new Date().toUTCString()
}: Partial<Idea>) => {
  if (!id) {
    throw new Error(IdeaErrors.IdRequired);
  }
  if (!identifier.isValidId(id)) {
    throw new Error(IdeaErrors.IdInvalid);
  }

  if (!userId) {
    throw new Error(IdeaErrors.UserIdRequired);
  }
  if (!identifier.isValidId(userId)) {
    throw new Error(IdeaErrors.UserIdInvalid);
  }

  if (!title || title.length < 1) {
    throw new Error(IdeaErrors.TitleRequired);
  }
  if (title.length > 100) {
    throw new Error(IdeaErrors.TitleMaxLength);
  }
  const sanitizedTitle: string = sanitizer.sanitizeText(title).trim();
  if (sanitizedTitle.length < 1) {
    throw new Error(IdeaErrors.TitleSanitizedInvalid);
  }

  if (!description || description.length < 1) {
    throw new Error(IdeaErrors.DescriptionRequired);
  }
  if (description.length > 10000) {
    throw new Error(IdeaErrors.DescriptionMaxLength);
  }
  const sanitizedDescription: string = sanitizer.sanitizeText(description).trim();
  if (sanitizedDescription.length < 1) {
    throw new Error(IdeaErrors.DescriptionSanitizedInvalid);
  }

  return Object.freeze({
    id,
    userId,
    title: sanitizedTitle,
    description: sanitizedDescription,
    createdAt,
    updatedAt
  });
};
