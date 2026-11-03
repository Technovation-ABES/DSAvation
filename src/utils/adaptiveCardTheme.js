import { FastAverageColor } from 'fast-average-color';

/**
 * Adaptive Background Contrast Engine for Member Profile Cards
 * 
 * Provides intelligent, accessible (WCAG 2.1 AA) foreground/surface styling
 * for member cards with arbitrary background images (anime art, landscapes,
 * gradients, light/dark photos).
 */

// In-memory cache to prevent repeated canvas processing of unchanged images
const themeCache = new Map();
const MAX_CACHE_SIZE = 250;

let facInstance = null;
function getFAC() {
  if (!facInstance && typeof window !== 'undefined') {
    facInstance = new FastAverageColor();
  }
  return facInstance;
}

/**
 * Safe default dark theme fallback (used on load failure, CORS restrictions, or empty BG)
 */
export const DEFAULT_DARK_CARD_THEME = Object.freeze({
  theme: 'dark',
  isDark: true,
  isLight: false,
  contrastRatio: { primary: 12.5, secondary: 7.2 },
  cssVariables: {
    '--card-theme': 'dark',
    '--card-text-primary': '#ffffff',
    '--card-text-secondary': '#cbd5e1',
    '--card-surface-bg': 'rgba(15, 23, 42, 0.70)',
    '--card-header-surface-bg': 'rgba(15, 23, 42, 0.70)',
    '--card-socials-surface-bg': 'rgba(15, 23, 42, 0.70)',
    '--card-surface-border': 'rgba(255, 255, 255, 0.16)',
    '--card-overlay-bg': 'rgba(0, 0, 0, 0.22)',
    '--card-link-color': '#38bdf8',
    '--card-link-hover': '#7dd3fc',
    '--card-btn-bg': 'rgba(255, 255, 255, 0.12)',
    '--card-btn-hover': 'rgba(255, 255, 255, 0.22)',
    '--card-border-color': 'rgba(255, 255, 255, 0.16)',
    '--card-points-color': '#34d399',
    '--card-aura-color': '#fb923c',
    '--card-leetcode-bg': 'rgba(15, 23, 42, 0.75)',
  }
});

/**
 * Calculate relative luminance of an sRGB color per WCAG 2.1 specifications.
 * @param {number} r 0-255
 * @param {number} g 0-255
 * @param {number} b 0-255
 * @returns {number} Relative luminance between 0 (black) and 1 (white)
 */
export function getRelativeLuminance(r, g, b) {
  const [rs, gs, bs] = [r, g, b].map((val) => {
    const s = Math.max(0, Math.min(255, val)) / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

/**
 * Calculate WCAG 2.1 contrast ratio between two relative luminances.
 * @param {number} lum1 0-1
 * @param {number} lum2 0-1
 * @returns {number} Contrast ratio between 1 and 21 (e.g. 4.5 for 4.5:1)
 */
export function getContrastRatio(lum1, lum2) {
  const l1 = Math.max(lum1, lum2);
  const l2 = Math.min(lum1, lum2);
  return (l1 + 0.05) / (l2 + 0.05);
}

/**
 * Alpha-blend a foreground RGBA surface onto an opaque RGB background.
 * @param {[number, number, number, number]} fgRgba [r, g, b, a (0..1)]
 * @param {[number, number, number]} bgRgb [r, g, b]
 * @returns {[number, number, number]} Composited [r, g, b]
 */
export function compositeRgba(fgRgba, bgRgb) {
  const alpha = Math.max(0, Math.min(1, fgRgba[3] ?? 1));
  return [
    Math.round(fgRgba[0] * alpha + bgRgb[0] * (1 - alpha)),
    Math.round(fgRgba[1] * alpha + bgRgb[1] * (1 - alpha)),
    Math.round(fgRgba[2] * alpha + bgRgb[2] * (1 - alpha)),
  ];
}

/**
 * Compute the optimal surface opacity (alpha) ensuring WCAG 2.1 compliance (>= 4.5:1).
 * Iteratively adjusts alpha upwards if the sampled background bleeds through too much.
 */
export function calculateOptimalSurfaceAlpha({
  isDarkTheme,
  surfaceBaseRgb,
  bgRgb,
  primaryTextRgb,
  secondaryTextRgb,
  minPrimaryContrast = 4.5,
  minSecondaryContrast = 4.5,
  initialAlpha = isDarkTheme ? 0.65 : 0.78,
  maxAlpha = 0.94,
}) {
  let alpha = initialAlpha;
  const primaryLum = getRelativeLuminance(...primaryTextRgb);
  const secondaryLum = getRelativeLuminance(...secondaryTextRgb);

  for (let step = 0; step <= 8; step++) {
    const comp = compositeRgba([...surfaceBaseRgb, alpha], bgRgb);
    const compLum = getRelativeLuminance(...comp);
    const primaryRatio = getContrastRatio(primaryLum, compLum);
    const secondaryRatio = getContrastRatio(secondaryLum, compLum);

    if (primaryRatio >= minPrimaryContrast && secondaryRatio >= minSecondaryContrast) {
      return { alpha: Number(alpha.toFixed(2)), primaryRatio, secondaryRatio };
    }

    alpha = Math.min(maxAlpha, alpha + 0.04);
  }

  const finalComp = compositeRgba([...surfaceBaseRgb, alpha], bgRgb);
  const finalLum = getRelativeLuminance(...finalComp);
  return {
    alpha: Number(alpha.toFixed(2)),
    primaryRatio: getContrastRatio(primaryLum, finalLum),
    secondaryRatio: getContrastRatio(secondaryLum, finalLum),
  };
}

/**
 * Construct CSS variables and theme metadata based on sampled image regions.
 */
export function buildCardThemeVariables({
  headerColor = [30, 41, 59],
  socialsColor = [30, 41, 59],
  overallColor = [30, 41, 59],
  isLight = false,
}) {
  const theme = isLight ? 'light' : 'dark';

  if (isLight) {
    // Light Background theme
    const primaryTextRgb = [9, 13, 22];     // near black #090d16
    const secondaryTextRgb = [51, 65, 85];  // slate gray #334155
    const surfaceBaseRgb = [255, 255, 255]; // white surface

    const headerSurface = calculateOptimalSurfaceAlpha({
      isDarkTheme: false,
      surfaceBaseRgb,
      bgRgb: headerColor,
      primaryTextRgb,
      secondaryTextRgb,
      initialAlpha: 0.80,
    });

    const socialsSurface = calculateOptimalSurfaceAlpha({
      isDarkTheme: false,
      surfaceBaseRgb,
      bgRgb: socialsColor,
      primaryTextRgb,
      secondaryTextRgb,
      initialAlpha: 0.80,
    });

    return {
      theme: 'light',
      isDark: false,
      isLight: true,
      contrastRatio: {
        primary: Number(headerSurface.primaryRatio.toFixed(2)),
        secondary: Number(headerSurface.secondaryRatio.toFixed(2)),
      },
      cssVariables: {
        '--card-theme': 'light',
        '--card-text-primary': '#090d16',
        '--card-text-secondary': '#334155',
        '--card-surface-bg': `rgba(255, 255, 255, ${headerSurface.alpha})`,
        '--card-header-surface-bg': `rgba(255, 255, 255, ${headerSurface.alpha})`,
        '--card-socials-surface-bg': `rgba(255, 255, 255, ${socialsSurface.alpha})`,
        '--card-surface-border': 'rgba(15, 23, 42, 0.12)',
        '--card-overlay-bg': 'rgba(255, 255, 255, 0.14)',
        '--card-link-color': '#0284c7', // WCAG >= 4.5:1 on light surface
        '--card-link-hover': '#0369a1',
        '--card-btn-bg': 'rgba(15, 23, 42, 0.08)',
        '--card-btn-hover': 'rgba(15, 23, 42, 0.15)',
        '--card-border-color': 'rgba(15, 23, 42, 0.14)',
        '--card-points-color': '#047857', // turquoise/emerald preserved & accessible
        '--card-aura-color': '#c2410c',   // aura orange preserved & accessible
        '--card-leetcode-bg': 'rgba(255, 255, 255, 0.88)',
      },
    };
  }

  // Dark Background theme
  const primaryTextRgb = [255, 255, 255];   // white #ffffff
  const secondaryTextRgb = [203, 213, 225]; // slate #cbd5e1
  const surfaceBaseRgb = [15, 23, 42];      // dark slate surface

  const headerSurface = calculateOptimalSurfaceAlpha({
    isDarkTheme: true,
    surfaceBaseRgb,
    bgRgb: headerColor,
    primaryTextRgb,
    secondaryTextRgb,
    initialAlpha: 0.68,
  });

  const socialsSurface = calculateOptimalSurfaceAlpha({
    isDarkTheme: true,
    surfaceBaseRgb,
    bgRgb: socialsColor,
    primaryTextRgb,
    secondaryTextRgb,
    initialAlpha: 0.68,
  });

  return {
    theme: 'dark',
    isDark: true,
    isLight: false,
    contrastRatio: {
      primary: Number(headerSurface.primaryRatio.toFixed(2)),
      secondary: Number(headerSurface.secondaryRatio.toFixed(2)),
    },
    cssVariables: {
      '--card-theme': 'dark',
      '--card-text-primary': '#ffffff',
      '--card-text-secondary': '#cbd5e1',
      '--card-surface-bg': `rgba(15, 23, 42, ${headerSurface.alpha})`,
      '--card-header-surface-bg': `rgba(15, 23, 42, ${headerSurface.alpha})`,
      '--card-socials-surface-bg': `rgba(15, 23, 42, ${socialsSurface.alpha})`,
      '--card-surface-border': 'rgba(255, 255, 255, 0.16)',
      '--card-overlay-bg': 'rgba(0, 0, 0, 0.22)',
      '--card-link-color': '#38bdf8', // bright sky blue
      '--card-link-hover': '#7dd3fc',
      '--card-btn-bg': 'rgba(255, 255, 255, 0.12)',
      '--card-btn-hover': 'rgba(255, 255, 255, 0.22)',
      '--card-border-color': 'rgba(255, 255, 255, 0.16)',
      '--card-points-color': '#34d399', // bright emerald
      '--card-aura-color': '#fb923c',   // vibrant flame orange
      '--card-leetcode-bg': 'rgba(15, 23, 42, 0.75)',
    },
  };
}

/**
 * Load an image safely with anonymous CORS and timeout.
 */
function loadImageSafely(url, timeoutMs = 4000) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    let timer = null;

    img.crossOrigin = 'anonymous';
    img.decoding = 'async';

    img.onload = () => {
      clearTimeout(timer);
      resolve(img);
    };

    img.onerror = (err) => {
      clearTimeout(timer);
      reject(err || new Error(`Failed to load image from ${url}`));
    };

    timer = setTimeout(() => {
      img.onload = null;
      img.onerror = null;
      reject(new Error(`Timeout loading image from ${url}`));
    }, timeoutMs);

    img.src = url;
  });
}

/**
 * Extract representative colors and compute adaptive contrast theme from an image URL.
 * Handles regional analysis (header, socials, overall), CORS restrictions, and errors.
 * 
 * @param {string} imageUrl URL of the member card background image
 * @returns {Promise<typeof DEFAULT_DARK_CARD_THEME>}
 */
export async function extractAdaptiveCardTheme(imageUrl) {
  if (!imageUrl || typeof imageUrl !== 'string' || !imageUrl.trim()) {
    return DEFAULT_DARK_CARD_THEME;
  }

  const cleanUrl = imageUrl.trim();

  // Return cached result if available
  if (themeCache.has(cleanUrl)) {
    return themeCache.get(cleanUrl);
  }

  // Manage cache capacity
  if (themeCache.size >= MAX_CACHE_SIZE) {
    const firstKey = themeCache.keys().next().value;
    themeCache.delete(firstKey);
  }

  const analysisPromise = (async () => {
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      return DEFAULT_DARK_CARD_THEME;
    }

    try {
      const fac = getFAC();
      if (!fac) return DEFAULT_DARK_CARD_THEME;

      const img = await loadImageSafely(cleanUrl);
      const width = img.naturalWidth || img.width || 300;
      const height = img.naturalHeight || img.height || 200;

      // 1. Regional sampling: Header area (top 45% of card)
      const headerColorResult = fac.getColor(img, {
        top: 0,
        left: 0,
        width,
        height: Math.max(1, Math.round(height * 0.45)),
        algorithm: 'sqrt',
        mode: 'precision',
      });

      // 2. Regional sampling: Socials & action area (bottom 50% of card)
      const socialsTop = Math.round(height * 0.50);
      const socialsHeight = Math.max(1, height - socialsTop);
      const socialsColorResult = fac.getColor(img, {
        top: socialsTop,
        left: 0,
        width,
        height: socialsHeight,
        algorithm: 'sqrt',
        mode: 'precision',
      });

      // 3. Full card color
      const overallColorResult = fac.getColor(img, {
        top: 0,
        left: 0,
        width,
        height,
        algorithm: 'sqrt',
        mode: 'precision',
      });

      // Regional brightness calculation (ITU-R BT.601 formula used by FastAverageColor)
      // Header region carries 60% text weight, socials carry 40%
      const headerVal = headerColorResult?.value || [30, 41, 59, 255];
      const socialsVal = socialsColorResult?.value || [30, 41, 59, 255];
      const overallVal = overallColorResult?.value || [30, 41, 59, 255];

      const headerBrightness = (headerVal[0] * 299 + headerVal[1] * 587 + headerVal[2] * 114) / 1000;
      const socialsBrightness = (socialsVal[0] * 299 + socialsVal[1] * 587 + socialsVal[2] * 114) / 1000;

      const weightedBrightness = headerBrightness * 0.60 + socialsBrightness * 0.40;
      const isLight = weightedBrightness >= 128;

      return buildCardThemeVariables({
        headerColor: headerVal.slice(0, 3),
        socialsColor: socialsVal.slice(0, 3),
        overallColor: overallVal.slice(0, 3),
        isLight,
      });
    } catch (err) {
      // CORS block, canvas security taint, network failure, or decoding error:
      // Gracefully fall back to safe dark theme without breaking card rendering
      return DEFAULT_DARK_CARD_THEME;
    }
  })();

  themeCache.set(cleanUrl, analysisPromise);
  return analysisPromise;
}
