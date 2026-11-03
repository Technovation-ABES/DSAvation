import test from 'node:test';
import assert from 'node:assert/strict';
import {
  getRelativeLuminance,
  getContrastRatio,
  compositeRgba,
  calculateOptimalSurfaceAlpha,
  buildCardThemeVariables,
  DEFAULT_DARK_CARD_THEME,
} from '../src/utils/adaptiveCardTheme.js';

test('getRelativeLuminance matches WCAG 2.1 specifications', () => {
  const blackLum = getRelativeLuminance(0, 0, 0);
  assert.equal(blackLum, 0);

  const whiteLum = getRelativeLuminance(255, 255, 255);
  assert.equal(Math.round(whiteLum), 1);

  // sRGB midpoint (128, 128, 128)
  const midLum = getRelativeLuminance(128, 128, 128);
  assert.ok(midLum > 0.20 && midLum < 0.23);
});

test('getContrastRatio computes accurate WCAG ratios', () => {
  const whiteLum = getRelativeLuminance(255, 255, 255);
  const blackLum = getRelativeLuminance(0, 0, 0);

  const maxContrast = getContrastRatio(whiteLum, blackLum);
  assert.equal(Math.round(maxContrast), 21);

  const sameContrast = getContrastRatio(whiteLum, whiteLum);
  assert.equal(sameContrast, 1);
});

test('compositeRgba correctly blends surface alpha onto background', () => {
  const bg = [0, 0, 0];
  const fg = [255, 255, 255, 0.5];
  const blended = compositeRgba(fg, bg);
  assert.deepEqual(blended, [128, 128, 128]);

  const opaqueFg = [100, 150, 200, 1];
  assert.deepEqual(compositeRgba(opaqueFg, bg), [100, 150, 200]);
});

test('calculateOptimalSurfaceAlpha guarantees >= 4.5:1 contrast for normal text', () => {
  // Test dark background: dark blue [15, 25, 45]
  const darkRes = calculateOptimalSurfaceAlpha({
    isDarkTheme: true,
    surfaceBaseRgb: [15, 23, 42],
    bgRgb: [15, 25, 45],
    primaryTextRgb: [255, 255, 255],
    secondaryTextRgb: [203, 213, 225],
  });
  assert.ok(darkRes.primaryRatio >= 4.5, `Dark primary ratio ${darkRes.primaryRatio} should be >= 4.5`);
  assert.ok(darkRes.secondaryRatio >= 4.5, `Dark secondary ratio ${darkRes.secondaryRatio} should be >= 4.5`);

  // Test light background: bright cream [250, 248, 240]
  const lightRes = calculateOptimalSurfaceAlpha({
    isDarkTheme: false,
    surfaceBaseRgb: [255, 255, 255],
    bgRgb: [250, 248, 240],
    primaryTextRgb: [9, 13, 22],
    secondaryTextRgb: [51, 65, 85],
  });
  assert.ok(lightRes.primaryRatio >= 4.5, `Light primary ratio ${lightRes.primaryRatio} should be >= 4.5`);
  assert.ok(lightRes.secondaryRatio >= 4.5, `Light secondary ratio ${lightRes.secondaryRatio} should be >= 4.5`);
});

test('adaptive themes with 5 visually distinct background scenarios', () => {
  // Scenario 1: Deep night anime background (very dark)
  const bg1 = buildCardThemeVariables({
    headerColor: [10, 14, 28],
    socialsColor: [8, 12, 22],
    overallColor: [9, 13, 25],
    isLight: false,
  });
  assert.equal(bg1.theme, 'dark');
  assert.equal(bg1.isDark, true);
  assert.equal(bg1.cssVariables['--card-text-primary'], '#ffffff');
  assert.ok(bg1.contrastRatio.primary >= 4.5);

  // Scenario 2: Bright sunny anime sky (very light)
  const bg2 = buildCardThemeVariables({
    headerColor: [240, 248, 255],
    socialsColor: [230, 242, 250],
    overallColor: [235, 245, 255],
    isLight: true,
  });
  assert.equal(bg2.theme, 'light');
  assert.equal(bg2.isLight, true);
  assert.equal(bg2.cssVariables['--card-text-primary'], '#090d16');
  assert.ok(bg2.contrastRatio.primary >= 4.5);

  // Scenario 3: Vibrant sunset / synthwave (magenta / purple)
  const bg3 = buildCardThemeVariables({
    headerColor: [175, 38, 130],
    socialsColor: [140, 25, 95],
    overallColor: [160, 30, 115],
    isLight: false,
  });
  assert.equal(bg3.theme, 'dark');
  assert.ok(bg3.contrastRatio.primary >= 4.5);

  // Scenario 4: Natural landscape (green foliage)
  const bg4 = buildCardThemeVariables({
    headerColor: [45, 95, 40],
    socialsColor: [35, 75, 30],
    overallColor: [40, 85, 35],
    isLight: false,
  });
  assert.equal(bg4.theme, 'dark');
  assert.ok(bg4.contrastRatio.primary >= 4.5);

  // Scenario 5: High-contrast split (bright sky header [225, 235, 245], dark ground socials [25, 35, 20])
  const headerBrightness = (225 * 299 + 235 * 587 + 245 * 114) / 1000;
  const socialsBrightness = (25 * 299 + 35 * 587 + 20 * 114) / 1000;
  const weighted = headerBrightness * 0.6 + socialsBrightness * 0.4;
  const isLight = weighted >= 128; // 233.1 * 0.6 + 30.3 * 0.4 = 139.86 + 12.12 = 151.98 -> light
  const bg5 = buildCardThemeVariables({
    headerColor: [225, 235, 245],
    socialsColor: [25, 35, 20],
    overallColor: [125, 135, 132],
    isLight,
  });
  assert.equal(bg5.theme, 'light');
  assert.ok(bg5.contrastRatio.primary >= 4.5);
});

test('semantic colors (points & aura) are preserved and distinct', () => {
  const darkTheme = buildCardThemeVariables({ isLight: false });
  assert.ok(darkTheme.cssVariables['--card-points-color']);
  assert.ok(darkTheme.cssVariables['--card-aura-color']);
  assert.notEqual(darkTheme.cssVariables['--card-points-color'], darkTheme.cssVariables['--card-aura-color']);

  const lightTheme = buildCardThemeVariables({ isLight: true });
  assert.ok(lightTheme.cssVariables['--card-points-color']);
  assert.ok(lightTheme.cssVariables['--card-aura-color']);
  assert.notEqual(lightTheme.cssVariables['--card-points-color'], lightTheme.cssVariables['--card-aura-color']);
});

test('DEFAULT_DARK_CARD_THEME is valid and populated', () => {
  assert.equal(DEFAULT_DARK_CARD_THEME.theme, 'dark');
  assert.equal(DEFAULT_DARK_CARD_THEME.isDark, true);
  assert.ok(DEFAULT_DARK_CARD_THEME.cssVariables['--card-text-primary']);
  assert.ok(DEFAULT_DARK_CARD_THEME.cssVariables['--card-surface-bg']);
});
