export function initialTheme() {
  const stored = typeof localStorage !== 'undefined' ? localStorage.getItem('dsavation-theme') : null;
  const theme = stored === 'dark' || stored === 'forest' ? stored : 'light';
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

