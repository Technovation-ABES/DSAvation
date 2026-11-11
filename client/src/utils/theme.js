export const VALID_THEMES = ['light', 'technovation', 'dark', 'forest'];

export function isLightMode(theme) {
  return theme === 'light' || theme === 'technovation';
}

export function isDarkMode(theme) {
  return theme === 'dark' || theme === 'forest';
}

export function initialTheme() {
  const stored = typeof localStorage !== 'undefined' ? localStorage.getItem('dsavation-theme') : null;
  const theme = VALID_THEMES.includes(stored) ? stored : 'light';
  if (typeof document !== 'undefined') {
    document.documentElement.dataset.theme = theme;
    delete document.documentElement.dataset.style;
  }
  return theme;
}

export function rememberDarkStyle(theme) {
  if (typeof localStorage !== 'undefined' && (theme === 'dark' || theme === 'forest')) {
    localStorage.setItem('dsavation-dark-style', theme);
  }
}

export function storedDarkStyle() {
  if (typeof localStorage === 'undefined') return 'forest';
  return localStorage.getItem('dsavation-dark-style') === 'dark' ? 'dark' : 'forest';
}

export function rememberLightStyle(theme) {
  if (typeof localStorage !== 'undefined' && (theme === 'light' || theme === 'technovation')) {
    localStorage.setItem('dsavation-light-style', theme);
  }
}

export function storedLightStyle() {
  if (typeof localStorage === 'undefined') return 'light';
  return localStorage.getItem('dsavation-light-style') === 'technovation' ? 'technovation' : 'light';
}
