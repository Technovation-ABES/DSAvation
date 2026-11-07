import React from 'react';
import { createPortal } from 'react-dom';
import { Icon as IconifyIcon } from '@iconify/react';
import { Icon } from '../common/Icon.jsx';
import { MemberAvatar } from '../common/MemberAvatar.jsx';
import { studyYearLabel } from '../../utils/dateUtils.js';

export function MemberAdminOverlay({
  adminOverlayMember,
  setAdminOverlayMember,
  account,
  memberBusy,
  updateRole,
  setDirectoryMembers,
  auraAwardBusy,
  handleAwardCustomAura,
  auraAwardAmount,
  setAuraAwardAmount,
  setMemberApproval,
  setMemberLeetcodeApproval,
  deleteMember,
}) {
  if (!adminOverlayMember) return null;

  return createPortal(
    <div
      className="member-admin-overlay-backdrop"
      onClick={() => setAdminOverlayMember(null)}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="member-admin-overlay-card panel"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="member-admin-overlay-header">
          <div className="member-admin-overlay-identity">
            <MemberAvatar person={adminOverlayMember} className="overlay-avatar" label="" />
            <div>
              <h2>{adminOverlayMember.name}</h2>
              <p>
                {adminOverlayMember.department} · {studyYearLabel(adminOverlayMember.studyYear)}
              </p>
              <div className="member-admin-overlay-meta">
                {adminOverlayMember.email && <span>{adminOverlayMember.email}</span>}
                {adminOverlayMember.githubUsername && <span>GitHub: @{adminOverlayMember.githubUsername}</span>}
                {adminOverlayMember.leetcodeUsername && <span>LeetCode: @{adminOverlayMember.leetcodeUsername}</span>}
                <span className="member-aura-chip" title="Current Blaze points">
                  <IconifyIcon icon="at-icons:fire" width={13} height={13} /> {adminOverlayMember.blaze ?? adminOverlayMember.aura ?? 0} Blaze
                </span>
              </div>
            </div>
          </div>
          <button
            type="button"
            className="modal-close"
            onClick={() => setAdminOverlayMember(null)}
            aria-label="Close overlay"
          >
            ×
          </button>
        </div>

        <div className="member-admin-overlay-actions">
          <label className="admin-overlay-role-label">
            <span>ROLE</span>
            <select
              aria-label={`Role for ${adminOverlayMember.name}`}
              value={adminOverlayMember.role || 'member'}
              disabled={memberBusy === adminOverlayMember.id || adminOverlayMember.id === account?.id}
              onChange={async (event) => {
                const newRole = event.target.value;
                await updateRole(adminOverlayMember, newRole);
                setAdminOverlayMember((prev) => (prev ? { ...prev, role: newRole } : null));
                setDirectoryMembers((prev) =>
                  prev.map((m) => (m.id === adminOverlayMember.id ? { ...m, role: newRole } : m))
                );
              }}
            >
              <option value="member">Member</option>
              <option value="admin">Admin</option>
            </select>
          </label>

          <div className="admin-overlay-aura-box">
            <div className="admin-overlay-aura-header">
              <span className="admin-overlay-aura-label">
                <IconifyIcon icon="at-icons:fire" width={14} height={14} /> AWARD CUSTOM BLAZE
              </span>
              <span className="admin-overlay-aura-current" title="Current total Blaze">
                {adminOverlayMember.blaze ?? adminOverlayMember.aura ?? 0} total
                {(adminOverlayMember.customBlaze ?? adminOverlayMember.customAura)
                  ? ` (${(adminOverlayMember.customBlaze ?? adminOverlayMember.customAura) > 0 ? '+' : ''}${adminOverlayMember.customBlaze ?? adminOverlayMember.customAura} custom)`
                  : ''}
              </span>
            </div>
            <div className="admin-overlay-aura-quick-chips">
              {[10, 25, 50, 100].map((pts) => (
                <button
                  key={pts}
                  type="button"
                  className="admin-overlay-aura-chip-btn"
                  disabled={auraAwardBusy}
                  onClick={() => handleAwardCustomAura(pts)}
                >
                  +{pts}
                </button>
              ))}
              <button
                type="button"
                className="admin-overlay-aura-chip-btn chip-deduct"
                disabled={auraAwardBusy}
                onClick={() => handleAwardCustomAura(-10)}
                title="Deduct 10 blaze"
              >
                -10
              </button>
            </div>
            <div className="admin-overlay-aura-input-row">
              <input
                type="number"
                placeholder="Custom points (e.g. 50)"
                value={auraAwardAmount}
                onChange={(e) => setAuraAwardAmount(e.target.value)}
                disabled={auraAwardBusy}
                className="admin-overlay-aura-input"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAwardCustomAura();
                  }
                }}
              />
              <button
                type="button"
                className="button button-green award-aura-submit-btn"
                disabled={auraAwardBusy || !auraAwardAmount || Number(auraAwardAmount) === 0}
                onClick={() => handleAwardCustomAura()}
              >
                <IconifyIcon icon="at-icons:fire" width={13} height={13} />
                {auraAwardBusy ? 'Awarding…' : 'Award'}
              </button>
            </div>
          </div>

          <button
            type="button"
            className="button button-quiet"
            disabled={memberBusy === adminOverlayMember.id || adminOverlayMember.id === account?.id}
            onClick={async () => {
              await setMemberApproval(adminOverlayMember, 'pending');
              setDirectoryMembers((prev) => prev.filter((m) => m.id !== adminOverlayMember.id));
              setAdminOverlayMember(null);
            }}
          >
            <IconifyIcon icon="lucide:user-x" width={14} height={14} />
            De-approve
          </button>

          {adminOverlayMember.leetcodeApproval === 'approved' ? (
            <button
              type="button"
              className="button button-quiet"
              disabled={memberBusy === adminOverlayMember.id || adminOverlayMember.id === account?.id}
              onClick={async () => {
                await setMemberLeetcodeApproval(adminOverlayMember, 'none');
                setAdminOverlayMember((prev) => (prev ? { ...prev, leetcodeApproval: 'none' } : null));
                setDirectoryMembers((prev) =>
                  prev.map((m) => (m.id === adminOverlayMember.id ? { ...m, leetcodeApproval: 'none' } : m))
                );
              }}
            >
              <IconifyIcon icon="simple-icons:leetcode" width={14} height={14} />
              Revoke LC
            </button>
          ) : (
            <button
              type="button"
              className="button button-quiet"
              disabled={memberBusy === adminOverlayMember.id}
              onClick={async () => {
                await setMemberLeetcodeApproval(adminOverlayMember, 'approved');
                setAdminOverlayMember((prev) => (prev ? { ...prev, leetcodeApproval: 'approved' } : null));
                setDirectoryMembers((prev) =>
                  prev.map((m) => (m.id === adminOverlayMember.id ? { ...m, leetcodeApproval: 'approved' } : m))
                );
              }}
            >
              <IconifyIcon icon="simple-icons:leetcode" width={14} height={14} />
              Grant LC
            </button>
          )}

          <button
            type="button"
            className="button button-danger"
            disabled={memberBusy === adminOverlayMember.id || adminOverlayMember.id === account?.id}
            onClick={async () => {
              await deleteMember(adminOverlayMember);
              setDirectoryMembers((prev) => prev.filter((m) => m.id !== adminOverlayMember.id));
              setAdminOverlayMember(null);
            }}
          >
            <Icon name="logout" size={14} />
            Delete
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

