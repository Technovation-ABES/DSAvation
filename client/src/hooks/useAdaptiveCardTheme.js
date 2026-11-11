import { useState, useEffect } from 'react';
import { extractAdaptiveCardTheme, DEFAULT_DARK_CARD_THEME } from '../utils/adaptiveCardTheme.js';

/**
 * React hook to extract and manage adaptive background contrast theme for a member card.
 * @param {string | undefined | null} cardBgUrl 
 * @returns {typeof DEFAULT_DARK_CARD_THEME}
 */
export function useAdaptiveCardTheme(cardBgUrl) {
  const [themeData, setThemeData] = useState(() => DEFAULT_DARK_CARD_THEME);

  useEffect(() => {
    if (!cardBgUrl || typeof cardBgUrl !== 'string' || !cardBgUrl.trim()) {
      setThemeData(DEFAULT_DARK_CARD_THEME);
      return;
    }

    let isMounted = true;
    extractAdaptiveCardTheme(cardBgUrl).then((result) => {
      if (isMounted && result) {
        setThemeData(result);
      }
    }).catch(() => {
      if (isMounted) {
        setThemeData(DEFAULT_DARK_CARD_THEME);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [cardBgUrl]);

  return themeData;
}

