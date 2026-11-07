import React, { useState, useEffect } from 'react';
import { createAvatarDataUri } from '../../utils/avatar.js';

export const MemberAvatar = React.memo(function MemberAvatar({
  person,
  style,
  seed,
  url,
  className = '',
  label = '',
}) {
  const avatarStyle = style || person?.avatarStyle || 'critters';
  const customUrl = url || person?.avatarUrl || (avatarStyle === 'custom' ? (seed || person?.avatarSeed) : null);
  const avatarSeed = seed || person?.avatarSeed || person?.id || 'dsavation-member';
  const [src, setSrc] = useState('');
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let active = true;
    setFailed(false);
    if (customUrl && /^https?:\/\//i.test(customUrl)) {
      setSrc(customUrl);
      return () => { active = false; };
    }
    createAvatarDataUri(avatarStyle, avatarSeed).then((dataUri) => {
      if (active) setSrc(dataUri);
    }).catch(() => {
      if (active) setFailed(true);
    });
    return () => { active = false; };
  }, [avatarStyle, avatarSeed, customUrl]);

  if (failed || (!src && !customUrl)) {
    const fallbackText = (person?.name || label || '?')[0].toUpperCase();
    return <span className={`avatar-fallback ${className}`} aria-hidden="true">{fallbackText}</span>;
  }
  return (
    <img
      src={src}
      alt={person?.name ? `${person.name}'s avatar` : 'Member avatar'}
      className={`member-avatar ${className}`}
      loading="lazy"
      onError={() => setFailed(true)}
    />
  );
});

