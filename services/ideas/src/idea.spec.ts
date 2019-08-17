import * as faker from 'faker';

import { Idea } from '@cents-ideas/types';
import makeFakeIdea from './test/idea.mock';
import makeIdea, { IdeaErrors } from './idea';

describe('Idea', () => {
  it('must have an id', () => {
    const noId: Idea = makeFakeIdea({ id: undefined });
    const fake: Idea = makeIdea(noId);
    expect(fake.id).toBeDefined();
    expect(typeof fake.id).toBe('string');
  });
  it('must have a valid id', () => {
    const noId: Idea = makeFakeIdea({ id: '💩' });
    expect(() => makeIdea(noId)).toThrow(IdeaErrors.IdInvalid);
  });

  it('must have an user', () => {
    const fake: Idea = makeFakeIdea({ userId: undefined });
    expect(() => makeIdea(fake)).toThrow(IdeaErrors.UserIdRequired);
  });
  it('must have a valid user id', () => {
    const fake: Idea = makeFakeIdea({ userId: '💩' });
    expect(() => makeIdea(fake)).toThrow(IdeaErrors.UserIdInvalid);
  });

  it('must have a title', () => {
    const fake: Idea = makeFakeIdea({ title: undefined });
    expect(() => makeIdea(fake)).toThrow(IdeaErrors.TitleRequired);
  });
  it('must have a title shorter than 100 characters', () => {
    const fake: Idea = makeFakeIdea({ title: faker.lorem.paragraphs(3) });
    expect(() => makeIdea(fake)).toThrow(IdeaErrors.TitleMaxLength);
  });
  it('sanitizes its title', () => {
    const saneText: string = 'This is a totally fine title 👌👍';
    const insaneText: string = `<script>insane title 👹</script>`;
    const okayText: string = 'This title is okay 😜';
    const totallyInsaneText: string = '<script>totally insane title 👹</script>';
    const sane = makeIdea(makeFakeIdea({ title: saneText }));
    const insane = makeIdea(makeFakeIdea({ title: insaneText + okayText }));
    const totallyInsane = makeFakeIdea({ title: totallyInsaneText });
    expect(sane.title).toBe(saneText);
    expect(insane.title).toBe(okayText);
    expect(() => makeIdea(totallyInsane)).toThrow(IdeaErrors.TitleSanitizedInvalid);
  });

  it('must have a description', () => {
    const fake: Idea = makeFakeIdea({ description: undefined });
    expect(() => makeIdea(fake)).toThrow(IdeaErrors.DescriptionRequired);
  });
  it('must have a description shorter than 100 characters', () => {
    const fake: Idea = makeFakeIdea({
      description: faker.lorem.paragraphs(300)
    });
    expect(() => makeIdea(fake)).toThrow(IdeaErrors.DescriptionMaxLength);
  });
  it('sanitizes its description', () => {
    const saneText: string = 'This is a totally fine description 👌👍';
    const insaneText: string = `<script>insane description 👹</script>`;
    const okayText: string = 'This description is okay 😜';
    const totallyInsaneText: string = '<script>totally insane description 👹</script>';
    const sane = makeIdea(makeFakeIdea({ description: saneText }));
    const insane = makeIdea(makeFakeIdea({ description: insaneText + okayText }));
    const totallyInsane = makeFakeIdea({ description: totallyInsaneText });
    expect(sane.description).toBe(saneText);
    expect(insane.description).toBe(okayText);
    expect(() => makeIdea(totallyInsane)).toThrow(IdeaErrors.DescriptionSanitizedInvalid);
  });

  it('has a created at date in UTC', () => {
    const noCreatedAt: Idea = makeFakeIdea({ createdAt: undefined });
    expect(noCreatedAt.createdAt).not.toBeDefined();
    const createdAt: string = makeIdea(noCreatedAt).createdAt;
    expect(createdAt).toBeDefined();
    expect(new Date(createdAt).toUTCString().substring(26)).toBe('GMT');
  });

  it('has a updated at date in UTC', () => {
    const noUpdatedAt: Idea = makeFakeIdea({ updatedAt: undefined });
    expect(noUpdatedAt.updatedAt).not.toBeDefined();
    const updatedAt: string = makeIdea(noUpdatedAt).updatedAt;
    expect(updatedAt).toBeDefined();
    expect(new Date(updatedAt).toUTCString().substring(26)).toBe('GMT');
  });
});
