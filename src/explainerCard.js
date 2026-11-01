import { createAvatarDataUri } from './avatar.js';

function studyYearLabel(value) {
  const map = {
    'first-year': 'First year',
    'second-year': 'Second year',
    'third-year': 'Third year',
    'fourth-year': 'Fourth year',
    passed: 'Passed out',
  };
  return map[value] || value || '';
}

function safeRoundRect(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  if (typeof ctx.roundRect === 'function') {
    ctx.roundRect(x, y, width, height, radius);
  } else {
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
  }
}

export async function renderExplainerCardCanvas({ explainer, question, dateKey }) {
  if (!explainer) throw new Error('No explainer selected.');
  const width = 1200;
  const height = 675; // Standard 16:9 social share graphic
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  // 1. Solid Dark Background
  const bgGrad = ctx.createLinearGradient(0, 0, width, height);
  bgGrad.addColorStop(0, '#06131f');
  bgGrad.addColorStop(0.5, '#0a1d30');
  bgGrad.addColorStop(1, '#050f19');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  // Subtle decorative atmospheric caustics
  ctx.save();
  const glowGrad = ctx.createRadialGradient(width * 0.85, height * 0.15, 20, width * 0.85, height * 0.15, 450);
  glowGrad.addColorStop(0, 'rgba(56, 189, 248, 0.16)');
  glowGrad.addColorStop(0.6, 'rgba(14, 165, 233, 0.04)');
  glowGrad.addColorStop(1, 'transparent');
  ctx.fillStyle = glowGrad;
  ctx.fillRect(0, 0, width, height);

  const glowBottom = ctx.createRadialGradient(width * 0.15, height * 0.85, 20, width * 0.15, height * 0.85, 380);
  glowBottom.addColorStop(0, 'rgba(45, 212, 191, 0.12)');
  glowBottom.addColorStop(1, 'transparent');
  ctx.fillStyle = glowBottom;
  ctx.fillRect(0, 0, width, height);
  ctx.restore();

  // Outer framing border
  ctx.save();
  ctx.strokeStyle = 'rgba(56, 189, 248, 0.35)';
  ctx.lineWidth = 2;
  safeRoundRect(ctx, 24, 24, width - 48, height - 48, 20);
  ctx.stroke();
  ctx.restore();

  // 2. Header Area
  ctx.save();
  // Logo image
  try {
    await new Promise((resolve) => {
      const logoImg = new Image();
      logoImg.onload = () => {
        ctx.save();
        safeRoundRect(ctx, 60, 52, 46, 46, 10);
        ctx.clip();
        ctx.drawImage(logoImg, 60, 52, 46, 46);
        ctx.restore();
        resolve();
      };
      logoImg.onerror = () => resolve();
      logoImg.src = '/technovation-logo.png';
      setTimeout(resolve, 1000);
    });
  } catch {}

  // Eyebrow badge
  ctx.fillStyle = '#38bdf8';
  ctx.font = '700 12px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.letterSpacing = '1.5px';
  ctx.fillText('ABES TECHNOVATION CLUB  ·  DSAVATION', 118, 68);

  // Main Heading
  ctx.fillStyle = '#ffffff';
  ctx.font = '800 30px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillText("TODAY'S SOLUTION EXPLAINER", 118, 97);

  // Date Tag Pill (Right side of header)
  const dateStr = dateKey || new Intl.DateTimeFormat('sv-SE', { timeZone: 'Asia/Kolkata' }).format(new Date());
  ctx.fillStyle = '#10273c';
  safeRoundRect(ctx, width - 240, 58, 180, 38, 19);
  ctx.fill();
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  ctx.fillStyle = '#ffffff';
  ctx.font = '700 14px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(`📅 ${dateStr}`, width - 150, 82);
  ctx.textAlign = 'left';
  ctx.restore();

  // 3. Today's Question Card
  ctx.save();
  const qY = 132;
  const qHeight = 90;
  ctx.fillStyle = '#0c2032';
  safeRoundRect(ctx, 60, qY, width - 120, qHeight, 14);
  ctx.fill();
  ctx.strokeStyle = 'rgba(56, 189, 248, 0.35)';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  ctx.fillStyle = '#7dd3fc';
  ctx.font = '700 12px monospace, system-ui, sans-serif';
  ctx.fillText("TODAY'S QUESTION OF THE DAY", 84, qY + 30);

  const qId = question?.id || explainer.questionId || '—';
  const qTitle = question?.title || explainer.questionTitle || 'Curriculum Problem';
  ctx.fillStyle = '#ffffff';
  ctx.font = '800 22px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillText(`LC #${qId} · ${qTitle}`, 84, qY + 63);

  if (question?.difficulty) {
    const diff = question.difficulty;
    const isEasy = diff.toLowerCase() === 'easy';
    const isMed = diff.toLowerCase() === 'medium';
    const diffBg = isEasy ? 'rgba(16, 185, 129, 0.22)' : isMed ? 'rgba(245, 158, 11, 0.22)' : 'rgba(239, 68, 68, 0.22)';
    const diffBorder = isEasy ? '#10b981' : isMed ? '#f59e0b' : '#ef4444';
    const diffText = isEasy ? '#34d399' : isMed ? '#fbbf24' : '#f87171';

    ctx.fillStyle = diffBg;
    safeRoundRect(ctx, width - 200, qY + 28, 100, 34, 17);
    ctx.fill();
    ctx.strokeStyle = diffBorder;
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.fillStyle = diffText;
    ctx.font = '800 13px system-ui, -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(diff.toUpperCase(), width - 150, qY + 50);
    ctx.textAlign = 'left';
  }
  ctx.restore();

  // 4. Hero Explainer Spotlight Section
  ctx.save();
  const sY = 240;
  const sHeight = 310;
  const spotlightGrad = ctx.createLinearGradient(60, sY, width - 60, sY + sHeight);
  spotlightGrad.addColorStop(0, '#0d243a');
  spotlightGrad.addColorStop(1, '#091a2a');
  ctx.fillStyle = spotlightGrad;
  safeRoundRect(ctx, 60, sY, width - 120, sHeight, 18);
  ctx.fill();
  ctx.strokeStyle = 'rgba(56, 189, 248, 0.55)';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Hero Avatar
  const avatarCenterX = 180;
  const avatarCenterY = sY + 145;
  const avatarR = 75;

  let avatarDrawn = false;

  // Helper to draw an image/canvas onto the hero avatar circle
  function drawAvatarToCanvas(imageObj) {
    try {
      ctx.save();
      ctx.beginPath();
      ctx.arc(avatarCenterX, avatarCenterY, avatarR, 0, Math.PI * 2);
      ctx.closePath();
      ctx.clip();
      ctx.drawImage(imageObj, avatarCenterX - avatarR, avatarCenterY - avatarR, avatarR * 2, avatarR * 2);
      ctx.restore();
      return true;
    } catch (err) {
      console.warn('drawAvatarToCanvas failed:', err);
      return false;
    }
  }

  // Helper: Create an Image object from a Blob URL safely
  function loadImageFromBlob(blob) {
    return new Promise((resolve) => {
      const blobUrl = URL.createObjectURL(blob);
      const img = new Image();
      img.onload = () => {
        const ok = drawAvatarToCanvas(img);
        URL.revokeObjectURL(blobUrl);
        resolve(ok);
      };
      img.onerror = () => {
        URL.revokeObjectURL(blobUrl);
        resolve(false);
      };
      img.src = blobUrl;
      setTimeout(() => {
        URL.revokeObjectURL(blobUrl);
        resolve(false);
      }, 4000);
    });
  }

  // TRICK 1: Check if the DOM already rendered the avatar for this explainer
  try {
    const previewImg = typeof document !== 'undefined'
      ? document.querySelector('.explainer-preview-avatar, .explainer-modal img.avatar-image')
      : null;
    if (previewImg && previewImg.complete && previewImg.naturalWidth > 0) {
      // If it's a data URI or blob URL, it is completely origin-clean and safe to draw immediately
      if (previewImg.src && (previewImg.src.startsWith('data:') || previewImg.src.startsWith('blob:'))) {
        if (drawAvatarToCanvas(previewImg)) {
          avatarDrawn = true;
        }
      }
    }
  } catch (e) {
    console.warn('DOM preview check failed:', e);
  }

  // TRICK 2: If not drawn from DOM, resolve from source with resilient fetch/blob conversion
  if (!avatarDrawn) {
    try {
      const isCustom = explainer.avatarStyle === 'custom' || /^https?:\/\//i.test(explainer.avatarSeed || '') || Boolean(explainer.avatarUrl);
      let rawSource = isCustom
        ? (explainer.avatarUrl || explainer.avatarSeed)
        : await createAvatarDataUri(explainer.avatarStyle, explainer.avatarSeed);

      if (rawSource) {
        // A. If HTTP/HTTPS URL (custom avatar)
        if (/^https?:\/\//i.test(rawSource)) {
          // Attempt 1: Fetch via proxy to get same-origin blob
          try {
            const proxyUrl = `/api/proxy-image?url=${encodeURIComponent(rawSource)}`;
            const res = await fetch(proxyUrl, { signal: AbortSignal.timeout(6000) });
            if (res.ok) {
              const blob = await res.blob();
              avatarDrawn = await loadImageFromBlob(blob);
            }
          } catch (e) {
            console.warn('Proxy blob fetch failed, falling back:', e);
          }

          // Attempt 2: Direct image with crossOrigin = 'anonymous' if proxy failed
          if (!avatarDrawn) {
            await new Promise((resolve) => {
              const img = new Image();
              img.crossOrigin = 'anonymous';
              img.onload = () => {
                if (drawAvatarToCanvas(img)) avatarDrawn = true;
                resolve();
              };
              img.onerror = () => resolve();
              img.src = rawSource;
              setTimeout(resolve, 3500);
            });
          }
        }
        // B. If SVG data URI or SVG markup (DiceBear)
        else if (rawSource.startsWith('data:image/svg+xml') || rawSource.startsWith('<svg')) {
          try {
            let svgXml;
            if (rawSource.startsWith('<svg')) {
              svgXml = rawSource;
            } else {
              const commaIdx = rawSource.indexOf(',');
              const header = rawSource.slice(0, commaIdx);
              const data = rawSource.slice(commaIdx + 1);
              svgXml = header.includes('base64') ? atob(data) : decodeURIComponent(data);
            }
            if (!/width\s*=/i.test(svgXml)) {
              svgXml = svgXml.replace(/<svg\b([^>]*)>/i, '<svg width="200" height="200" $1>');
            }
            const blob = new Blob([svgXml], { type: 'image/svg+xml;charset=utf-8' });
            avatarDrawn = await loadImageFromBlob(blob);
          } catch (e) {
            console.warn('SVG blob conversion failed, trying direct:', e);
            // Fallback: direct data URI load
            await new Promise((resolve) => {
              const img = new Image();
              img.onload = () => {
                if (drawAvatarToCanvas(img)) avatarDrawn = true;
                resolve();
              };
              img.onerror = () => resolve();
              img.src = rawSource;
              setTimeout(resolve, 2500);
            });
          }
        }
        // C. Other data URI (PNG, JPG base64)
        else {
          await new Promise((resolve) => {
            const img = new Image();
            img.onload = () => {
              if (drawAvatarToCanvas(img)) avatarDrawn = true;
              resolve();
            };
            img.onerror = () => resolve();
            img.src = rawSource;
            setTimeout(resolve, 3000);
          });
        }
      }
    } catch (err) {
      console.warn('Avatar resolution failed:', err);
    }
  }

  // TRICK 3: If still not drawn and DOM has a loaded previewImg (even if external),
  // as an emergency fallback, draw it!
  if (!avatarDrawn && typeof document !== 'undefined') {
    try {
      const previewImg = document.querySelector('.explainer-preview-avatar, .explainer-modal img.avatar-image');
      if (previewImg && previewImg.complete && previewImg.naturalWidth > 0) {
        if (drawAvatarToCanvas(previewImg)) {
          avatarDrawn = true;
        }
      }
    } catch {}
  }

  if (!avatarDrawn) {
    ctx.save();
    const avBg = ctx.createLinearGradient(avatarCenterX - avatarR, avatarCenterY - avatarR, avatarCenterX + avatarR, avatarCenterY + avatarR);
    avBg.addColorStop(0, '#0284c7');
    avBg.addColorStop(1, '#0d9488');
    ctx.fillStyle = avBg;
    ctx.beginPath();
    ctx.arc(avatarCenterX, avatarCenterY, avatarR, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.font = '800 42px system-ui, -apple-system, sans-serif';
    ctx.textAlign = 'center';
    const initial = (explainer.name || 'M')[0].toUpperCase();
    ctx.fillText(initial, avatarCenterX, avatarCenterY + 15);
    ctx.restore();
  }

  // Neon Avatar Ring
  ctx.save();
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 3.5;
  ctx.shadowColor = 'rgba(56, 189, 248, 0.6)';
  ctx.shadowBlur = 16;
  ctx.beginPath();
  ctx.arc(avatarCenterX, avatarCenterY, avatarR + 5, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();

  // Explainer Details (Right side of avatar)
  const textX = 295;
  ctx.save();

  // Spotlight Tag Badge
  ctx.fillStyle = 'rgba(249, 115, 22, 0.22)';
  safeRoundRect(ctx, textX, sY + 32, 270, 30, 15);
  ctx.fill();
  ctx.strokeStyle = '#f97316';
  ctx.lineWidth = 1.5;
  ctx.stroke();
  ctx.fillStyle = '#fb923c';
  ctx.font = '800 12px monospace, system-ui, sans-serif';
  ctx.fillText('🎉 SELECTED SOLUTION EXPLAINER', textX + 16, sY + 52);

  // Full Name - Bright Bold White
  ctx.fillStyle = '#ffffff';
  ctx.font = '800 36px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillText(explainer.name || 'Member', textX, sY + 106);

  // Department and Study Year - High Contrast Crisp Text
  const yearText = studyYearLabel(explainer.studyYear);
  const deptYear = [explainer.department || 'Club Member', yearText].filter(Boolean).join('  ·  ');
  ctx.fillStyle = '#e2e8f0';
  ctx.font = '600 19px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillText(deptYear, textX, sY + 140);

  // GitHub Handle Badge (Note: LeetCode handle is strictly excluded per privacy request)
  let nextY = sY + 165;
  if (explainer.githubUsername) {
    ctx.fillStyle = 'rgba(56, 189, 248, 0.16)';
    safeRoundRect(ctx, textX, nextY, 230, 36, 10);
    ctx.fill();
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.fillStyle = '#7dd3fc';
    ctx.font = '700 14px monospace, system-ui, sans-serif';
    ctx.fillText(`GitHub: @${explainer.githubUsername}`, textX + 14, nextY + 23);
    nextY += 48;
  } else {
    nextY += 10;
  }

  // Submission Status - Luminous Green
  const subTimeStr = explainer.submittedAt ? new Date(explainer.submittedAt).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Kolkata' }) : '';
  ctx.fillStyle = '#34d399';
  ctx.font = '700 15px system-ui, -apple-system, sans-serif';
  ctx.fillText(`✓ Solution Attempt Accepted · Submitted at ${subTimeStr} IST`, textX, nextY + 16);

  // Group instructions note - Crisp Off-White
  ctx.fillStyle = '#f1f5f9';
  ctx.font = 'italic 14px system-ui, -apple-system, sans-serif';
  ctx.fillText("Please share your code walkthrough, approach and complexity insights in today's club session!", textX, nextY + 44);
  ctx.restore();

  // 5. Footer Bar - Clear and Legible
  ctx.save();
  ctx.fillStyle = '#0a1a28';
  safeRoundRect(ctx, 60, height - 85, width - 120, 44, 10);
  ctx.fill();
  ctx.strokeStyle = 'rgba(56, 189, 248, 0.25)';
  ctx.lineWidth = 1;
  ctx.stroke();

  ctx.fillStyle = '#cbd5e1';
  ctx.font = '600 14px system-ui, -apple-system, sans-serif';
  ctx.fillText('DSAvation  ·  ABES Engineering College  ·  Technovation Club', 84, height - 58);
  ctx.textAlign = 'right';
  ctx.fillText("Randomly selected among today's submitters", width - 84, height - 58);
  ctx.restore();

  return canvas;
}

export async function downloadExplainerImage(params) {
  const canvas = await renderExplainerCardCanvas(params);
  return new Promise((resolve, reject) => {
    try {
      canvas.toBlob((blob) => {
        if (!blob) {
          resolve(false);
          return;
        }
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        const cleanName = (params.explainer?.name || 'member').toLowerCase().replace(/[^a-z0-9]+/g, '-');
        a.href = url;
        a.download = `explainer-spotlight-${cleanName}-${params.dateKey || 'today'}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(() => URL.revokeObjectURL(url), 2000);
        resolve(true);
      }, 'image/png');
    } catch (err) {
      reject(err);
    }
  });
}

export async function copyExplainerImage(params) {
  const canvas = await renderExplainerCardCanvas(params);
  return new Promise((resolve, reject) => {
    try {
      canvas.toBlob(async (blob) => {
        if (!blob) {
          resolve(false);
          return;
        }
        try {
          if (navigator.clipboard && window.ClipboardItem) {
            await navigator.clipboard.write([
              new ClipboardItem({ 'image/png': blob })
            ]);
            resolve('copied');
            return;
          }
        } catch (err) {
          console.warn('Clipboard write not allowed, falling back to download:', err);
        }
        // Fallback: trigger download if clipboard API unavailable
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        const cleanName = (params.explainer?.name || 'member').toLowerCase().replace(/[^a-z0-9]+/g, '-');
        a.href = url;
        a.download = `explainer-spotlight-${cleanName}-${params.dateKey || 'today'}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(() => URL.revokeObjectURL(url), 2000);
        resolve('downloaded');
      }, 'image/png');
    } catch (err) {
      reject(err);
    }
  });
}
