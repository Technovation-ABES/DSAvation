export const AVATAR_STYLES = [
  { id: 'critters', name: 'Critters' },
  { id: 'fun-emoji', name: 'Fun Emoji' },
  { id: 'clay', name: 'Clay' },
  { id: 'micah', name: 'Micah' },
];

const loaders = {
  critters: () => import('@dicebear/styles/critters.json'),
  'fun-emoji': () => import('@dicebear/styles/fun-emoji.json'),
  clay: () => import('@dicebear/styles/clay.json'),
  micah: () => import('@dicebear/styles/micah.json'),
};
const avatarCache = new Map();

export async function createAvatarDataUri(styleId, seed) {
  const selectedStyle = loaders[styleId] ? styleId : 'critters';
  const selectedSeed = String(seed || 'dsavation-member');
  const key = `${selectedStyle}:${selectedSeed}`;
  if (avatarCache.has(key)) return avatarCache.get(key);
  const generated = Promise.all([import('@dicebear/core'), loaders[selectedStyle]()]).then(([core, module]) =>
    new core.Avatar(new core.Style(module.default), { seed: selectedSeed, size: 200 }).toDataUri());
  avatarCache.set(key, generated);
  try {
    return await generated;
  } catch (error) {
    avatarCache.delete(key);
    throw error;
  }
}

export async function createAvatarSvg(styleId, seed, size = 200) {
  const selectedStyle = loaders[styleId] ? styleId : 'critters';
  const selectedSeed = String(seed || 'dsavation-member');
  const [core, module] = await Promise.all([import('@dicebear/core'), loaders[selectedStyle]()]);
  const avatar = new core.Avatar(new core.Style(module.default), { seed: selectedSeed, size });
  return avatar.toString();
}

export async function rasterizeSvgToPngDataUri(svgString, size = 200) {
  if (typeof document === 'undefined') return null;
  return new Promise((resolve) => {
    try {
      let cleanSvg = svgString;
      if (!/xmlns\s*=/i.test(cleanSvg)) {
        cleanSvg = cleanSvg.replace(/<svg\b/i, '<svg xmlns="http://www.w3.org/2000/svg"');
      }
      if (!/width\s*=/i.test(cleanSvg)) {
        cleanSvg = cleanSvg.replace(/<svg\b/i, `<svg width="${size}" height="${size}"`);
      }
      const b64 = typeof window !== 'undefined' && window.btoa ? window.btoa(unescape(encodeURIComponent(cleanSvg))) : '';
      if (!b64) return resolve(null);
      const img = new Image();
      img.onload = () => {
        try {
          const offCanvas = document.createElement('canvas');
          offCanvas.width = size;
          offCanvas.height = size;
          const ctx = offCanvas.getContext('2d');
          ctx.drawImage(img, 0, 0, size, size);
          resolve(offCanvas.toDataURL('image/png'));
        } catch {
          resolve('data:image/svg+xml;base64,' + b64);
        }
      };
      img.onerror = () => resolve('data:image/svg+xml;base64,' + b64);
      img.src = 'data:image/svg+xml;base64,' + b64;
      setTimeout(() => resolve('data:image/svg+xml;base64,' + b64), 2500);
    } catch {
      resolve(null);
    }
  });
}

export function createAvatarSeeds(count = 8) {
  return Array.from({ length: count }, () => {
    const random = globalThis.crypto?.randomUUID?.() || `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
    return `avatar-${random.replaceAll('-', '').slice(0, 20)}`;
  });
}
