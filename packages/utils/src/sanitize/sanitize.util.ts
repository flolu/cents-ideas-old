import * as sanitizeHtml from 'sanitize-html';
import { SanitizeText } from './sanitize.types';

const sanitizeText: SanitizeText = (text: string): string => {
  return sanitizeHtml(text);
};

export { sanitizeText };
