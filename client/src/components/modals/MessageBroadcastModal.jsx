import React from 'react';
import { createPortal } from 'react-dom';
import { Icon as IconifyIcon } from '@iconify/react';
import { Icon } from '../common/Icon.jsx';

export function MessageBroadcastModal({
  messageModalOpen,
  setMessageModalOpen,
  messageModalType,
  messageModalTab,
  setMessageModalTab,
  messageDraft,
  handleCopyMessageFromModal,
  messageCopiedNotice,
  templateDraft,
  setTemplateDraft,
  handleSaveTemplate,
  templateSavedNotice,
  handleResetTemplate,
}) {
  if (!messageModalOpen) return null;

  return createPortal(
    <div
      className="modal-scrim"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) setMessageModalOpen(false);
      }}
    >
      <section
        className="auth-modal message-broadcast-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="message-broadcast-title"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal-close" onClick={() => setMessageModalOpen(false)} aria-label="Close">
          ×
        </button>
        <div className="message-modal-header">
          <div className="eyebrow">
            <span className="eyebrow-line" />
            COMMUNICATION · BROADCAST
          </div>
          <h2 id="message-broadcast-title">
            {messageModalType === 'daily'
              ? 'Daily Challenge Announcement'
              : 'Evening Solution Breakdown'}
            <span>.</span>
          </h2>
        </div>

        <div className="message-modal-tabs" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={messageModalTab === 'preview'}
            className={`message-modal-tab ${messageModalTab === 'preview' ? 'active' : ''}`}
            onClick={() => setMessageModalTab('preview')}
          >
            Today's Message
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={messageModalTab === 'template'}
            className={`message-modal-tab ${messageModalTab === 'template' ? 'active' : ''}`}
            onClick={() => setMessageModalTab('template')}
          >
            Edit Default Template
          </button>
        </div>

        <div className="message-modal-body">
          {messageModalTab === 'preview' ? (
            <>
              <div className="message-modal-preview">
                <pre className="message-preview-text">{messageDraft}</pre>
              </div>
              <div className="message-modal-actions">
                <button
                  type="button"
                  className="button button-green message-copy-action-btn"
                  onClick={handleCopyMessageFromModal}
                >
                  <Icon name={messageCopiedNotice ? 'check' : 'copy'} size={14} />
                  <span>{messageCopiedNotice ? 'Copied to clipboard!' : 'Copy message'}</span>
                </button>
              </div>
            </>
          ) : (
            <>
              <textarea
                className="message-modal-textarea"
                rows={8}
                value={templateDraft}
                onChange={(e) => setTemplateDraft(e.target.value)}
                placeholder="Template with placeholders like {title}, {tag}..."
              />
              <div className="message-variable-chips-row">
                <span className="chips-label">Insert variable:</span>
                {(messageModalType === 'daily'
                  ? ['{day}', '{id}', '{title}', '{topic}', '{leetcodeUrl}']
                  : ['{title}', '{tag}', '{name}']
                ).map((v) => (
                  <button
                    key={v}
                    type="button"
                    className="message-var-chip"
                    onClick={() => setTemplateDraft((prev) => `${prev} ${v} `)}
                    title={`Insert ${v}`}
                  >
                    {v}
                  </button>
                ))}
              </div>
              <div className="message-modal-actions">
                <button
                  type="button"
                  className="button button-green message-copy-action-btn"
                  onClick={handleSaveTemplate}
                >
                  <Icon name={templateSavedNotice ? 'check' : 'arrow'} size={14} />
                  <span>{templateSavedNotice ? 'Saved!' : 'Save template'}</span>
                </button>
                <button
                  type="button"
                  className="button button-quiet"
                  onClick={handleResetTemplate}
                  title="Reset to factory original default"
                >
                  <IconifyIcon icon="charm:refresh" width={13} height={13} />
                  <span>Reset default</span>
                </button>
              </div>
            </>
          )}
        </div>
      </section>
    </div>,
    document.body
  );
}

