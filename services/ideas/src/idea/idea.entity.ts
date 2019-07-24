import { BuildMakeIdea, BuildMakeIdeaPayload, MakeIdea } from './idea.types';

enum IdeaErrors {
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

const buildMakeIdea: BuildMakeIdea = ({
  makeUniqueId,
  isIdValid,
  sanitizeText
}: BuildMakeIdeaPayload): MakeIdea => {
  return ({
    id = makeUniqueId(),
    userId,
    title,
    description,
    createdAt = new Date().toUTCString(),
    updatedAt = new Date().toUTCString()
  }) => {
    if (!id) {
      throw new Error(IdeaErrors.IdRequired);
    }
    if (!isIdValid(id)) {
      throw new Error(IdeaErrors.IdInvalid);
    }

    if (!userId) {
      throw new Error(IdeaErrors.UserIdRequired);
    }
    if (!isIdValid(userId)) {
      throw new Error(IdeaErrors.UserIdInvalid);
    }

    if (!title || title.length < 1) {
      throw new Error(IdeaErrors.TitleRequired);
    }
    if (title.length > 100) {
      throw new Error(IdeaErrors.TitleMaxLength);
    }
    const sanitizedTitle: string = sanitizeText(title).trim();
    if (sanitizedTitle.length < 1) {
      throw new Error(IdeaErrors.TitleSanitizedInvalid);
    }

    if (!description || description.length < 1) {
      throw new Error(IdeaErrors.DescriptionRequired);
    }
    if (description.length > 10000) {
      throw new Error(IdeaErrors.DescriptionMaxLength);
    }
    const sanitizedDescription: string = sanitizeText(description).trim();
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
};

export default buildMakeIdea;
