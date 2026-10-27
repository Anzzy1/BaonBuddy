'use client';

import Icon from '@/components/Icon';
import { isIOSUI } from '@/lib/platform';

export interface ConfirmAction {
  label: string;
  onClick: () => void;
  kind?: 'primary' | 'danger' | 'cancel';
}

interface Props {
  title: string;
  message: string;
  icon?: string;
  actions: ConfirmAction[];
  onDismiss: () => void;
}

// Two looks: a frosted glass card with pill buttons on iOS, and a Material-style
// dialog (icon, headline, buttons in a row) on Android, desktop and the web.
export default function ConfirmDialog({ title, message, icon = 'check', actions, onDismiss }: Props) {
  const ios = isIOSUI();
  const cancel = actions.find(a => a.kind === 'cancel');
  const rest = actions.filter(a => a.kind !== 'cancel');
  return (
    <div className={`confirm ${ios ? 'is-ios' : 'is-md'}`} role="alertdialog" aria-modal="true" aria-labelledby="confirmTitle" aria-describedby="confirmMsg" onClick={onDismiss}>
      <div className="confirm-box" onClick={e => e.stopPropagation()}>
        {!ios && <span className="confirm-ic"><Icon name={icon} /></span>}
        <p id="confirmTitle" className="confirm-title">{title}</p>
        <p id="confirmMsg" className="confirm-msg">{message}</p>
        {ios ? (
          <div className="confirm-actions">
            {[...rest, ...(cancel ? [cancel] : [])].map(a => (
              <button key={a.label} type="button" className={`is-${a.kind || 'default'}`} onClick={a.onClick}>{a.label}</button>
            ))}
          </div>
        ) : (
          <div className="confirm-actions">
            {cancel && <button type="button" className="is-cancel" onClick={cancel.onClick}>{cancel.label}</button>}
            <span className="flex-1" />
            {[...rest].reverse().map(a => (
              <button key={a.label} type="button" className={`is-${a.kind || 'default'}`} onClick={a.onClick}>{a.label}</button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
