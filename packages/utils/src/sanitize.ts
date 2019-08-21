import * as sanitizeHtml from 'sanitize-html';

export class Sanitizer {
  public sanitizeText = (text: string): string => {
    return sanitizeHtml(text);
  };
}
