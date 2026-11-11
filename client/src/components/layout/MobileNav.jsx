import React from 'react';
import { Icon as IconifyIcon } from '@iconify/react';
import { Icon } from '../common/Icon.jsx';

export const MobileNav = React.memo(function MobileNav({
  view,
  navigate,
  account,
  isAdmin,
}) {
  return (
    <div
      className={`mobile-bottom-nav ${account ? 'has-account' : ''} ${isAdmin ? 'admin-nav' : ''}`}
    >
      <button
        className={view === 'general' ? 'active' : ''}
        onClick={() => navigate('general')}
      >
        <IconifyIcon icon="bi:journal-bookmark" width={17} height={17} />
        Home
      </button>
      {account && (
        <button
          className={view === 'members' ? 'active' : ''}
          onClick={() => navigate('members')}
        >
          <Icon name="users" size={17} />
          Members
        </button>
      )}
      <button
        className={view === 'club' ? 'active' : ''}
        onClick={() => navigate('club')}
      >
        <Icon name="users" size={17} />
        Club
      </button>
      {account && (
        <button
          className={view === 'activity' ? 'active' : ''}
          onClick={() => navigate('activity')}
        >
          <Icon name="calendar" size={17} />
          Activity
        </button>
      )}
      {isAdmin && (
        <button
          className={view === 'dashboard' ? 'active' : ''}
          onClick={() => navigate('dashboard')}
        >
          <Icon name="users" size={17} />
          Admin
        </button>
      )}
    </div>
  );
});

