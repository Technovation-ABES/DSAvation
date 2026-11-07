import { DEFAULT_DAILY_TEMPLATE, DEFAULT_EXPLAINER_TEMPLATE } from '../data/constants.js';

export function getMessageTemplate(type) {
  const key = type === 'daily' ? 'dsavation-daily-template' : 'dsavation-explainer-template';
  const stored = typeof localStorage !== 'undefined' ? localStorage.getItem(key) : null;
  if (stored) return stored;
  return type === 'daily' ? DEFAULT_DAILY_TEMPLATE : DEFAULT_EXPLAINER_TEMPLATE;
}

export function saveMessageTemplate(type, template) {
  const key = type === 'daily' ? 'dsavation-daily-template' : 'dsavation-explainer-template';
  if (typeof localStorage !== 'undefined') localStorage.setItem(key, template);
}

export function resetMessageTemplate(type) {
  const key = type === 'daily' ? 'dsavation-daily-template' : 'dsavation-explainer-template';
  if (typeof localStorage !== 'undefined') localStorage.removeItem(key);
  return type === 'daily' ? DEFAULT_DAILY_TEMPLATE : DEFAULT_EXPLAINER_TEMPLATE;
}

export function renderMessageText(template, { question, explainer }) {
  if (!template) return '';
  let text = template;
  if (question) {
    const slug = question.title ? question.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') : '';
    const url = `https://leetcode.com/problems/${slug}/`;
    text = text
      .replace(/{day}/gi, String(question.day || '—'))
      .replace(/{id}/gi, String(question.id || '—'))
      .replace(/{title}/gi, question.title || 'today’s question')
      .replace(/{topic}/gi, question.topic || 'General')
      .replace(/{leetcodeUrl}/gi, url);
  }
  if (explainer) {
    const tag = explainer.githubUsername ? `@${explainer.githubUsername}` : (explainer.name ? `@${explainer.name}` : '@explainer');
    text = text
      .replace(/{tag}/gi, tag)
      .replace(/<tag>/gi, tag)
      .replace(/{name}/gi, explainer.name || 'explainer')
      .replace(/<name>/gi, explainer.name || 'explainer');
  } else {
    text = text
      .replace(/{tag}/gi, '@explainer')
      .replace(/<tag>/gi, '@explainer')
      .replace(/{name}/gi, 'explainer')
      .replace(/<name>/gi, 'explainer');
  }
  return text;
}

