export function getViewFromPath(path) {
  if (path === '/dashboard') return 'dashboard';
  if (path === '/members') return 'members';
  if (path === '/challenge' || path === '/club') return 'club';
  if (path === '/activity' || path === '/practice') return 'activity';
  if (path === '/account' || path === '/progress') return 'progress';
  if (path === '/reset-password') return 'reset-password';
  return 'general';
}

export function getPathFromView(v) {
  if (v === 'dashboard') return '/dashboard';
  if (v === 'members') return '/members';
  if (v === 'club') return '/challenge';
  if (v === 'activity') return '/activity';
  if (v === 'progress') return '/account';
  if (v === 'reset-password') return '/reset-password';
  return '/';
}

